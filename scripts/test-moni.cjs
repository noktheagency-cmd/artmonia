// Deterministic contract checks; no real provider requests or database writes.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const crypto = require('node:crypto');
const cache = new Map();
function load(file, mocks = {}) {
  const absolute = path.resolve(file);
  if (!Object.keys(mocks).length && cache.has(absolute)) return cache.get(absolute);
  const code = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const module = { exports: {} };
  const env = { ...process.env, OPENROUTER_API_KEY: 'unit-test-only-not-a-real-key' };
  vm.runInNewContext(code, { module, exports: module.exports, Buffer, crypto: crypto.webcrypto, process: { env }, Date, console, URL, Request, Response, AbortSignal, setTimeout, clearTimeout,
    fetch: mocks.fetch || (() => { throw new Error('Unexpected external call'); }),
    require: (name) => mocks[name] || (name.startsWith('@/') ? load(`src/${name.slice(2)}.ts`) : require(name)) }, { filename: absolute });
  if (!Object.keys(mocks).length) cache.set(absolute, module.exports);
  return module.exports;
}
const lib = load('src/lib/moni.ts');
const profile = { goal: 'Özüm üçün öyrənmək', level: 'İlk dəfə başlayıram', note: 'Vaxtım azdır.' };
assert(lib.readMoniProfile(profile));
assert.equal(lib.readMoniProfile({ ...profile, level: 'system' }), null);
assert.equal(lib.readMoniProfile({ ...profile, note: 'x'.repeat(501) }), null);
assert(!lib.readMoniProfile({ ...profile, note: 'mail@example.com +994 50 123 45 67' }).note.includes('example'));
const courses = lib.moniCourses([{ title: 'Akademik rəsm', text: 'Əsaslar', price: '120 AZN', duration: '12 həftə' }, { title: 'Gizli', published: false }]);
assert.equal(courses.length, 1);
const valid = { courseId: '0', reason: 'Əsasları addım-addım öyrənmək məqsədinə uyğundur.', steps: ['İlk xətlər', 'İşıq və kölgə', 'İlk tamamlanmış işin'] };
assert(lib.readModelPlan(valid, courses));
assert.equal(lib.readModelPlan({ ...valid, courseId: '99' }, courses), null);
assert.equal(lib.readModelPlan({ ...valid, reason: 'Qiymət 20 manatdır.' }, courses), null);
assert.equal(lib.readModelPlan({ ...valid, steps: ['X'] }, courses), null);
const token = lib.signMoniPlan({ profile, course: 'Akademik rəsm', reason: valid.reason, steps: valid.steps });
assert.equal(lib.verifyMoniPlan(token).course, 'Akademik rəsm');
assert.equal(lib.verifyMoniPlan(`${token}tampered`), null);
assert.equal(lib.verifyMoniPlan('invalid'), null);
for (let index = 0; index < 6; index++) assert.equal(lib.allowMoniRequest('test', 1000), true);
assert.equal(lib.allowMoniRequest('test', 1000), false);
assert.equal(lib.allowMoniRequest('test', 601001), true);

(async () => {
  let providerBody;
  const handler = load('src/app/api/moni/route.ts', {
    '@/lib/site-content': { getPublishedContent: async () => ({ courses: [{ title: 'Akademik rəsm', text: 'Əsaslar', price: '120 AZN', duration: '12 həftə' }], moni_settings: { enabled: true } }) },
    fetch: async (_url, options) => { providerBody = JSON.parse(options.body); return Response.json({ choices: [{ message: { content: JSON.stringify(valid) } }] }); }
  });
  const makeRequest = (body, origin = 'https://example.com') => new Request('https://example.com/api/moni', { method: 'POST', headers: { origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  assert.equal((await handler.POST(makeRequest({ ...profile, consent: true }, 'https://attacker.example'))).status, 403);
  assert.equal((await handler.POST(makeRequest(profile))).status, 400);
  const response = await handler.POST(makeRequest({ ...profile, consent: true }));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.course.price, '120 AZN');
  assert.equal(body.proof, null);
  assert(lib.verifyMoniPlan(body.token));
  assert.equal(providerBody.model, 'google/gemini-2.5-flash');
  assert(!providerBody.messages[1].content.includes('120 AZN'));
  let inserted;
  const contact = load('src/app/api/contact/route.ts', {
    '@/lib/supabase/server': { createClient: async () => ({ from: () => ({ insert: async (value) => { inserted = value; return { error: null }; } }) }) },
    '@/lib/supabase/config': { isSupabaseConfigured: () => true }
  });
  const form = new FormData();
  form.set('full_name', 'Moni QA'); form.set('phone', '+994501234567'); form.set('moni_token', body.token); form.set('consent', 'true');
  const sent = await contact.POST(new Request('https://example.com/api/contact', { method: 'POST', body: form }));
  assert.equal(sent.status, 200);
  assert(inserted.goal.startsWith('[Moni AI]'));
  assert.equal(inserted.level, profile.level);
  assert.equal(inserted.interest, 'Akademik rəsm');
  assert.equal(inserted.id, lib.verifyMoniPlan(body.token).id);
  console.log('PASS: profile validation, privacy redaction, course allowlist, commercial fact guard, signed token, throttle, origin/consent, provider contract, CMS facts, admin lead payload.');
})().catch((error) => { console.error(error); process.exitCode = 1; });
