import { and, eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import * as schema from "../../src/db/schema";
import { createCategoryRepository } from "../../src/repositories/categoryRepository";

import { createTestDb, seedTwoUsers } from "./fixtures";

// The Repository Choke Point is the seam the isolation matrix binds to (ADR-0005).
// Real D1 in workerd proves the ACTUAL SQL Drizzle emits enforces `WHERE userId =
// caller`, not a mock. isolatedStorage rolls each test back to the clean, migrated,
// two-user database.
describe("category repository — per-user isolation on real D1", () => {
    it("scopes list() to the caller: A never sees B's rows", async () => {
        const db = createTestDb();
        const { userA, userB } = await seedTwoUsers(db);

        const reposA = createCategoryRepository(db, userA.id);
        const reposB = createCategoryRepository(db, userB.id);

        await reposA.create({ name: "A's category" });
        await reposB.create({ name: "B's category" });

        const listA = await reposA.list();
        const listB = await reposB.list();

        expect(listA.map((c) => c.name)).toEqual(["A's category"]);
        expect(listB.map((c) => c.name)).toEqual(["B's category"]);
    });

    it("list() never surfaces another user's Categories, even with several each", async () => {
        // T4 acceptance: user A's list never includes user B's Categories. Both
        // users own multiple rows so a leak would be unmistakable, not a coincidence
        // of a single-row set.
        const db = createTestDb();
        const { userA, userB } = await seedTwoUsers(db);

        const reposA = createCategoryRepository(db, userA.id);
        const reposB = createCategoryRepository(db, userB.id);

        await reposA.create({ name: "A one" });
        await reposA.create({ name: "A two" });
        await reposB.create({ name: "B one" });
        await reposB.create({ name: "B two" });
        await reposB.create({ name: "B three" });

        const listA = await reposA.list();
        const namesA = listA.map((c) => c.name);

        expect(namesA).toHaveLength(2);
        expect(namesA).toEqual(expect.arrayContaining(["A one", "A two"]));
        expect(namesA).not.toContain("B one");
        expect(namesA).not.toContain("B two");
        expect(namesA).not.toContain("B three");
    });

    it("cannot read B's row by crafting a direct displayId lookup", async () => {
        const db = createTestDb();
        const { userA, userB } = await seedTwoUsers(db);

        const bCategory = await createCategoryRepository(db, userB.id).create({
            name: "B private",
        });

        // A knows B's displayId (as if leaked) and asks for it directly. Ownership
        // scoping makes "exists but not yours" indistinguishable from "no such row".
        const found = await createCategoryRepository(db, userA.id).findByDisplayId(
            bCategory.displayId,
        );
        expect(found).toBeNull();
    });

    it("always writes rows owned by the bound user, never a client-supplied one", async () => {
        const db = createTestDb();
        const { userA } = await seedTwoUsers(db);

        const created = await createCategoryRepository(db, userA.id).create({
            name: "owned by A",
        });

        const [row] = await db
            .select()
            .from(schema.category)
            .where(
                and(
                    eq(schema.category.displayId, created.displayId),
                    eq(schema.category.userId, userA.id),
                ),
            );
        expect(row?.userId).toBe(userA.id);
    });

    it("allows an empty Category (name only, no description)", async () => {
        const db = createTestDb();
        const { userA } = await seedTwoUsers(db);

        const created = await createCategoryRepository(db, userA.id).create({
            name: "empty is fine",
        });

        expect(created.description).toBeNull();
        expect(created.displayId).toBeTruthy();
    });
});
