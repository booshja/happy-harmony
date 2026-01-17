import { createMiddleware, createStart } from "@tanstack/react-start";

import { Sentry } from "./sentry.server";

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
