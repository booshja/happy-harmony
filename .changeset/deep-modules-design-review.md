---
"happy-harmony": patch
---

Record the architecture design-review decisions for the Repository Choke Point and Sentry scrubbing seam (docs only — no runtime change):

- **CONTEXT.md**: add the **Opaque External Identity** term — internal autoincrement `id` for storage/joins, opaque external `displayId` as the sole wire identity; defense-in-depth and enumeration-prevention, not the authorization boundary.
- **ADR 0006 (new)**: Sentry scrubbing is **allowlist / fail-closed** — a single shared pure scrubber feeds all four hooks (client/server × `beforeSend`/`beforeBreadcrumb`), with init-level hardening; the named-key denylist is retained as a redundant second layer.
- **privacy-and-guardrails-spec.md**: reframe "Required scrubbing/redaction" from denylist to allowlist, cross-referencing ADR 0006.
- **ADR 0003**: refinements — bound factory `createCategoryRepository(db, userId)`, `requireUser()`/`withRepos()` gate, scoped-read parent-ownership, and externally indistinguishable not-found/not-yours failures.
- **ADR 0005**: refinement — the `db` injection seam stops at the repository factory; the isolation matrix injects a test DB there rather than through `withRepos`.
