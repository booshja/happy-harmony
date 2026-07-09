import { describe, expect, it } from "vitest";

import { pickRandom } from "../pickRandom";

describe("pickRandom", () => {
    it("returns null for an empty set (the friendly 'nothing to pick' signal)", () => {
        expect(pickRandom([])).toBeNull();
    });

    it("returns the only item for a single-item set", () => {
        expect(pickRandom(["only"])).toBe("only");
    });

    it("maps the random source to an index (0 -> first)", () => {
        expect(pickRandom(["a", "b", "c"], () => 0)).toBe("a");
    });

    it("maps the random source to an index (just under 1 -> last)", () => {
        expect(pickRandom(["a", "b", "c"], () => 0.999)).toBe("c");
    });

    it("clamps a degenerate random source of exactly 1 to the last item", () => {
        // Math.random() never returns 1, but an injected/edge source might; the
        // pick must stay in bounds rather than return undefined.
        expect(pickRandom(["a", "b", "c"], () => 1)).toBe("c");
    });

    it("selects each index for the corresponding random band (uniform)", () => {
        const items = ["a", "b", "c", "d"];
        // Sample the midpoint of each of the 4 equal bands: every item is reachable.
        const picks = [0.1, 0.3, 0.6, 0.85].map((r) =>
            pickRandom(items, () => r),
        );
        expect(picks).toEqual(["a", "b", "c", "d"]);
    });

    it("covers the whole set over many draws from a real-valued source", () => {
        const items = ["a", "b", "c", "d", "e"];
        const seen = new Set<string>();
        // Deterministic sweep across [0,1): proves no item is unreachable.
        for (let i = 0; i < 1000; i++) {
            const r = i / 1000;
            seen.add(pickRandom(items, () => r) as string);
        }
        expect(seen).toEqual(new Set(items));
    });
});
