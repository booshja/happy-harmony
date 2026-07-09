import path from "node:path";

import {
    defineWorkersConfig,
    readD1Migrations,
} from "@cloudflare/vitest-pool-workers/config";

// Integration-test config: runs Vitest inside `workerd` against a REAL D1
// database (via @cloudflare/vitest-pool-workers), kept deliberately separate
// from the jsdom unit config in vite.config.ts. This project loads none of the
// app's Vite plugins (tanstackStart / @cloudflare/vite-plugin) — a
// repository-layer isolation test needs only Drizzle + the D1 binding, which
// the pool provides directly. See docs/research/d1-integration-testing-and-server-fn-auth.md.
export default defineWorkersConfig(async () => {
    // Read the Drizzle migrations from ./drizzle in Node (they are applied to
    // the in-worker test D1 by ./test/integration/apply-migrations.ts).
    const migrations = await readD1Migrations(path.join(__dirname, "drizzle"));

    return {
        test: {
            include: ["test/integration/**/*.integration.test.ts"],
            setupFiles: ["./test/integration/apply-migrations.ts"],
            poolOptions: {
                workers: {
                    // Per-test rollback: every test starts from the clean,
                    // migrated database seeded by the setup file.
                    isolatedStorage: true,
                    singleWorker: true,
                    miniflare: {
                        // Pinned pool-workers@0.12.0 bundles workerd 2026-01-03;
                        // requesting a later date than the bundled runtime only
                        // warns and falls back, so pin to the runtime's own max.
                        // (wrangler.jsonc's dev/deploy date is 2026-01-07 — the
                        // 4-day gap is immaterial to a repository-layer test.)
                        // Declare the D1 binding in-memory rather than reusing
                        // the remote database_id.
                        compatibilityDate: "2026-01-03",
                        compatibilityFlags: ["nodejs_compat"],
                        d1Databases: { DB: "happy-harmony-test" },
                        // Migrations are surfaced to the worker as a binding so
                        // the setup file can apply them via cloudflare:test.
                        bindings: { TEST_MIGRATIONS: migrations },
                    },
                },
            },
        },
    };
});
