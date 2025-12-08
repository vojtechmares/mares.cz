import Fastify from "fastify";
import fastifyMiddie from "@fastify/middie";
import fastifyStatic from "@fastify/static";
import { fileURLToPath } from "node:url";
import { applySecurityHeaders } from "./middleware/security-headers.js";

const app = Fastify({ logger: true });

await app
  .register(fastifyStatic, {
    root: fileURLToPath(new URL("../client", import.meta.url)),
    setHeaders: (res) => {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    },
  })
  .register(fastifyMiddie);

// Apply security headers middleware
app.use(applySecurityHeaders);

// Import SSR handler dynamically after build
const { handler } = await import("../server/entry.mjs");

app.use(handler);

app.get("/_/livez", { config: { otel: false } }, async (_request, _reply) => {
  return { message: "OK" };
});

app.listen({ host: "0.0.0.0", port: 8080 });
