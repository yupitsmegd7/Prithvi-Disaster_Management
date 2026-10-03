import { readFileSync } from "node:fs";
import ts from "typescript";
import assert from "node:assert/strict";
const source = readFileSync("lib/risk.ts", "utf8");
const js = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const risk = await import(
  "data:text/javascript;base64," + Buffer.from(js).toString("base64")
);
assert.equal(risk.sumComplete([0, null, 2], 3), null);
assert.equal(risk.sumComplete([0, 0, 0], 3), 0);
assert.equal(risk.sumComplete([5], 24), null);
assert.equal(risk.rainfallLevel(null), "neutral");
assert.equal(risk.rainfallLevel(49.9), "low");
assert.equal(risk.rainfallLevel(50), "caution");
assert.equal(risk.rainfallLevel(100), "danger");
const empty = {
  weather: { data: null },
  quakes: { status: "unavailable", data: null },
  air: { data: null },
  dry: { data: null },
  cyclones: { status: "unavailable", data: null },
};
assert.ok(risk.makeHazards(empty).every((h) => h.level === "neutral"));
assert.equal(
  risk.makeHazards(empty).find((h) => h.id === "earthquake").label,
  "Feed unavailable",
);
assert.ok(Math.abs(risk.distanceKm(20, 85, 20, 85)) < 0.001);
console.log("10 safety-sensitive risk assertions passed.");
