import { applyDiscount, tier } from "./discount";

describe("applyDiscount", () => {
    it("applies a standard percentage discount", () => {
        expect(applyDiscount(100, 10)).toBeCloseTo(90, 2);
    });

    it("returns the same price for 0% discount", () => {
        expect(applyDiscount(100, 0)).toBeCloseTo(100, 2);
    });

    it("returns 0 for 100% discount", () => {
        expect(applyDiscount(100, 100)).toBeCloseTo(0, 2);
    });

    it("rounds to two decimal places", () => {
        const expected = Math.round(99.99 * (1 - 33 / 100) * 100) / 100;
        expect(applyDiscount(99.99, 33)).toBeCloseTo(expected, 2);
    });

    it("handles fractional percentages", () => {
        const expected = Math.round(250 * (1 - 12.5 / 100) * 100) / 100;
        expect(applyDiscount(250, 12.5)).toBeCloseTo(expected, 2);
    });

    it("handles price of zero", () => {
        expect(applyDiscount(0, 50)).toBeCloseTo(0, 2);
    });

    it("returns a number type", () => {
        expect(typeof applyDiscount(100, 25)).toBe("number");
    });

    it("never returns a value greater than the original price", () => {
        for (let pct = 0; pct <= 100; pct += 10) {
            expect(applyDiscount(500, pct)).toBeLessThanOrEqual(500);
        }
    });

    it("decreases monotonically as percentage increases", () => {
        let prev = Infinity;
        for (let pct = 0; pct <= 100; pct += 5) {
            const result = applyDiscount(800, pct);
            expect(result).toBeLessThanOrEqual(prev);
            prev = result;
        }
    });

    it("throws when pct is below 0", () => {
        expect(() => applyDiscount(100, -1)).toThrow("pct must be between 0 and 100");
    });

    it("throws when pct is above 100", () => {
        expect(() => applyDiscount(100, 101)).toThrow("pct must be between 0 and 100");
    });

    it("does not throw at the boundary of 0", () => {
        expect(() => applyDiscount(100, 0)).not.toThrow();
    });

    it("does not throw at the boundary of 100", () => {
        expect(() => applyDiscount(100, 100)).not.toThrow();
    });
});

describe("tier", () => {
    it("returns gold for totals at or above 1000", () => {
        expect(tier(1000)).toBe("gold");
        expect(tier(5000)).toBe("gold");
    });

    it("returns silver for totals at or above 200 but below 1000", () => {
        expect(tier(200)).toBe("silver");
        expect(tier(999.99)).toBe("silver");
    });

    it("returns bronze for totals below 200", () => {
        expect(tier(199.99)).toBe("bronze");
        expect(tier(0)).toBe("bronze");
    });

    it("handles negative totals as bronze", () => {
        expect(tier(-100)).toBe("bronze");
    });

    it("respects the gold boundary exactly", () => {
        expect(tier(999)).toBe("silver");
        expect(tier(1000)).toBe("gold");
    });

    it("respects the silver boundary exactly", () => {
        expect(tier(199)).toBe("bronze");
        expect(tier(200)).toBe("silver");
    });
});
