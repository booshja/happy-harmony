import { env } from "cloudflare:test";
import { drizzle } from "drizzle-orm/d1";
import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "../../src/db/schema";

export type TestDb = DrizzleD1Database<typeof schema>;

export interface TestSession {
    expiresAt: Date;
    id: string;
    token: string;
    userId: string;
}

export interface TestUser {
    email: string;
    id: string;
    name: string;
    session: TestSession;
}

/** The reusable two-user fixture: user A and user B, each with a session. */
export interface SeededUsers {
    userA: TestUser;
    userB: TestUser;
}

// better-auth's default (unprefixed) session-token cookie name. Tests that
// exercise session-gated server functions present this cookie via authHeadersFor().
const SESSION_COOKIE_NAME = "better-auth.session_token";

// One week, in ms — session lifetime for the synthetic fixture users.
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/** A fresh Drizzle client bound to the real in-worker test D1. */
export function createTestDb(): TestDb {
    return drizzle(env.DB, { schema });
}

function makeUser(suffix: string, now: Date): TestUser {
    return {
        email: `user-${suffix}@example.test`,
        id: `user_${suffix}`,
        name: `Test User ${suffix.toUpperCase()}`,
        session: {
            expiresAt: new Date(now.getTime() + SESSION_TTL_MS),
            id: `session_${suffix}`,
            token: `token_${suffix}`,
            userId: `user_${suffix}`,
        },
    };
}

/**
 * Seeds two synthetic users (A and B), each with an authenticated session, into
 * the real test D1. Synthetic data only (no real user content); rolled back
 * automatically after each test by `isolatedStorage`. Isolation tests across the
 * slice reuse this to prove A cannot read or write B's rows at the repository
 * choke point (ADR-0005).
 */
export async function seedTwoUsers(db: TestDb = createTestDb()): Promise<SeededUsers> {
    const now = new Date();
    const userA = makeUser("a", now);
    const userB = makeUser("b", now);
    const users = [userA, userB];

    await db.insert(schema.user).values(
        users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: false,
            createdAt: now,
            updatedAt: now,
        })),
    );

    await db.insert(schema.session).values(
        users.map((user) => ({
            id: user.session.id,
            token: user.session.token,
            userId: user.session.userId,
            expiresAt: user.session.expiresAt,
            createdAt: now,
            updatedAt: now,
        })),
    );

    return { userA, userB };
}

/** Request headers carrying `user`'s session cookie, for session-gated fns. */
export function authHeadersFor(user: TestUser): Headers {
    return new Headers({
        cookie: `${SESSION_COOKIE_NAME}=${user.session.token}`,
    });
}
