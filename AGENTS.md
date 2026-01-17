# AGENTS.md

Guidance for AI agents (Cursor/Claude) working in this repo.

## Purpose & scope

- Applies to all code and docs in this repo.
- Prioritize safety, privacy, and minimal, reviewable changes.

## Code quality rules

- Do not use `any`; prefer precise, explicit typing.
- Do not use TypeScript or ESLint ignore comments to bypass checks.

## Non‑permitted actions

- Do not read `.env*` files or any secrets; never exfiltrate or log secrets.
- Do not run database/schema migrations unless explicitly asked and approved (Drizzle included).
- Do not perform file operations outside this repo root.
- Do not guess credentials, tokens, or production URLs.
- Do not run `wrangler deploy` or touch Cloudflare envs/config unless explicitly requested.
- Avoid changing infra/deploy/CI configs (e.g., `wrangler.toml`, GitHub Actions) unless asked.

## Data handling & privacy (health‑adjacent app)

- Treat all data as sensitive; avoid PII in logs and comments.
- Use synthetic/sample data in tests, fixtures, seeds, and examples; no real user data or screenshots.
- Redact identifiers if logging errors; prefer structured, minimal logs. Only log minimal context; no secrets/PII. Prefer Sentry breadcrumbs/contexts sparingly.
- Do not send user data to third parties beyond existing approved services (e.g., Sentry) without confirmation.

## Tech stack context

- Frontend/app: TanStack Start, React, Zustand, Vite.
- Backend/runtime: Cloudflare Workers target.
- Observability: Sentry is used; avoid logging secrets, ensure context is minimal.
- ORM/tooling: Drizzle; migrations only if explicitly authorized.
- Package manager: pnpm (hard‑require).

## Commands (pnpm)

- Install: `pnpm install` (prefer `pnpm install --frozen-lockfile` to keep lockfile fidelity)
- Dev server: `pnpm run dev` (Vite, port 3000)
- Typecheck: `pnpm run typecheck`
- Lint: `pnpm run lint`
- Tests: `pnpm run test` (cov: `pnpm run test:cov`; watch: `pnpm run test:watch`)
- Full check: `pnpm run check`
- Build: `pnpm run build`
- Deploy target: Cloudflare Workers (via `wrangler deploy`) — run only if explicitly requested.

## Coding style & quality

- Follow existing ESLint/Prettier configs; add project rules here when defined.
- Keep changes small and scoped; avoid unnecessary churn.
- Prefer clear naming, typed APIs, and predictable error handling.
- Error handling: fail fast, return typed errors, avoid silent catches; keep logs minimal and redacted.
- UI changes: consider accessibility (keyboard/focus/ARIA) for new or modified components.
- Cloudflare Workers: avoid heavy/blocking work on request path; prefer async/queued work when possible.

## Git & PR workflow

- Branch per PR; target `mainline`.
- Keep PRs narrowly scoped for easy review.
- Commit messages: format as `<TICKET-123>: <summary>`; include what changed.
- Changesets are required when packages change; include a brief human-readable summary and bump patch for fixes/non-breaking tweaks, minor for new features. Pipeline will fail if missing.
- PR description skeleton (use `.github/pull_request_template.md`):
    - Summary: what changed and why.
    - Risks: where this could break or regress.
    - Validation: steps or commands to verify.
    - Tests: which test suites were run/not run.

## Testing expectations

- Default to `pnpm run check` before requesting review.
- If `pnpm run check` is skipped, state why in the PR.
- If skipping tests or checks, call it out in PR (with rationale).
- Note when integration/e2e are not run.

## Safety checklist for assistants

- Confirm instructions before touching data models or auth flows.
- Avoid touching infra/deploy configs unless requested.
- Never introduce or expose secrets in code, logs, or examples.
- Ask before performing migrations, data backfills, or destructive ops.

## When to ask for guidance

- Ambiguous product requirements or UX changes.
- Schema/auth changes, cross‑service contracts, or performance‑sensitive code paths.
- Any action that could affect production behavior or data durability.
