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

/**
 * `listActivities` RPC (ADR-0003). A session-scoped read through the Repository
 * Choke Point: `withRepos()` derives `userId` from the authenticated session and
 * the repository scopes every query `WHERE activity.userId = caller`, so the list
 * can only ever contain the caller's own Activities — never another user's. Each
 * carries its parent Category's `displayId` for grouping. No input to validate;
 * the empty list is a valid, friendly result (no Activities yet).
 */
export const listActivities = createServerFn({ method: "GET" }).handler(
    async () => {
        const { repos } = await withRepos();
        return repos.activities.list();
    },
);

/**
 * `pickActivity` RPC (ADR-0003) — the "pick one" nudge (PRD JANDES-124, user stories
 * 7/8/9/10). A session-scoped read through the Repository Choke Point: `withRepos()`
 * derives `userId` from the authenticated session and the repository draws only from
 * the caller's own Activities, so selection can never surface another user's content.
 * Returns one uniformly-random Activity, or `null` when the caller has none — the
 * friendly "nothing to pick" signal, not an error. No input to validate.
 */
export const pickActivity = createServerFn({ method: "GET" }).handler(
    async () => {
        const { repos } = await withRepos();
        return repos.activities.pick();
    },
);
