import { requireUser } from "../auth/requireUser";
import { getDb } from "../db";

import { createCategoryRepository } from "./categoryRepository";

/**
 * Composes the `requireUser()` gate with repository construction, so a data server
 * function cannot obtain a repository without passing authentication (ADR-0003).
 * `userId` is bound into every repository exactly once here — never taken from
 * client input. Boundary order: authenticate -> (caller validates) -> scoped write.
 */
export async function withRepos() {
    const { user } = await requireUser();
    const db = getDb();
    return {
        repos: {
            categories: createCategoryRepository(db, user.id),
        },
        user,
    };
}
