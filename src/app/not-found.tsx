import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
export const metadata: Metadata = { title: 'Page not found', robots: { index: false, follow: true } };
export default function NotFound() {
 return <><SiteHeader /><main id="main-content"><section className="page-intro"><div className="container"><span className="eyebrow">Page not found</span><h1>Let us find your next step.</h1><p className="lead">This page is not available. Explore home rehabilitation, international care or contact the team.</p><div className="hero-actions"><Link href="/" className="btn btn-dark">Return home</Link><Link href="/contact" className="btn btn-outline">Contact the team</Link></div></div></section></main><SiteFooter /></>;
}
