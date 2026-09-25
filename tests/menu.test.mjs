import test from "node:test";
import assert from "node:assert/strict";

import { configuredMenuEntries, isMenuShown } from "../src/helpers/menu.js";

const MENUS = [
  {
    id: "PTBAMainMenu",
    submenus: [
      { position: 2, id: "activity.menu.weeklyPlan" },
      { position: 1, id: "activity.menu.ptba" },
    ],
  },
];
const ENTRIES = [
  { id: "activity.menu.ptba", text: "PTBA", filter: (rights) => rights.includes(170014) },
  { id: "activity.menu.weeklyPlan", text: "Hebdo", filter: (rights) => rights.includes(170005) },
  { id: "other.menu", text: "Other" },
];
const noIcon = () => null;

test("ACT-A-N1: a configured menu without any entry the user may open is not shown", () => {
  const entries = configuredMenuEntries(MENUS, ENTRIES, "PTBAMainMenu", [101001], noIcon);
  assert.deepEqual(entries, []);
  assert.equal(isMenuShown(entries), false);
});

test("a configured menu shows the permitted entries in configured order", () => {
  const entries = configuredMenuEntries(MENUS, ENTRIES, "PTBAMainMenu", [170014, 170005], noIcon);
  assert.deepEqual(entries.map((e) => e.id), ["activity.menu.ptba", "activity.menu.weeklyPlan"]);
  assert.equal(isMenuShown(entries), true);
});
