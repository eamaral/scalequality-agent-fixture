import { applyDiscount, tier } from "./discount";

describe("applyDiscount", () => {
  it("returns full price when pct is 0", () => {
    expect(applyDiscount(100, 0)).toBeCloseTo(100, 2);
  });

  it("returns 0 when pct is 100", () => {
    expect(applyDiscount(100, 100)).toBeCloseTo(0, 2);
  });

  it("applies a normal percentage discount", () => {
    expect(applyDiscount(100, 25)).toBeCloseTo(75, 2);
  });

  it("applies a fractional-resulting discount and rounds to 2 decimals", () => {
    const expected = Math.round(99.99 * (1 - 10 / 100) * 100) / 100;
    expect(applyDiscount(99.99, 10)).toBeCloseTo(expected, 2);
  });

  it("rounds to two decimal places", () => {
    const price = 19.99;
    const pct = 33;
    const expected = Math.round(price * (1 - pct / 100) * 100) / 100;
    const result = applyDiscount(price, pct);
    expect(result).toBeCloseTo(expected, 2);
    // ensure no more than 2 decimals
    expect(Math.round(result * 100) / 100).toBe(result);
  });

  it("handles a zero price", () => {
    expect(applyDiscount(0, 50)).toBeCloseTo(0, 2);
  });

  it("handles boundary pct of 0 without throwing", () => {
    expect(() => applyDiscount(50, 0)).not.toThrow();
  });

  it("handles boundary pct of 100 without throwing", () => {
    expect(() => applyDiscount(50, 100)).not.toThrow();
  });

  it("throws when pct is negative", () => {
    expect(() => applyDiscount(100, -1)).toThrow(
      "pct must be between 0 and 100"
    );
  });

  it("throws when pct exceeds 100", () => {
    expect(() => applyDiscount(100, 101)).toThrow(
      "pct must be between 0 and 100"
    );
  });

  it("throws just below the lower boundary", () => {
    expect(() => applyDiscount(100, -0.0001)).toThrow(Error);
  });

  it("throws just above the upper boundary", () => {
    expect(() => applyDiscount(100, 100.0001)).toThrow(Error);
  });

  it("returns a number type", () => {
    expect(typeof applyDiscount(100, 20)).toBe("number");
  });

  it("computes correctly for large prices", () => {
    const price = 123456.78;
    const pct = 15;
    const expected = Math.round(price * (1 - pct / 100) * 100) / 100;
    expect(applyDiscount(price, pct)).toBeCloseTo(expected, 2);
  });
});

describe("tier", () => {
  it("returns bronze for total below 200", () => {
    expect(tier(0)).toBe("bronze");
    expect(tier(199.99)).toBe("bronze");
  });

  it("returns silver at exactly 200", () => {
    expect(tier(200)).toBe("silver");
  });

  it("returns silver for totals between 200 and 999.99", () => {
    expect(tier(500)).toBe("silver");
    expect(tier(999.99)).toBe("silver");
  });

  it("returns gold at exactly 1000", () => {
    expect(tier(1000)).toBe("gold");
  });

  it("returns gold for totals above 1000", () => {
    expect(tier(5000)).toBe("gold");
  });

  it("handles negative totals as bronze", () => {
    expect(tier(-100)).toBe("bronze");
  });

  it("returns one of the valid tier strings", () => {
    const validTiers = ["bronze", "silver", "gold"];
    expect(validTiers).toContain(tier(0));
    expect(validTiers).toContain(tier(200));
    expect(validTiers).toContain(tier(1000));
  });
});
