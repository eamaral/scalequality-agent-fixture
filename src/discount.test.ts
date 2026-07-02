import { applyDiscount, tier } from "./discount";

describe("applyDiscount", () => {
  it("returns full price for 0% discount", () => {
    expect(applyDiscount(100, 0)).toBe(100);
  });

  it("returns 0 for 100% discount", () => {
    expect(applyDiscount(100, 100)).toBe(0);
  });

  it("applies a standard percentage discount", () => {
    expect(applyDiscount(100, 20)).toBeCloseTo(80, 2);
  });

  it("applies a 50% discount", () => {
    expect(applyDiscount(50, 50)).toBeCloseTo(25, 2);
  });

  it("rounds to two decimal places", () => {
    const price = 19.99;
    const pct = 15;
    const expected = Math.round(price * (1 - pct / 100) * 100) / 100;
    expect(applyDiscount(price, pct)).toBeCloseTo(expected, 2);
  });

  it("handles fractional pct correctly", () => {
    const price = 200;
    const pct = 12.5;
    const expected = Math.round(price * (1 - pct / 100) * 100) / 100;
    expect(applyDiscount(price, pct)).toBeCloseTo(expected, 2);
  });

  it("handles a price of 0", () => {
    expect(applyDiscount(0, 50)).toBe(0);
  });

  it("throws when pct is below 0", () => {
    expect(() => applyDiscount(100, -1)).toThrow("pct must be between 0 and 100");
  });

  it("throws when pct is above 100", () => {
    expect(() => applyDiscount(100, 101)).toThrow("pct must be between 0 and 100");
  });

  it("does not throw at boundary pct = 0", () => {
    expect(() => applyDiscount(100, 0)).not.toThrow();
  });

  it("does not throw at boundary pct = 100", () => {
    expect(() => applyDiscount(100, 100)).not.toThrow();
  });

  it("result never exceeds the original price for valid pct", () => {
    expect(applyDiscount(123.45, 10)).toBeLessThanOrEqual(123.45);
  });

  it("returns a number type", () => {
    expect(typeof applyDiscount(100, 25)).toBe("number");
  });
});

describe("tier", () => {
  it("returns gold for total >= 1000", () => {
    expect(tier(1000)).toBe("gold");
    expect(tier(5000)).toBe("gold");
  });

  it("returns silver for total between 200 and 999.99", () => {
    expect(tier(200)).toBe("silver");
    expect(tier(999)).toBe("silver");
  });

  it("returns bronze for total below 200", () => {
    expect(tier(0)).toBe("bronze");
    expect(tier(199)).toBe("bronze");
    expect(tier(199.99)).toBe("bronze");
  });

  it("returns silver exactly at boundary 200", () => {
    expect(tier(200)).toBe("silver");
  });

  it("returns bronze just below silver boundary", () => {
    expect(tier(199.99)).toBe("bronze");
  });

  it("returns gold just at gold boundary and silver just below", () => {
    expect(tier(1000)).toBe("gold");
    expect(tier(999.99)).toBe("silver");
  });

  it("handles negative totals as bronze", () => {
    expect(tier(-100)).toBe("bronze");
  });

  it("returns one of the valid tier strings", () => {
    const result = tier(500);
    expect(["bronze", "silver", "gold"]).toContain(result);
  });
});
