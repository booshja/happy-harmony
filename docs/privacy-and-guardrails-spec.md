# Privacy & Guardrails Spec

## Scope

This spec defines **what user data we collect/process**, **what we must never collect**, and **how we protect/retain/delete/export it** for this product.

**In scope**

- Application data handling (DB), email flows (SES), analytics (Plausible), operational logging, and error reporting (Sentry).
- Guardrails for engineers: what can/can’t be stored, logged, sent to third parties, or retained.

**Out of scope**

- Legal terms, privacy policy language, DPIAs, HIPAA/regulated compliance claims, and org-level security programs (SOC2, ISO).
- “Perfect anonymity” guarantees (we’re practical; we minimize data and avoid unnecessary collection).
- Browser/OS telemetry outside our control (e.g., device logs, ISP logs).

---

## Data Categories

### 1) Account Data

Used to create/manage user accounts and authentication.

- **Examples:** email address, email verification status/timestamps, password hash (never raw password), account creation time, user ID (internal).
- **Non-examples:** activity titles/notes (not account data).

### 2) Activity Data (User Content)

User-entered content. **Highest sensitivity in this system.**

- **Examples:** activity title, notes, category name, tags, schedules, completion state, suggestion history content derived from user entries.
- **Rule of thumb:** if the user typed it, treat it as sensitive by default.

### 3) Operational Telemetry (Ops Logs)

Minimal, non-content logs used to run/debug the service.

- **Examples:** route template (`/api/activities/:id`), HTTP method, status code, request ID, latency/timing, deployment version, coarse error codes, rate-limit events.
- **Non-examples:** request/response bodies, query strings containing content, activity titles/notes.

### 4) Analytics (Product/Marketing Measurement)

Aggregated, privacy-friendly measurements to understand marketing site traffic.

- **Examples:** page views on marketing pages, referrer, UTM params, country/region (if available), device type (coarse).
- **Non-examples:** user IDs, emails, in-app behavioral tracking, activity content.

### 5) Error Reporting (Sentry)

Used to diagnose crashes/exceptions in prod.

- **Examples:** stack traces, file/line info, release version, route template, coarse error codes, request ID, sanitized breadcrumbs.
- **Non-examples:** user-entered text (activity titles/notes/category names), emails, raw payloads.

---

## Hard Rules (“Must Never”)

These are non-negotiable.

- **Must never** log, send, or store **user-entered activity title/notes** in:
    - server logs (stdout/structured logs)
    - analytics events (Plausible or otherwise)
    - error reports (Sentry), including breadcrumbs, request bodies, headers, query params, or exception messages
- **Must never** include:
    - raw passwords (ever)
    - password reset tokens or email verification tokens in logs or Sentry
    - full request/response bodies in logs or Sentry by default
    - emails in analytics or Sentry
- **Must never** enable “session replay” / DOM recording / keystroke tracking.
- **Must never** add in-app analytics by default (marketing-only analytics only; see Analytics section).

---

## Allowed Rules (“May, but only if…”)

### Operational logging (server-side)

May log **only** the following for each request (structured logging strongly recommended):

- `timestamp`
- `method` (GET/POST/…)
- `route_template` (e.g., `/api/activities/:id`), **not** the full URL with IDs or query strings
- `status` (HTTP status code)
- `request_id` (generated per request)
- `latency_ms` (and optionally breakdowns: db_ms, external_ms)
- `release` / `version` / `env`
- `error_code` (coarse, non-content; e.g., `ACTIVITY_CREATE_VALIDATION_FAILED`)
- `rate_limit` outcome (allowed/blocked, bucket key **not** user email)

**May log user identifiers** for ops correlation **only if** they are non-sensitive and internal:

- `user_id` (internal UUID) is allowed in ops logs **if** it’s not sent to third parties and not combined with content.
- Prefer `request_id` for cross-system correlation; use `user_id` only when necessary.

### Error reporting (Sentry)

May send to Sentry **only if all content is scrubbed** (see next section):

- stack traces + release + environment
- route template + method + status
- request ID
- coarse error code
- sanitized breadcrumbs (no URLs with IDs, no bodies)

---

## Sentry Scrubbing & Breadcrumb Rules

### Defaults (implementation-oriented)

- **Disable sending request bodies** to Sentry (server SDK config).
- **Do not attach headers** except a strict allowlist (e.g., `user-agent` may be okay; never `authorization`, never cookies).
- **Strip query strings** or store only route templates.
- **Sanitize exception messages**: do not throw errors that include user content. If a validation error would include an input string, replace with a generic message and a coarse code.

### Required scrubbing/redaction

Before any event leaves the app:

- Remove or redact fields by key name match (case-insensitive):
    - `title`, `note`, `notes`, `category`, `categories`, `suggestion`, `content`, `message` (when it can hold user input), `email`
- Redact known sensitive locations:
    - breadcrumbs data payloads
    - `request.data`, `request.body`, `extra`, `contexts`, `tags` (ensure tags don’t include content)
- Ensure URLs are normalized:
    - store `/api/activities/:id` not `/api/activities/4d2f...`

### Breadcrumbs

Breadcrumbs are allowed **only if** they contain:

- route template transitions
- coarse UI actions (e.g., `activity_create_submit`) **without** any user-provided strings
- timing markers

**No breadcrumb should ever include** typed text, form payloads, or activity IDs.

---

## Data Retention & Deletion

### Defaults

- **Ops logs retention:** 14 days
- **Sentry retention:** 30 days (or lowest feasible tier)
- **Marketing analytics retention:** 24 months (Plausible default is typically configurable)

### Hard delete behavior (user-initiated account deletion)

Deletion should be **hard delete**, not “disable”.
What must be deleted:

- account record (including email, verification state, auth metadata)
- all user categories
- all user activities (including titles/notes)
- suggestion history (inputs/outputs tied to the user)
- any “soft” audit rows that contain user content (avoid storing these in the first place)

What may remain (non-identifying, non-content):

- aggregated operational counters with no user linkage
- logs keyed only by request ID (and those will age out by retention)

### Backups interaction

- Backups are append-only snapshots and may contain deleted data until they expire.
- **Default:** backup retention 30 days.
- Deletion request takes effect immediately in the primary DB; backups expire on their schedule.
- Backups must not be browsable for ad-hoc queries by engineers; access is restricted and audited.

---

## Data Export Requirements

User export provides a portable copy of the user’s data.

- **Format:** JSON file (optionally zipped), UTF-8
- **Schema versioning:** include top-level `schema_version` (semver, e.g. `1.0.0`)
- **Included:**
    - account basics: `email`, `created_at` (and optionally `verified_at`)
    - categories (names, ordering, created_at)
    - activities (title, notes, status, timestamps, category association by category **name**, not ID)
    - suggestion history entries (if product has them), excluding internal prompts/templates
- **Excluded:**
    - internal IDs (user_id, category_id, activity_id, suggestion_id)
    - operational telemetry, logs, Sentry event IDs
    - security/internal metadata (rate limit counters, internal feature flags)

**Default export shape (example)**

```json
{
    "schema_version": "1.0.0",
    "exported_at": "2026-01-09T00:00:00Z",
    "account": {
        "email": "user@example.com",
        "created_at": "2025-12-01T12:34:56Z",
        "verified_at": "2025-12-01T12:40:00Z"
    },
    "categories": [{ "name": "Work", "created_at": "2025-12-01T12:35:00Z" }],
    "activities": [
        {
            "title": "Ship feature X",
            "notes": "…",
            "status": "open",
            "category": "Work",
            "created_at": "2025-12-02T08:00:00Z",
            "updated_at": "2025-12-05T10:00:00Z"
        }
    ],
    "suggestions": []
}
```
