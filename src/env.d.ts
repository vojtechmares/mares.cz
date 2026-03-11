/// <reference types="astro/client" />

declare module "cloudflare:workers" {
  export const env: {
    ASSETS: { fetch(input: string | Request): Promise<Response> };
    [key: string]: unknown;
  };
}

interface ImportMetaEnv {
  readonly DISABLE_ANALYTICS: boolean;
  readonly SESSIONS_API_URL: string;
  readonly SESSIONS_OIDC_ISSUER: string;
  readonly SESSIONS_OIDC_CLIENT_ID: string;
  readonly SESSIONS_OIDC_CLIENT_SECRET: string;
}
