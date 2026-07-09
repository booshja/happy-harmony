import { describe, expect, it } from "vitest";

import {
    CATEGORY_NAME_MAX_LENGTH,
    categoryNameSchema,
    createCategoryInputSchema,
} from "../categorySchema";

describe("categoryNameSchema", () => {
    it("rejects a blank name with a clear message", () => {
        const result = categoryNameSchema.safeParse("");
        expect(result.success).toBe(false);
        expect(result.error?.issues[0]?.message).toBe(
            "Please enter a name for your category.",
        );
    });

    it("rejects a whitespace-only name (trimmed to empty)", () => {
        const result = categoryNameSchema.safeParse("   ");
        expect(result.success).toBe(false);
        expect(result.error?.issues[0]?.message).toBe(
            "Please enter a name for your category.",
        );
    });

    it("rejects an over-long name with a clear message", () => {
        const tooLong = "a".repeat(CATEGORY_NAME_MAX_LENGTH + 1);
        const result = categoryNameSchema.safeParse(tooLong);
        expect(result.success).toBe(false);
        expect(result.error?.issues[0]?.message).toBe(
            `Name must be ${CATEGORY_NAME_MAX_LENGTH} characters or fewer.`,
        );
    });

    it("accepts a name at the maximum length", () => {
        const atMax = "a".repeat(CATEGORY_NAME_MAX_LENGTH);
        expect(categoryNameSchema.parse(atMax)).toBe(atMax);
    });

    it("trims surrounding whitespace from a valid name", () => {
        expect(categoryNameSchema.parse("  Reading  ")).toBe("Reading");
    });
});

describe("createCategoryInputSchema", () => {
    it("validates the { name } shape and trims the name", () => {
        expect(createCategoryInputSchema.parse({ name: " Hiking " })).toEqual({
            name: "Hiking",
        });
    });

    it("rejects a blank name inside the object", () => {
        expect(createCategoryInputSchema.safeParse({ name: "" }).success).toBe(
            false,
        );
    });
});
