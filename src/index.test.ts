import { checkout } from "./index";
import { applyDiscount, tier } from "./discount";

describe("checkout", () => {
    it("returns final price computed by applyDiscount", () => {
        const price = 100;
        const discountPct = 10;
        const expectedFinal = applyDiscount(price, discountPct);
        const result = checkout(price, discountPct);
        expect(result.final).toBeCloseTo(expectedFinal, 2);
    });

    it("returns tier computed from the final price", () => {
        const price = 100;
        const discountPct = 10;
        const final = applyDiscount(price, discountPct);
        const expectedTier = tier(final);
        const result = checkout(price, discountPct);
        expect(result.tier).toBe(expectedTier);
    });

    it("returns an object with final and tier keys", () => {
        const result = checkout(50, 5);
        expect(result).toHaveProperty("final");
        expect(result).toHaveProperty("tier");
        expect(typeof result.final).toBe("number");
    });

    it("handles zero discount", () => {
        const price = 200;
        const expectedFinal = applyDiscount(price, 0);
        const result = checkout(price, 0);
        expect(result.final).toBeCloseTo(expectedFinal, 2);
        expect(result.tier).toBe(tier(expectedFinal));
    });

    it("handles full discount", () => {
        const price = 200;
        const expectedFinal = applyDiscount(price, 100);
        const result = checkout(price, 100);
        expect(result.final).toBeCloseTo(expectedFinal, 2);
        expect(result.tier).toBe(tier(expectedFinal));
    });

    it("handles zero price", () => {
        const expectedFinal = applyDiscount(0, 10);
        const result = checkout(0, 10);
        expect(result.final).toBeCloseTo(expectedFinal, 2);
        expect(result.tier).toBe(tier(expectedFinal));
    });

    it("is consistent with the underlying discount and tier functions for various inputs", () => {
        const cases: Array<[number, number]> = [
            [10, 0],
            [10, 50],
            [1000, 25],
            [999.99, 33],
            [1, 99],
        ];
        for (const [price, pct] of cases) {
            const final = applyDiscount(price, pct);
            const result = checkout(price, pct);
            expect(result.final).toBeCloseTo(final, 2);
            expect(result.tier).toBe(tier(final));
        }
    });
});
