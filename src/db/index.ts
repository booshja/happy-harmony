/// <reference types="@cloudflare/workers-types" />
// Workers runtime only; do not import in client code.
import { env as cfEnv } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema";

export function getDb() {
    return drizzle(cfEnv.DB, { schema });
}
