// Usage: node scripts/test-seo.cjs http://localhost:4317
const assert = require('node:assert/strict');
const base = process.argv[2] || 'http://localhost:4317';
async function get(path) {
  const response = await fetch(new URL(path, base), { headers: { 'user-agent': 'Googlebot' }, signal: AbortSignal.timeout(120000) });
  return { status: response.status, html: await response.text() };
}
(async () => {
  const robots = await get('/robots.txt');
  assert.equal(robots.status, 200);
  assert.match(robots.html, /Sitemap: https:\/\/artmoniya.com\/sitemap.xml/);
  const sitemap = await get('/sitemap.xml');
  assert.equal(sitemap.status, 200);
  const urls = [...sitemap.html.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1].replaceAll('&amp;', '&'));
  assert(urls.length >= 8);
  assert(!urls.some(url => /\/admin|\/api\//.test(url)));
  assert.equal(new Set(urls).size, urls.length);
  const paths = ['/', '/akademiya', '/blog', '/yenilikler', '/neticeler', '/telebe-isleri', '/mukafatlar', '/muraciet'];
  for (const prefix of ['/blog/', '/yenilikler/', '/programlar/']) {
    const url = urls.find(url => new URL(url).pathname.startsWith(prefix));
    if (url) paths.push(new URL(url).pathname);
  }
  for (const path of paths) {
    const { status, html } = await get(path);
    assert.equal(status, 200, path);
    assert.match(html, /<h1[\s>]/, `${path}: missing H1`);
    assert.match(html, /name="description" content="[^"]+"/, `${path}: missing description`);
    assert.match(html, /property="og:image"/, `${path}: missing social image`);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
    assert(canonical, `${path}: missing canonical`);
    assert.equal(new URL(canonical).pathname, new URL(path, base).pathname);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    if (path === '/' || /^\/(blog|yenilikler|programlar)\//.test(path)) assert(schemas.length > 0, `${path}: missing schema`);
    for (const match of schemas) JSON.parse(match[1]);
    console.log(`PASS ${path}`);
  }
  const admin = await get('/admin/login');
  assert.match(admin.html, /name="robots" content="noindex, nofollow"/);
  const missing = await get('/blog/seo-nonexistent-article-404');
  assert.equal(missing.status, 404);
  const secondPage = urls.find(url => url.includes('/yenilikler?page=2'));
  if (secondPage) {
    const { html } = await get('/yenilikler?page=2&deploy=test');
    assert(html.includes('rel="canonical" href="https://artmoniya.com/yenilikler?page=2"'));
  }
  console.log(`PASS robots, sitemap (${urls.length} URLs), admin noindex, missing article 404`);
})().catch(error => { console.error(error); process.exitCode = 1; });
