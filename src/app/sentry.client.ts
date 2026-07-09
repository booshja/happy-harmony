import * as Sentry from "@sentry/tanstackstart-react";

import { scrubBreadcrumb, scrubEvent } from "./sentry-scrub";

const dsn = import.meta.env.VITE_SENTRY_DSN;

if (dsn) {
    const environment = import.meta.env.MODE || "development";
    const isProduction = environment === "production";

    const tracesSampleRate = isProduction ? 0.1 : 1.0;
    const profilesSampleRate = isProduction ? 0.1 : 1.0;

    const replaysSessionSampleRate = 0;
    const replaysOnErrorSampleRate = 1.0;

    Sentry.init({
        dsn,
        environment,
        tracesSampleRate,
        profilesSampleRate,
        replaysSessionSampleRate,
        replaysOnErrorSampleRate,
        // Rigor Level A (ADR-0004): fail-closed scrub every event / breadcrumb
        // before it leaves the browser (ADR-0006). Client-side drift would leak
        // typed form input — the highest-sensitivity data — so the SAME pure
        // scrubber feeds both SDKs. Never attach default PII.
        sendDefaultPii: false,
        beforeSend: (event) => scrubEvent(event) as Sentry.ErrorEvent,
        beforeBreadcrumb: (breadcrumb) => scrubBreadcrumb(breadcrumb),
    });
}
