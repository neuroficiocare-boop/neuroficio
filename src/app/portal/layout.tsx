import type { Metadata } from 'next';
import './portal.css';

export const metadata: Metadata = { title: 'Care Portal', description: 'Your NeuroFicio care plan, updates and progress.', robots: { index: false, follow: false }, referrer: 'no-referrer' };

export default function PortalLayout({ children }: { children: React.ReactNode }) { return children; }
