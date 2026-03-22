import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { getAuth } from "./server";

export const getSessionFn = createServerFn({ method: "GET" }).handler(async () => {
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
});
