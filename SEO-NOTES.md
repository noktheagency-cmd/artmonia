# SEO / AI-search handoff

Canonical origin: `https://artmoniya.com`.

## Implemented

- Canonical URLs, unique descriptions, Open Graph and Twitter metadata on public pages.
- News pagination has its own canonical URL. Tracking parameters do not become canonical URLs.
- Dynamic `/sitemap.xml` reads the same published CMS content as the site, including program, news and blog detail links. Draft blogs and administrative URLs are excluded. No fabricated last-modified timestamps.
- `/robots.txt` allows public crawling and points to the sitemap. Admin routes intentionally remain crawlable so crawlers can read `noindex, nofollow`; authentication remains the access control, not robots.txt.
- JSON-LD organization/contact data on home, Course data on program details, Article/BlogPosting data and breadcrumbs on details. Admin text is safely escaped. No invented ratings, prices, people or credentials.
- Optional Railway variables `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` accept the verification token only (not a complete HTML tag). Redeploy after setting them.

## Verification

Run `node scripts/test-seo.cjs http://localhost:4317` against a running app. This checks metadata, sitemap, JSON-LD syntax, admin noindex and a missing article's 404 response. Local content is fallback data unless the CMS environment is configured; repeat against production after deployment with `node --use-system-ca scripts/test-seo.cjs https://artmoniya.com`.

## Requires account access / ongoing editorial work

1. Verify ownership in Google Search Console and Bing Webmaster Tools; submit `https://artmoniya.com/sitemap.xml`. Check indexing and crawl errors after deployment.
2. Maintain matching official name, telephone, address and opening hours across the site and verified business profiles. Do not invent hours or geographic coordinates.
3. Replace explicitly labelled sample testimonials with genuine consented testimonials through the admin panel. Add genuine article authors when applicable; verify all program and admissions claims.
4. Publish original, useful answers and examples. FAQ answers are already rendered as HTML. Structured data is not a promise of a rich result or an AI citation.
5. Measure real-user Core Web Vitals and index coverage in Search Console. This technical pass is not a field-performance certification or a ranking guarantee.

Guidance: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
