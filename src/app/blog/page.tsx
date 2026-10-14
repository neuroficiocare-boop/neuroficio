import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import PatientGuideLibrary from '@/components/PatientGuideLibrary';
import UiIcon from '@/components/UiIcon';
import { blogPosts } from '@/content/blog-posts';
export const metadata = pageMetadata('Neuro Rehabilitation Guides for Patients & Caregivers', 'Patient guides on stroke, brain injury, care costs, choosing rehabilitation, caregiver support and specialised therapies. Explore care enquiry options.', '/blog');
export default function BlogIndexPage() {
 const guides = blogPosts.map(({ slug, title, excerpt, category, readTime }) => ({ slug, title, excerpt, category, readTime }));
 return <><SiteHeader activeHref="/blog" /><main id="main-content"><section className="library-hero"><div className="container"><nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Patient guides</span></nav><div className="library-hero-layout"><div><span className="eyebrow">The NeuroFicio reading room</span><h1>Good questions.<br /><em>Clearer next steps.</em></h1><p>Explore neurological rehabilitation, recovery and everyday care. Practical guides for patients and the people beside them.</p></div><figure className="editorial-image"><Image src="/images/family-care-editorial.webp" alt="A caregiver and an older family member talking at home" fill sizes="(max-width: 760px) 100vw, 40vw" /><figcaption>Illustrative family-support setting</figcaption></figure></div></div></section><section className="library-section"><div className="container"><PatientGuideLibrary guides={guides} /><aside className="article-cta library-enquiry"><span className="eyebrow" style={{ color: 'var(--teal-light)' }}>Care enquiries</span><h2>Have a question about your own care?</h2><p>Ask about home rehabilitation in Hyderabad or remote-care suitability for your country.</p><Link href="/contact" className="btn btn-primary">Make a care enquiry <UiIcon name="arrow" /></Link></aside></div></section></main><SiteFooter /></>;
}
