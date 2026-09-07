import { API_SECRET, MODEL } from "./config";

describe("config", () => {
  describe("API_SECRET", () => {
    it("is a string", () => {
      expect(typeof API_SECRET).toBe("string");
    });

    it("has the expected value", () => {
      expect(API_SECRET).toBe(
        "9f2c4e8b1a7d3f6e0c5b8a2d4f7e1c3b9a6d8f0e2c4b7a1d5e3f"
      );
    });

    it("is non-empty", () => {
      expect(API_SECRET.length).toBeGreaterThan(0);
    });

    it("has the expected length", () => {
      expect(API_SECRET.length).toBe(52);
    });

    it("contains only lowercase hex characters", () => {
      expect(API_SECRET).toMatch(/^[0-9a-f]+$/);
    });
  });

  describe("MODEL", () => {
    it("is a string", () => {
      expect(typeof MODEL).toBe("string");
    });

    it("has the expected value", () => {
      expect(MODEL).toBe("gpt-4o-mini");
    });

    it("is non-empty", () => {
      expect(MODEL.length).toBeGreaterThan(0);
    });
  });
});
