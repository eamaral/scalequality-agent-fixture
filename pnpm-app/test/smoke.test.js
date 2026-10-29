const test = require("node:test");
const assert = require("node:assert");
test("the app's dependencies load", () => {
  assert.equal(typeof require("express"), "function");
  assert.equal(typeof require("dompurify"), "function");
});
