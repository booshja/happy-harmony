import { createServerFn } from "@tanstack/react-start";

import { getSession } from "./requireUser";

// Exposes the session read as a server function for the router's isomorphic
// beforeLoad. Keep this module's exports limited to the server function: it is
// dynamically imported by the root route as a namespace, so any server-only regular
// export here would be pulled into the client bundle. The shared read lives in
// `./requireUser` (server-only) and is referenced only inside the handler, which the
// compiler strips from the client.
export const getSessionFn = createServerFn({ method: "GET" }).handler(async () =>
    getSession(),
);
