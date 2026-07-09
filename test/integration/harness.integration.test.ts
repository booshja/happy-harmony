import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import * as schema from "../../src/db/schema";

import { authHeadersFor, createTestDb, seedTwoUsers } from "./fixtures";

describe("integration harness — real D1 in workerd", () => {
    it("writes then reads a user row against real D1", async () => {
        const db = createTestDb();
        const now = new Date();

        await db.insert(schema.user).values({
            id: "user_harness",
            name: "Harness User",
            email: "harness@example.test",
            emailVerified: false,
            createdAt: now,
            updatedAt: now,
        });

        const [row] = await db
            .select()
            .from(schema.user)
            .where(eq(schema.user.id, "user_harness"));

        expect(row?.email).toBe("harness@example.test");
    });

    it("starts each test from a clean, migrated database (isolatedStorage)", async () => {
        // The row written by the previous test must NOT leak into this one.
        const db = createTestDb();
        const rows = await db.select().from(schema.user);

        expect(rows).toHaveLength(0);
    });

    it("provides a reusable two-user fixture with authenticated sessions", async () => {
        const db = createTestDb();
        const { userA, userB } = await seedTwoUsers(db);

        const users = await db.select().from(schema.user);
        expect(users).toHaveLength(2);

        const [sessionA] = await db
            .select()
            .from(schema.session)
            .where(eq(schema.session.userId, userA.id));
        expect(sessionA?.token).toBe(userA.session.token);

        expect(userA.id).not.toBe(userB.id);
        expect(authHeadersFor(userA).get("cookie")).toContain(userA.session.token);
    });
});
