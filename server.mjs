import Fastify from "fastify";
import fastifyMiddie from "@fastify/middie";
import fastifyStatic from "@fastify/static";
import { fileURLToPath } from "node:url";
import { handler as ssrHandler } from "./dist/server/entry.mjs";

const app = Fastify({ logger: true });

await app
  .register(fastifyStatic, {
    root: fileURLToPath(new URL("./dist/client", import.meta.url)),
    cacheControl: "public, max-age=31536000, immutable",
  })
  .register(fastifyMiddie);

// Middleware to add security headers
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  );
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' https://cdn.mares.cz data:; font-src 'self'; connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com; frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
  );
  res.removeHeader("Server");
  res.removeHeader("X-Powered-By");
  next();
});

app.use(ssrHandler);

app.get("/_/livez", { config: { otel: false } }, async (_request, _reply) => {
  return { message: "OK" };
});

app.listen({ host: "0.0.0.0", port: 8080 });
