const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const ts = require('typescript');

function load(file, dependencies = {}) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, URL, require: (id) => {
    if (!(id in dependencies)) throw new Error(`Unexpected import: ${id}`);
    return dependencies[id];
  } });
  return exports;
}
const lib = load('src/lib/certificates.ts');
const valid = () => ({ ...lib.certificateDefaults, image: '/assets/certificate.png' });

test('legacy image, explicit empty image and disabled state are preserved', () => {
  assert.equal(lib.certificateFor({ certificateImage: '/old.png' }).image, '/old.png');
  assert.equal(lib.certificateFor({ certificateImage: '' }).image, '');
  assert.equal(lib.certificateFor({ certificate: { enabled: false } }).enabled, false);
});
test('validation accepts local and HTTPS images, rejects unsafe/malformed/oversized input', () => {
  assert.equal(lib.validateCertificate(valid()), undefined);
  assert.equal(lib.validateCertificate({ ...valid(), image: 'https://example.com/cert.jpg' }), undefined);
  for (const image of ['javascript:alert(1)', '//example.com/a', 'data:image/png;base64,abc', '/\\evil', 'http://example.com/a']) assert.ok(lib.validateCertificate({ ...valid(), image }));
  assert.ok(lib.validateCertificate({ ...valid(), title: '' }));
  assert.ok(lib.validateCertificate({ ...valid(), description: 'x'.repeat(2001) }));
  assert.ok(lib.validateCertificate(null));
  assert.equal(lib.validateCertificate({ ...valid(), image: '', enabled: false }), undefined);
});
test('stored fields are whitelisted', () => {
  assert.equal(lib.certificateDetail({ ...valid(), role: 'admin' }).certificate.role, undefined);
});

function fixture(options = {}) {
  const state = { writes: 0, row: { id: 'section', key: 'courses', updated_at: 'v1', content: [
    { title: 'Portret', detail: { certificateImage: '/old.png', unrelated: 'keep' } },
    { title: 'Rəngkarlıq', detail: { certificateImage: '/other.png' } }
  ] } };
  const db = { auth: { getUser: async () => ({ data: { user: options.anonymous ? null : { id: 'admin' } } }) }, from(table) {
    let patch;
    const q = {
      select() { return q; }, eq() { return q; },
      update(value) { patch = value; return q; },
      async maybeSingle() {
        if (table === 'admin_users') return { data: options.nonAdmin ? null : { user_id: 'admin' } };
        if (patch) { if (options.race) return { data: null }; state.writes++; state.row = { ...state.row, ...patch, updated_at: 'v2' }; }
        return { data: state.row };
      }
    };
    return q;
  } };
  const route = load('src/app/api/certificates/route.ts', {
    'next/server': { NextResponse: { json: (body, options) => ({ body, ...options }) } },
    'next/cache': { revalidatePath() {} },
    '@/lib/site-content': { getPublishedContent: async () => ({ courses: state.row.content }) },
    '@/lib/supabase/server': { createClient: async () => db },
    '@/lib/supabase/config': { isSupabaseConfigured: () => true },
    '@/lib/admin-content': { defaultSections: [] },
    '@/lib/certificates': lib,
    '@/lib/program-content': { withProgramDetail: (course) => course }
  });
  const request = (patch = {}, origin = 'http://localhost:3001') => ({
    nextUrl: new URL('http://localhost:3001/api/certificates'), headers: { get: () => origin },
    text: async () => JSON.stringify({ program: 'portret', version: 'v1', certificate: valid(), ...patch })
  });
  return { state, route, request };
}
test('API saves one program and preserves other program + unrelated detail', async () => {
  const { state, route, request } = fixture();
  assert.equal((await route.PUT(request())).status, 200);
  assert.equal(state.writes, 1);
  assert.equal(state.row.content[0].detail.certificateImage, '/assets/certificate.png');
  assert.equal(state.row.content[0].detail.unrelated, 'keep');
  assert.equal(state.row.content[1].detail.certificateImage, '/other.png');
});
test('API denies anonymous, non-admin and cross-origin writes', async () => {
  for (const [options, status] of [[{ anonymous: true }, 401], [{ nonAdmin: true }, 403]]) {
    const f = fixture(options); assert.equal((await f.route.PUT(f.request())).status, status); assert.equal(f.state.writes, 0);
  }
  const f = fixture(); assert.equal((await f.route.PUT(f.request({}, 'https://other.test'))).status, 403); assert.equal(f.state.writes, 0);
});
test('API rejects stale versions, races, unknown programs and invalid certificates', async () => {
  for (const [patch, status] of [[{ version: 'old' }, 409], [{ program: 'unknown' }, 404], [{ certificate: {} }, 400]]) {
    const f = fixture(); assert.equal((await f.route.PUT(f.request(patch))).status, status); assert.equal(f.state.writes, 0);
  }
  const f = fixture({ race: true }); assert.equal((await f.route.PUT(f.request())).status, 409);
});
test('public API hides disabled certificates and returns program-specific data', async () => {
  const f = fixture();
  await f.route.PUT(f.request({ certificate: { ...valid(), enabled: false, image: '' } }));
  const all = await f.route.GET(f.request()); assert.equal(all.body.certificates.length, 1);
  const req = f.request(); req.nextUrl.searchParams.set('program', 'portret');
  assert.equal((await f.route.GET(req)).status, 404);
  req.nextUrl.searchParams.set('program', 'rəngkarlıq');
  assert.equal((await f.route.GET(req)).body.certificates[0].image, '/other.png');
});
