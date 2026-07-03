/// <reference types="vite/client" />

import { parseBuildEnv } from "./config/validation";
import type { BuildEnv } from "./config/validation";

declare global {
    interface ImportMetaEnv {
        readonly VITE_SENTRY_DSN?: string;
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }
}

export const env: BuildEnv = parseBuildEnv(process.env);
