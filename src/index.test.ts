import { checkout } from "./index";
import { applyDiscount, tier } from "./discount";

describe("checkout", () => {
    it("returns final price computed by applyDiscount and its tier", () => {
        const price = 100;
        const discountPct = 10;
        const expectedFinal = applyDiscount(price, discountPct);
        const expectedTier = tier(expectedFinal);

        const result = checkout(price, discountPct);

        expect(result.final).toBeCloseTo(expectedFinal, 2);
        expect(result.tier).toBe(expectedTier);
    });

    it("returns full price when discount is zero", () => {
        const price = 250;
        const expectedFinal = applyDiscount(price, 0);
        const result = checkout(price, 0);

        expect(result.final).toBeCloseTo(expectedFinal, 2);
        expect(result.tier).toBe(tier(expectedFinal));
    });

    it("handles a full 100% discount", () => {
        const price = 500;
        const expectedFinal = applyDiscount(price, 100);
        const result = checkout(price, 100);

        expect(result.final).toBeCloseTo(expectedFinal, 2);
        expect(result.tier).toBe(tier(expectedFinal));
    });

    it("handles zero price", () => {
        const expectedFinal = applyDiscount(0, 50);
        const result = checkout(0, 50);

        expect(result.final).toBeCloseTo(expectedFinal, 2);
        expect(result.tier).toBe(tier(expectedFinal));
    });

    it("returns an object with exactly 'final' and 'tier' keys", () => {
        const result = checkout(100, 10);
        expect(Object.keys(result).sort()).toEqual(["final", "tier"]);
    });

    it("final is a number and tier matches tier() applied to final", () => {
        const result = checkout(199.99, 25);
        expect(typeof result.final).toBe("number");
        expect(result.tier).toBe(tier(result.final));
    });

    it("is consistent across multiple price/discount combinations", () => {
        const cases: Array<[number, number]> = [
            [10, 5],
            [1000, 50],
            [42.5, 33],
            [0, 0],
            [999.99, 99],
        ];

        for (const [price, discountPct] of cases) {
            const expectedFinal = applyDiscount(price, discountPct);
            const result = checkout(price, discountPct);
            expect(result.final).toBeCloseTo(expectedFinal, 2);
            expect(result.tier).toBe(tier(expectedFinal));
        }
    });

    it("delegates final computation to applyDiscount (equal to direct call)", () => {
        const price = 123.45;
        const discountPct = 12.5;
        expect(checkout(price, discountPct).final).toBeCloseTo(
            applyDiscount(price, discountPct),
            2
        );
    });
});
