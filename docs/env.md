# Environment configuration

This project separates build-time variables (used by Vite and CI) from runtime variables (provided by Cloudflare Workers).

## Build-time env

- Purpose: tooling only (e.g., Sentry sourcemap upload in CI).
- Source: `.env.local` (optional) or CI env.
- Keys: `CI`, `VITE_SENTRY_ORG`, `VITE_SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`.
- Validation: `parseBuildEnv` in `src/config/validation.ts` (used by `vite.config.ts`).

## Runtime env (Workers)

- Purpose: secrets and bindings used by server code at runtime.
- Source: Cloudflare bindings; local via `.dev.vars` when running `wrangler dev`.
- Keys: `AUTH_SECRET`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `SES_FROM_EMAIL`, optional `SENTRY_DSN`.
- Access: `getRuntimeEnv()` from `src/config/runtimeEnv.ts` (Workers runtime only; not for client imports).
- Validation: Zod schema in `runtimeEnv.ts`; errors list missing keys but never values.

## Local setup

- Build-time: optionally copy `.env.example` to `.env.local` and fill Sentry fields if you need CI-style sourcemap uploads locally.
- Runtime: copy `.dev.vars.example` to `.dev.vars` and fill values; `wrangler dev` will load them.
- Run: `pnpm dev` (uses `wrangler dev` on port 3000). `pnpm dev:vite` is available as a Vite-only fallback.

## Staging/production

- Secrets (`AUTH_SECRET`, AWS keys) should be set with `wrangler secret put`.
- Non-secrets (`AWS_REGION`, `SES_FROM_EMAIL`, optional `SENTRY_DSN`) can be set via `vars` in `wrangler.toml` or `wrangler deploy --var KEY=value`.
- Build-time Sentry vars for CI are configured in the CI environment (match `.env.example` keys).
- Runtime env must be read only through `getRuntimeEnv()` inside server code.

## Validation

- Build-time keys are validated by `buildEnvSchema` in `src/config/validation.ts` and parsed via `parseBuildEnv` in `vite.config.ts` / `src/env.ts`. When `CI=true`, Sentry keys are required; otherwise they stay optional.
- Runtime keys are validated by `getRuntimeEnv()` in `src/config/runtimeEnv.ts`; error messages list missing keys without revealing values.

## Sentry defaults

- Server (Workers): DSN from runtime `SENTRY_DSN` via `getRuntimeEnv()`. Sample rates: traces 0.1 / profiles 0.1 in production, 1.0 in dev/staging. Environment comes from `WORKERS_ENVIRONMENT`/`NODE_ENV`.
- Client: DSN from `VITE_SENTRY_DSN` (optional). Sample rates mirror server; replays are off by default (`replaysSessionSampleRate=0`, `replaysOnErrorSampleRate=1.0`). Environment uses `import.meta.env.MODE`.

## Testing

- Playwright uses `pnpm dev` (wrangler) so e2e hits the Workers runtime on port 3000. `.dev.vars` must be present for runtime bindings.

## Deployment

- `workers_dev` is enabled for the first deploy to `*.workers.dev`. Route settings remain in `wrangler.jsonc` for attaching the custom domain afterward.
