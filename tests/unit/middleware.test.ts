import { describe, expect, it, vi } from "vitest";

type MiddlewareContext = {
  url: URL;
  request: { headers: Headers };
  cookies: { get: (key: string) => { value: string } | undefined };
  locals: { locale?: "cs" | "en" };
  redirect: ReturnType<typeof vi.fn>;
  rewrite: ReturnType<typeof vi.fn>;
};

const SENTINEL_RESPONSE = new Response("next");
const REDIRECT_RESPONSE = new Response(null, { status: 302 });
const REWRITE_RESPONSE = new Response("rewritten");

function buildContext({
  pathname,
  acceptLanguage,
  langCookie,
}: {
  pathname: string;
  acceptLanguage?: string;
  langCookie?: string;
}): MiddlewareContext {
  const headers = new Headers();
  if (acceptLanguage) headers.set("Accept-Language", acceptLanguage);

  return {
    url: new URL(`https://www.mares.cz${pathname}`),
    request: { headers },
    cookies: {
      get: (key: string) => (key === "lang" && langCookie ? { value: langCookie } : undefined),
    },
    locals: {},
    redirect: vi.fn(() => REDIRECT_RESPONSE),
    rewrite: vi.fn(() => REWRITE_RESPONSE),
  };
}

type NextFn = () => Promise<Response>;
type MiddlewareFn = (ctx: MiddlewareContext, next: NextFn) => Promise<Response>;

async function run(context: MiddlewareContext) {
  const { onRequest } = await import("../../src/middleware");
  const next = vi.fn<NextFn>(async () => SENTINEL_RESPONSE);
  // The middleware is typed against Astro's APIContext; tests inject a minimal shape.
  const result = await (onRequest as unknown as MiddlewareFn)(context, next);
  return { result, next };
}

describe("locale middleware", () => {
  it("redirects Czech pages to /en when Accept-Language prefers English and no lang cookie", async () => {
    const ctx = buildContext({ pathname: "/blog", acceptLanguage: "en-US,en;q=0.9" });
    const { result } = await run(ctx);

    expect(ctx.redirect).toHaveBeenCalledWith("/en/blog", 302);
    expect(result).toBe(REDIRECT_RESPONSE);
  });

  it("does NOT redirect /card.png even when Accept-Language prefers English", async () => {
    const ctx = buildContext({
      pathname: "/blog/some-post/card.png",
      acceptLanguage: "en-US,en;q=0.9",
    });
    const { result, next } = await run(ctx);

    expect(ctx.redirect).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    expect(ctx.locals.locale).toBe("cs");
    expect(result).toBe(SENTINEL_RESPONSE);
  });

  it("does NOT redirect /rss.xml even when Accept-Language prefers English", async () => {
    const ctx = buildContext({ pathname: "/blog/rss.xml", acceptLanguage: "en" });
    const { result, next } = await run(ctx);

    expect(ctx.redirect).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    expect(ctx.locals.locale).toBe("cs");
    expect(result).toBe(SENTINEL_RESPONSE);
  });

  it("does NOT redirect /robots.txt even when Accept-Language prefers English", async () => {
    const ctx = buildContext({ pathname: "/robots.txt", acceptLanguage: "en" });
    const { result, next } = await run(ctx);

    expect(ctx.redirect).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    expect(ctx.locals.locale).toBe("cs");
    expect(result).toBe(SENTINEL_RESPONSE);
  });

  it("does NOT redirect /_image even when Accept-Language prefers English", async () => {
    const ctx = buildContext({ pathname: "/_image", acceptLanguage: "en-US,en;q=0.9" });
    const { result, next } = await run(ctx);

    expect(ctx.redirect).not.toHaveBeenCalled();
    expect(ctx.rewrite).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    expect(result).toBe(SENTINEL_RESPONSE);
  });

  it("rewrites /en/.../card.png to the Czech path and sets English locale", async () => {
    const ctx = buildContext({ pathname: "/en/blog/some-post/card.png" });
    const { result } = await run(ctx);

    expect(ctx.rewrite).toHaveBeenCalledWith("/blog/some-post/card.png");
    expect(ctx.locals.locale).toBe("en");
    expect(result).toBe(REWRITE_RESPONSE);
  });

  it("does not redirect when Accept-Language prefers Czech", async () => {
    const ctx = buildContext({ pathname: "/blog", acceptLanguage: "cs,en;q=0.5" });
    const { next } = await run(ctx);

    expect(ctx.redirect).not.toHaveBeenCalled();
    expect(ctx.locals.locale).toBe("cs");
    expect(next).toHaveBeenCalled();
  });

  it("does not redirect when lang cookie is present, even if Accept-Language prefers English", async () => {
    const ctx = buildContext({
      pathname: "/blog",
      acceptLanguage: "en",
      langCookie: "cs",
    });
    const { next } = await run(ctx);

    expect(ctx.redirect).not.toHaveBeenCalled();
    expect(ctx.locals.locale).toBe("cs");
    expect(next).toHaveBeenCalled();
  });
});
