import { checkout } from "./index";
import { tier } from "./discount";

describe("tier threshold rule change", () => {
    it("checkout(100, 10) yields silver tier", () => {
        const result = checkout(100, 10);
        expect(result.final).toBe(90);
        expect(result.tier).toBe("silver");
    });

    it("90 total is silver", () => {
        expect(tier(90)).toBe("silver");
    });

    it("below 90 is still bronze", () => {
        expect(tier(89)).toBe("bronze");
    });

    it("1000+ is still gold", () => {
        expect(tier(1000)).toBe("gold");
    });
});
