import test from "node:test";
import assert from "node:assert/strict";

import { isSessionError } from "../src/helpers/session.js";

test("an expired Django session (csrftoken) is a session error", () => {
  assert.equal(isSessionError([{ message: "'csrftoken'" }]), true);
});

test("permission refusals of a valid session are not session errors", () => {
  assert.equal(isSessionError([{ message: "Unauthorized" }]), false);
  assert.equal(isSessionError([{ message: "User not authorized for this operation" }]), false);
});

test("no errors, no session error", () => {
  assert.equal(isSessionError([]), false);
  assert.equal(isSessionError(), false);
});
