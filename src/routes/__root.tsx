import type { QueryClient } from "@tanstack/react-query";
import {
    HeadContent,
    Scripts,
    createRootRouteWithContext,
} from "@tanstack/react-router";
import { Suspense, lazy, useEffect } from "react";

import Header from "../components/Header";
import appCss from "../styles.css?url";

interface MyRouterContext {
    queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
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

function RootDocument({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        void import("../app/sentry.client");
    }, []);

    const Devtools =
        import.meta.env.DEV && typeof window !== "undefined"
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
