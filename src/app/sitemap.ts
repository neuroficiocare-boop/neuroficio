import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { sitePages } from '@/content/site-pages';
import { blogPosts } from '@/content/blog-posts';
export default function sitemap(): MetadataRoute.Sitemap {
 return [...Object.values(sitePages).map(p => ({ url: `${SITE_URL}${p.path}` })), { url: `${SITE_URL}/blog` },
 ...blogPosts.map(p => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.modified || p.date }))];
}
