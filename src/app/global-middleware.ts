import { createMiddleware, createStart } from "@tanstack/react-start";

import { Sentry } from "./sentry.server";

const sentryFunctionMiddleware = createMiddleware({ type: "function" }).server(
    async ({ next, serverFnMeta, method }) =>
        Sentry.startSpan(
            {
                name: serverFnMeta.id,
                op: `server.fn.${method}`,
            },
            () => next(),
        ),
);

export const functionMiddleware = [sentryFunctionMiddleware];

export const start = createStart(() => ({
    functionMiddleware,
}));
