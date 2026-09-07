import { applyDiscount, tier } from "./discount";

describe("applyDiscount", () => {
    it("returns the same price when pct is 0", () => {
        expect(applyDiscount(100, 0)).toBeCloseTo(100, 2);
    });

    it("returns 0 when pct is 100", () => {
        expect(applyDiscount(100, 100)).toBeCloseTo(0, 2);
    });

    it("applies a normal discount", () => {
        expect(applyDiscount(100, 25)).toBeCloseTo(75, 2);
    });

    it("applies a fractional discount and rounds to 2 decimals", () => {
        const expected = Math.round(99.99 * (1 - 10 / 100) * 100) / 100;
        expect(applyDiscount(99.99, 10)).toBeCloseTo(expected, 2);
    });

    it("rounds correctly for values needing rounding", () => {
        const price = 19.99;
        const pct = 33;
        const expected = Math.round(price * (1 - pct / 100) * 100) / 100;
        expect(applyDiscount(price, pct)).toBeCloseTo(expected, 2);
    });

    it("handles price of 0", () => {
        expect(applyDiscount(0, 50)).toBeCloseTo(0, 2);
    });

    it("throws when pct is below 0", () => {
        expect(() => applyDiscount(100, -1)).toThrow("pct must be between 0 and 100");
    });

    it("throws when pct is above 100", () => {
        expect(() => applyDiscount(100, 101)).toThrow("pct must be between 0 and 100");
    });

    it("does not throw at boundary pct=0", () => {
        expect(() => applyDiscount(100, 0)).not.toThrow();
    });

    it("does not throw at boundary pct=100", () => {
        expect(() => applyDiscount(100, 100)).not.toThrow();
    });

    it("returns a number type", () => {
        expect(typeof applyDiscount(50, 20)).toBe("number");
    });

    it("result never exceeds original price for valid pct", () => {
        const price = 250;
        const result = applyDiscount(price, 10);
        expect(result).toBeLessThanOrEqual(price);
        expect(result).toBeGreaterThanOrEqual(0);
    });
});

describe("tier", () => {
    it("returns bronze for totals below 200", () => {
        expect(tier(0)).toBe("bronze");
        expect(tier(199)).toBe("bronze");
        expect(tier(199.99)).toBe("bronze");
    });

    it("returns silver at the 200 boundary", () => {
        expect(tier(200)).toBe("silver");
    });

    it("returns silver for totals between 200 and 999", () => {
        expect(tier(500)).toBe("silver");
        expect(tier(999.99)).toBe("silver");
    });

    it("returns gold at the 1000 boundary", () => {
        expect(tier(1000)).toBe("gold");
    });

    it("returns gold for totals above 1000", () => {
        expect(tier(5000)).toBe("gold");
    });

    it("handles negative totals as bronze", () => {
        expect(tier(-100)).toBe("bronze");
    });
});
