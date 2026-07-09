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
