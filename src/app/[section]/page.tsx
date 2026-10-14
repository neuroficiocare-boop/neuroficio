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
 const crumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
 { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
 { '@type': 'ListItem', position: 2, name: page.title, item: `${SITE_URL}${page.path}` }] };
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(crumbs) }} /><SiteExperience initialPage={key as PageKey} /></>;
}
