import Link from 'next/link';
import LogoMark from './LogoMark';

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <LogoMark size={26} />
              Neuro<span style={{ color: '#5EEAD4' }}>Ficio</span>
            </div>
            <p style={{ fontSize: 14, maxWidth: 280, marginBottom: 18 }}>Specialist neurological rehabilitation, delivered at home. A Therapy Partners service, trusted across Hyderabad and beyond.</p>
            <div className="pill" style={{ background: 'rgba(94,234,212,0.12)', color: '#5EEAD4' }}>First assessment &amp; session free</div>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link href="/#services">How home care works</Link></li>
              <li><Link href="/#equipment">Equipment &amp; tools</Link></li>
              <li><Link href="/#community">Support groups</Link></li>
              <li><Link href="/#about">Our story</Link></li>
              <li><Link href="/blog">Blog &amp; resources</Link></li>
            </ul>
          </div>
          <div>
            <h4>Conditions</h4>
            <ul>
              <li><Link href="/#services">Stroke recovery</Link></li>
              <li><Link href="/#services">Traumatic brain injury</Link></li>
              <li><Link href="/#services">Spinal cord injury</Link></li>
              <li><Link href="/#services">Parkinson&apos;s</Link></li>
            </ul>
          </div>
          <div>
            <h4>Get in touch</h4>
            <ul>
              <li><a href="tel:+918341471837">+91 83414 71837</a></li>
              <li><a href="https://wa.me/918341471837" target="_blank" rel="noopener noreferrer">WhatsApp us</a></li>
              <li><a href="mailto:neuroficio.care@gmail.com">neuroficio.care@gmail.com</a></li>
              <li><Link href="/#contact">Book free assessment →</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Neuroficio, a Therapy Partners service. All rights reserved.</span>
          <span>Hyderabad, India · Remote consultations worldwide</span>
        </div>
      </div>
    </footer>
  );
}
