import { checkout } from "./index";
import { applyDiscount, tier } from "./discount";

describe("checkout", () => {
  it("returns final price and tier consistent with discount helpers", () => {
    const price = 100;
    const discountPct = 10;
    const expectedFinal = applyDiscount(price, discountPct);
    const result = checkout(price, discountPct);

    expect(result.final).toBeCloseTo(expectedFinal, 5);
    expect(result.tier).toBe(tier(expectedFinal));
  });

  it("applies zero discount (final equals applyDiscount output)", () => {
    const price = 250;
    const expectedFinal = applyDiscount(price, 0);
    const result = checkout(price, 0);

    expect(result.final).toBeCloseTo(expectedFinal, 5);
    expect(result.tier).toBe(tier(expectedFinal));
  });

  it("applies full discount", () => {
    const price = 80;
    const expectedFinal = applyDiscount(price, 100);
    const result = checkout(price, 100);

    expect(result.final).toBeCloseTo(expectedFinal, 5);
    expect(result.tier).toBe(tier(expectedFinal));
  });

  it("returns an object with exactly the expected shape", () => {
    const result = checkout(100, 20);
    expect(result).toHaveProperty("final");
    expect(result).toHaveProperty("tier");
    expect(Object.keys(result).sort()).toEqual(["final", "tier"]);
  });

  it("final is a number and tier matches tier() for that final", () => {
    const result = checkout(999, 33);
    expect(typeof result.final).toBe("number");
    expect(result.tier).toBe(tier(result.final));
  });

  it("handles a range of prices consistently with the helpers", () => {
    for (const price of [0, 1, 50, 100, 500, 1000, 9999]) {
      for (const pct of [0, 5, 25, 50, 75, 100]) {
        const expectedFinal = applyDiscount(price, pct);
        const result = checkout(price, pct);
        expect(result.final).toBeCloseTo(expectedFinal, 5);
        expect(result.tier).toBe(tier(expectedFinal));
      }
    }
  });

  it("handles fractional prices and percentages", () => {
    const price = 123.45;
    const pct = 12.5;
    const expectedFinal = applyDiscount(price, pct);
    const result = checkout(price, pct);
    expect(result.final).toBeCloseTo(expectedFinal, 5);
    expect(result.tier).toBe(tier(expectedFinal));
  });

  it("handles zero price", () => {
    const expectedFinal = applyDiscount(0, 50);
    const result = checkout(0, 50);
    expect(result.final).toBeCloseTo(expectedFinal, 5);
    expect(result.tier).toBe(tier(expectedFinal));
  });
});
