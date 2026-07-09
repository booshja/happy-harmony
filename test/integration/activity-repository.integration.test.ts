import { and, eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import * as schema from "../../src/db/schema";
import {
    ParentCategoryNotFoundError,
    createActivityRepository,
} from "../../src/repositories/activityRepository";
import { createCategoryRepository } from "../../src/repositories/categoryRepository";

import { createTestDb, seedTwoUsers } from "./fixtures";

// The Repository Choke Point is the seam the isolation matrix binds to (ADR-0005).
// Real D1 in workerd proves the ACTUAL SQL Drizzle emits enforces the
// parent-ownership boundary — the target Category must belong to the caller — not a
// mock. isolatedStorage rolls each test back to the clean, migrated, two-user
// database.
describe("activity repository — parent-ownership on real D1", () => {
    it("creates an Activity under the caller's own Category", async () => {
        const db = createTestDb();
        const { userA } = await seedTwoUsers(db);

        const parent = await createCategoryRepository(db, userA.id).create({
            name: "A's category",
        });

        const created = await createActivityRepository(db, userA.id).create({
            title: "Read a book",
            categoryDisplayId: parent.displayId,
        });

        expect(created.title).toBe("Read a book");
        expect(created.displayId).toBeTruthy();
        expect(created.categoryDisplayId).toBe(parent.displayId);
    });

    it("writes rows owned by the bound user, linked to the owned Category", async () => {
        const db = createTestDb();
        const { userA } = await seedTwoUsers(db);

        const parent = await createCategoryRepository(db, userA.id).create({
            name: "A's category",
        });
        const created = await createActivityRepository(db, userA.id).create({
            title: "owned by A",
            categoryDisplayId: parent.displayId,
        });

        const [row] = await db
            .select()
            .from(schema.activity)
            .where(eq(schema.activity.displayId, created.displayId));

        expect(row?.userId).toBe(userA.id);
        const [parentRow] = await db
            .select()
            .from(schema.category)
            .where(eq(schema.category.displayId, parent.displayId));
        expect(row?.categoryId).toBe(parentRow?.id);
    });

    it("rejects creating an Activity under another user's Category", async () => {
        // T5 acceptance / user story 11: the parent-ownership boundary holds
        // server-side. B owns a Category; A knows its displayId (as if leaked) and
        // tries to create an Activity under it. The scoped parent lookup makes B's
        // Category invisible to A, so the create is rejected — and no Activity row
        // is written.
        const db = createTestDb();
        const { userA, userB } = await seedTwoUsers(db);

        const bCategory = await createCategoryRepository(db, userB.id).create({
            name: "B private",
        });

        await expect(
            createActivityRepository(db, userA.id).create({
                title: "sneaky",
                categoryDisplayId: bCategory.displayId,
            }),
        ).rejects.toBeInstanceOf(ParentCategoryNotFoundError);

        // Nothing was written under B's Category by anyone.
        const rows = await db
            .select()
            .from(schema.activity)
            .where(
                and(
                    eq(schema.activity.userId, userA.id),
                    eq(schema.activity.name, "sneaky"),
                ),
            );
        expect(rows).toHaveLength(0);
    });

    it("rejects creating an Activity under a non-existent Category", async () => {
        const db = createTestDb();
        const { userA } = await seedTwoUsers(db);

        await expect(
            createActivityRepository(db, userA.id).create({
                title: "orphan",
                categoryDisplayId: "does-not-exist",
            }),
        ).rejects.toBeInstanceOf(ParentCategoryNotFoundError);
    });
});
