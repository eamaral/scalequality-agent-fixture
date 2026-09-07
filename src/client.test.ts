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

    it("formats the Authorization value as a Bearer token using API_SECRET", () => {
        const header = authHeader();
        expect(header.Authorization).toBe(`Bearer ${API_SECRET}`);
    });

    it("returns only the Authorization key", () => {
        const header = authHeader();
        expect(Object.keys(header)).toEqual(["Authorization"]);
    });

    it("returns a fresh object each call", () => {
        expect(authHeader()).not.toBe(authHeader());
        expect(authHeader()).toEqual(authHeader());
    });
});

describe("summarizeRequest", () => {
    it("uses the configured MODEL", () => {
        const req = summarizeRequest("hello");
        expect(req.model).toBe(MODEL);
    });

    it("passes short input through unchanged", () => {
        const req = summarizeRequest("hello world");
        expect(req.input).toBe("hello world");
    });

    it("handles empty string input", () => {
        const req = summarizeRequest("");
        expect(req.input).toBe("");
    });

    it("truncates input to at most 2000 characters", () => {
        const longText = "a".repeat(5000);
        const req = summarizeRequest(longText);
        expect(req.input).toHaveLength(2000);
        expect(req.input).toBe("a".repeat(2000));
    });

    it("keeps input exactly at the 2000 boundary", () => {
        const text = "b".repeat(2000);
        const req = summarizeRequest(text);
        expect(req.input).toHaveLength(2000);
        expect(req.input).toBe(text);
    });

    it("does not truncate input just below the boundary", () => {
        const text = "c".repeat(1999);
        const req = summarizeRequest(text);
        expect(req.input).toHaveLength(1999);
        expect(req.input).toBe(text);
    });

    it("truncates input just above the boundary", () => {
        const text = "d".repeat(2001);
        const req = summarizeRequest(text);
        expect(req.input).toHaveLength(2000);
    });

    it("includes the auth header", () => {
        const req = summarizeRequest("hi");
        expect(req.headers).toEqual({ Authorization: `Bearer ${API_SECRET}` });
    });

    it("returns an object with model, input and headers keys", () => {
        const req = summarizeRequest("anything");
        expect(Object.keys(req).sort()).toEqual(["headers", "input", "model"]);
    });

    it("preserves unicode characters within limit", () => {
        const req = summarizeRequest("héllo 🌟");
        expect(req.input).toBe("héllo 🌟");
    });
});
