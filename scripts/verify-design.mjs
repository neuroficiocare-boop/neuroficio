import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { filterGuides } from '../src/lib/guide-search.ts';
const data = JSON.parse(readFileSync('src/content/patient-guides.json', 'utf8'));
const summaries = data.map(g => ({ ...g, readTime: '3 min read' }));
assert.equal(filterGuides(summaries, '  FOOT DROP  ', 'All topics')[0].slug, 'foot-drop-after-stroke');
assert.ok(filterGuides(summaries, 'Medicare', 'Costs and assessment').some(g => g.slug === 'neuro-rehab-cost-insurance-medicare'));
assert.equal(filterGuides(summaries, 'Medicare', 'Stroke recovery').length, 0);
assert.equal(filterGuides(summaries, 'a topic that is not in the library', 'All topics').length, 0);
assert.equal(filterGuides(summaries, '', 'All topics').length, data.length);
console.log('PASS guide search: case, spaces, terms, topic combination and empty results');
const routes = ['/', '/services', '/international', '/equipment', '/second-opinion', '/community', '/about', '/contact', '/blog', '/blog/robotic-neuro-rehabilitation-2026', ...data.map(g => `/blog/${g.slug}`)];
const pages = new Map(routes.map(route => [route, readFileSync(`.next/server/app/${route === '/' ? 'index' : route.slice(1)}.html`, 'utf8')]));
for (const [route, html] of pages) {
 const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
 assert.equal(new Set(ids).size, ids.length, `${route}: duplicate IDs`);
 assert.ok(html.includes('aria-label="Main navigation"') && html.includes('aria-label="Mobile navigation"'));
 assert.ok(html.includes('<dialog') && html.includes('aria-labelledby="mobile-menu-title"'));
 for (const anchor of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
  const href = anchor[1]; if (!href.startsWith('/') && !href.startsWith('#')) continue;
  const url = new URL(href, `https://example.com${route}`);
  assert.ok(pages.has(url.pathname), `${route}: unknown destination ${href}`);
  if (url.hash) assert.ok(pages.get(url.pathname).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${route}: missing target ${href}`);
 }
}
for (const name of ['home', 'online', 'family', 'movement']) assert.ok(existsSync(`public/images/${name}-care-editorial.webp`));
console.log(`PASS ${pages.size} redesigned pages: shared menus, unique IDs and valid local links/anchors; four image assets`);
