jest.mock("./config", () => ({
    API_SECRET: "test-secret",
    MODEL: "test-model",
}));

import { authHeader, summarizeRequest } from "./client";
import { API_SECRET, MODEL } from "./config";

describe("authHeader", () => {
    it("returns an object with an Authorization key", () => {
        const header = authHeader();
        expect(header).toHaveProperty("Authorization");
    });

    it("formats the Authorization value as a Bearer token with the secret", () => {
        const header = authHeader();
        expect(header.Authorization).toBe(`Bearer ${API_SECRET}`);
    });

    it("uses the mocked secret", () => {
        expect(authHeader().Authorization).toBe("Bearer test-secret");
    });

    it("returns only the Authorization key", () => {
        expect(Object.keys(authHeader())).toEqual(["Authorization"]);
    });

    it("returns a fresh object on each call", () => {
        expect(authHeader()).not.toBe(authHeader());
        expect(authHeader()).toEqual(authHeader());
    });
});

describe("summarizeRequest", () => {
    it("includes the configured model", () => {
        const req = summarizeRequest("hello");
        expect(req.model).toBe(MODEL);
        expect(req.model).toBe("test-model");
    });

    it("passes through short input unchanged", () => {
        const req = summarizeRequest("hello world");
        expect(req.input).toBe("hello world");
    });

    it("handles empty string input", () => {
        const req = summarizeRequest("");
        expect(req.input).toBe("");
    });

    it("truncates input to 2000 characters", () => {
        const longText = "a".repeat(5000);
        const req = summarizeRequest(longText);
        expect(req.input).toHaveLength(2000);
        expect(req.input).toBe("a".repeat(2000));
    });

    it("keeps input at exactly 2000 characters unchanged", () => {
        const text = "b".repeat(2000);
        const req = summarizeRequest(text);
        expect(req.input).toHaveLength(2000);
        expect(req.input).toBe(text);
    });

    it("keeps input at 1999 characters unchanged", () => {
        const text = "c".repeat(1999);
        const req = summarizeRequest(text);
        expect(req.input).toHaveLength(1999);
        expect(req.input).toBe(text);
    });

    it("includes the auth header", () => {
        const req = summarizeRequest("test");
        expect(req.headers).toEqual({ Authorization: `Bearer ${API_SECRET}` });
    });

    it("returns an object with model, input and headers keys", () => {
        const req = summarizeRequest("x");
        expect(Object.keys(req).sort()).toEqual(["headers", "input", "model"]);
    });

    it("slices from the start of the string when truncating", () => {
        const text = "start" + "z".repeat(2000);
        const req = summarizeRequest(text);
        expect(req.input.startsWith("start")).toBe(true);
        expect(req.input).toHaveLength(2000);
    });
});
