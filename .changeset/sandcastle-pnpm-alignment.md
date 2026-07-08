---
"happy-harmony": patch
---

Align the Sandcastle (Ralph-loop) sandbox with the repo's pnpm hard-require. The loop shipped with generic template defaults that used npm, which on this pnpm-only repo (no `package-lock.json`) ignored `pnpm-lock.yaml` and re-resolved from ranges on every iteration, and left agents unable to run their tickets' `pnpm`-worded acceptance checks:

- Install pinned pnpm (`pnpm@10.11.0`) globally in `.sandcastle/Dockerfile` so it's on PATH for the agent user.
- Switch the `onSandboxReady` install hook in `.sandcastle/main.ts` from `npm install` to `pnpm install --frozen-lockfile` for lockfile fidelity.
- Update the implement/merge prompts to run `pnpm run typecheck` / `pnpm run test` instead of the npm equivalents.
