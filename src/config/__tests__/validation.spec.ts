import { describe, expect, it } from "vitest";

import { parseBuildEnv } from "../validation";

describe("parseBuildEnv", () => {
    it("throws and names every missing Sentry credential when CI is true", () => {
        let message = "";
        try {
            parseBuildEnv({ CI: "true" });
        } catch (error) {
            message = (error as Error).message;
        }

        expect(message).toContain("Invalid build environment variables");
        expect(message).toContain(
            "VITE_SENTRY_ORG: VITE_SENTRY_ORG is required when CI=true",
        );
        expect(message).toContain(
            "VITE_SENTRY_PROJECT: VITE_SENTRY_PROJECT is required when CI=true",
        );
        expect(message).toContain(
            "SENTRY_AUTH_TOKEN: SENTRY_AUTH_TOKEN is required when CI=true",
        );
    });

    it("does not require Sentry credentials when CI is not set", () => {
        expect(() => parseBuildEnv({}, { requireSentryInCi: true })).not.toThrow();
    });

    it("does not require Sentry credentials when requireSentryInCi is false", () => {
        expect(() =>
            parseBuildEnv({ CI: "true" }, { requireSentryInCi: false }),
        ).not.toThrow();
    });

    // z.coerce.boolean() runs Boolean(value), so *any* non-empty string is true —
    // including the literal "false". Pinned so nobody relies on CI="false"
    // meaning "not CI".
    it('treats the string "false" as truthy (CI coercion gotcha)', () => {
        expect(() => parseBuildEnv({ CI: "false" })).toThrow(
            /is required when CI=true/,
        );
    });
});
