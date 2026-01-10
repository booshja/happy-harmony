# Contributing

## Prereqs

- Node 22 (see `.node-version` / `.nvmrc`)
- pnpm 9 via `corepack enable` (CI uses pnpm/action-setup)

## Setup

- Install deps: `pnpm install`
- Husky hooks install via `pnpm prepare` (runs automatically on install)

## Everyday commands

- Lint: `pnpm lint` (cached)
- Lint fix: `pnpm lint:fix`
- Format all: `pnpm format`
- Format check: `pnpm format:check`
- Typecheck: `pnpm typecheck`
- Tests: `pnpm test`
- Check pipeline locally: `pnpm check`

## Pre-commit

- Hooks run `lint-staged` (Prettier + ESLint with caching) on staged files.
- Tests are intentionally **not** run in hooks; they run in CI.

## Changesets

- Required for PR merge.
- Add one per change: `pnpm changeset` and follow prompts.
- Check status vs main: `pnpm changeset:status`
- Version/publish (CI or release flow): `pnpm changeset:version`, `pnpm changeset:publish`

## CI expectations

- CI jobs: changeset status (required), lint/typecheck/build, tests, weekly security audit.
- Keep branch protections requiring the changeset job’s status check.
