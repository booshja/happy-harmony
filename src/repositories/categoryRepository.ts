import { and, eq } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";

import type * as schema from "../db/schema";
import { category } from "../db/schema";
import { generateDisplayId } from "../lib/displayId";

// Accept any Drizzle D1 client bound to this schema. `db` is a parameter, not an
// internal getDb() — the injection seam the ADR-0005 integration tests bind to.
type Db = DrizzleD1Database<typeof schema>;

export interface CreateCategoryInput {
    name: string;
    description?: string | null;
}

// The repository speaks `displayId` exclusively; the internal integer `id` and the
// tenancy `userId` never cross this interface (Opaque External Identity, ADR-0003).
export interface CategoryDto {
    createdAt: Date;
    description: string | null;
    displayId: string;
    name: string;
    updatedAt: Date;
}

function toCategoryDto(row: typeof category.$inferSelect): CategoryDto {
    return {
        createdAt: row.createdAt,
        description: row.description,
        displayId: row.displayId,
        name: row.name,
        updatedAt: row.updatedAt,
    };
}

/**
 * The Repository Choke Point for Categories (ADR-0003). Bind `userId` exactly once
 * at construction; every query is scoped `WHERE userId = boundUserId`, so the
 * authorization boundary lives here and nowhere else. Call sites cannot obtain a
 * repository without passing the `requireUser()` gate (see `withRepos`).
 */
export function createCategoryRepository(db: Db, userId: string) {
    return {
        /** Insert a Category owned by the bound user; mints the displayId. */
        async create(input: CreateCategoryInput): Promise<CategoryDto> {
            const now = new Date();
            const [row] = await db
                .insert(category)
                .values({
                    createdAt: now,
                    description: input.description ?? null,
                    displayId: generateDisplayId(),
                    name: input.name,
                    updatedAt: now,
                    userId,
                })
                .returning();
            if (!row) {
                // Content-free: never echo user input into an error message.
                throw new Error("Failed to create category");
            }
            return toCategoryDto(row);
        },

        /** All Categories owned by the bound user — never another user's rows. */
        async list(): Promise<Array<CategoryDto>> {
            const rows = await db
                .select()
                .from(category)
                .where(eq(category.userId, userId));
            return rows.map(toCategoryDto);
        },

        /**
         * A single Category owned by the bound user, or null. "No such row" and
         * "exists but not yours" are indistinguishable (both null) — the scoped
         * query closes the enumeration oracle (ADR-0003).
         */
        async findByDisplayId(displayId: string): Promise<CategoryDto | null> {
            const [row] = await db
                .select()
                .from(category)
                .where(
                    and(
                        eq(category.userId, userId),
                        eq(category.displayId, displayId),
                    ),
                );
            return row ? toCategoryDto(row) : null;
        },
    };
}

export type CategoryRepository = ReturnType<typeof createCategoryRepository>;
