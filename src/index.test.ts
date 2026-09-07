import { checkout } from "./index";
import { applyDiscount, tier } from "./discount";

describe("checkout", () => {
  it("returns final price consistent with applyDiscount", () => {
    const price = 100;
    const discountPct = 20;
    const expectedFinal = applyDiscount(price, discountPct);
    const result = checkout(price, discountPct);
    expect(result.final).toBeCloseTo(expectedFinal, 2);
  });

  it("returns tier consistent with tier() of the final price", () => {
    const price = 100;
    const discountPct = 20;
    const expectedFinal = applyDiscount(price, discountPct);
    const expectedTier = tier(expectedFinal);
    const result = checkout(price, discountPct);
    expect(result.tier).toBe(expectedTier);
  });

  it("applies zero discount (final equals full applyDiscount result)", () => {
    const price = 250;
    const expectedFinal = applyDiscount(price, 0);
    const result = checkout(price, 0);
    expect(result.final).toBeCloseTo(expectedFinal, 2);
    expect(result.tier).toBe(tier(expectedFinal));
  });

  it("applies full discount", () => {
    const price = 500;
    const expectedFinal = applyDiscount(price, 100);
    const result = checkout(price, 100);
    expect(result.final).toBeCloseTo(expectedFinal, 2);
    expect(result.tier).toBe(tier(expectedFinal));
  });

  it("handles price of zero", () => {
    const expectedFinal = applyDiscount(0, 50);
    const result = checkout(0, 50);
    expect(result.final).toBeCloseTo(expectedFinal, 2);
    expect(result.tier).toBe(tier(expectedFinal));
  });

  it("returns an object with exactly the expected keys", () => {
    const result = checkout(100, 10);
    expect(Object.keys(result).sort()).toEqual(["final", "tier"]);
  });

  it("final is a number and tier matches tier() type", () => {
    const result = checkout(100, 10);
    expect(typeof result.final).toBe("number");
    expect(result.tier).toBe(tier(result.final));
  });

  it("handles fractional discount percentages consistently", () => {
    const price = 99.99;
    const discountPct = 12.5;
    const expectedFinal = applyDiscount(price, discountPct);
    const result = checkout(price, discountPct);
    expect(result.final).toBeCloseTo(expectedFinal, 2);
    expect(result.tier).toBe(tier(expectedFinal));
  });

  it("is deterministic for the same inputs", () => {
    const a = checkout(320, 15);
    const b = checkout(320, 15);
    expect(a).toEqual(b);
  });

  it("produces different final values for different discounts on same price", () => {
    const low = checkout(1000, 5);
    const high = checkout(1000, 90);
    const expectedLow = applyDiscount(1000, 5);
    const expectedHigh = applyDiscount(1000, 90);
    expect(low.final).toBeCloseTo(expectedLow, 2);
    expect(high.final).toBeCloseTo(expectedHigh, 2);
  });
});
