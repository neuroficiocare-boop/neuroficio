import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { sitePages } from '@/content/site-pages';
import { blogPosts } from '@/content/blog-posts';
export default function sitemap(): MetadataRoute.Sitemap {
 const revisedPages = ['/', '/services', '/international', '/nri', '/remote', '/privacy', '/contact', '/about', '/second-opinion', '/equipment'];
 return [...Object.values(sitePages).map(p => ({ url: `${SITE_URL}${p.path}`, ...(revisedPages.includes(p.path) ? { lastModified: '2026-11-16' } : {}) })), { url: `${SITE_URL}/blog` },
 ...blogPosts.map(p => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.modified || p.date }))];
}
