import { createServerFn } from "@tanstack/react-start";

import { createActivityInputSchema } from "../lib/activitySchema";
import { withRepos } from "../repositories";

/**
 * `createActivity` RPC (ADR-0003). Treated as a public, untrusted HTTP endpoint:
 * every input is validated with zod, and `userId` is derived from the authenticated
 * session inside `withRepos()` — never from client input. The displayId is minted by
 * the repository, which also enforces the parent-ownership boundary: the target
 * Category must belong to the caller, otherwise the create is rejected. Activity
 * metadata (duration, notes) is deferred — title-only create this slice (ADR-0002).
 */
export const createActivity = createServerFn({ method: "POST" })
    .validator(createActivityInputSchema)
    .handler(async ({ data }) => {
        const { repos } = await withRepos();
        return repos.activities.create({
            title: data.title,
            categoryDisplayId: data.categoryDisplayId,
        });
    });
