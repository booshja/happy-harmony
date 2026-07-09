import { describe, expect, it } from "vitest";

import { scrubBreadcrumb, scrubEvent } from "../sentry-scrub";

const REDACTED = "[redacted]";

describe("scrubEvent — allowlist / fail-closed (ADR-0006)", () => {
    it("redacts an unanticipated field in `extra` (fail-closed by default)", () => {
        const scrubbed = scrubEvent({
            extra: { activityName: "synthetic-content", someNewField: 42 },
        });
        expect(scrubbed.extra?.activityName).toBe(REDACTED);
        expect(scrubbed.extra?.someNewField).toBe(REDACTED);
    });

    it("keeps allow-listed keys in a content-bearing bag", () => {
        const scrubbed = scrubEvent({
            extra: { route: "/_authenticated/", request_id: "req_123" },
        });
        expect(scrubbed.extra?.route).toBe("/_authenticated/");
        expect(scrubbed.extra?.request_id).toBe("req_123");
    });

    it("redacts every named-sensitive key nested in `extra`", () => {
        const scrubbed = scrubEvent({
            extra: {
                title: "t",
                note: "n",
                category: "c",
                suggestion: "s",
                content: "x",
                email: "user@example.test",
            },
        });
        for (const value of Object.values(scrubbed.extra ?? {})) {
            expect(value).toBe(REDACTED);
        }
    });

    it("redacts sensitive keys nested inside `contexts` but keeps trace intact", () => {
        const scrubbed = scrubEvent({
            contexts: {
                trace: { trace_id: "abc", span_id: "def" },
                app: { title: "synthetic-title", route: "/ok" },
            },
        });
        const trace = scrubbed.contexts?.trace as Record<string, unknown>;
        const app = scrubbed.contexts?.app as Record<string, unknown>;
        expect(trace.trace_id).toBe("abc");
        expect(trace.span_id).toBe("def");
        expect(app.title).toBe(REDACTED);
        expect(app.route).toBe("/ok");
    });

    it("scrubs `request.data` while leaving other request fields", () => {
        const event = {
            request: { url: "/api/x", data: { name: "synthetic", route: "/ok" } },
        };
        const scrubbed = scrubEvent(event);
        const request = scrubbed.request as {
            data?: Record<string, unknown>;
            url?: string;
        };
        expect(request.url).toBe("/api/x");
        expect(request.data?.name).toBe(REDACTED);
        expect(request.data?.route).toBe("/ok");
    });

    it("does not mutate the original event", () => {
        const event = { extra: { title: "keep-me" } };
        scrubEvent(event);
        expect(event.extra.title).toBe("keep-me");
    });
});

describe("scrubBreadcrumb", () => {
    it("redacts sensitive keys in breadcrumb `data`", () => {
        const breadcrumb = {
            category: "ui.click",
            data: { title: "synthetic-title", route: "/ok" },
        };
        const scrubbed = scrubBreadcrumb(breadcrumb);
        expect(scrubbed.data?.title).toBe(REDACTED);
        expect(scrubbed.data?.route).toBe("/ok");
    });

    it("returns the breadcrumb unchanged when it has no data bag", () => {
        const breadcrumb = { data: undefined };
        expect(scrubBreadcrumb(breadcrumb)).toBe(breadcrumb);
    });
});
