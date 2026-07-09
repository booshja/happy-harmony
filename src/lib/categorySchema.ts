import { z } from "zod";

// Pure validation logic for Category input — no server-only imports, so it is
// importable by the client UI (courtesy validation) and unit tests alike, while the
// server function (`src/server/categories.ts`) reuses the same schema as the
// authoritative boundary. Category names are short human labels: reject blank (after
// trimming) and over-long names with a clear, content-free message.
export const CATEGORY_NAME_MAX_LENGTH = 100;

export const categoryNameSchema = z
    .string()
    .trim()
    .min(1, "Please enter a name for your category.")
    .max(
        CATEGORY_NAME_MAX_LENGTH,
        `Name must be ${CATEGORY_NAME_MAX_LENGTH} characters or fewer.`,
    );

export const createCategoryInputSchema = z.object({
    name: categoryNameSchema,
});

export type CreateCategoryInput = z.infer<typeof createCategoryInputSchema>;
