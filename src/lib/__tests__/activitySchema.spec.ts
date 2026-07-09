import { describe, expect, it } from "vitest";

import {
    ACTIVITY_TITLE_MAX_LENGTH,
    activityTitleSchema,
    createActivityInputSchema,
} from "../activitySchema";

describe("activityTitleSchema", () => {
    it("rejects a blank title with a clear message", () => {
        const result = activityTitleSchema.safeParse("");
        expect(result.success).toBe(false);
        expect(result.error?.issues[0]?.message).toBe(
            "Please enter a title for your activity.",
        );
    });

    it("rejects a whitespace-only title (trimmed to empty)", () => {
        const result = activityTitleSchema.safeParse("   ");
        expect(result.success).toBe(false);
        expect(result.error?.issues[0]?.message).toBe(
            "Please enter a title for your activity.",
        );
    });

    it("rejects an over-long title with a clear message", () => {
        const tooLong = "a".repeat(ACTIVITY_TITLE_MAX_LENGTH + 1);
        const result = activityTitleSchema.safeParse(tooLong);
        expect(result.success).toBe(false);
        expect(result.error?.issues[0]?.message).toBe(
            `Title must be ${ACTIVITY_TITLE_MAX_LENGTH} characters or fewer.`,
        );
    });

    it("accepts a title at the maximum length", () => {
        const atMax = "a".repeat(ACTIVITY_TITLE_MAX_LENGTH);
        expect(activityTitleSchema.parse(atMax)).toBe(atMax);
    });

    it("trims surrounding whitespace from a valid title", () => {
        expect(activityTitleSchema.parse("  Read a book  ")).toBe("Read a book");
    });
});

describe("createActivityInputSchema", () => {
    it("validates the { title, categoryDisplayId } shape and trims the title", () => {
        expect(
            createActivityInputSchema.parse({
                title: " Hiking ",
                categoryDisplayId: "cat-123",
            }),
        ).toEqual({ title: "Hiking", categoryDisplayId: "cat-123" });
    });

    it("rejects a blank title inside the object", () => {
        expect(
            createActivityInputSchema.safeParse({
                title: "",
                categoryDisplayId: "cat-123",
            }).success,
        ).toBe(false);
    });

    it("rejects a missing parent category", () => {
        const result = createActivityInputSchema.safeParse({
            title: "Hiking",
            categoryDisplayId: "",
        });
        expect(result.success).toBe(false);
        expect(result.error?.issues[0]?.message).toBe(
            "Please pick a category for your activity.",
        );
    });
});
