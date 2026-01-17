/// <reference types="vite/client" />

import { parseBuildEnv } from "./config/validation";
import type { BuildEnv } from "./config/validation";

declare global {
    interface ImportMetaEnv {
        readonly VITE_API_URL: string;
        // Client-side environment variables
        readonly VITE_APP_NAME: string;
        readonly VITE_AUTH0_CLIENT_ID: string;
        readonly VITE_AUTH0_DOMAIN: string;
        readonly VITE_ENABLE_NEW_DASHBOARD?: string;
        readonly VITE_SENTRY_DSN?: string;
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }

    // Server-side environment variables
    namespace NodeJS {
        interface ProcessEnv {
            readonly AUTH0_CLIENT_SECRET: string;
            readonly DATABASE_URL: string;
            readonly JWT_SECRET: string;
            readonly NODE_ENV: "development" | "production" | "test";
            readonly REDIS_URL: string;
            readonly STRIPE_SECRET_KEY: string;
        }
    }
}

export const env: BuildEnv = parseBuildEnv(process.env);
