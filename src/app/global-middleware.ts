import * as Sentry from "@sentry/tanstackstart-react";
import { createMiddleware, createStart } from "@tanstack/react-start";

const sentryFunctionMiddleware = createMiddleware({ type: "function" }).server(
    async ({ next, functionId, method }) =>
        Sentry.startSpan(
            {
                name: functionId,
                op: `server.fn.${method}`,
            },
            () => next(),
        ),
);

export const functionMiddleware = [sentryFunctionMiddleware];

export const start = createStart(() => ({
    functionMiddleware,
}));
