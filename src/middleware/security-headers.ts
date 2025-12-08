import type { IncomingMessage, ServerResponse } from "node:http";

/**
 * Middleware function that applies security headers to HTTP responses.
 * This includes:
 * - X-Frame-Options: Prevents clickjacking attacks
 * - X-Content-Type-Options: Prevents MIME type sniffing
 * - Referrer-Policy: Controls referrer information
 * - Permissions-Policy: Restricts browser features
 * - Content-Security-Policy: Prevents XSS and other injection attacks
 * - Removes Server and X-Powered-By headers to reduce fingerprinting
 */
export function applySecurityHeaders(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
): void {
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
}
