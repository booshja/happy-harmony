---
"happy-harmony": minor
---

JANDES-127: Repository Choke Point + Category create (Slice 1, T3). Adds the single
data-access layer for user-owned tables (`createCategoryRepository(db, userId)`),
where every query is scoped `WHERE userId = caller` (ADR-0003). Factors
`requireUser()` out of the session helper and composes it with repository
construction via `withRepos()`, so `userId` is always derived from the session,
never from client input. Ships the `createCategory` RPC (zod-validated name;
blank / over-long rejected), a minimal create-Category UI, and mints an opaque
`displayId` on create. Activates Rigor Level A privacy on this first write path: a
pure, allowlist / fail-closed Sentry scrubber (`scrubEvent` / `scrubBreadcrumb`,
ADR-0006) now feeds both SDKs so no user-typed content reaches Sentry. Isolation
is proven on real D1 (A cannot read or write B's rows through the repository).
