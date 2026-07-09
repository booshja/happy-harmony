// Pure Sentry scrubbing seam (ADR-0006). No env or client/server-only imports, so
// the SAME functions feed all four hooks — beforeSend / beforeBreadcrumb on both the
// server and client SDKs — with no per-SDK reimplementation that could drift.
//
// Posture: allowlist / fail-closed. The free-form, content-bearing bags of a Sentry
// event (`extra`, `tags`, `request.data`, breadcrumb `data`) are treated as
// sensitive by default: a value survives only if its key is on the allowlist;
// everything else is redacted. A redundant denylist scans inside kept values (and
// across `contexts`, which is left structurally intact so Sentry's own `trace`
// context is not destroyed). Under Rigor Level A (ADR-0004), an unanticipated field
// must leak nothing by default.

const REDACTED = "[redacted]";

// Known-safe keys that may survive in a content-bearing bag (lower-cased).
const ALLOWED_KEYS = new Set(
    [
        "request_id",
        "requestId",
        "route",
        "environment",
        "code",
        "user-agent",
        "userAgent",
    ].map((key) => key.toLowerCase()),
);

// Redundant second layer: keys that are always redacted, anywhere they appear —
// even nested inside an allow-listed value or inside `contexts` (lower-cased).
const DENIED_KEYS = new Set(
    [
        "title",
        "note",
        "notes",
        "name",
        "category",
        "categories",
        "activity",
        "suggestion",
        "content",
        "message",
        "email",
    ].map((key) => key.toLowerCase()),
);

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return (
        typeof value === "object" && value !== null && !Array.isArray(value)
    );
}

// Denylist-only recursion: preserve structure, redact known-sensitive keys wherever
// they appear. Used for values kept by the allowlist and for `contexts`.
function scrubDenied(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(scrubDenied);
    }
    if (!isPlainObject(value)) {
        return value;
    }
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
        out[key] = DENIED_KEYS.has(key.toLowerCase())
            ? REDACTED
            : scrubDenied(val);
    }
    return out;
}

// Allowlist filter for a content-bearing bag: redact any key not on the allowlist
// (or on the denylist); recurse denylist-only into the values that survive.
function scrubBag(bag: Record<string, unknown>): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(bag)) {
        const lower = key.toLowerCase();
        out[key] =
            !ALLOWED_KEYS.has(lower) || DENIED_KEYS.has(lower)
                ? REDACTED
                : scrubDenied(value);
    }
    return out;
}

// Minimal structural shape of the parts of a Sentry event/breadcrumb we scrub.
// Kept deliberately loose (no index signatures) so the SDK's `ErrorEvent` /
// `Breadcrumb` interfaces satisfy the constraint, while this module stays free of
// any SDK value import.
export interface ScrubbableEvent {
    contexts?: Record<string, unknown>;
    extra?: Record<string, unknown>;
    request?: { data?: unknown };
    tags?: Record<string, unknown>;
}

export interface ScrubbableBreadcrumb {
    data?: Record<string, unknown>;
}

/**
 * Scrub a Sentry event without mutating the input, returning a scrubbed clone. The
 * runtime clone (via spread) preserves every field the SDK set; only the static
 * type is narrowed to the fields this seam reasons about, so call sites cast the
 * result back to the SDK's `ErrorEvent`.
 */
export function scrubEvent(event: ScrubbableEvent): ScrubbableEvent {
    const next: ScrubbableEvent = { ...event };
    if (isPlainObject(event.extra)) {
        next.extra = scrubBag(event.extra);
    }
    if (isPlainObject(event.tags)) {
        next.tags = scrubBag(event.tags);
    }
    if (isPlainObject(event.request)) {
        const request: { data?: unknown } = { ...event.request };
        if (isPlainObject(request.data)) {
            request.data = scrubBag(request.data);
        }
        next.request = request;
    }
    // `contexts` is denylist-scanned (not allowlist-filtered) so Sentry's own
    // `trace`/`runtime`/`os` contexts survive while user content is redacted.
    if (isPlainObject(event.contexts)) {
        next.contexts = scrubDenied(event.contexts) as Record<string, unknown>;
    }
    return next;
}

/** Scrub a Sentry breadcrumb's free-form `data` bag, returning a scrubbed clone. */
export function scrubBreadcrumb(
    breadcrumb: ScrubbableBreadcrumb,
): ScrubbableBreadcrumb {
    if (!isPlainObject(breadcrumb.data)) {
        return breadcrumb;
    }
    return { ...breadcrumb, data: scrubBag(breadcrumb.data) };
}
