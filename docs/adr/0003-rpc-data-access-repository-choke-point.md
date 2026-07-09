# Data access is RPC through a single repository choke point

Data access uses TanStack Start server functions (`createServerFn`) — RPC, not
REST. There are no addressable resource URLs (e.g. `/api/activities/:id`); a
server function is a public HTTP endpoint reachable by anyone who can craft the
request, gated only by its own session and scoping logic. We enforce
authorization by routing **all** access to user-owned tables through a single
**repository choke point** that requires a `userId` and scopes every query by it.
The `WHERE userId = caller` clause is the authorization boundary, enforced in one
layer rather than duplicated (and risking omission) across every server function.

## What the choke point guarantees

- `requireUser()` resolves the session or throws — every data server function
  starts here.
- Every read/write to `category`, `activity`, and `suggestionHistory` goes through
  the repository, which takes `userId` as a required argument.
- **Parent-ownership check:** creating an Activity verifies the target Category
  belongs to the caller, so User B cannot inject rows into User A's Category.
- Inputs are validated with zod; server functions are treated as untrusted,
  public endpoints in the threat model.
- Internal autoincrement `id`s are never accepted or exposed externally; the
  opaque `displayId` is used, but unguessability is not treated as authorization.

This is the enforcement point the isolation matrix (ADR 0005) tests. Chosen over
inline per-function scoping because a single tested boundary is far cheaper to
guarantee than "don't forget the WHERE clause" across a growing set of functions —
which matters given Rigor Level A (ADR 0004).

## Design-review refinements

- **Interface shape:** the choke point is a bound factory
  `createCategoryRepository(db, userId)` returning the method set, one factory per
  entity. `userId` is bound exactly once per request at construction, so no call
  site re-threads it. `db` is a parameter (not an internal `getDb()`), which is
  the injection seam for the ADR 0005 test DB (see that ADR's refinement).
- **`requireUser()` / `withRepos()`:** `requireUser(request)` returns `{ user }`
  or throws — a thin identity primitive. `withRepos(request)` composes it with
  repository construction and returns `{ user, repos }`, so a data server function
  cannot obtain a repository without passing the gate. Boundary order is
  authenticate → validate (zod) → scoped write.
- **Parent-ownership = scoped read:** the Activity repository enforces ownership
  with a single scoped query against `category`
  (`WHERE displayId = ? AND userId = boundUserId`), which serves as both the
  ownership check and the `displayId → id` resolution.
- **Indistinguishable failures:** "no such row" and "exists but not yours" produce
  the same external signal (a generic not-found). This falls out for free from the
  bound-`userId` scoped query and closes the enumeration oracle. Exception messages
  carry no user content.
- **Opaque External Identity:** the repository speaks `displayId` exclusively and
  mints it on create; the internal integer `id` never crosses the interface. See
  CONTEXT.md.

## Follow-up

`docs/privacy-and-guardrails-spec.md` describes operational logging with REST
route templates (`/api/activities/:id`). That intent (log route/function id, never
content) still holds, but the literal examples assume an API shape that will not
exist under RPC; the privacy spec needs a small revision to RPC-shaped guidance.
