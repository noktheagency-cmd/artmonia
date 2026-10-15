const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const ts = require("typescript");

const source = readFileSync(join(__dirname, "../src/lib/moni-demo.ts"), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
const model = {};
new Function("exports", compiled.outputText)(model);
const { toMoniCatalog, getMoniRecommendation, validateMoniDemoContact } = model;

const catalog = toMoniCatalog([
  { title: "Akademik Rəsm", duration: "12 həftə", price: "", image: "/drawing.webp" },
  { title: "Rəng & Boyama", duration: "10 həftə", price: "120 AZN" },
  { title: "Portret Sənəti" },
  { title: "Rəqəmsal Sənət" },
  { title: "Kompozisiya" },
  { title: "Portfolyo Hazırlığı" }
]);

test("incomplete discovery never generates a recommendation", () => {
  assert.equal(getMoniRecommendation({ goal: null, level: null, focus: null }, catalog), null);
  assert.equal(getMoniRecommendation({ goal: "create", level: null, focus: null }, catalog), null);
  assert.equal(getMoniRecommendation({ goal: "grow", level: "practicing", focus: null }, catalog), null);
});

test("a new beginner receives a foundation, while an existing hobbyist explores painting", () => {
  const beginner = getMoniRecommendation({ goal: "create", level: "beginner", focus: null }, catalog);
  const practicing = getMoniRecommendation({ goal: "create", level: "practicing", focus: null }, catalog);
  assert.equal(beginner.program.title, "Akademik Rəsm");
  assert.equal(practicing.program.title, "Rəng & Boyama");
  assert.equal(beginner.program.price, "");
  assert.equal(practicing.program.price, "120 AZN");
  assert.equal(beginner.steps.length, 3);
});

test("skill development respects each explicitly selected art direction", () => {
  const choices = { drawing: "Akademik Rəsm", painting: "Rəng & Boyama", portrait: "Portret Sənəti", digital: "Rəqəmsal Sənət", composition: "Kompozisiya" };
  for (const [focus, title] of Object.entries(choices)) {
    assert.equal(getMoniRecommendation({ goal: "grow", level: "practicing", focus }, catalog).program.title, title);
  }
});

test("a changed portfolio goal takes precedence over a previous art direction", () => {
  const result = getMoniRecommendation({ goal: "portfolio", level: "beginner", focus: "digital" }, catalog);
  assert.equal(result.program.title, "Portfolyo Hazırlığı");
  assert.match(result.steps[0].title, /İşlərini/);
});

test("an unpublished or unavailable program is not replaced with an invented offer", () => {
  const result = getMoniRecommendation({ goal: "grow", level: "practicing", focus: "digital" }, catalog.filter((item) => item.title !== "Rəqəmsal Sənət"));
  assert.equal(result.program, null);
  assert.equal(result.steps.length, 3);
  assert.equal(getMoniRecommendation({ goal: "portfolio", level: "beginner", focus: null }, []).program, null);
});

test("invalid catalog content is ignored and unconfirmed commercial fields stay empty", () => {
  assert.deepEqual(toMoniCatalog(null), []);
  assert.deepEqual(toMoniCatalog({ title: "Akademik Rəsm" }), []);
  const result = toMoniCatalog([null, {}, "invalid", { title: " " }, { title: " Akademik Rəsm ", price: 99, duration: false }]);
  assert.equal(result.length, 1);
  assert.equal(result[0].title, "Akademik Rəsm");
  assert.equal(result[0].price, "");
  assert.equal(result[0].duration, "");
});

test("demo contact rejects incomplete or malformed input and accepts formatted phone numbers", () => {
  assert.ok(validateMoniDemoContact("", "+994 50 123 45 67"));
  assert.ok(validateMoniDemoContact("A", "+994 50 123 45 67"));
  assert.ok(validateMoniDemoContact("A".repeat(61), "+994 50 123 45 67"));
  assert.ok(validateMoniDemoContact("Leyla", "123"));
  assert.ok(validateMoniDemoContact("Leyla", "abc994501234567"));
  assert.ok(validateMoniDemoContact("Leyla", "1234567890123456"));
  assert.equal(validateMoniDemoContact(" Leyla ", "+994 50 123 45 67"), null);
  assert.equal(validateMoniDemoContact("Leyla", "050-123-45-67"), null);
});
