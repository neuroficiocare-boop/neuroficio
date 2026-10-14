 'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import UiIcon from './UiIcon';
export default function MobileCareBar() {
 const pathname = usePathname();
 if (pathname === '/contact') return null;
 const href = pathname.startsWith('/blog/') ? '#care-enquiry' : '/contact';
 return <nav className="mobile-care-bar" aria-label="Quick care contact"><a href="tel:+918341471837"><UiIcon name="phone" size={18} /> Call the team</a><Link href={href}>Care enquiry <UiIcon name="arrow" size={18} /></Link></nav>;
}
