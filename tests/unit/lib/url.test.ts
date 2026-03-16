import { describe, it, expect } from "vitest";
import { canonicalUrl } from "../../../src/lib/url";

describe("canonicalUrl", () => {
  it("returns production URL when site is defined", () => {
    const astroUrl = new URL("http://localhost:4321/blog/my-post/");
    const astroSite = new URL("https://www.mares.cz");
    const result = canonicalUrl(astroUrl, astroSite);
    expect(result.toString()).toBe("https://www.mares.cz/blog/my-post/");
  });

  it("falls back to hardcoded domain when site is undefined", () => {
    const astroUrl = new URL("http://localhost:4321/skoleni/docker/");
    const result = canonicalUrl(astroUrl, undefined);
    expect(result.toString()).toBe("https://www.mares.cz/skoleni/docker/");
  });

  it("preserves pathname correctly", () => {
    const astroUrl = new URL("http://localhost:4321/blog/archive/2024/01/");
    const astroSite = new URL("https://www.mares.cz");
    const result = canonicalUrl(astroUrl, astroSite);
    expect(result.toString()).toBe("https://www.mares.cz/blog/archive/2024/01/");
  });

  it("handles root path", () => {
    const astroUrl = new URL("http://localhost:4321/");
    const astroSite = new URL("https://www.mares.cz");
    const result = canonicalUrl(astroUrl, astroSite);
    expect(result.toString()).toBe("https://www.mares.cz/");
  });

  it("handles trailing slashes", () => {
    const astroUrl = new URL("http://localhost:4321/prednasky/");
    const astroSite = new URL("https://www.mares.cz/");
    const result = canonicalUrl(astroUrl, astroSite);
    expect(result.toString()).toBe("https://www.mares.cz/prednasky/");
  });

  it("strips query params and hash from origin but preserves pathname", () => {
    const astroUrl = new URL("http://localhost:4321/blog/post/?ref=test#section");
    const astroSite = new URL("https://www.mares.cz");
    const result = canonicalUrl(astroUrl, astroSite);
    expect(result.toString()).toBe("https://www.mares.cz/blog/post/");
  });
});
