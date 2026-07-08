---
"happy-harmony": patch
---

Harden the project scaffolding:

- Replace the dangling `eslint: "link:@tanstack/config/eslint"` spec (a leftover from the TanStack monorepo template pointing at a package that isn't installed) with a real `eslint: "^9.36.0"` devDependency, so `pnpm dedupe`/reinstall can no longer break linting by honoring the dead link.
- Enable `noUncheckedIndexedAccess` in `tsconfig.json` for stricter indexed-access safety (no code fallout at current size).
- Add a `check:full` script (`check` + `build`) so the build can be run as part of the local gate before opening a PR.
- Fix Sentry skill doc drift: the global middleware names spans by `serverFnMeta.id`, not `functionId`.
