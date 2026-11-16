'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import UiIcon from './UiIcon';
import { serviceCategories, internationalOptions } from '@/content/care-options';

export default function ServiceCategories() {
 const rail = useRef<HTMLDivElement>(null);
 const [edges, setEdges] = useState({ start: true, end: false });
 const updateEdges = useCallback(() => {
  const el = rail.current;
  if (el) {
   const next = { start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 };
   setEdges(previous => previous.start === next.start && previous.end === next.end ? previous : next);
  }
 }, []);
 useEffect(() => {
  const el = rail.current;
  if (!el) return;
  const observer = new ResizeObserver(updateEdges);
  observer.observe(el);
  updateEdges();
  return () => observer.disconnect();
 }, [updateEdges]);
 const scroll = (direction: number) => {
  const el = rail.current;
  if (!el) return;
  const card = el.firstElementChild as HTMLElement | null;
  const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 22;
  el.scrollBy({ left: direction * ((card?.offsetWidth || el.clientWidth) + gap), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
 };
 return <section className="section service-categories" id="our-services" aria-labelledby="services-heading"><div className="container">
  <div className="service-section-heading"><div className="section-heading"><span className="eyebrow">Our services / Six specialist categories</span><h2 id="services-heading">Explore our six<br />rehabilitation services.</h2><p>From personalised care at home to international programmes, find the support that fits your needs.</p></div><Link href="/contact" className="text-link">Not sure where to start? Ask us <UiIcon name="arrow" size={18} /></Link></div>
  <div className="service-scroll-toolbar"><p><span className="service-count">6 services</span> <span>Swipe or scroll to explore every category</span></p><div className="service-scroll-controls" aria-label="Service carousel controls"><button type="button" aria-label="Previous service" aria-controls="service-carousel" disabled={edges.start} onClick={()=>scroll(-1)}><UiIcon name="arrow" className="previous-service-arrow" /></button><button type="button" aria-label="Next service" aria-controls="service-carousel" disabled={edges.end} onClick={()=>scroll(1)}><UiIcon name="arrow" /></button></div></div>
  <div className="service-category-grid service-carousel" id="service-carousel" ref={rail} onScroll={updateEdges} tabIndex={0} role="region" aria-label="Six rehabilitation services. Scroll horizontally or use the previous and next buttons.">{serviceCategories.map((service, i) => <Link href={service.href} className="service-category-card" key={service.href}><div className="service-category-top"><span className="feature-icon"><UiIcon name={service.icon} size={26} /></span><span className="service-category-number">Service 0{i + 1}</span></div><h3>{service.title}</h3><p>{service.detail}</p><span className="service-category-action">Explore this service <UiIcon name="arrow" size={18} /></span></Link>)}</div>
  <div className="international-service-options" aria-labelledby="international-options-heading"><div><span className="eyebrow">Across borders</span><h2 id="international-options-heading">Your international care options.</h2></div><div className="international-option-list">{internationalOptions.map(option => <Link key={option.href} href={option.href}><div><h3>{option.title}</h3><p>{option.detail}</p></div><UiIcon name="diagonal" size={20} /></Link>)}</div></div>
 </div></section>;
}
