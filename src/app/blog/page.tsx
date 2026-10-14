import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { blogPosts } from '@/content/blog-posts';
export const metadata = pageMetadata('Neuro Rehabilitation Guides for Patients & Caregivers', 'Patient guides on stroke, brain injury, care costs, choosing rehabilitation, caregiver support and specialised therapies. Explore care enquiry options.', '/blog');
const categories = ['Choosing care', 'Costs and assessment', 'Stroke recovery', 'Brain injury', 'Caregiver support', 'Specialised therapies'];
function topicId(category: string) { return category.toLowerCase().replaceAll(' ', '-'); }
export default function BlogIndexPage() {
 return <><SiteHeader activeHref="/blog" /><main id="main-content">
  <section className="page-hero"><div className="container">
   <span className="eyebrow" style={{ color: '#5EEAD4' }}>Patient guides</span>
   <h1 style={{ color: 'white', maxWidth: 900 }}>Answers to your neurological rehabilitation questions</h1>
   <p className="lead" style={{ color: 'rgba(255,255,255,0.75)', marginTop: 18 }}>Explore recovery, care choices, costs and support for everyday life. Find questions to discuss with your clinical team and enquire about suitable care.</p>
  </div></section>
  <section className="section"><div className="container">
   <nav aria-label="Browse patient guides by topic" className="blog-topic-nav">{categories.map(c => <a key={c} href={`#${topicId(c)}`}>{c}</a>)}</nav>
   {categories.map(category => <section key={category} className="blog-topic" aria-labelledby={topicId(category)}>
    <h2 id={topicId(category)}>{category}</h2>
    <div className="blog-grid">{blogPosts.filter(p => p.category === category).map(post => <Link key={post.slug} href={`/blog/${post.slug}`} className="card blog-card">
     <div className="blog-card-tags"><span>{post.category}</span></div><h3>{post.title}</h3><p>{post.excerpt}</p>
     <div className="blog-card-meta"><span>{post.author}</span><span>{post.readTime}</span></div>
    </Link>)}</div>
   </section>)}
   <aside className="article-cta"><h2>Need help choosing the next step?</h2><p>Ask about home rehabilitation in Hyderabad or remote-care suitability for your country.</p><Link className="btn btn-primary" href="/contact">Make a care enquiry</Link></aside>
  </div></section>
 </main><SiteFooter /></>;
}
