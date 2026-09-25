import test from "node:test";
import assert from "node:assert/strict";

import { nextConfirmIntent, isLogoutConfirmed } from "../src/helpers/confirm.js";

// Sequence of `confirm` store values: the csrf_logout confirm opened, then
// cancelled (cleared), then a confirm without intent opened, then answered.
const replay = (confirms) => confirms.reduce((intent, confirm) => nextConfirmIntent(intent, confirm), null);

test("ACT-B-D4: OK on a later confirm without intent does not log out after a cancelled session confirm", () => {
  const intent = replay([{ title: "Session Expired", intent: "csrf_logout" }, null, { title: "Supprimer PTBA" }, null]);
  assert.equal(intent, null);
  assert.equal(isLogoutConfirmed(true, intent), false);
});

test("OK on the session confirm itself logs out", () => {
  const intent = replay([{ title: "Session Expired", intent: "csrf_logout" }, null]);
  assert.equal(isLogoutConfirmed(true, intent), true);
  assert.equal(isLogoutConfirmed(false, intent), false);
});
