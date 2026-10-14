import Link from 'next/link';
import LogoMark from './LogoMark';
import UiIcon from './UiIcon';
import MobileCareBar from './MobileCareBar';
import { conditions, careOptions } from '@/content/care-options';
export default function SiteFooter() {
 return <><footer className="site-footer"><div className="container">
  <div className="footer-intro"><div><span className="eyebrow">Your next step</span><h2>A conversation can make<br />the way forward clearer.</h2></div><Link href="/contact" className="btn btn-primary">Make a care enquiry <UiIcon name="arrow" /></Link></div>
  <div className="footer-grid">
   <div className="footer-brand"><Link href="/" className="brand"><span className="brand-symbol"><LogoMark size={26} /></span><span className="brand-word">Neuro<span>Ficio</span></span></Link><p>Neurological rehabilitation built around everyday life. A Therapy Partners service based in Hyderabad.</p><span className="footer-location"><UiIcon name="pin" size={16} /> Hyderabad, India</span></div>
   <div><h3>Care options</h3><ul>{careOptions.map(c => <li key={c.href}><Link href={c.href}>{c.title}</Link></li>)}</ul></div>
   <div><h3>Explore</h3><ul>{conditions.map(c => <li key={c.id}><Link href={`/services#${c.id}`}>{c.title}</Link></li>)}<li><Link href="/blog">Patient guides</Link></li><li><Link href="/about">About NeuroFicio</Link></li></ul></div>
   <div><h3>Speak with us</h3><ul className="footer-contact"><li><a href="tel:+918341471837">+91 83414 71837</a></li><li><a href="mailto:neuroficio.care@gmail.com">neuroficio.care@gmail.com</a></li><li><a href="https://wa.me/918341471837" target="_blank" rel="noopener noreferrer">Connect on WhatsApp <UiIcon name="diagonal" size={15} /></a></li><li><Link href="/contact">Address &amp; care enquiries</Link></li></ul><p className="footer-note">Ask about the free assessment offer and eligibility for your care format.</p></div>
  </div><div className="footer-bottom"><p>&copy; 2026 NeuroFicio. A Therapy Partners service.</p><p>Home visits in Hyderabad. Remote availability confirmed individually.</p></div>
 </div></footer><MobileCareBar /></>;
}
