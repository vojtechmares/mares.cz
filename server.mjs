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

// Add security headers to all responses
app.addHook("onRequest", async (_request, reply) => {
  reply.header("X-Frame-Options", "SAMEORIGIN");
  reply.header("X-Content-Type-Options", "nosniff");
  reply.header("Referrer-Policy", "strict-origin-when-cross-origin");
  reply.header(
    "Permissions-Policy",
    "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  );
});

app.use(ssrHandler);

app.get("/_/livez", { config: { otel: false } }, async (_request, _reply) => {
  return { message: "OK" };
});

app.listen({ host: "0.0.0.0", port: 8080 });
