import { applyDiscount, tier } from "./discount";

describe("applyDiscount", () => {
    it("returns full price when discount is 0", () => {
        expect(applyDiscount(100, 0)).toBe(100);
    });

    it("returns 0 when discount is 100", () => {
        expect(applyDiscount(100, 100)).toBe(0);
    });

    it("applies a standard percentage discount", () => {
        const price = 200;
        const pct = 25;
        const expected = Math.round(price * (1 - pct / 100) * 100) / 100;
        expect(applyDiscount(price, pct)).toBe(expected);
        expect(applyDiscount(price, pct)).toBeCloseTo(150, 2);
    });

    it("rounds to two decimal places", () => {
        const price = 9.99;
        const pct = 33;
        const expected = Math.round(price * (1 - pct / 100) * 100) / 100;
        expect(applyDiscount(price, pct)).toBe(expected);
        // Result should not have more than 2 decimal places
        expect(Number.isInteger(applyDiscount(price, pct) * 100)).toBe(true);
    });

    it("handles a price of 0", () => {
        expect(applyDiscount(0, 50)).toBe(0);
    });

    it("handles fractional percentages", () => {
        const price = 100;
        const pct = 12.5;
        const expected = Math.round(price * (1 - pct / 100) * 100) / 100;
        expect(applyDiscount(price, pct)).toBe(expected);
        expect(applyDiscount(price, pct)).toBeCloseTo(87.5, 2);
    });

    it("accepts the boundary value 0", () => {
        expect(() => applyDiscount(100, 0)).not.toThrow();
    });

    it("accepts the boundary value 100", () => {
        expect(() => applyDiscount(100, 100)).not.toThrow();
    });

    it("throws when pct is below 0", () => {
        expect(() => applyDiscount(100, -1)).toThrow("pct must be between 0 and 100");
    });

    it("throws when pct is above 100", () => {
        expect(() => applyDiscount(100, 101)).toThrow("pct must be between 0 and 100");
    });

    it("throws on large invalid pct", () => {
        expect(() => applyDiscount(50, 1000)).toThrow(Error);
    });

    it("never returns -0 for zero results", () => {
        const result = applyDiscount(0, 100);
        expect(+result === 0).toBe(true);
    });

    it("result is within range [0, price] for valid discounts", () => {
        const price = 500;
        for (const pct of [0, 10, 50, 99, 100]) {
            const result = applyDiscount(price, pct);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThanOrEqual(price);
        }
    });
});

describe("tier", () => {
    it("returns 'gold' for totals at or above 1000", () => {
        expect(tier(1000)).toBe("gold");
        expect(tier(5000)).toBe("gold");
    });

    it("returns 'silver' for totals at or above 200 but below 1000", () => {
        expect(tier(200)).toBe("silver");
        expect(tier(999)).toBe("silver");
        expect(tier(500)).toBe("silver");
    });

    it("returns 'bronze' for totals below 200", () => {
        expect(tier(199)).toBe("bronze");
        expect(tier(0)).toBe("bronze");
        expect(tier(100)).toBe("bronze");
    });

    it("handles negative totals as bronze", () => {
        expect(tier(-100)).toBe("bronze");
    });

    it("respects exact boundary at 200", () => {
        expect(tier(199.99)).toBe("bronze");
        expect(tier(200)).toBe("silver");
    });

    it("respects exact boundary at 1000", () => {
        expect(tier(999.99)).toBe("silver");
        expect(tier(1000)).toBe("gold");
    });
});
