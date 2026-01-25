/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly DISABLE_ANALYTICS: boolean;
  readonly SESSIONS_API_URL: string;
  readonly SESSIONS_OIDC_ISSUER: string;
  readonly SESSIONS_OIDC_CLIENT_ID: string;
  readonly SESSIONS_OIDC_CLIENT_SECRET: string;
}
