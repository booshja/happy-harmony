# Test pyramid per slice; the isolation matrix lives at the integration layer

Each Vertical Slice ships tests across the pyramid rather than deferring test
writing to the end of the project. Crucially, the exhaustive cross-user
**isolation matrix** is owned by the integration layer, not by end-to-end tests —
integration tests are faster and more precise for proving the authorization
boundary, and E2E carries only a single representative isolation smoke.

## The layers, per slice

- **Unit (Vitest)** — pure logic with no DB: the selection algorithm
  (random / avoid-repeats), zod validators, mappers. Many of these.
- **Integration (Vitest against a test DB)** — the repository choke point and
  server functions: CRUD correctness **and the full isolation matrix** (User B
  cannot read / list / update / delete User A's rows, and cannot create a child
  under User A's Category). This layer owns the security assertions.
- **E2E (Playwright)** — one happy-path flow through the real UI, plus **one**
  representative cross-user isolation check. Few of these.
- **Manual usability** — every slice must be something you can actually click
  through and use; that is the tracer-bullet payoff.

## Consequences

- The standalone "authorization boundary E2E" epic (Linear JANDES-77 / JANDES-123)
  dissolves: isolation becomes integration-test acceptance criteria baked into
  every slice that adds a scoped server function, plus one E2E smoke.
- Tests written along the way give regression safety, avoid an end-of-project test
  death march, and serve as documentation of intended behavior.

## Design-review refinement

The `db` injection seam stops at the repository factory. The isolation matrix
constructs `createCategoryRepository(testDb, userId)` directly and asserts
cross-user isolation — it does **not** go through `withRepos` or a server
function. So `db` is injected at the factory (its two real implementations —
prod D1 and the test DB — justify the seam), while `withRepos` calls `getDb()`
internally and stays clean. We do **not** thread an optional test-only `db`
through `withRepos`; the full-stack server-function path stays in the deliberately
thin E2E layer.
