 'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sitePages, type PageKey } from '@/content/site-pages';
export default function LegacyFragments() {
 const router = useRouter();
 useEffect(() => { const key = window.location.hash.slice(1); if (key !== 'home' && Object.hasOwn(sitePages, key)) router.replace(sitePages[key as PageKey].path); }, [router]);
 return null;
}
