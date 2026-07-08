---
"happy-harmony": patch
---

Align the Sandcastle (Ralph-loop) sandbox with the repo's pnpm hard-require. The loop shipped with generic template defaults that used npm, which on this pnpm-only repo (no `package-lock.json`) ignored `pnpm-lock.yaml` and re-resolved from ranges on every iteration, and left agents unable to run their tickets' `pnpm`-worded acceptance checks:

- Install pinned pnpm (`pnpm@10.11.0`) globally in `.sandcastle/Dockerfile` so it's on PATH for the agent user.
- Switch the `onSandboxReady` install hook in `.sandcastle/main.ts` from `npm install` to `pnpm install --frozen-lockfile` for lockfile fidelity.
- Update the implement/merge/review prompts to run `pnpm run check` (typecheck + lint + test) instead of the npm equivalents, matching the bar CI and the tickets' acceptance criteria enforce (previously the loop skipped lint).

Also resolve the pre-existing pnpm-version drift so every surface agrees on one version:

- Add a `packageManager: "pnpm@10.11.0"` field to `package.json` as the single source of truth.
- Drop the `version: 9` pin from `pnpm/action-setup@v4` in all GitHub Actions workflows; the action now reads the pinned version from the `packageManager` field, so CI matches the host, lockfile, and sandbox (all pnpm 10.11.0) instead of running pnpm 9.
- Correct the stale "pnpm 9" prereq in `docs/CONTRIBUTING.md` to point at the `packageManager` field.
