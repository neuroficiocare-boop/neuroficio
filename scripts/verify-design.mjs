import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { filterGuides } from '../src/lib/guide-search.ts';
import { serviceCategories, internationalOptions } from '../src/content/care-options.ts';
const data = JSON.parse(readFileSync('src/content/patient-guides.json', 'utf8'));
const summaries = data.map(g => ({ ...g, readTime: '3 min read' }));
assert.equal(filterGuides(summaries, '  FOOT DROP  ', 'All topics')[0].slug, 'foot-drop-after-stroke');
assert.ok(filterGuides(summaries, 'Medicare', 'Costs and assessment').some(g => g.slug === 'neuro-rehab-cost-insurance-medicare'));
assert.equal(filterGuides(summaries, 'Medicare', 'Stroke recovery').length, 0);
assert.equal(filterGuides(summaries, 'a topic that is not in the library', 'All topics').length, 0);
assert.equal(filterGuides(summaries, '', 'All topics').length, data.length);
console.log('PASS guide search: case, spaces, terms, topic combination and empty results');
const routes = ['/', '/services', '/international', '/nri', '/remote', '/privacy', '/equipment', '/second-opinion', '/community', '/about', '/contact', '/blog', '/blog/robotic-neuro-rehabilitation-2026', ...data.map(g => `/blog/${g.slug}`)];
const pages = new Map(routes.map(route => [route, readFileSync(`.next/server/app/${route === '/' ? 'index' : route.slice(1)}.html`, 'utf8')]));
for (const [route, html] of pages) {
 const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
 assert.equal(new Set(ids).size, ids.length, `${route}: duplicate IDs`);
 assert.ok(html.includes('aria-label="Main navigation"') && html.includes('aria-label="Mobile navigation"'));
 assert.ok(html.includes('<dialog') && html.includes('aria-labelledby="mobile-menu-title"'));
 for (const anchor of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
  const href = anchor[1]; if (!href.startsWith('/') && !href.startsWith('#')) continue;
  const url = new URL(href, `https://example.com${route}`);
  if (url.pathname.startsWith('/brochures/')) {
   assert.ok(existsSync(`public${url.pathname}`), `${route}: missing brochure ${href}`);
   continue;
  }
  assert.ok(pages.has(url.pathname), `${route}: unknown destination ${href}`);
  if (url.hash) assert.ok(pages.get(url.pathname).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${route}: missing target ${href}`);
 }
}
for (const name of ['home', 'online', 'family', 'movement']) assert.ok(existsSync(`public/images/${name}-care-editorial.webp`));
console.log(`PASS ${pages.size} redesigned pages: shared menus, unique IDs and valid local links/anchors; four image assets`);
const home = pages.get('/');
assert.equal(serviceCategories.length, 6);
assert.equal((home.match(/class="service-category-card"/g) || []).length, 6, 'All six services must render as visible cards');
for (const service of serviceCategories) {
 assert.ok(home.includes(`<h3>${service.title}</h3>`), `Missing prominent service heading: ${service.title}`);
 assert.ok(home.includes(service.detail), `Missing service description: ${service.title}`);
}
const headline = home.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1].replace(/<br\s*\/?\s*>/g, ' ').replace(/<[^>]+>/g, '');
assert.equal(headline, 'Expert Neurological Rehabilitation. Personalised for Every Step of Recovery.');
for (const [route, html] of pages) {
 const nav = html.match(/<nav\b[^>]*aria-label="Care journeys"[^>]*>(.*?)<\/nav>/s)?.[1];
 assert.equal((nav?.match(/<a\b/g) || []).length, 4, `${route}: all international options must be present`);
 for (const option of internationalOptions) assert.ok(nav.includes(option.title), `${route}: international label missing`);
}
assert.ok(pages.get('/services').includes('id="technology"') && pages.get('/services').includes('id="multidisciplinary"'));
assert.ok(pages.get('/second-opinion').includes('distinct from a medical diagnostic opinion'));
assert.ok(pages.get('/services').includes('Speech and swallowing rehabilitation is available'));
const speech = pages.get('/blog/speech-recovery-after-stroke-aphasia');
assert.ok(speech.includes('NeuroFicio provides speech and swallowing rehabilitation'));
assert.ok(!speech.includes('No dedicated speech-language or intensive aphasia programme is confirmed by this article'));
console.log('PASS service visibility: exact hero headline, six service cards, four international labels, service anchors and consistent speech/swallowing availability');
