import type { QueryClient } from "@tanstack/react-query";
import {
    HeadContent,
    Scripts,
    createRootRouteWithContext,
} from "@tanstack/react-router";
import { createClientOnlyFn } from "@tanstack/react-start";
import { Suspense, lazy, useEffect } from "react";

import type { getSessionFn } from "../auth/session";
import Header from "../components/Header";
import appCss from "../styles.css?url";

interface MyRouterContext {
    queryClient: QueryClient;
    session: Awaited<ReturnType<typeof getSessionFn>>;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    beforeLoad: async () => {
        const { getSessionFn: getSession } = await import("../auth/session");
        const session = await getSession();
        return { session };
    },
    head: () => ({
        meta: [
            {
                charSet: "utf-8",
            },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            {
                title: "Happy Harmony",
            },
        ],
        links: [
            {
                rel: "stylesheet",
                href: appCss,
            },
        ],
    }),

    shellComponent: RootDocument,
});

// Load the browser Sentry SDK only on the client. Wrapping the dynamic import in
// createClientOnlyFn strips it from the server bundle, satisfying TanStack Start's
// import-protection (which denies importing `*.client.*` from server-reachable code).
const initSentryClient = createClientOnlyFn(() => {
    void import("../app/sentry.client");
});

function RootDocument({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        initSentryClient();
    }, []);

    const shouldShowDevtools =
        import.meta.env.DEV &&
        typeof window !== "undefined" &&
        process.env.CI !== "true" &&
        process.env.CI !== "1";
    const Devtools = shouldShowDevtools
        ? lazy(() => import("../components/Devtools"))
        : null;

    return (
        <html lang="en">
            <head>
                <HeadContent />
            </head>
            <body>
                <Header />
                {children}
                {Devtools ? (
                    <Suspense fallback={null}>
                        <Devtools />
                    </Suspense>
                ) : null}
                <Scripts />
            </body>
        </html>
    );
}
