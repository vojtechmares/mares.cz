/// <reference types="astro/client" />
interface ImportMetaEnv {
    readonly STRAPI_API_URL: string;
    readonly STRAPI_API_TOKEN: string;
    readonly NOTION_API_KEY: string;
    readonly NOTION_TRAINING_SESSIONS_DATABASE_ID: string;
    readonly DISABLE_ANALYTICS: boolean;
}
