const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const ts = require("typescript");
const cache = new Map();
let rows = [];
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const mod = { exports: {} };
  cache.set(file, mod);
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const req = (name) => {
    if (name.endsWith("supabase/config")) return { isSupabaseConfigured: () => true };
    if (name.endsWith("supabase/server")) return { createClient: async () => ({ from: () => ({ select: () => ({ order: async () => ({ data: rows, error: null }) }) }) }) };
    if (name.startsWith("@/")) return load(path.join("src", name.slice(2)) + ".ts");
    if (name.startsWith(".")) return load(path.resolve(path.dirname(file), name) + ".ts");
    return require(name);
  };
  new Function("require", "module", "exports", code)(req, mod, mod.exports);
  return mod.exports;
}
(async () => {
  const { getAdminSections, getPublishedContent } = load("src/lib/site-content.ts");
  const record = (key, content) => ({ key, content, is_published: true, sort_order: 0 });
  rows = [
    record("courses", [{ title: "Test course", text: "Intro", details: "Original syllabus", image: "/original.jpg", duration: "8 weeks", price: "50", color: "#fff" }]),
    record("transformations", [{ title: "Existing benefit", text: "Existing text" }]),
    record("home_page_copy", { problem: { transformationTitle: "Custom title", transformationLabel: "Custom label" } }),
    record("gallery_images", [{ src: "/unused.jpg" }, { src: "/existing.jpg", alt: "Existing photo" }])
  ];
  const sections = await getAdminSections();
  const program = sections.find(s => s.key === "courses").content[0];
  assert.equal(program.detail.image, "/original.jpg");
  assert.equal(program.detail.syllabus[0].text, "Original syllabus");
  const benefits = sections.find(s => s.key === "transformations").content;
  assert.equal(benefits.title, "Custom title");
  assert.equal(benefits.image, "/existing.jpg");
  assert.equal(benefits.items[0].title, "Existing benefit");
  program.detail.image = "/changed.jpg";
  program.detail.audience = [];
  program.detail.syllabus = [{ title: "Edited", text: "New curriculum", image: "/topic.jpg" }];
  program.detail.enrollText = "";
  rows[0].content = [program];
  rows[1].content = { ...benefits, image: "", items: [] };
  const published = await getPublishedContent();
  assert.equal(published.courses[0].detail.image, "/changed.jpg");
  assert.deepEqual(published.courses[0].detail.audience, []);
  assert.equal(published.courses[0].detail.syllabus[0].image, "/topic.jpg");
  assert.equal(published.courses[0].detail.enrollText, "");
  assert.deepEqual(published.transformations.items, []);
  assert.equal(published.transformations.image, "");
  rows[0].content = [];
  assert.deepEqual((await getPublishedContent()).courses, []);
  console.log("PASS: legacy content preserved; program text/images editable; empty lists and blank fields stay empty.");
})().catch(error => { console.error(error); process.exitCode = 1; });
