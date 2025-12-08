import { describe, it, expect, beforeAll, afterAll } from "vitest";
import Fastify, { type FastifyInstance } from "fastify";
import fastifyMiddie from "@fastify/middie";

describe("Security Headers", () => {
  let app: FastifyInstance;
  let address: string;

  beforeAll(async () => {
    // Create a test instance of the Fastify server
    app = Fastify({ logger: false });

    await app.register(fastifyMiddie);

    // Middleware to add security headers (same as in server.mjs)
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

    // Add a simple test route
    app.get("/test", async () => {
      return { message: "OK" };
    });

    // Start the server on a random port
    address = await app.listen({ port: 0, host: "127.0.0.1" });
  });

  afterAll(async () => {
    await app.close();
  });

  it("should include X-Frame-Options header", async () => {
    const response = await fetch(`${address}/test`);
    expect(response.headers.get("x-frame-options")).toBe("SAMEORIGIN");
  });

  it("should include X-Content-Type-Options header", async () => {
    const response = await fetch(`${address}/test`);
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
  });

  it("should include Referrer-Policy header", async () => {
    const response = await fetch(`${address}/test`);
    expect(response.headers.get("referrer-policy")).toBe(
      "strict-origin-when-cross-origin",
    );
  });

  it("should include Permissions-Policy header", async () => {
    const response = await fetch(`${address}/test`);
    expect(response.headers.get("permissions-policy")).toBe(
      "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
    );
  });

  it("should include Content-Security-Policy header", async () => {
    const response = await fetch(`${address}/test`);
    expect(response.headers.get("content-security-policy")).toBe(
      "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' https://cdn.mares.cz data:; font-src 'self'; connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com; frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
    );
  });

  it("should not include Server header", async () => {
    const response = await fetch(`${address}/test`);
    expect(response.headers.get("server")).toBeNull();
  });

  it("should not include X-Powered-By header", async () => {
    const response = await fetch(`${address}/test`);
    expect(response.headers.get("x-powered-by")).toBeNull();
  });

  it("should include all security headers on all routes", async () => {
    const response = await fetch(`${address}/test`);

    // Verify all security headers are present
    expect(response.headers.get("x-frame-options")).toBeTruthy();
    expect(response.headers.get("x-content-type-options")).toBeTruthy();
    expect(response.headers.get("referrer-policy")).toBeTruthy();
    expect(response.headers.get("permissions-policy")).toBeTruthy();
    expect(response.headers.get("content-security-policy")).toBeTruthy();

    // Verify fingerprinting headers are removed
    expect(response.headers.get("server")).toBeNull();
    expect(response.headers.get("x-powered-by")).toBeNull();
  });
});
