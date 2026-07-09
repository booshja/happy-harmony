/// <reference types="@cloudflare/vitest-pool-workers" />
import type { D1Migration } from "cloudflare:test";

// Types the `env` exported from `cloudflare:test`. `DB` is the real D1 binding
// declared in vitest.workers.config.ts; `TEST_MIGRATIONS` carries the Drizzle
// migrations read at config load and applied in apply-migrations.ts.
declare module "cloudflare:test" {
    interface ProvidedEnv {
        DB: D1Database;
        TEST_MIGRATIONS: Array<D1Migration>;
    }
}
