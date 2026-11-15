import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.neuroficio.com').replace(/\/$/, '');
const guides = JSON.parse(readFileSync('src/content/patient-guides.json', 'utf8'));
const routes = ['/', '/services', '/international', '/nri', '/remote', '/privacy', '/equipment', '/second-opinion', '/community', '/about', '/contact', '/blog', '/blog/robotic-neuro-rehabilitation-2026', ...guides.map(g => `/blog/${g.slug}`)];
const titles = new Set();
for (const route of routes) {
 const file = path.join('.next/server/app', route === '/' ? 'index.html' : `${route.slice(1)}.html`);
 const html = readFileSync(file, 'utf8');
 const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
 assert.ok(title, `${route}: title missing`);
 assert.ok(!titles.has(title), `${route}: duplicate title`); titles.add(title);
 assert.ok(!title.includes('NeuroFicio | NeuroFicio'), `${route}: repeated brand suffix`);
 assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${route}: expected one H1`);
 const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
 assert.equal(canonical?.replace(/\/$/, ""), `${base}${route}`.replace(/\/$/, ""), `${route}: incorrect canonical`);
 assert.match(html, /<meta name="description" content="[^"]+"/);
 assert.match(html, /property="og:image"/);
 assert.match(html, /name="twitter:card" content="summary_large_image"/);
 assert.match(html, /<meta name="google-site-verification" content="ni4j0SFsHZZb-M-67jsIl413Jm4Y42ON9v5mtdUCEHE"/);
 assert.match(html, /<main/);
 assert.match(html, /href="\/contact"/);
 for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) JSON.parse(match[1]);
 assert.ok(!html.includes('Nero Ficio'), `${route}: old author typo`);
 assert.ok(!html.includes('Request received'), `${route}: false submission message`);
 assert.ok(!/<figcaption[^>]*>[^<]*[Ii]llustrative/.test(html), `${route}: visible image label remains`);
 assert.ok(html.includes('/brand/neuroficio-logo.webp'), `${route}: official logo absent`);
 assert.ok(html.includes('aria-label="Care journeys"'), `${route}: three-journey navigation absent`);
 console.log(`PASS ${route}: initial HTML, title, H1, canonical, social metadata, links and schema`);
}
const robots = readFileSync('.next/server/app/robots.txt.body', 'utf8');
assert.ok(robots.includes(`Sitemap: ${base}/sitemap.xml`));
const sitemap = readFileSync('.next/server/app/sitemap.xml.body', 'utf8');
for (const route of routes) assert.ok(sitemap.includes(`<loc>${base}${route}</loc>`), `${route}: missing from sitemap`);
assert.equal((sitemap.match(/<loc>/g) || []).length, routes.length);
console.log(`PASS robots and sitemap: all ${routes.length} public content URLs`);
const readPage = route => readFileSync(path.join('.next/server/app', `${route}.html`), 'utf8');
const contact = readPage('contact');
for (const field of ['patient-country', 'patient-city', 'name', 'relationship', 'enquirer-country', 'timezone', 'method', 'contact']) {
 const control = contact.match(new RegExp(`<(?:input|select)[^>]*name="${field}"[^>]*>`))?.[0];
 assert.ok(control?.includes('required'), `contact: ${field} must be required`);
}
for (const field of ['condition', 'start', 'note']) {
 const control = contact.match(new RegExp(`<(?:input|select|textarea)[^>]*name="${field}"[^>]*>`))?.[0];
 assert.ok(control && !control.includes('required'), `contact: ${field} must remain optional`);
}
assert.match(contact, /<input[^>]*type="checkbox"[^>]*id="enquiry-privacy"[^>]*required/);
assert.ok(contact.includes('href="/privacy"') && contact.includes('<noscript>'));
assert.ok(!/<form[^>]*method="get"/.test(contact), 'Personal details must not fall back to a website GET query');
for (const route of ['index', 'services', 'contact', 'international', 'nri', 'remote']) {
 assert.ok(!/free.assessment|free first session/i.test(readPage(route)), `${route}: unapproved free offer`);
}
for (const route of ['services', 'international', 'nri', 'remote']) {
 const html = readPage(route);
 const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m => JSON.parse(m[1]));
 assert.ok(schemas.some(s => s['@type'] === 'Service'), `${route}: service schema missing`);
 const faq = schemas.find(s => s['@type'] === 'FAQPage');
 assert.ok(faq && faq.mainEntity.every(q => html.includes(q.name.replace(/&/g, '&amp;').replace(/'/g, '&#x27;'))), `${route}: schema questions must be visible`);
}
console.log('PASS refinement: official branding, journeys, caption removal, enquiry privacy/required fields, optional care details, service schema and quotation messaging');
