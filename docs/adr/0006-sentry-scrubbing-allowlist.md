# Sentry scrubbing is allowlist / fail-closed

All data leaving the app for Sentry passes through a single scrubbing seam that
**allows only known-safe fields and drops everything else**, rather than
enumerating sensitive fields to remove. The content-bearing containers of a
Sentry event — `extra`, `contexts`, `tags`, `request.data` / `request.body`, and
breadcrumb `data` payloads — are treated as sensitive by default: a value
survives only if its key is on an explicit allowlist (request id, route template,
coarse error code, environment, `user-agent`). Everything else is redacted.

This inverts the earlier denylist framing in
`docs/privacy-and-guardrails-spec.md`. A denylist **fails open**: the moment any
code adds a field the list did not anticipate (`activityName`, `noteBody`, a
renamed column), it silently leaks to a third party. Correctness would depend on
keeping the redaction list perfectly synced with every field the app ever
produces — the same "don't forget the clause" fragility ADR 0003 rejects for the
authorization boundary. An allowlist **fails closed**: an unanticipated field
leaks nothing by default. Under Rigor Level A (ADR 0004) and the "treat all data
as sensitive by default" rule, fail-closed is the only defensible posture for
user content — Activity titles and notes are the highest-sensitivity data in the
system.

## What the seam guarantees

- A single **pure** scrubbing module (`scrubEvent` / `scrubBreadcrumb`) with no
  env or client/server-only imports, so it is importable by both the server SDK
  (`sentry.server.ts`) and the client SDK (`sentry.client.ts`).
- The **same** functions feed all four hooks: `beforeSend` and `beforeBreadcrumb`
  on both client and server. No per-SDK reimplementation that could drift — a
  client-side drift would leak typed form input, the highest-sensitivity data.
- Allowlist is the primary layer; the named-key denylist (`title`, `note`,
  `notes`, `category`, `categories`, `suggestion`, `content`, `message`, `email`,
  case-insensitive) is retained as a **redundant second layer** that also scans
  inside allow-listed containers.
- **Init-level hardening** complements the scrub: request bodies are not sent,
  query strings are stripped (route templates only), and headers are limited to a
  strict allowlist (never `authorization`, never cookies) — reduce what reaches
  the scrubber in the first place.
- The scrubber is pure, so it is unit-tested (ADR 0005 unit layer) against
  **synthetic** events carrying every named-sensitive key nested inside `extra` /
  `contexts` / breadcrumb `data`, asserting each is gone. No real user content in
  fixtures.

## Considered options

- **Denylist by key name (prior spec framing)** — rejected: fails open; leaks any
  unanticipated field; correctness depends on perpetual vigilance.
- **Allowlist / fail-closed (chosen)** — unknown fields leak nothing by default;
  the wrong thing is unexpressible rather than merely discouraged.
- **Disable Sentry entirely** — rejected: loses the observability posture ADR
  0004 assumes; the risk is user content in events, which scrubbing removes.

## Consequences

- `docs/privacy-and-guardrails-spec.md` "Required scrubbing/redaction" is revised
  from denylist to allowlist framing, cross-referencing this ADR.
- Because exception messages are already generic and carry no user content (see
  ADR 0003's indistinguishable-failure semantics), `message` scrubbing is
  defense-in-depth rather than the only line.
