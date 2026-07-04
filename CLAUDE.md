# Rules

- When creating any docs, write them to @.ai-docs
- Changesets are used and required for PR's to pass the pipeline

## Code quality rules

- Do not use `any`; prefer precise, explicit typing.
- Do not use TypeScript or ESLint ignore comments to bypass checks.

## Non‑permitted actions

- Do not run database/schema migrations unless explicitly asked and approved (Drizzle included).
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
