import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { blogPosts, getBlogPost } from '@/content/blog-posts';
import ArticleBody, { faqs } from '@/content/blog/robotic-neuro-rehabilitation-2026';

const SITE_URL = 'https://www.neuroficio.com';

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

  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: `${post.title} | NeuroFicio, Hyderabad`,
    description: post.excerpt,
    authors: [{ name: post.author }],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url,
      siteName: 'NeuroFicio',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  const Body = ARTICLE_COMPONENTS[slug];
  if (!post || !Body) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
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
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SiteHeader activeHref="/blog" />

      <section className="page-hero" style={{ paddingBottom: 48 }}>
        <div className="container">
          <span className="eyebrow" style={{ color: '#5EEAD4' }}>
            {post.tags[0] ?? 'Neuro Recovery'}
          </span>
          <h1 style={{ color: 'white', maxWidth: 800 }}>{post.title}</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginTop: 18, fontSize: 14.5 }}>
            By {post.author} · {new Date(post.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })} · {post.readTime}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Body />
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
