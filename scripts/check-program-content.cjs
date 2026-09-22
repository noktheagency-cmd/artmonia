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
  assert.equal(sections.find(s => s.key === "home_page_copy").content.problem.image, "/assets/problem-center-girl.webp");
  rows[2].content.problem.image = "/custom-person.png";
  assert.equal((await getPublishedContent()).home_page_copy.problem.image, "/custom-person.png");
  rows[2].content.problem.image = "";
  assert.equal((await getPublishedContent()).home_page_copy.problem.image, "");
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
  rows = [{ ...record("news_items", null), is_published: false }, { ...record("home_page_copy", null), is_published: false }];
  const hidden = await getPublishedContent();
  assert.deepEqual(hidden.news_items, []);
  assert.equal(hidden.home_page_copy.problem.image, "");
  assert.equal(hidden.home_page_copy.hero.leftTitle, "");
  const { validContact } = load("src/lib/contact-validation.ts");
  const contact = { fullName: "Test Person", phone: "+994 50 123 45 67", email: null, goal: null, interest: "Test", level: null };
  assert(validContact(contact));
  assert(!validContact({ ...contact, phone: "0000000000" }));
  assert(!validContact({ ...contact, email: "invalid" }));
  assert(!validContact({ ...contact, interest: "x".repeat(201) }));
  const { validateSection } = load("src/lib/admin-validation.ts");
  assert(validateSection(record("success_stories", [{ video: "https://example.com/not-youtube" }])));
  assert.equal(validateSection(record("success_stories", [{ video: "https://youtu.be/tWoo8i_VkvI" }])), undefined);
  console.log("PASS: legacy content preserved; program text/images editable; empty lists and blank fields stay empty.");
})().catch(error => { console.error(error); process.exitCode = 1; });
