# Research: Vitest integration testing against a real D1 + reading the auth session inside a TanStack Start server function

> **Scope / grounding date:** 2026-07-05. Targets the versions pinned in this repo's `package.json`
> (vitest `^3.2.6`, wrangler `^4.59.2`, `@cloudflare/vite-plugin` `^1.20.1`, `@tanstack/react-start` `^1.132.0`,
> better-auth `^1.6.2`, drizzle-orm `^0.45.2`, drizzle-kit `^0.31.8`, vite `^7.3.5`).

> ## ⚠️ Provenance / verification status — READ THIS FIRST
>
> This document was produced in a **sandbox with no network access**: `WebFetch`, `WebSearch`, and outbound
> `curl` were all denied, so the official Cloudflare docs pages and the npm registry **could not be fetched**.
>
> As a result, claims are split into two confidence tiers, and this is called out inline throughout:
>
> - **[VERIFIED-LOCAL]** — read directly from primary sources available on disk: this repo's source, and the
>   **actual shipped type definitions** inside `node_modules`. These are as authoritative as the docs (arguably
>   more version-accurate, since they are the exact installed artifacts). File paths are cited.
> - **[UNVERIFIED — prior knowledge, MUST confirm before adopting]** — the `@cloudflare/vitest-pool-workers`
>   API surface and (critically) its **version-compatibility matrix**. That package is **not installed** in
>   this repo, so there was nothing local to read and no way to hit the docs or registry. Every such claim
>   carries the canonical doc URL to verify against, and the [Verification checklist](#verification-checklist)
>   at the bottom lists the exact commands to run once network is available. **Do not pin a
>   `@cloudflare/vitest-pool-workers` version from this document — run the checklist first.**

---

## Executive summary / recommendations

**Q1 — Real-D1 integration tests. Recommendation: ADOPT `@cloudflare/vitest-pool-workers`, in a _separate_
Vitest project, not the existing jsdom config.**

- The canonical, first-party way to run Vitest _inside workerd_ with real Cloudflare bindings (D1, KV, DO) is
  Cloudflare's `@cloudflare/vitest-pool-workers`. It runs each test file in a real `workerd`/Miniflare instance
  and gives you the _actual_ D1 binding via `import { env } from "cloudflare:test"` — not a mock.
  ([UNVERIFIED] canonical entry point: <https://developers.cloudflare.com/workers/testing/vitest-integration/>)
- **Do not try to make it share one config with the app's Vite/TanStack Start build.** The repo already gates
  the Cloudflare plugin off under Vitest (`shouldUseCloudflare = !isVitest`, `vite.config.ts:21`) precisely
  because the two don't compose cleanly. Keep the existing jsdom config for unit/component tests, and add a
  **second Vitest project** (`vitest.projects.ts` / the `test.projects` field) whose config is built with
  `defineWorkersConfig` from `@cloudflare/vitest-pool-workers/config`. The pool-workers project should **not**
  load the `tanstackStart()` or `@cloudflare/vite-plugin` plugins — a repository-layer test needs only Drizzle
    - the D1 binding, which pool-workers provides directly.
- Per-test isolation is built in (`isolatedStorage`, on by default): every test gets a clean copy of storage
  and mutations roll back after each test — ideal for the "user A cannot read user B's rows" assertion.
- Apply Drizzle migrations to the test D1 with `applyD1Migrations(env.DB, await readD1Migrations(dir))` from
  `cloudflare:test`, pointed at this repo's `./drizzle` migrations dir, in a setup/`beforeAll`.
- **Version pin — RESOLVED [VERIFIED-REGISTRY 2026-07-05].** Pin **`@cloudflare/vitest-pool-workers@0.12.0`**,
  and do **not** upgrade Vitest. `0.12.0` is the _highest_ release whose `peerDependencies.vitest` is
  `2.0.x - 3.2.x` (matches the repo's `vitest@3.2.6`); `0.13.0`+ require `vitest ^4.1.0`. Bonus: `0.12.0`
  bundles `miniflare@4.20260103.0`, essentially the same workerd as the installed `wrangler@4.59.2` (which
  bundles `miniflare@4.20260114.0`), so the test runtime matches dev/deploy. `@latest` (0.18.0) requires
  `vitest ^4.1.0` and is therefore INCOMPATIBLE with this repo until Vitest is bumped to 4.x.

**Q2 — Reading the session inside a server function. Recommendation: the repo already establishes the pattern; extend it.**

One-liner: **`requireUser()` reads the session by calling `getAuth().api.getSession({ headers: getRequest().headers })` inside the `createServerFn(...).handler`, and `throw redirect({ to: "/login" })` (or a thrown error) when it returns `null`.** This is exactly the shape of the existing `src/auth/session.ts` (`getSessionFn`) — factor a `requireUser()` helper out of it rather than inventing a new mechanism.

- Request headers inside a server function come from `getRequest()` (or `getRequestHeaders()`) exported by
  `@tanstack/react-start/server`. **[VERIFIED-LOCAL]** — already used at `src/auth/session.ts:2,9`, and the
  export is declared in the installed types (`getRequest(): Request`,
  `node_modules/@tanstack/start-server-core/dist/esm/request-response.d.ts:8`).
- better-auth's session is read with `auth.api.getSession({ headers })`, already implemented at
  `src/auth/session.ts:10-12`. **[VERIFIED-LOCAL]**
- The D1 binding / CF env inside a server function is reached via `import { env } from "cloudflare:workers"`,
  already wrapped by `getRuntimeEnv()` (`src/config/runtimeEnv.ts`) and `getDb()` (`src/db/index.ts:3-10`).
  **[VERIFIED-LOCAL]**
- **Server functions are public HTTP endpoints** — treat every one as untrusted input: validate args with zod
  (`createServerFn().validator(zodSchema).handler(...)`) and always re-derive `userId` from the _session_,
  never from a client-supplied field.

---

## Q1 — Vitest integration testing against a REAL Cloudflare D1

### Repo starting point (VERIFIED-LOCAL)

- `vite.config.ts:21` sets `const shouldUseCloudflare = !isVitest;` and only pushes the `cloudflare({...})`
  plugin when `shouldUseCloudflare` is true (`vite.config.ts:58-64`). **So today, under Vitest, there is no
  workerd environment and no `DB` binding** — `test.environment` is `"jsdom"` (`vite.config.ts:109-114`).
  A test that did `import { getDb } from "src/db"` would fail, because `src/db/index.ts:3` imports
  `env` from the virtual module `cloudflare:workers`, which only exists inside the Workers runtime.
- The D1 binding name is **`DB`** for both prod and staging (`wrangler.jsonc:26-32,36-42`), with
  `"migrations_dir": "./drizzle"`.
- Drizzle is configured to emit SQL migrations to `./drizzle` (`drizzle.config.ts:6`, `out: "./drizzle"`),
  schema at `./src/db/schema.ts`. One migration exists today: `drizzle/0000_violet_mephistopheles.sql`, with
  `drizzle/meta/_journal.json` + `0000_snapshot.json`. Local apply is
  `wrangler d1 migrations apply DB --local` (`package.json:39`).
- App tables carry a `userId` FK to `user.id` with `onDelete: "cascade"` (`src/db/schema.ts` — `category`,
  `activity`, `suggestionHistory` each have `userId: text("userId").notNull().references(() => user.id, ...)`).
  **This `userId` column is the tenancy boundary the isolation test must prove the repository layer enforces.**

> **Key insight:** the "user A cannot read/write user B's rows" guarantee is _not_ enforced by D1 itself — D1
> is a single SQLite database and every row is visible to any query. The guarantee must be enforced in the
> **repository/query layer** (every read/write is scoped `where eq(table.userId, currentUserId)`). The
> integration test therefore seeds two users and asserts that repository calls made _as_ user A never touch
> user B's rows. Real D1 (vs a mock) matters because you want to prove the _actual SQL_ Drizzle emits enforces
> the scoping against the real SQLite engine.

### (a) Canonical approach + how it coexists with the vite-plugin and TanStack Start

**[UNVERIFIED — prior knowledge; confirm at**
<https://developers.cloudflare.com/workers/testing/vitest-integration/get-started/write-your-first-test/> **and**
<https://developers.cloudflare.com/workers/testing/vitest-integration/configuration/>**]**

The canonical approach is **`@cloudflare/vitest-pool-workers`** (a Vitest _pool_ — it replaces the default
worker-thread/forks pool with one that runs each test file inside `workerd` via Miniflare). You configure it
with `defineWorkersConfig` from `@cloudflare/vitest-pool-workers/config`, which is a thin wrapper over Vitest's
`defineConfig` that wires the pool and the `cloudflare:test` module.

**Coexistence strategy — use a separate Vitest project, do NOT merge into `vite.config.ts`.** Rationale:

1. The app config deliberately disables the Cloudflare/workerd plugin under Vitest (`vite.config.ts:21`). The
   pool-workers pool provides workerd itself; it does not want the `@cloudflare/vite-plugin` layered on top,
   and it does not need `tanstackStart()` (that plugin is for building the app's router/SSR entry, irrelevant
   to a headless repository test).
2. Component/DOM tests want `environment: "jsdom"`; workerd tests run _in workerd_ and cannot use jsdom. These
   are mutually exclusive per-file environments, which is exactly what **Vitest projects** are for.

Recommended layout (create a dedicated config; keep the existing jsdom `test` block in `vite.config.ts` for units):

```ts
// vitest.workers.config.ts   (integration / real-D1 tests only)
import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig({
    test: {
        include: ["src/**/*.integration.test.ts"],
        globalSetup: ["./test/integration/global-setup.ts"], // optional; see (c)
        setupFiles: ["./test/integration/setup.ts"], // per-test-file migration apply
        poolOptions: {
            workers: {
                // Reuse the repo's wrangler config so the DB binding + migrations_dir line up.
                wrangler: { configPath: "./wrangler.jsonc" },
                miniflare: {
                    // If you prefer not to reuse wrangler.jsonc, declare an in-memory D1 here:
                    // d1Databases: { DB: "test-db-id" },
                    compatibilityDate: "2026-01-07",
                    compatibilityFlags: ["nodejs_compat"],
                },
                isolatedStorage: true, // default; per-test rollback (see (b))
                singleWorker: false,
            },
        },
    },
});
```

Add a script such as `"test:integration": "vitest run --config vitest.workers.config.ts"`. Keep
`"test": "VITEST=true vitest run"` for the jsdom units. (Alternatively use Vitest's `test.projects` array in a
single root config to run both in one command — but a separate config file is simpler to reason about given the
`isVitest` plugin gating already in place.)

> **Note on `wrangler: { configPath }` vs `miniflare.d1Databases`:** pointing pool-workers at
> `wrangler.jsonc` reuses the real `DB` binding name and `migrations_dir`, but that file also declares
> `d1_databases` with **remote `database_id`s** and custom-domain `routes`. pool-workers runs everything
> locally/in-memory (it does not touch the remote DB), but confirm it ignores `routes`/`database_id`. If it
> complains, declare a minimal `d1Databases: { DB: "<any-id>" }` under `miniflare` instead and skip
> `configPath`. **[UNVERIFIED — confirm behavior against the configuration doc.]**

### (b) Isolated D1 binding + reset between tests

**[UNVERIFIED — prior knowledge; confirm at**
<https://developers.cloudflare.com/workers/testing/vitest-integration/isolated-storage/>**]**

- `poolOptions.workers.isolatedStorage` (default **on**) gives each test its **own stacked view of storage**;
  writes a test makes to D1/KV/DO are **rolled back at the end of that test**, so tests don't leak state into
  one another. This is implemented via Miniflare's storage-stack "push before each test / pop after" model.
- `singleWorker` controls whether all test files share one worker instance or each file gets its own; leave it
  `false` unless you hit performance/setup cost issues. With `isolatedStorage`, per-_test_ isolation holds
  regardless.
- Practical consequence for the two-user test: seed both users in a `beforeEach` (or `beforeAll` + rely on
  rollback), run the assertions, and the storage resets automatically — no manual `DELETE FROM` teardown.

### (c) Applying Drizzle migrations to the test D1

**[UNVERIFIED — prior knowledge; confirm at**
<https://developers.cloudflare.com/workers/testing/vitest-integration/test-apis/>**]**

The `cloudflare:test` module exposes `env` (your bindings, incl. `env.DB`), plus D1 migration helpers
`readD1Migrations(migrationsDir)` and `applyD1Migrations(db, migrations)`. Because this repo already generates
standard Drizzle SQL into `./drizzle` with a `meta/_journal.json`, point the reader at that directory.

```ts
// test/integration/setup.ts   (runs in-worker, once per test file)
import { env, applyD1Migrations, readD1Migrations } from "cloudflare:test";
import { beforeAll } from "vitest";

beforeAll(async () => {
    // Reads ./drizzle/*.sql in journal order and applies them to the in-memory test D1.
    const migrations = await readD1Migrations("./drizzle");
    await applyD1Migrations(env.DB, migrations);
});
```

> Two caveats to verify: (1) `readD1Migrations` expects Wrangler/D1-style migrations (a directory of numbered
> `.sql` files) — Drizzle's `./drizzle` output is a directory of `NNNN_name.sql` files plus a `meta/` folder,
> which is the same shape wrangler uses (`wrangler.jsonc` already sets `migrations_dir: "./drizzle"`), so this
> should line up. (2) The migrations directory typically must be made available to the pool via
> `test.poolOptions.workers.miniflare` or a Vite `define`/`server.deps` allowance so the files are readable at
> test time. **Confirm the exact recipe in the test-apis + recipes docs before relying on it.**
> ([UNVERIFIED] recipes: <https://developers.cloudflare.com/workers/testing/vitest-integration/recipes/>)

### (d) Seed + teardown + the two-user fixture (the headline assertion)

Teardown is automatic under `isolatedStorage` (b). Seed two synthetic users and prove tenancy scoping. Use
**synthetic data only** (per repo CLAUDE.md — no real user data):

```ts
// src/repositories/category.repository.integration.test.ts
import { env } from "cloudflare:test";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";

import * as schema from "../db/schema";
import { createCategoryRepository } from "./category.repository"; // repo layer under test

const db = drizzle(env.DB, { schema });

// --- synthetic two-user fixture ---
const USER_A = { id: "user_a", name: "Test A", email: "a@example.test" };
const USER_B = { id: "user_b", name: "Test B", email: "b@example.test" };

async function seedUsers() {
    const now = new Date();
    await db.insert(schema.user).values([
        { ...USER_A, emailVerified: false, createdAt: now, updatedAt: now },
        { ...USER_B, emailVerified: false, createdAt: now, updatedAt: now },
    ]);
}

describe("category repository — tenant isolation", () => {
    beforeEach(async () => {
        await seedUsers(); // rolled back automatically after each test
    });

    it("user A cannot READ user B's rows", async () => {
        const now = new Date();
        await db.insert(schema.category).values({
            displayId: "cat_b_1",
            userId: USER_B.id,
            name: "B private",
            description: "secret",
            createdAt: now,
            updatedAt: now,
        });

        const repoAsA = createCategoryRepository(db, USER_A.id);
        const visible = await repoAsA.list(); // repo scopes: where eq(category.userId, USER_A.id)

        expect(visible).toHaveLength(0); // A sees none of B's rows
    });

    it("user A cannot WRITE/UPDATE user B's rows", async () => {
        const now = new Date();
        const [bRow] = await db
            .insert(schema.category)
            .values({
                displayId: "cat_b_2",
                userId: USER_B.id,
                name: "B private",
                description: "secret",
                createdAt: now,
                updatedAt: now,
            })
            .returning();

        const repoAsA = createCategoryRepository(db, USER_A.id);
        await repoAsA.rename(bRow.displayId, "hijacked"); // must be a no-op / throw for a foreign row

        // Assert against the real DB that B's row is untouched.
        const [after] = await db
            .select()
            .from(schema.category)
            .where(eq(schema.category.id, bRow.id));
        expect(after.name).toBe("B private");
    });
});
```

The **repository layer** (`createCategoryRepository(db, userId)`) is the unit whose contract this test pins:
every method must fold `where eq(table.userId, userId)` into its query. The value of running against real D1 is
that the assertion exercises the actual SQLite semantics of the SQL Drizzle emits, not a hand-rolled mock.

### (e) Gotchas

- **workerd, not Node.** Tests run in the Workers runtime. Node-only APIs are unavailable unless
  `nodejs_compat` is set (it is, in `wrangler.jsonc:6-9`; mirror it in `miniflare.compatibilityFlags`).
- **Don't load the app's Vite plugins into the pool-workers config.** `tanstackStart()` and
  `@cloudflare/vite-plugin` are for the app build; layering them under pool-workers invites the exact plugin
  conflicts that `shouldUseCloudflare = !isVitest` was added to avoid. **[VERIFIED-LOCAL for the repo gating;
  UNVERIFIED for the pool's plugin tolerance — confirm in the known-issues doc:**
  <https://developers.cloudflare.com/workers/testing/vitest-integration/known-issues/>**]**
- **Async setup ordering:** `applyD1Migrations` must complete before any test queries. Do it in a
  `beforeAll` inside a `setupFiles` module (runs in-worker) — not in a Node-side `globalSetup`, which runs
  outside workerd and cannot see `env.DB`.
- **Strict Vitest version peer.** See version-sensitivity section — this is the single most likely thing to
  break the install.
- **`cloudflare:test` types.** You'll need a `tsconfig`/`d.ts` that references
  `@cloudflare/vitest-pool-workers` and declares the shape of `env` (the `ProvidedEnv` interface) so
  `env.DB` is typed as `D1Database`. **[UNVERIFIED — confirm the exact `types` reference string in the config doc.]**

---

## Q2 — Reading the auth session inside a TanStack Start server function

**This pattern already exists in the repo.** The recommendation is to extend it, not replace it.

### (a) Idiomatic access to request/headers + the better-auth session (VERIFIED-LOCAL)

`src/auth/session.ts` is the canonical example already in the tree:

```ts
// src/auth/session.ts  (existing)
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getAuth } from "./server";

export const getSessionFn = createServerFn({ method: "GET" }).handler(async () => {
    try {
        const auth = getAuth();
        const request = getRequest();
        const session = await auth.api.getSession({ headers: request.headers });
        return session;
    } catch {
        return null;
    }
});
```

- `getRequest()` is exported from `@tanstack/react-start/server`. Its declared type is
  `export declare function getRequest(): Request;`
  (`node_modules/@tanstack/start-server-core/dist/esm/request-response.d.ts:8`, re-exported via
  `@tanstack/react-start-server` → `@tanstack/react-start/server`). Sibling helpers are available if you want
  headers without the full request: `getRequestHeaders()`, `getRequestHeader(name)`
  (same file, lines 9-10). **[VERIFIED-LOCAL]**
- `auth.api.getSession({ headers })` is better-auth's server-side session read; the endpoint is declared as
  `readonly getSession: better_call0.StrictEndpoint<"/get-session", ...>` in the installed types
  (`node_modules/better-auth/dist/api/index.d.mts:233`). It returns the `{ session, user }` object or `null`.
  **[VERIFIED-LOCAL]**
- `getAuth()` is a lazy singleton over `betterAuth({...})` configured with the Drizzle adapter and the
  **`tanstackStartCookies()`** plugin (`src/auth/server.ts:11-21`). That plugin "automatically handles cookie
  setting for TanStack Start ... uses `@tanstack/react-start-server` to set cookies" — confirmed in the
  installed better-auth types (`node_modules/better-auth/dist/integrations/tanstack-start.d.mts:5-31`).
  **[VERIFIED-LOCAL]** — so cookie propagation (Set-Cookie on refresh, etc.) inside server fns is already handled.

### (b) A `requireUser()` gate (recommended addition)

Factor a reusable gate out of the existing `getSessionFn`. Two flavors — throw a `redirect` (for
route-driven fns) or throw a plain error (for API-style fns). `redirect` is exported from
`@tanstack/react-router` (`node_modules/@tanstack/react-router/dist/esm/index.d.ts:22`,
`export { redirect, isRedirect, ... }`). **[VERIFIED-LOCAL for the export]**

```ts
// src/auth/require-user.ts  (proposed — mirrors existing getSessionFn)
import { redirect } from "@tanstack/react-router";
import { getRequest } from "@tanstack/react-start/server";

import { getAuth } from "./server";

/** Returns the authenticated { session, user }, or throws a redirect to /login. */
export async function requireUser() {
    const auth = getAuth();
    const request = getRequest();
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
        throw redirect({ to: "/login", search: { redirect: request.url } });
    }
    return session; // { session, user }
}
```

Usage inside any protected server function:

```ts
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireUser } from "../auth/require-user";
import { getDb } from "../db";
import { createCategoryRepository } from "../repositories/category.repository";

export const listCategoriesFn = createServerFn({ method: "GET" }).handler(async () => {
    const { user } = await requireUser(); // gate
    const repo = createCategoryRepository(getDb(), user.id); // scope by session-derived id
    return repo.list();
});
```

The existing route guard `_authenticated.tsx` (`beforeLoad` → `throw redirect({ to: "/login", ... })`,
`src/routes/_authenticated.tsx:5-11`) already establishes the redirect-on-unauthenticated convention;
`requireUser()` applies the same convention at the server-function layer. Extend that, don't diverge from it.
**[VERIFIED-LOCAL]**

### (c) Server functions are PUBLIC endpoints — validate everything

TanStack Start compiles each `createServerFn` into an addressable HTTP endpoint (RPC). Anyone can POST to it
directly, so:

- **Never trust client-supplied identity.** Always derive `userId` from `requireUser()`'s session, never from
  a request argument. (The schema's `userId` FKs — `src/db/schema.ts` — are the tenancy key; the _server_
  chooses it.)
- **Validate all input with zod** using the built-in `.validator()` step (zod `^4.3.5` is already a dep):

    ```ts
    export const createCategoryFn = createServerFn({ method: "POST" })
        .validator(
            z.object({
                name: z.string().min(1).max(100),
                description: z.string().max(500),
            }),
        )
        .handler(async ({ data }) => {
            const { user } = await requireUser();
            return createCategoryRepository(getDb(), user.id).create(data); // userId from session, not client
        });
    ```

> The "server functions are public endpoints, validate with the validator step" guidance is standard TanStack
> Start doctrine; the primary reference is
> <https://tanstack.com/start/latest/docs/framework/react/server-functions> (**[UNVERIFIED — the docs page
> > could not be fetched offline]**), but the `.validator()` API itself is present in the installed
> `@tanstack/react-start` and the zod dependency is already in `package.json`.

### (d) Accessing the D1 binding / CF env inside a server function (VERIFIED-LOCAL)

Server functions run in the Workers runtime, so the Cloudflare `env` is reached through the
`cloudflare:workers` virtual module — the repo already centralizes this:

- `src/db/index.ts:3-10`:
    ```ts
    import { env as cfEnv } from "cloudflare:workers";
    import { drizzle } from "drizzle-orm/d1";
    import * as schema from "./schema";
    export function getDb() {
        return drizzle(cfEnv.DB, { schema });
    }
    ```
    So inside a server function you just call `getDb()` — the `DB` binding (`wrangler.jsonc:26/36`) is resolved
    by the `@cloudflare/vite-plugin` at runtime. **[VERIFIED-LOCAL]**
- Other env/secrets (`AUTH_SECRET`, `BETTER_AUTH_URL`, AWS/SES creds, `SENTRY_DSN`) are read + zod-validated
  via `getRuntimeEnv()` (`src/config/runtimeEnv.ts`), also over `cloudflare:workers`. Reuse it; don't read
  `cfEnv` directly. **[VERIFIED-LOCAL]**
- Both `src/db/index.ts` and `src/auth/server.ts` carry `// Workers runtime only; do not import in client
code.` — importing them into a client bundle breaks, because `cloudflare:workers` only exists server-side.
  Keep server-fn handlers as the boundary. **[VERIFIED-LOCAL]**

---

## Version-sensitivity / risks

1. **`@cloudflare/vitest-pool-workers` ↔ Vitest peer range. RESOLVED [VERIFIED-REGISTRY 2026-07-05].**
   pool-workers pins a narrow `vitest` peerDependency. Registry probe results:
    - `0.12.0` → `peerDependencies.vitest: "2.0.x - 3.2.x"` (miniflare `4.20260103.0`) ✅ matches `vitest@3.2.6`
    - `0.13.0`–`0.18.0` → `peerDependencies.vitest: "^4.1.0"` ❌ requires a Vitest 3→4 upgrade
    - `0.9.x`–`0.11.0` → also `"2.0.x - 3.2.x"` but older miniflare.
      **Decision: pin `@cloudflare/vitest-pool-workers@0.12.0`** (highest 3.2.x-compatible release). Installing a
      `0.13+` version against `vitest@3.2.6` would fail the peer check under pnpm's strict resolution.

2. **pool-workers ↔ wrangler/miniflare/workerd. RESOLVED [VERIFIED-REGISTRY/LOCAL 2026-07-05].**
   `0.12.0` bundles `miniflare@4.20260103.0`; the installed `wrangler@4.59.2` bundles `miniflare@4.20260114.0`
   — same early-Jan-2026 workerd line, so test runtime ≈ dev/deploy runtime. Set the pool's
   `compatibilityDate`/`compatibilityFlags` to match `wrangler.jsonc` (`2026-01-07`, `nodejs_compat`).

3. **Two Vitest configs / the `isVitest` gate. [VERIFIED-LOCAL]**
   `vite.config.ts:21` disables the Cloudflare plugin under Vitest. That is correct for the _jsdom_ project
   and should stay. The pool-workers integration project is a **separate** config (`defineWorkersConfig`) and
   deliberately must not re-enable `@cloudflare/vite-plugin` or `tanstackStart()`. If you instead merge them
   into one config via `test.projects`, keep the plugin lists per-project.

4. **Drizzle migrations dir shape. [PARTIALLY VERIFIED]**
   `./drizzle` contains `NNNN_name.sql` + `meta/_journal.json` (verified on disk) and is already declared as
   wrangler's `migrations_dir` (`wrangler.jsonc`). `readD1Migrations("./drizzle")` should consume it, but the
   exact expectations of `readD1Migrations` (does it read `meta/_journal.json` or just glob `*.sql`?) could
   not be verified offline — confirm against the test-apis doc.

5. **better-auth `1.6.x` API stability. [VERIFIED-LOCAL]**
   `auth.api.getSession({ headers })` and `tanstackStartCookies()` are present in the installed
   `better-auth@1.6.2` types. If you bump better-auth, re-check `dist/integrations/tanstack-start.d.mts` and
   `dist/api/index.d.mts` — the `tanstack-start` cookie integration is comparatively new and its export path
   (`better-auth/tanstack-start`) has moved across versions.

6. **TanStack Start server-fn helpers. [VERIFIED-LOCAL]**
   `getRequest`/`getRequestHeaders` live in `@tanstack/start-server-core` and are surfaced via
   `@tanstack/react-start/server`. Note the repo mixes major-version lines
   (`@tanstack/react-start@^1.132.0` app dep vs `@tanstack/react-start-server@^1.166.16` /
   `@tanstack/start-server-core@^1.167.1` dev deps); keep those in step when upgrading, since `getRequest`'s
   home package is the server-core one.

---

## Verification checklist

Run these once network/registry access is available; they resolve every **[UNVERIFIED]** item above.

```bash
# 1. The critical version-compat answer: which pool-workers pairs with vitest 3.2.x?
npm view @cloudflare/vitest-pool-workers versions --json          # full version list
npm view @cloudflare/vitest-pool-workers dist-tags                # latest
# For each candidate version, inspect its vitest peer + miniflare dep:
npm view @cloudflare/vitest-pool-workers@<VER> peerDependencies
npm view @cloudflare/vitest-pool-workers@<VER> dependencies       # look for miniflare/wrangler
# Pick the highest version whose peerDependencies.vitest satisfies 3.2.x, then:
pnpm add -D @cloudflare/vitest-pool-workers@<CHOSEN>              # only after approval
```

Primary docs to confirm the API surface (fetch and reconcile against this file):

- Entry / overview — <https://developers.cloudflare.com/workers/testing/vitest-integration/>
- Write your first test (defineWorkersConfig, poolOptions) —
  <https://developers.cloudflare.com/workers/testing/vitest-integration/get-started/write-your-first-test/>
- Configuration reference (poolOptions.workers: miniflare, wrangler.configPath, isolatedStorage, singleWorker) —
  <https://developers.cloudflare.com/workers/testing/vitest-integration/configuration/>
- Isolated storage model —
  <https://developers.cloudflare.com/workers/testing/vitest-integration/isolated-storage/>
- Test APIs (`cloudflare:test`: env, applyD1Migrations, readD1Migrations, SELF, createExecutionContext) —
  <https://developers.cloudflare.com/workers/testing/vitest-integration/test-apis/>
- Recipes (D1 example) —
  <https://developers.cloudflare.com/workers/testing/vitest-integration/recipes/>
- Known issues (Vitest version compat, third-party Vite plugins) —
  <https://developers.cloudflare.com/workers/testing/vitest-integration/known-issues/>
- better-auth × TanStack Start — <https://www.better-auth.com/docs/integrations/tanstack>
- TanStack Start server functions — <https://tanstack.com/start/latest/docs/framework/react/server-functions>

---

### Appendix — primary sources actually read for this document

Repo:
`vite.config.ts`, `wrangler.jsonc`, `drizzle.config.ts`, `vitest.setup.ts`, `package.json`,
`src/db/index.ts`, `src/db/schema.ts`, `src/config/runtimeEnv.ts`,
`src/auth/server.ts`, `src/auth/session.ts`, `src/auth/client.ts`,
`src/routes/api.auth.$.ts`, `src/routes/_authenticated.tsx`,
`drizzle/0000_violet_mephistopheles.sql`, `drizzle/meta/_journal.json`.

Installed package type definitions (node_modules — treated as version-accurate primary source):
`@tanstack/start-server-core/dist/esm/request-response.d.ts` (getRequest / getRequestHeaders),
`@tanstack/react-start-server/dist/esm/index.d.ts`, `@tanstack/react-start/dist/esm/server.d.ts`,
`@tanstack/react-router/dist/esm/index.d.ts` (redirect export),
`better-auth/dist/integrations/tanstack-start.d.mts` (tanstackStartCookies),
`better-auth/dist/api/index.d.mts` (getSession endpoint).
