import type { Metadata } from 'next';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.neuroficio.com').replace(/\/$/, '');
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return { title, description, alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: { type: 'website', title, description, url: `${SITE_URL}${path}`, siteName: 'NeuroFicio', images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'NeuroFicio neurological rehabilitation' }] },
    twitter: { card: 'summary_large_image', title, description, images: ['/opengraph-image'] } };
}
export function jsonLd(data: unknown) { return JSON.stringify(data).replace(/</g, '\\u003c'); }
