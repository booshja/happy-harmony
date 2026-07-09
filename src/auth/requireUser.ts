import { redirect } from "@tanstack/react-router";
import { getRequest } from "@tanstack/react-start/server";

import { getAuth } from "./server";

// Server-only. This module reaches getAuth -> getDb -> `cloudflare:workers`, so it
// must never enter a client-reachable module graph. It is imported only through the
// repository choke point (`withRepos`) and by `getSessionFn`'s handler — both of
// which the TanStack Start compiler strips from the client bundle. `session.ts` is
// dynamically imported by the root route as a namespace, so its server-only reads
// live here rather than as exports on that module.

/**
 * Reads the better-auth session from the current request's headers. Returns null
 * (never throws) on absence or failure — the single seam that reads identity from
 * the request. `getSessionFn` and `requireUser` share it so identity resolves
 * identically everywhere.
 */
export async function getSession() {
    try {
        const auth = getAuth();
        const request = getRequest();
        const session = await auth.api.getSession({
            headers: request.headers,
        });
        return session;
    } catch {
        return null;
    }
}

/**
 * The identity gate for data server functions (ADR-0003). Resolves the
 * authenticated user from the session or redirects unauthenticated callers to
 * sign-in — every data server function starts here. Factored from the existing
 * session read (not a new auth path). Returns only `{ user }`; per-user scoping
 * happens at the repository choke point via `withRepos`.
 */
export async function requireUser() {
    const session = await getSession();
    if (!session?.user) {
        throw redirect({ to: "/login" });
    }
    return { user: session.user };
}
