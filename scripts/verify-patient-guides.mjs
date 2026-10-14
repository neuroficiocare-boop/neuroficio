import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const guides = JSON.parse(readFileSync('src/content/patient-guides.json', 'utf8'));
const slugs = new Set([...guides.map(g => g.slug), 'robotic-neuro-rehabilitation-2026']);
assert.equal(slugs.size, guides.length + 1, 'Duplicate article slug');
const index = readFileSync('.next/server/app/blog.html', 'utf8');
const paragraphs = new Set();
for (const guide of guides) {
 const html = readFileSync(`.next/server/app/blog/${guide.slug}.html`, 'utf8');
 assert.ok(index.includes(`href="/blog/${guide.slug}"`), `${guide.slug}: absent from blog index`);
 assert.ok(html.includes('id="care-enquiry"'), `${guide.slug}: enquiry target missing`);
 assert.ok(html.includes('action="https://wa.me/918341471837"'), `${guide.slug}: form not connected to WhatsApp`);
 assert.ok(html.includes('id="article-enquiry-location"'), `${guide.slug}: enquiry location field missing`);
 assert.ok(html.includes('id="article-enquiry-service"'), `${guide.slug}: service field missing`);
 for (const related of guide.related) { assert.ok(slugs.has(related), `${guide.slug}: related slug missing`); assert.ok(html.includes(`href="/blog/${related}"`)); }
 for (const section of guide.sections) {
  assert.ok(html.includes(`id="${section.id}"`));
  for (const index of section.sources || []) assert.ok(guide.sources[index], `${guide.slug}: source reference missing`);
  for (const p of section.paragraphs) { assert.ok(!paragraphs.has(p), `${guide.slug}: duplicated body paragraph`); paragraphs.add(p); }
 }
 const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m => JSON.parse(m[1]));
 const faq = schemas.find(s => s['@type'] === 'FAQPage');
 assert.deepEqual(faq.mainEntity.map(f => [f.name, f.acceptedAnswer.text]), guide.faqs.map(f => [f.question, f.answer]), `${guide.slug}: FAQs do not match this article`);
 const article = schemas.find(s => s['@type'] === 'BlogPosting');
 assert.equal(article.headline, guide.title);
 const selected = html.match(/<option[^>]*selected=""[^>]*>(.*?)<\/option>/)?.[1];
 const decode = text => text?.replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, '&');
 assert.equal(decode(selected), guide.service, `${guide.slug}: inappropriate default service`);
 console.log(`PASS ${guide.slug}: index, related links, sources, matched FAQs and contextual enquiry form`);
}
const old = readFileSync('.next/server/app/blog/robotic-neuro-rehabilitation-2026.html', 'utf8');
assert.ok(old.includes('id="care-enquiry"') && old.includes('action="https://wa.me/918341471837"'));
console.log(`PASS ${guides.length + 1} articles: all have enquiry forms; new guides have distinct body paragraphs`);
