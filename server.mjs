import Fastify from 'fastify';
import fastifyMiddie from '@fastify/middie';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'node:url';
import { handler as ssrHandler } from './dist/server/entry.mjs';

const app = Fastify({ logger: true });

await app
  .register(fastifyStatic, {
    root: fileURLToPath(new URL('./dist/client', import.meta.url)),
    cacheControl: "public, max-age=31536000, immutable"
  })
  .register(fastifyMiddie);
app.use(ssrHandler);

app.get("/_/livez", {config: { otel: false }}, async (request, reply) => { return {message: "OK"}})

app.listen({ host: "0.0.0.0", port: 8080 });
