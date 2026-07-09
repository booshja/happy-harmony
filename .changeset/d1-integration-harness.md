---
"happy-harmony": patch
---

Add a Vitest + real-D1-in-workerd integration-test harness (JANDES-126, PRD JANDES-124).

Stands up `@cloudflare/vitest-pool-workers@0.12.0` (pinned to the highest release compatible with `vitest@3.2.6`) in a separate `defineWorkersConfig` config, kept apart from the jsdom unit config. `isolatedStorage` gives per-test rollback from a clean, migrated database; the Drizzle migrations in `./drizzle` are applied in setup. Adds a reusable two-user fixture (A and B, each with an authenticated session) for the slice's repository-choke-point isolation tests, plus a trivial integration test that writes then reads a `user` row against real D1. Wired into `pnpm check` via a new `test:integration` script.
