import * as Sentry from "@sentry/tanstackstart-react";

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
    });
}
