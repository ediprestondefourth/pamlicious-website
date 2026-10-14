import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const dir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(dir, "checkout-calendar.ts"), "utf8");
const transpiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(transpiled).toString("base64")}`;
const calendar = await import(moduleUrl);

test("selected date stays bound to the month it was chosen in", () => {
  const selected = { year: 2026, month: 9, day: 15 };
  assert.equal(calendar.isSelectedScheduleDate(selected, 2026, 9, 15), true);
  assert.equal(calendar.isSelectedScheduleDate(selected, 2026, 10, 15), false);
  assert.equal(calendar.formatDeliveryDate(selected), "2026-10-15");
});

test("changing the viewed month must not rewrite the submitted delivery date", () => {
  const selected = { year: 2026, month: 9, day: 15 };
  const viewedMonth = { year: 2026, month: 10, day: 15 };
  assert.equal(calendar.formatDeliveryDate(selected), "2026-10-15");
  assert.notEqual(calendar.formatDeliveryDate(viewedMonth), calendar.formatDeliveryDate(selected));
});

test("Sundays and past dates are unavailable", () => {
  const now = new Date(2026, 9, 12, 10);
  assert.equal(calendar.isScheduleDateDisabled(2026, 9, 11, now), true);
  assert.equal(calendar.isScheduleDateDisabled(2026, 9, 18, now), true);
  assert.equal(calendar.isScheduleDateDisabled(2026, 9, 13, now), false);
});
