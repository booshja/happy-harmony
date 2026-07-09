import { z } from "zod";

// Pure validation logic for Activity input — no server-only imports, so it is
// importable by the client UI (courtesy validation) and unit tests alike, while the
// server function (`src/server/activities.ts`) reuses the same schema as the
// authoritative boundary. Activity titles are short human labels: reject blank
// (after trimming) and over-long titles with a clear, content-free message. Every
// Activity belongs to exactly one parent Category (ADR-0002), identified by its
// opaque `displayId` — the only Category identity that crosses the boundary.
export const ACTIVITY_TITLE_MAX_LENGTH = 100;

export const activityTitleSchema = z
    .string()
    .trim()
    .min(1, "Please enter a title for your activity.")
    .max(
        ACTIVITY_TITLE_MAX_LENGTH,
        `Title must be ${ACTIVITY_TITLE_MAX_LENGTH} characters or fewer.`,
    );

// The parent Category's opaque external identity. Presence is validated here; the
// authoritative parent-ownership check (the Category must belong to the caller)
// lives server-side at the Repository Choke Point (ADR-0003) and cannot be bypassed
// from the client.
export const categoryDisplayIdSchema = z
    .string()
    .trim()
    .min(1, "Please pick a category for your activity.");

export const createActivityInputSchema = z.object({
    title: activityTitleSchema,
    categoryDisplayId: categoryDisplayIdSchema,
});

export type CreateActivityInput = z.infer<typeof createActivityInputSchema>;
