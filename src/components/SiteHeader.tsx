 'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import LogoMark from './LogoMark';
import UiIcon from './UiIcon';
import { conditions, careOptions } from '@/content/care-options';
export default function SiteHeader({ activeHref }: { activeHref?: string }) {
 const pathname = usePathname();
 const current = activeHref || pathname;
 const [open, setOpen] = useState(false);
 const dialog = useRef<HTMLDialogElement>(null);
 const header = useRef<HTMLElement>(null);
 const closeMenu = () => setOpen(false);
 useEffect(() => {
  const el = dialog.current; if (!el) return;
  if (open && !el.open) el.showModal();
  if (!open && el.open) el.close();
  const previous = document.body.style.overflow;
  if (open) document.body.style.overflow = 'hidden';
  return () => { document.body.style.overflow = previous; };
 }, [open]);
 useEffect(() => {
  const close = (event: PointerEvent) => {
   if (!header.current?.contains(event.target as Node)) header.current?.querySelectorAll('details[open]').forEach(el => el.removeAttribute('open'));
  };
  document.addEventListener('pointerdown', close); return () => document.removeEventListener('pointerdown', close);
 }, []);
 const closeDisclosure = (event: React.MouseEvent<HTMLElement>) => event.currentTarget.closest('details')?.removeAttribute('open');
 return <>
  <a className="skip-link" href="#main-content">Skip to content</a>
  <header className="site-header" ref={header} onKeyDown={event => {
   if (event.key === 'Escape') { const detail = (event.target as HTMLElement).closest('details'); detail?.removeAttribute('open'); detail?.querySelector('summary')?.focus(); }
  }}>
   <div className="utility-bar"><div className="container utility-inner"><span>A Therapy Partners service</span><span className="utility-location">Hyderabad home care <span aria-hidden="true">/</span> Online care enquiries</span><a href="tel:+918341471837"><UiIcon name="phone" size={13} /> +91 83414 71837</a></div></div>
   <div className="container header-inner">
    <Link href="/" className="brand" aria-label="NeuroFicio home"><span className="brand-symbol"><LogoMark size={34} /></span><span className="brand-word">Neuro<span>Ficio</span><small>NEUROLOGICAL REHABILITATION</small></span></Link>
    <nav aria-label="Main navigation" className="desktop-nav">
     <details className="nav-disclosure"><summary className={current === '/services' ? 'active' : ''}>Conditions <UiIcon name="chevron" size={15} /></summary><div className="nav-panel conditions-panel"><span className="menu-caption">Care shaped around your needs</span>{conditions.map(c => <Link key={c.id} href={`/services#${c.id}`} onClick={closeDisclosure}><span className="menu-icon"><UiIcon name={c.icon} /></span><span>{c.title}<small>{c.description}</small></span><UiIcon name="diagonal" size={16} /></Link>)}<Link className="menu-all" href="/services" onClick={closeDisclosure}>Explore home rehabilitation <UiIcon name="arrow" size={16} /></Link></div></details>
     <details className="nav-disclosure"><summary className={careOptions.some(c => c.href === current) && current !== '/services' ? 'active' : ''}>Care options <UiIcon name="chevron" size={15} /></summary><div className="nav-panel"><span className="menu-caption">Find your starting point</span>{careOptions.map(c => <Link href={c.href} key={c.href} onClick={closeDisclosure}><span className="menu-icon"><UiIcon name={c.icon} /></span><span>{c.title}<small>{c.detail}</small></span><UiIcon name="diagonal" size={16} /></Link>)}</div></details>
     <Link href="/blog" aria-current={current === '/blog' ? 'page' : undefined}>Patient guides</Link>
     <Link href="/about" aria-current={current === '/about' ? 'page' : undefined}>About us</Link>
    </nav>
    <div className="header-actions"><Link className="btn btn-dark header-enquiry" href="/contact">Care enquiry <UiIcon name="arrow" size={16} /></Link><button className="menu-toggle" aria-label="Open navigation" aria-expanded={open} aria-haspopup="dialog" aria-controls="mobile-navigation" onClick={() => setOpen(true)}><UiIcon name="menu" size={24} /></button></div>
   </div>
  </header>
  <dialog ref={dialog} id="mobile-navigation" className="mobile-dialog" onClose={closeMenu} onClick={e => { if (e.target === e.currentTarget) closeMenu(); }} aria-labelledby="mobile-menu-title">
   <div className="mobile-dialog-head"><span id="mobile-menu-title">Explore NeuroFicio</span><button onClick={closeMenu} aria-label="Close navigation"><UiIcon name="close" size={24} /></button></div>
   <nav aria-label="Mobile navigation"><Link href="/" onClick={closeMenu} className="mobile-primary">Home <UiIcon name="arrow" /></Link><p className="menu-caption">Conditions</p>{conditions.map(c => <Link key={c.id} href={`/services#${c.id}`} onClick={closeMenu}>{c.title}<UiIcon name="diagonal" size={18} /></Link>)}<p className="menu-caption">Care options</p>{careOptions.map(c => <Link href={c.href} key={c.href} onClick={closeMenu}>{c.title}<UiIcon name="diagonal" size={18} /></Link>)}<Link href="/blog" onClick={closeMenu} className="mobile-primary">Patient guides <UiIcon name="book" /></Link><Link href="/about" onClick={closeMenu} className="mobile-primary">About us <UiIcon name="arrow" /></Link></nav>
   <div className="mobile-dialog-foot"><Link href="/contact" className="btn btn-dark btn-block" onClick={closeMenu}>Make a care enquiry <UiIcon name="arrow" /></Link><a href="tel:+918341471837">Or call +91 83414 71837</a></div>
  </dialog>
 </>;
}
