import * as Sentry from "@sentry/tanstackstart-react";

import { getRuntimeEnv } from "../config/runtimeEnv";

import { scrubBreadcrumb, scrubEvent } from "./sentry-scrub";

const runtimeEnv = getRuntimeEnv();

const envRecord = process.env as Record<string, string | undefined>;
const environment = envRecord.WORKERS_ENVIRONMENT ?? envRecord.NODE_ENV ?? "production";
const isProduction = environment === "production";

const tracesSampleRate = isProduction ? 0.1 : 1.0;
const profilesSampleRate = isProduction ? 0.1 : 1.0;

if (runtimeEnv.SENTRY_DSN) {
    Sentry.init({
        dsn: runtimeEnv.SENTRY_DSN,
        tracesSampleRate,
        profilesSampleRate,
        environment,
        // Rigor Level A (ADR-0004): never attach default PII (bodies, IPs), and
        // fail-closed scrub every event / breadcrumb before it leaves the app
        // (ADR-0006). User-typed content must not reach Sentry.
        sendDefaultPii: false,
        beforeSend: (event) => scrubEvent(event) as Sentry.ErrorEvent,
        beforeBreadcrumb: (breadcrumb) => scrubBreadcrumb(breadcrumb),
    });
}

export { Sentry };
