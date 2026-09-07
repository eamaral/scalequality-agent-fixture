import { checkout } from "./index";
import { tier } from "./discount";

describe("checkout tier regression", () => {
    it("returns silver for checkout(100, 10) which totals 90", () => {
        expect(checkout(100, 10)).toEqual({ final: 90, tier: "silver" });
    });

    it("tier(90) is silver", () => {
        expect(tier(90)).toBe("silver");
    });

    it("tier(89) is still bronze", () => {
        expect(tier(89)).toBe("bronze");
    });
});
