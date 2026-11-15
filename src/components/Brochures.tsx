import Image from 'next/image';
import Link from 'next/link';
import { Download, ArrowUpRight } from 'lucide-react';

const brochures = [
 { id: 'overview', number: '01', label: 'Start here', title: 'Care, connected around you.', description: 'An introduction to NeuroFicio, rehabilitation options and international care coordination for patients, families and referral partners.', file: 'neuroficio-international.pdf', format: 'PDF', size: '7.5 MB', image: 'neuroficio-overview.jpg', imageSize: '3.2 MB', next: '/international', nextLabel: 'Explore international care' },
 { id: 'telerehab', number: '02', label: 'Support from home', title: 'Understand telerehabilitation.', description: 'Explore video sessions, movement reviews, caregiver guidance and the questions to ask before starting remote support.', file: 'neuroficio-telerehab.pdf', format: 'PDF', size: '4.2 MB', image: 'neuroficio-telerehab.jpg', imageSize: '3.4 MB', next: '/remote', nextLabel: 'Ask about remote guidance' },
 { id: 'equipment', number: '03', label: 'For care partners', title: 'Explore equipment pathways.', description: 'An overview of robotic rehabilitation equipment and collaboration pathways between Tanzania and India.', file: 'neuroficio-equipment.jpg', format: 'JPG', size: '3 MB', image: 'neuroficio-equipment.jpg', imageSize: '3 MB', next: '/equipment', nextLabel: 'Explore equipment guidance' },
];

export default function Brochures() {
 return <section id="brochures" className="section brochure-section" aria-labelledby="brochures-title"><div className="container">
  <div className="section-topline"><div className="section-heading"><span className="eyebrow">Take the next step, in your own time</span><h2 id="brochures-title">A little clarity.<br />Something to keep.</h2><p>Get to know your care options with our brochures. Read them at your pace, save a copy or share one with your family or care team.</p></div><div className="brochure-intro-note"><Download size={22} aria-hidden="true" /><span>Free to download.<br />No form to fill in.</span></div></div>
  <div className="brochure-grid">{brochures.map(b => <article className="brochure-card" key={b.id}>
   <a className={`brochure-cover brochure-cover-${b.id}`} href={`/brochures/${b.file}`} target="_blank" rel="noopener noreferrer" aria-label={`View ${b.title} (${b.format}, opens in a new tab)`}><span className="brochure-sheet"><Image src={`/brochures/${b.id}-preview.webp`} alt={`${b.id === 'overview' ? 'NeuroFicio international care' : b.id === 'telerehab' ? 'NeuroFicio telerehabilitation' : 'NeuroFicio equipment partnerships'} brochure cover`} width={700} height={990} sizes="(max-width: 760px) 80vw, 28vw" /></span><span className="brochure-preview-label">View brochure <ArrowUpRight size={16} aria-hidden="true" /></span></a>
   <div className="brochure-card-body"><span className="eyebrow"><span>{b.number}</span> / {b.label}</span><h3>{b.title}</h3><p>{b.description}</p><a className="btn btn-dark brochure-download" href={`/brochures/${b.file}`} download aria-label={`Download ${b.title} (${b.format}, ${b.size})`}><Download size={18} aria-hidden="true" /><span>Download brochure<small>{b.format} Â· {b.size}</small></span></a>{b.format === 'PDF' ? <a className="brochure-image-link" href={`/brochures/${b.image}`} download>Save image version <span>JPG Â· {b.imageSize}</span></a> : <p className="brochure-format-note">High-resolution image for saving and sharing.</p>}<Link className="brochure-next" href={b.next}>{b.nextLabel}<ArrowUpRight size={16} aria-hidden="true" /></Link></div>
  </article>)}</div>
  <div className="brochure-next-step"><div><strong>Found a starting point?</strong><p>Tell us your location and what support you are looking for. We will help you understand the next step.</p></div><Link href="/contact" className="btn btn-outline">Talk to the team <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
 </div></section>;
}
