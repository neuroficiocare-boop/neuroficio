import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { blogPosts } from '@/content/blog-posts';

export const metadata: Metadata = {
  title: 'Blog & Resources | Neuroficio',
  description:
    'Guides on stroke, brain injury, spinal cord injury and Parkinson’s recovery from Neuroficio’s home-based neuro rehabilitation team in Hyderabad.',
};

export default function BlogIndexPage() {
  return (
    <>
      <SiteHeader activeHref="/blog" />

      <section className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{ color: '#5EEAD4' }}>Blog &amp; Resources</span>
          <h1 style={{ color: 'white', maxWidth: 760 }}>Guides on neuro recovery, from the specialists behind Neuroficio.</h1>
          <p className="lead" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 600, marginTop: 18 }}>
            Practical, evidence-informed reading on stroke, brain injury, spinal cord injury and Parkinson&apos;s
            recovery — written by Nero Ficio Physiotherapists.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="blog-grid">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="card blog-card">
                <div className="blog-card-tags">
                  {post.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="blog-card-meta">
                  <span>{post.author}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
