/// <reference types="@cloudflare/workers-types" />
// Workers runtime only; do not import in client code.
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { getRuntimeEnv } from "../config/runtimeEnv";
import { getDb } from "../db";
import * as schema from "../db/schema";

function createAuth() {
    const env = getRuntimeEnv();
    return betterAuth({
        database: drizzleAdapter(getDb(), { provider: "sqlite", schema }),
        secret: env.AUTH_SECRET,
        baseURL: env.BETTER_AUTH_URL,
        trustedOrigins: [env.BETTER_AUTH_URL],
        emailAndPassword: { enabled: true },
        plugins: [tanstackStartCookies()],
    });
}

let _auth: ReturnType<typeof createAuth> | null = null;

export function getAuth() {
    if (!_auth) {
        _auth = createAuth();
    }
    return _auth;
}

export type Auth = ReturnType<typeof getAuth>;
