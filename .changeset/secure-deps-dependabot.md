---
"happy-harmony": patch
---

Resolve Dependabot security advisories by bumping vuln-driving direct dependencies (@tanstack/_, @cloudflare/vite-plugin, wrangler, vite, @sentry/_, better-auth) and re-resolving affected transitive packages. Clears 51 of 57 open advisories, including the production-runtime cluster (@tanstack/start-server-core server-function deserialization, h3/srvx middleware bypasses, undici, defu prototype pollution).

Updates the Sentry server-function middleware to the current TanStack Start API (`serverFnMeta.id` replaces the removed `functionId` option).

Remaining 6 advisories (esbuild via drizzle-kit's deprecated @esbuild-kit chain; seroval via @tanstack/react-devtools → solid-js) are dev/build-time only, do not execute in the deployed Worker, and are blocked on upstream releases — deferred.
