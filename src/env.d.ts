/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly STRAPI_API_URL: string;
  readonly STRAPI_API_TOKEN: string;
  readonly DISABLE_ANALYTICS: boolean;
}
