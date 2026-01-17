# Environment configuration

This project separates **build-time** variables (used by Vite/CI tooling) from **runtime** variables (provided to Cloudflare Workers at runtime).

## Build-time env (Vite/CI only)

- **Purpose:** tooling only (e.g., Sentry sourcemap upload during CI builds).
- **Source:** CI environment variables; optionally `.env.local` for local experimentation.
- **Keys:** `CI`, `VITE_SENTRY_ORG`, `VITE_SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`, `VITE_SENTRY_DSN`.
- **Validation:** `parseBuildEnv` in `src/config/validation.ts` (used by `vite.config.ts`).
- **Notes:**
    - Build-time env should **not** contain runtime secrets like AWS keys or auth secrets.
    - Sourcemap upload should typically run **only in CI**.
    - `SKIP_ENV_LOAD=true` skips loading `.env*` files in Vite; use sparingly.

## Runtime env (Cloudflare Workers)

- **Purpose:** secrets and bindings used by server/runtime code (auth, SES, etc.).
- **Source (staging/prod):** Cloudflare Workers environment variables/secrets.
- **Source (local):** `.dev.vars` when running `wrangler dev`.
- **Keys:**
    - Required: `AUTH_SECRET`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `SES_FROM_EMAIL`
    - Optional: `SENTRY_DSN`
- **Access:** `getRuntimeEnv()` from `src/config/runtimeEnv.ts` (**Workers runtime only; do not import in client code**). Non-secret runtime metadata (like environment name) may be read from `process.env` when needed.
- **Validation:** Zod schema in `runtimeEnv.ts`; errors list missing keys but never values.

## Local setup

- **Runtime (required for server features):**
    1. Copy `.dev.vars.example` → `.dev.vars`
    2. Fill in values (AUTH_SECRET, AWS keys, SES_FROM_EMAIL, etc.)
    3. Run `pnpm dev` (uses `wrangler dev` on port 3000)

- **Build-time (optional):**
    - Copy `.env.example` → `.env.local` only if you want to experiment with CI-like Sentry sourcemap uploads locally.
    - In normal development, you usually don’t need build-time Sentry upload.

- **Commands:**
    - `pnpm dev` → Workers-parity local dev via Wrangler
    - `pnpm dev:vite` → Vite-only fallback (not Workers-parity; avoid for runtime-dependent work)

## Staging / production

- **Secrets** (e.g., `AUTH_SECRET`, AWS keys) should be set with Wrangler:
    - `wrangler secret put AUTH_SECRET`
    - `wrangler secret put AWS_ACCESS_KEY_ID`
    - `wrangler secret put AWS_SECRET_ACCESS_KEY`

- **Non-secrets** (e.g., `AWS_REGION`, `SES_FROM_EMAIL`, optional `SENTRY_DSN`) can be set as vars:
    - via `wrangler.jsonc` `vars` (preferred when values are non-sensitive), or
    - via Cloudflare dashboard for the Worker environment

- **CI build-time Sentry vars** (`VITE_SENTRY_ORG`, `VITE_SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`, `CI`) are configured in the CI environment (match `.env.example` keys).

- **Domains:** staging uses the default `*.workers.dev` URL; production uses the custom domain `app.happyharmony.dev`.

- **Rule:** runtime env must be read only through `getRuntimeEnv()` inside server code.

## Validation

- **Build-time** keys are validated by the schema in `src/config/validation.ts`.
    - When `CI=true`, Sentry build keys are required; otherwise they remain optional.
- **Runtime** keys are validated by `getRuntimeEnv()` in `src/config/runtimeEnv.ts`.
    - Error messages list missing keys without revealing values.

## Sentry (recommended defaults)

- **Server (Workers):** DSN from runtime `SENTRY_DSN` via `getRuntimeEnv()`.
- **Client:** use whatever TanStack Start / Sentry integration requires (avoid exposing secrets; DSN is not a secret).
- **Privacy:** never include user-entered activity text/notes in logs, breadcrumbs, or error reports.

## Testing

- Playwright uses `pnpm dev:vite` by default, so E2E tests do **not** hit the Workers runtime unless you change the Playwright `webServer` command.
- `.dev.vars` is required only when tests exercise runtime-dependent routes and you run via `pnpm dev` (Wrangler).

## Deployment & domains

- `workers_dev` is enabled so deploys always have a `*.workers.dev` URL available (used for staging and debugging).
- Staging deploys use the `*.workers.dev` URL (no custom domain).
- Production is served from the **Custom Domain** `app.happyharmony.dev`, managed in the Cloudflare dashboard.
- **Do not configure `route` patterns in `wrangler.jsonc`** (we intentionally keep the apex `happyharmony.dev` free for marketing later).

## Environment variable reference

### Build-time (Vite/CI)

| Key                   | Secret? | Used where                                        | Purpose                                                                                                   |
| --------------------- | ------: | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `CI`                  |      No | CI environment; `vite.config.ts`                  | Controls CI-only behavior (e.g., enabling sourcemap upload). When `true`, Sentry build vars are required. |
| `VITE_SENTRY_ORG`     |      No | CI environment; `vite.config.ts`                  | Sentry org slug for sourcemap upload configuration.                                                       |
| `VITE_SENTRY_PROJECT` |      No | CI environment; `vite.config.ts`                  | Sentry project slug for sourcemap upload configuration.                                                   |
| `SENTRY_AUTH_TOKEN`   | **Yes** | CI environment; `vite.config.ts`                  | Auth token used by the Sentry Vite plugin to upload sourcemaps. Never expose to runtime/client code.      |
| `VITE_SENTRY_DSN`     |      No | Client build-time env; `src/app/sentry.client.ts` | Client Sentry DSN for browser error reporting.                                                            |

### Runtime (Workers)

| Key                     | Secret? | Set where                               | Used where                           | Purpose                                                                                       |
| ----------------------- | ------: | --------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------- |
| `AUTH_SECRET`           | **Yes** | Wrangler secret / Cloudflare env secret | Server runtime via `getRuntimeEnv()` | Secret used by authentication/session crypto. Must be long and random in staging/prod.        |
| `AWS_REGION`            |      No | Wrangler var / Cloudflare env var       | Server runtime via `getRuntimeEnv()` | AWS region used when calling SES APIs.                                                        |
| `AWS_ACCESS_KEY_ID`     | **Yes** | Wrangler secret / Cloudflare env secret | Server runtime via `getRuntimeEnv()` | Access key for SES sending credentials (least-privilege IAM).                                 |
| `AWS_SECRET_ACCESS_KEY` | **Yes** | Wrangler secret / Cloudflare env secret | Server runtime via `getRuntimeEnv()` | Secret key for SES sending credentials (least-privilege IAM).                                 |
| `SES_FROM_EMAIL`        |      No | Wrangler var / Cloudflare env var       | Server runtime via `getRuntimeEnv()` | Verified “From” address used for verification/reset emails.                                   |
| `SENTRY_DSN`            |      No | Wrangler var / Cloudflare env var       | Server runtime via `getRuntimeEnv()` | Sentry DSN for server-side error reporting. DSN is not secret, but treat it as configuration. |

### Local files (never commit)

| File         | Purpose                                   | Notes                                                                              |
| ------------ | ----------------------------------------- | ---------------------------------------------------------------------------------- |
| `.dev.vars`  | Local runtime bindings for `wrangler dev` | Copy from `.dev.vars.example`. Do not commit.                                      |
| `.env.local` | Optional local build-time vars            | Typically only needed if you want CI-like sourcemap upload locally. Do not commit. |
