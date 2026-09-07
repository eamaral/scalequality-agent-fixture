import { applyDiscount, tier } from "./discount";

describe("applyDiscount", () => {
    it("returns full price when pct is 0", () => {
        expect(applyDiscount(100, 0)).toBeCloseTo(100, 2);
    });

    it("returns 0 when pct is 100", () => {
        expect(applyDiscount(100, 100)).toBeCloseTo(0, 2);
    });

    it("applies a standard discount", () => {
        const price = 200;
        const pct = 25;
        const expected = Math.round(price * (1 - pct / 100) * 100) / 100;
        expect(applyDiscount(price, pct)).toBeCloseTo(expected, 2);
        expect(applyDiscount(price, pct)).toBeCloseTo(150, 2);
    });

    it("rounds to two decimal places", () => {
        const price = 9.99;
        const pct = 33;
        const expected = Math.round(price * (1 - pct / 100) * 100) / 100;
        expect(applyDiscount(price, pct)).toBeCloseTo(expected, 2);
    });

    it("handles a fractional discount result correctly", () => {
        const price = 10;
        const pct = 15;
        const expected = Math.round(price * (1 - pct / 100) * 100) / 100;
        expect(applyDiscount(price, pct)).toBeCloseTo(expected, 2);
        expect(applyDiscount(price, pct)).toBeCloseTo(8.5, 2);
    });

    it("handles price of 0", () => {
        expect(applyDiscount(0, 50)).toBeCloseTo(0, 2);
    });

    it("handles boundary pct of 0 without throwing", () => {
        expect(() => applyDiscount(100, 0)).not.toThrow();
    });

    it("handles boundary pct of 100 without throwing", () => {
        expect(() => applyDiscount(100, 100)).not.toThrow();
    });

    it("throws for negative pct", () => {
        expect(() => applyDiscount(100, -1)).toThrow("pct must be between 0 and 100");
    });

    it("throws for pct greater than 100", () => {
        expect(() => applyDiscount(100, 101)).toThrow("pct must be between 0 and 100");
    });

    it("never returns more than the original price for valid pct", () => {
        const price = 500;
        for (let pct = 0; pct <= 100; pct += 10) {
            expect(applyDiscount(price, pct)).toBeLessThanOrEqual(price);
        }
    });

    it("is monotonically non-increasing as pct increases", () => {
        const price = 500;
        let prev = applyDiscount(price, 0);
        for (let pct = 10; pct <= 100; pct += 10) {
            const current = applyDiscount(price, pct);
            expect(current).toBeLessThanOrEqual(prev);
            prev = current;
        }
    });
});

describe("tier", () => {
    it("returns bronze for totals below 200", () => {
        expect(tier(0)).toBe("bronze");
        expect(tier(199.99)).toBe("bronze");
    });

    it("returns silver at the 200 boundary", () => {
        expect(tier(200)).toBe("silver");
    });

    it("returns silver for totals between 200 and 999.99", () => {
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
