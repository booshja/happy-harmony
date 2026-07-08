---
name: sentry
description: How this repo wires Sentry — automatic error capture and automatic server-function tracing via global middleware, plus how to add a manual span. Use when working with Sentry, adding error or performance monitoring, or writing/editing createServerFn server functions.
---

# Sentry

We use Sentry to capture errors in the deployed app and to trace performance. Most of it is wired automatically — prefer the existing setup over adding your own instrumentation.

## Error capture & init (automatic)

`Sentry.init` runs at startup, gated on a DSN env var, in two places:

- **Client / browser** — `src/app/sentry.client.ts`, gated on `VITE_SENTRY_DSN`.
- **Server / worker** — `src/app/sentry.server.ts`, gated on `SENTRY_DSN`; it re-exports the configured `Sentry` for other server code to import.

If no DSN is set, Sentry stays disabled. You don't need to add anything for errors to be captured.

## Server functions are instrumented automatically

Do **not** hand-wrap a `createServerFn` handler in a Sentry span. `src/app/global-middleware.ts` installs a global `functionMiddleware` that wraps **every** server function in a `Sentry.startSpan` named by its `serverFnMeta.id` (op `server.fn.<method>`). Adding your own span around a server function just double-instruments it.

## Manual spans (for arbitrary hot operations)

When you want a span around a lengthy operation that is **not** a server-function boundary, import the configured `Sentry` and wrap it:

```tsx
import { Sentry } from "@/app/sentry.server"; // server; on the client use `import * as Sentry from "@sentry/tanstackstart-react"`

Sentry.startSpan({ name: "descriptive operation name" }, async () => {
    // some lengthy operation here
    await fetch("https://api.example.com/data/");
});
```

Keep span names, breadcrumbs, and contexts free of PII and secrets — see `CLAUDE.md` → Data handling & privacy.
