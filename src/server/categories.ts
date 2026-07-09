import { createServerFn } from "@tanstack/react-start";

import { createCategoryInputSchema } from "../lib/categorySchema";
import { withRepos } from "../repositories";

/**
 * `createCategory` RPC (ADR-0003). Treated as a public, untrusted HTTP endpoint:
 * every input is validated with zod, and `userId` is derived from the authenticated
 * session inside `withRepos()` — never from client input. The displayId is minted
 * by the repository. Description is omitted this slice; empty Categories are allowed.
 */
export const createCategory = createServerFn({ method: "POST" })
    .validator(createCategoryInputSchema)
    .handler(async ({ data }) => {
        const { repos } = await withRepos();
        return repos.categories.create({ name: data.name });
    });

/**
 * `listCategories` RPC (ADR-0003). A session-scoped read through the Repository
 * Choke Point: `withRepos()` derives `userId` from the authenticated session and
 * the repository scopes every query `WHERE userId = caller`, so the list can only
 * ever contain the caller's own Categories — never another user's. No input to
 * validate; the empty list is a valid, friendly result (no Categories yet).
 */
export const listCategories = createServerFn({ method: "GET" }).handler(
    async () => {
        const { repos } = await withRepos();
        return repos.categories.list();
    },
);
