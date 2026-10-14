import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { blogPosts, getBlogPost } from '@/content/blog-posts';
import ArticleBody, { faqs as roboticFaqs } from '@/content/blog/robotic-neuro-rehabilitation-2026';

import { getPatientGuide } from '@/content/patient-guides';
import PatientGuideBody from '@/components/PatientGuideBody';
import EnquiryForm from '@/components/EnquiryForm';
import Link from 'next/link';

import { SITE_URL, pageMetadata, jsonLd } from '@/lib/seo';

const ARTICLE_COMPONENTS: Record<string, typeof ArticleBody> = {
  'robotic-neuro-rehabilitation-2026': ArticleBody,
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    ...pageMetadata(post.title, post.excerpt, `/blog/${post.slug}`),
    authors: [{ name: post.author }],
    openGraph: { ...pageMetadata(post.title, post.excerpt, `/blog/${post.slug}`).openGraph,
      type: 'article', publishedTime: post.date, modifiedTime: post.modified || post.date },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  const Body = ARTICLE_COMPONENTS[slug];
  const guide = getPatientGuide(slug);
  if (!post || (!Body && !guide)) notFound();
  const articleFaqs = guide?.faqs || roboticFaqs;
  const relatedSlugs = guide?.related || ['walking-after-stroke-recovery-timeline', 'foot-drop-after-stroke', 'tms-hyperbaric-oxygen-neurological-recovery'];
  const relatedPosts = relatedSlugs.map(getBlogPost).filter((p): p is NonNullable<typeof p> => !!p);

  const url = `${SITE_URL}/blog/${post.slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.modified || post.date,
    author: { '@type': 'Organization', name: post.author },
    publisher: {
      '@type': 'MedicalBusiness',
      name: 'NeuroFicio',
      url: SITE_URL,
      telephone: '+91-8341471837',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Second floor, Huda Residential Layout, Plot 118, above Frills Boutique (opposite Reliance Digital), Nallagandla',
        addressLocality: 'Hyderabad',
        addressRegion: 'Telangana',
        postalCode: '500019',
        addressCountry: 'IN',
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: post.tags.join(', '),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: articleFaqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleSchema) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }} />

      <SiteHeader activeHref="/blog" />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Patient guides', item: `${SITE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ] }) }} />
      <main id="main-content">
      <section className="page-hero" style={{ paddingBottom: 48 }}>
        <div className="container">
          <span className="eyebrow" style={{ color: '#5EEAD4' }}>
            {post.tags[0] ?? 'Neuro Recovery'}
          </span>
          <h1 style={{ color: 'white', maxWidth: 800 }}>{post.title}</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginTop: 18, fontSize: 14.5 }}>
            By {post.author} · {new Date(post.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })} · {post.readTime} | Updated {post.modified || post.date}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/blog">Patient guides</a> / {post.title}</nav>
          {guide ? <PatientGuideBody guide={guide} /> : Body && <Body />}
          <section id="care-enquiry" className="article-enquiry" aria-label="Care enquiry form">
            <div><span className="eyebrow">Care enquiries</span><h2>Ask NeuroFicio about your care options</h2>
              <p>{guide?.cta || 'Ask about home or remote physiotherapy and rehabilitation equipment guidance.'}</p>
              <p>Home visits are based in Hyderabad. Remote suitability and availability are confirmed for your country. Ask which services are currently offered.</p>
              <p><Link href="/services">Home rehabilitation</Link> | <Link href="/international">International enquiries</Link> | <Link href="/contact">All contact options</Link></p>
              <p><a href="tel:+918341471837">Call +91 83414 71837</a></p>
            </div>
            <EnquiryForm key={post.slug} idPrefix="article-enquiry" defaultService={guide?.service || 'Rehabilitation equipment'} source={`${post.title} (${SITE_URL}/blog/${post.slug})`} />
          </section>
          <section className="article-related" aria-labelledby="related-guides"><h2 id="related-guides">Related patient guides</h2>
            <div className="blog-grid">{relatedPosts.map(related => <Link className="card blog-card" key={related.slug} href={`/blog/${related.slug}`}><h3>{related.title}</h3><p>{related.excerpt}</p></Link>)}</div>
          </section>
        </div>
      </section>

      </main>
      <SiteFooter />
    </>
  );
}
