/// <reference types="astro/client" />
/// <reference types="@astrojs/cloudflare/types.d.ts" />

declare namespace App {
  interface Locals {
    locale: import("./i18n/types").Locale;
  }
}

interface ImportMetaEnv {
  readonly SESSIONS_API_URL: string;
  readonly SESSIONS_OIDC_ISSUER: string;
  readonly SESSIONS_OIDC_CLIENT_ID: string;
  readonly SESSIONS_OIDC_CLIENT_SECRET: string;
}
