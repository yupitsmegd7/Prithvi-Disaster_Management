import { readFileSync } from "node:fs";
import ts from "typescript";
import assert from "node:assert/strict";
const modules = {};
const cached = async (_key, _ttl, fn) => ({
  data: await fn(),
  fetchedAt: new Date().toISOString(),
});
function load(name) {
  if (modules[name]) return modules[name].exports;
  if (name === "storage") return { cached };
  const code = ts.transpileModule(readFileSync(`lib/${name}.ts`, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const module = { exports: {} };
  modules[name] = module;
  new Function("require", "module", "exports", code)(
    (n) => load(n.replace("./", "")),
    module,
    module.exports,
  );
  return module.exports;
}
const { historical } = load("feeds");
const area = load("locations").AREAS[0];
const time = Array.from({ length: 366 }, (_, i) =>
  new Date(Date.UTC(2024, 0, 1) + i * 86400000).toISOString().slice(0, 10),
);
const rain = time.map(() => 0),
  temp = time.map(() => 25);
temp[3] = null;
globalThis.fetch = async () => ({
  ok: true,
  json: async () => ({
    daily: { time, precipitation_sum: rain, temperature_2m_mean: temp },
  }),
});
let result = await historical(area, 2024);
assert.equal(
  result.data.months[0].rain,
  0,
  "Missing temperature must not discard complete rainfall",
);
assert.equal(
  result.data.months[0].temperature,
  null,
  "Incomplete temperature must stay missing",
);
assert.equal(
  result.data.months[1].days,
  29,
  "Leap February must require 29 days",
);
assert.equal(
  result.data.months[0].dryDays,
  31,
  "Measured zero rainfall is a dry day",
);
rain[5] = null;
result = await historical(area, 2024);
assert.equal(
  result.data.months[0].rain,
  null,
  "A missing rainfall sample must not become a zero",
);
assert.equal(
  result.data.months[0].dryDays,
  null,
  "Missing rainfall must not be counted as a dry day",
);
time.pop();
rain.pop();
temp.pop();
result = await historical(area, 2024);
assert.equal(
  result.data.months[11].rain,
  null,
  "A missing calendar day must invalidate the monthly total",
);
console.log("7 historical completeness checks passed.");
