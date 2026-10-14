import SiteExperience from '@/components/SiteExperience';
import { pageMetadata } from '@/lib/seo';
import { sitePages } from '@/content/site-pages';
export const metadata = pageMetadata(sitePages.home.title, sitePages.home.description, '/');
export default function Home() { return <SiteExperience initialPage="home" />; }
