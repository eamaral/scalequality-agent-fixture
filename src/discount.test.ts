import { applyDiscount, tier } from "./discount";

describe("applyDiscount", () => {
    it("applies a typical discount", () => {
        expect(applyDiscount(100, 20)).toBeCloseTo(80, 2);
    });

    it("returns full price when pct is 0", () => {
        expect(applyDiscount(100, 0)).toBeCloseTo(100, 2);
    });

    it("returns 0 when pct is 100", () => {
        expect(applyDiscount(100, 100)).toBeCloseTo(0, 2);
    });

    it("rounds to two decimal places", () => {
        const expected = Math.round(99.99 * (1 - 33 / 100) * 100) / 100;
        expect(applyDiscount(99.99, 33)).toBeCloseTo(expected, 2);
    });

    it("handles fractional discount percentages", () => {
        const expected = Math.round(50 * (1 - 12.5 / 100) * 100) / 100;
        expect(applyDiscount(50, 12.5)).toBeCloseTo(expected, 2);
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

    it("does not throw at boundary 0", () => {
        expect(() => applyDiscount(100, 0)).not.toThrow();
    });

    it("does not throw at boundary 100", () => {
        expect(() => applyDiscount(100, 100)).not.toThrow();
    });

    it("returns a number type", () => {
        expect(typeof applyDiscount(100, 25)).toBe("number");
    });
});

describe("tier", () => {
    it("returns gold for totals >= 1000", () => {
        expect(tier(1000)).toBe("gold");
        expect(tier(1500)).toBe("gold");
    });

    it("returns silver for totals between 200 and 999", () => {
        expect(tier(200)).toBe("silver");
        expect(tier(999)).toBe("silver");
        expect(tier(999.99)).toBe("silver");
    });

    it("returns bronze for totals below 200", () => {
        expect(tier(199)).toBe("bronze");
        expect(tier(199.99)).toBe("bronze");
        expect(tier(0)).toBe("bronze");
    });

    it("returns bronze for negative totals", () => {
        expect(tier(-100)).toBe("bronze");
    });

    it("boundary at exactly 200 returns silver", () => {
        expect(tier(200)).toBe("silver");
    });

    it("just below 200 returns bronze", () => {
        expect(tier(199.999)).toBe("bronze");
    });

    it("just below 1000 returns silver", () => {
        expect(tier(999.999)).toBe("silver");
    });
});
