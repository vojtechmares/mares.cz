import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

// Astro middleware handler
const { handler } = await import("../server/entry.mjs");

const HOST = process.env.HOST ?? "0.0.0.0";
const PORT = parseInt(process.env.PORT ?? "8080", 10);

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const clientDir = join(__dirname, "..", "client");

// --- Graceful shutdown state ---
let isShuttingDown = false;
const activeConnections = new Set<import("node:net").Socket>();

// --- Rate limiting (sliding window) ---
const MAX_RPS = 50;
let requestCount = 0;
let windowStart = Date.now();

function isThrottled(): boolean {
  const now = Date.now();
  if (now - windowStart >= 1000) {
    requestCount = 0;
    windowStart = now;
  }
  requestCount++;
  return requestCount > MAX_RPS;
}

// --- MIME types ---
const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
};

// --- Static file serving ---
async function serveStatic(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const filePath = join(clientDir, url.pathname);

  // Prevent directory traversal
  if (!filePath.startsWith(clientDir)) return false;

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) return false;

    const ext = extname(filePath);
    const contentType = MIME_TYPES[ext] ?? "application/octet-stream";
    const isHashed = url.pathname.startsWith("/_astro/");

    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": fileStat.size,
      "Cache-Control": isHashed ? "public, max-age=31536000, immutable" : "public, max-age=3600",
    });

    const content = await readFile(filePath);
    res.end(content);
    return true;
  } catch {
    return false;
  }
}

// --- 429 response ---
const THROTTLE_HTML = `<!DOCTYPE html>
<html lang="cs">
<head><meta charset="utf-8"><title>429 Too Many Requests</title></head>
<body><h1>429 Too Many Requests</h1><p>Zkuste to prosím později.</p></body>
</html>`;

function send429(res: ServerResponse): void {
  res.writeHead(429, {
    "Content-Type": "text/html; charset=utf-8",
    "Retry-After": "1",
  });
  res.end(THROTTLE_HTML);
}

// --- HTTP server ---
const server = createServer(async (req, res) => {
  const url = req.url ?? "/";

  // Liveness probe — always responds, even during shutdown
  if (url === "/_/livez") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ok");
    return;
  }

  // Rate limiting (all routes except livez)
  if (isThrottled()) {
    send429(res);
    return;
  }

  // Readiness probe
  if (url === "/_/readyz") {
    if (isShuttingDown) {
      res.writeHead(503, { "Content-Type": "text/plain" });
      res.end("shutting down");
    } else {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("ok");
    }
    return;
  }

  // Try static files first
  if (req.method === "GET" || req.method === "HEAD") {
    const served = await serveStatic(req, res);
    if (served) return;
  }

  // Forward to Astro handler
  handler(req, res);
});

// Track connections for graceful shutdown
server.on("connection", (socket) => {
  activeConnections.add(socket);
  socket.on("close", () => activeConnections.delete(socket));
});

// --- Graceful shutdown ---
function shutdown(signal: string): void {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`${signal} received, starting graceful shutdown…`);

  server.close(() => {
    console.log("All connections closed, exiting.");
    process.exit(0);
  });

  // Close idle connections (those without an active request)
  for (const socket of activeConnections) {
    // Destroy sockets that are not currently processing a request
    if (!(socket as any)._httpMessage) {
      socket.destroy();
    }
  }

  // Hard timeout
  setTimeout(() => {
    console.log("Shutdown timeout reached, forcing exit.");
    process.exit(0);
  }, 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

server.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
