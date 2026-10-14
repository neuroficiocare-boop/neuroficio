import Link from 'next/link';
import { sitePages, type PageKey } from '@/content/site-pages';
import UiIcon from './UiIcon';
export default function PatientQuestions({ page }: { page: PageKey }) {
 return <section className="section faq-section" aria-labelledby="patient-questions"><div className="container faq-layout"><div><span className="eyebrow">A little more clarity</span><h2 id="patient-questions">Questions patients<br />and families ask.</h2><p>Find a starting point here, then discuss your own needs with the team.</p><Link href="/blog" className="text-link">Explore our patient guides <UiIcon name="arrow" size={18} /></Link></div><div className="faq-list">{sitePages[page].faqs.map(f => <details className="faq-item" key={f.question}><summary>{f.question}<span aria-hidden="true">+</span></summary><p>{f.answer}</p></details>)}<Link className="faq-contact text-link" href="/contact">Have a different question? Ask us <UiIcon name="arrow" size={18} /></Link></div></div></section>;
}
