import { checkout } from "./index";
import { applyDiscount, tier } from "./discount";

describe("checkout", () => {
  it("returns final price and tier together", () => {
    const result = checkout(100, 10);
    expect(result).toHaveProperty("final");
    expect(result).toHaveProperty("tier");
  });

  it("final equals applyDiscount of inputs", () => {
    const price = 250;
    const discountPct = 20;
    const result = checkout(price, discountPct);
    expect(result.final).toBeCloseTo(applyDiscount(price, discountPct), 5);
  });

  it("tier equals tier of the discounted final price", () => {
    const price = 500;
    const discountPct = 15;
    const result = checkout(price, discountPct);
    expect(result.tier).toBe(tier(applyDiscount(price, discountPct)));
  });

  it("handles zero discount", () => {
    const result = checkout(100, 0);
    expect(result.final).toBeCloseTo(applyDiscount(100, 0), 5);
    expect(result.tier).toBe(tier(applyDiscount(100, 0)));
  });

  it("handles zero price", () => {
    const result = checkout(0, 50);
    expect(result.final).toBeCloseTo(applyDiscount(0, 50), 5);
    expect(result.tier).toBe(tier(applyDiscount(0, 50)));
  });

  it("handles full (100%) discount", () => {
    const result = checkout(100, 100);
    expect(result.final).toBeCloseTo(applyDiscount(100, 100), 5);
    expect(result.tier).toBe(tier(applyDiscount(100, 100)));
  });

  it("is consistent across multiple inputs", () => {
    const cases: Array<[number, number]> = [
      [10, 5],
      [1000, 25],
      [99.99, 33],
      [1, 1],
      [12345, 50],
    ];
    for (const [price, discountPct] of cases) {
      const result = checkout(price, discountPct);
      const expectedFinal = applyDiscount(price, discountPct);
      expect(result.final).toBeCloseTo(expectedFinal, 5);
      expect(result.tier).toBe(tier(expectedFinal));
    }
  });

  it("returns numeric final and a defined tier", () => {
    const result = checkout(200, 10);
    expect(typeof result.final).toBe("number");
    expect(result.tier).toBeDefined();
  });
});
