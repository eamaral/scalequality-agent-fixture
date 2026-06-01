import { applyDiscount, tier } from "./discount";

describe("applyDiscount", () => {
  it("applies a typical percentage discount", () => {
    const price = 100;
    const pct = 20;
    const expected = Math.round(price * (1 - pct / 100) * 100) / 100;
    expect(applyDiscount(price, pct)).toBeCloseTo(expected, 2);
    expect(applyDiscount(100, 20)).toBeCloseTo(80, 2);
  });

  it("returns the full price when discount is 0", () => {
    expect(applyDiscount(49.99, 0)).toBeCloseTo(49.99, 2);
  });

  it("returns 0 when discount is 100", () => {
    expect(applyDiscount(250, 100)).toBeCloseTo(0, 2);
  });

  it("rounds the result to two decimal places", () => {
    const price = 19.99;
    const pct = 33;
    const expected = Math.round(price * (1 - pct / 100) * 100) / 100;
    const result = applyDiscount(price, pct);
    expect(result).toBeCloseTo(expected, 2);
    // verify it is rounded to at most 2 decimals
    expect(Math.round(result * 100) / 100).toBe(result);
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

  it("does not throw at the boundaries 0 and 100", () => {
    expect(() => applyDiscount(100, 0)).not.toThrow();
    expect(() => applyDiscount(100, 100)).not.toThrow();
  });

  it("computes a fractional-percentage discount correctly", () => {
    const price = 200;
    const pct = 12.5;
    const expected = Math.round(price * (1 - pct / 100) * 100) / 100;
    expect(applyDiscount(price, pct)).toBeCloseTo(expected, 2);
    expect(applyDiscount(price, pct)).toBeCloseTo(175, 2);
  });

  it("returns a number type", () => {
    expect(typeof applyDiscount(100, 10)).toBe("number");
  });
});

describe("tier", () => {
  it("returns gold for totals >= 1000", () => {
    expect(tier(1000)).toBe("gold");
    expect(tier(5000)).toBe("gold");
  });

  it("returns silver for totals >= 200 and < 1000", () => {
    expect(tier(200)).toBe("silver");
    expect(tier(999.99)).toBe("silver");
    expect(tier(500)).toBe("silver");
  });

  it("returns bronze for totals < 200", () => {
    expect(tier(199.99)).toBe("bronze");
    expect(tier(0)).toBe("bronze");
    expect(tier(199)).toBe("bronze");
  });

  it("returns bronze for negative totals", () => {
    expect(tier(-100)).toBe("bronze");
  });

  it("respects the exact gold boundary at 1000", () => {
    expect(tier(999)).toBe("silver");
    expect(tier(1000)).toBe("gold");
  });

  it("respects the exact silver boundary at 200", () => {
    expect(tier(199)).toBe("bronze");
    expect(tier(200)).toBe("silver");
  });
});
