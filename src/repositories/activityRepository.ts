import { and, eq } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";

import type * as schema from "../db/schema";
import { activity, category } from "../db/schema";
import { generateDisplayId } from "../lib/displayId";
import { pickRandom } from "../lib/pickRandom";

// Accept any Drizzle D1 client bound to this schema. `db` is a parameter, not an
// internal getDb() — the injection seam the ADR-0005 integration tests bind to.
type Db = DrizzleD1Database<typeof schema>;

export interface CreateActivityInput {
    categoryDisplayId: string;
    title: string;
}

// The repository speaks `displayId` exclusively; the internal integer `id` and the
// tenancy `userId` never cross this interface (Opaque External Identity, ADR-0003).
// `categoryDisplayId` is the parent Category's opaque identity — the internal
// `categoryId` link stays hidden.
export interface ActivityDto {
    categoryDisplayId: string;
    createdAt: Date;
    displayId: string;
    title: string;
    updatedAt: Date;
}

/**
 * Raised when the target parent Category does not belong to the caller (or does not
 * exist — the two are indistinguishable by design, closing the enumeration oracle,
 * ADR-0003). The message is content-free: it never echoes user input.
 */
export class ParentCategoryNotFoundError extends Error {
    constructor() {
        super("Category not found");
        this.name = "ParentCategoryNotFoundError";
    }
}

/**
 * The Repository Choke Point for Activities (ADR-0003). Bind `userId` exactly once
 * at construction; every query is scoped `WHERE userId = boundUserId`, so the
 * authorization boundary lives here and nowhere else. Call sites cannot obtain a
 * repository without passing the `requireUser()` gate (see `withRepos`).
 */
export function createActivityRepository(db: Db, userId: string) {
    // The single scoped read of the caller's own Activities, shared by `list()` and
    // `pick()` so both draw from exactly the same `WHERE userId = caller` set —
    // there is no second, unscoped path selection could leak through.
    async function listOwned(): Promise<Array<ActivityDto>> {
        return db
            .select({
                categoryDisplayId: category.displayId,
                createdAt: activity.createdAt,
                displayId: activity.displayId,
                title: activity.name,
                updatedAt: activity.updatedAt,
            })
            .from(activity)
            .innerJoin(category, eq(activity.categoryId, category.id))
            .where(eq(activity.userId, userId));
    }

    return {
        /**
         * Insert an Activity owned by the bound user under one of the caller's own
         * Categories; mints the displayId. Enforces the parent-ownership boundary:
         * the target Category is resolved `WHERE userId = caller`, so a Category the
         * caller does not own is invisible and the create is rejected with
         * `ParentCategoryNotFoundError` — the boundary holds server-side, never
         * trusting the client-supplied parent id.
         */
        async create(input: CreateActivityInput): Promise<ActivityDto> {
            const [parent] = await db
                .select({ id: category.id, displayId: category.displayId })
                .from(category)
                .where(
                    and(
                        eq(category.userId, userId),
                        eq(category.displayId, input.categoryDisplayId),
                    ),
                );
            if (!parent) {
                throw new ParentCategoryNotFoundError();
            }

            const now = new Date();
            const [row] = await db
                .insert(activity)
                .values({
                    categoryId: parent.id,
                    createdAt: now,
                    displayId: generateDisplayId(),
                    name: input.title,
                    updatedAt: now,
                    userId,
                })
                .returning();
            if (!row) {
                // Content-free: never echo user input into an error message.
                throw new Error("Failed to create activity");
            }
            return {
                categoryDisplayId: parent.displayId,
                createdAt: row.createdAt,
                displayId: row.displayId,
                title: row.name,
                updatedAt: row.updatedAt,
            };
        },

        /**
         * All Activities owned by the bound user — never another user's rows. Each
         * carries its parent Category's `displayId` (never the internal link) so the
         * caller can group Activities under their Category. The inner join is safe
         * for isolation: every Activity is scoped `WHERE userId = caller`, and its
         * parent was itself resolved under the caller at create time.
         */
        async list(): Promise<Array<ActivityDto>> {
            return listOwned();
        },

        /**
         * One uniformly-random Activity from the bound user's own set — the "pick
         * one" nudge (user stories 7/8/9/10). Draws only from the caller-scoped read
         * (`WHERE userId = caller`), so another user's Activity can never be picked.
         * An empty set returns `null` — the friendly "nothing to pick" signal, not an
         * error. Avoid-repeats / `suggestionHistory` are deferred (out of scope this
         * slice), so every draw is independent and uniform.
         */
        async pick(): Promise<ActivityDto | null> {
            return pickRandom(await listOwned());
        },
    };
}

export type ActivityRepository = ReturnType<typeof createActivityRepository>;
