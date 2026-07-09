import { applyD1Migrations, env } from "cloudflare:test";

// Runs once per worker (before the test files). Applies the Drizzle migrations
// from ./drizzle to the in-worker test D1. With `isolatedStorage` on, the
// migrated schema becomes the clean baseline every test rolls back to.
await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
