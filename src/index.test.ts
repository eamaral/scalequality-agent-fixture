import { checkout } from "./index";
import { applyDiscount, tier } from "./discount";

describe("checkout", () => {
  it("returns final price computed via applyDiscount", () => {
    const price = 100;
    const discountPct = 10;
    const expectedFinal = applyDiscount(price, discountPct);
    const result = checkout(price, discountPct);
    expect(result.final).toBeCloseTo(expectedFinal, 2);
  });

  it("returns tier computed from the final price", () => {
    const price = 100;
    const discountPct = 10;
    const expectedFinal = applyDiscount(price, discountPct);
    const expectedTier = tier(expectedFinal);
    const result = checkout(price, discountPct);
    expect(result.tier).toBe(expectedTier);
  });

  it("returns an object with final and tier keys", () => {
    const result = checkout(50, 5);
    expect(result).toHaveProperty("final");
    expect(result).toHaveProperty("tier");
    expect(Object.keys(result).sort()).toEqual(["final", "tier"]);
  });

  it("handles zero discount", () => {
    const price = 200;
    const expectedFinal = applyDiscount(price, 0);
    const result = checkout(price, 0);
    expect(result.final).toBeCloseTo(expectedFinal, 2);
    expect(result.tier).toBe(tier(expectedFinal));
  });

  it("handles zero price", () => {
    const expectedFinal = applyDiscount(0, 10);
    const result = checkout(0, 10);
    expect(result.final).toBeCloseTo(expectedFinal, 2);
    expect(result.tier).toBe(tier(expectedFinal));
  });

  it("handles full (100%) discount", () => {
    const price = 100;
    const expectedFinal = applyDiscount(price, 100);
    const result = checkout(price, 100);
    expect(result.final).toBeCloseTo(expectedFinal, 2);
    expect(result.tier).toBe(tier(expectedFinal));
  });

  it("final price type is a number", () => {
    const result = checkout(123.45, 17);
    expect(typeof result.final).toBe("number");
  });

  it("is consistent with direct discount + tier composition for various inputs", () => {
    const cases: Array<[number, number]> = [
      [10, 0],
      [10, 50],
      [999, 33],
      [1, 99],
      [500, 25],
    ];
    for (const [price, pct] of cases) {
      const expectedFinal = applyDiscount(price, pct);
      const result = checkout(price, pct);
      expect(result.final).toBeCloseTo(expectedFinal, 2);
      expect(result.tier).toBe(tier(expectedFinal));
    }
  });
});
