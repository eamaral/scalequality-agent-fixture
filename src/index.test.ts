import { checkout } from "./index";

describe("checkout tier", () => {
    it("returns silver for a 90 total", () => {
        expect(checkout(100, 10)).toEqual({ final: 90, tier: "silver" });
    });
});
