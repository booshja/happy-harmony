## Environment validation

- Server env is validated with Zod in `src/config/validation.ts` and parsed in `src/env.ts` during startup. Invalid or missing values throw immediately.
- When `CI=true`, required keys: `VITE_SENTRY_ORG`, `VITE_SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`.
- When `CI` is false/omitted, Sentry env is optional and the build runs without the Sentry wrapper.
- `CI` is coerced to boolean, defaults to `false`.
- `vite.config.ts` conditionally wraps with Sentry only when all Sentry env vars are present.

### Adding a new env var

1. Add the key to `serverEnvSchema` in `src/config/validation.ts` (mark it required/optional as needed and document any CI-only requirements).
2. Access it via `env.MY_KEY` from `src/env.ts`.
3. Restart the dev server/build; invalid values will surface as startup errors.
