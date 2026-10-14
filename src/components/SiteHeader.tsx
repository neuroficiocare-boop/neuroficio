'use client';

import { useState } from 'react';
import Link from 'next/link';
import LogoMark from './LogoMark';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'What We Treat', href: '/services' },
  { label: 'International Patients', href: '/international' },
  { label: 'Neuro Equipment', href: '/equipment' },
  { label: 'Second Opinion Clinic', href: '/second-opinion' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function SiteHeader({ activeHref }: { activeHref?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="nav">
        <div className="container nav-inner">
          <Link href="/" className="logo">
            <LogoMark size={30} />
            <span>Neuro<span className="ficio">Ficio</span></span>
          </Link>
          <div className="nav-links">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className={activeHref === l.href ? 'active' : ''}>
                {l.label}
              </a>
            ))}
          </div>
          <div className="nav-cta">
            <a href="tel:+918341471837" className="nav-phone" aria-label="Call +91 83414 71837">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              <span className="nav-phone-number">+91 83414 71837</span>
            </a>
            <Link href="/contact" className="btn btn-dark btn-sm">Book Assessment</Link>
            <button className="nav-burger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0A2540" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
        <div className="mobile-menu-top">
          <span className="logo" style={{ color: 'white' }}><span>Neuro<span className="ficio" style={{ color: '#5EEAD4' }}>Ficio</span></span></span>
          <button className="mobile-close" onClick={() => setMobileOpen(false)}>&times;</button>
        </div>
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>{l.label}</a>
        ))}
        <div style={{ marginTop: 32 }}>
          <Link href="/contact" className="btn btn-primary btn-block" onClick={() => setMobileOpen(false)}>
            Book Free Assessment
          </Link>
        </div>
      </div>
    </>
  );
}
