import Link from 'next/link';
import { sitePages, type PageKey } from '@/content/site-pages';
export default function PatientQuestions({ page }: { page: PageKey }) {
 return <section className="section" aria-labelledby="patient-questions"><div className="container" style={{ maxWidth: 900 }}>
  <h2 id="patient-questions">Questions patients and families ask</h2>
  {sitePages[page].faqs.map(f => <details className="article-faq" key={f.question}><summary><strong>{f.question}</strong></summary><p style={{ marginTop: 12 }}>{f.answer}</p></details>)}
  <p style={{ marginTop: 24 }}><Link href="/contact">Ask about your rehabilitation options</Link> or <Link href="/blog">read our patient guide</Link>.</p>
 </div></section>;
}
