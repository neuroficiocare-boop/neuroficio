import { notFound } from 'next/navigation';
import SiteExperience from '@/components/SiteExperience';
import { sitePages, type PageKey } from '@/content/site-pages';
import { pageMetadata, jsonLd, SITE_URL } from '@/lib/seo';
function getPage(section: string) { return Object.entries(sitePages).find(([key, page]) => key !== 'home' && page.path === `/${section}`); }
export function generateStaticParams() { return Object.values(sitePages).filter(p => p.path !== '/').map(p => ({ section: p.path.slice(1) })); }
export async function generateMetadata({ params }: { params: Promise<{ section: string }> }) {
 const found = getPage((await params).section); if (!found) notFound();
 return pageMetadata(found[1].title, found[1].description, found[1].path);
}
export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
 const found = getPage((await params).section); if (!found) notFound();
 const [key, page] = found;
 const pageSchema = { '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${SITE_URL}${page.path}#webpage`, url: `${SITE_URL}${page.path}`, name: page.title, description: page.description, isPartOf: { '@id': `${SITE_URL}/#website` }, about: { '@id': `${SITE_URL}/#organization` }, inLanguage: 'en' };
 const serviceNames: Record<string, string> = { services: 'Home neurological rehabilitation in Hyderabad', nri: 'Home rehabilitation in Hyderabad arranged by overseas families', international: 'International in-person neurological rehabilitation enquiries', remote: 'Remote neurological rehabilitation guidance enquiries' };
 const serviceSchema = serviceNames[key] ? { '@context': 'https://schema.org', '@type': 'Service', '@id': `${SITE_URL}${page.path}#service`, name: serviceNames[key], description: page.description, url: `${SITE_URL}${page.path}`, provider: { '@id': `${SITE_URL}/#organization` }, ...(key === 'services' || key === 'nri' ? { areaServed: { '@type': 'City', name: 'Hyderabad' } } : {}) } : null;
 const faqSchema = page.faqs.length ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: page.faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) } : null;
 const crumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
 { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
 { '@type': 'ListItem', position: 2, name: page.title, item: `${SITE_URL}${page.path}` }] };
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(crumbs) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(pageSchema) }} />{serviceSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(serviceSchema) }} />}{faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }} />}<SiteExperience initialPage={key as PageKey} /></>;
}
