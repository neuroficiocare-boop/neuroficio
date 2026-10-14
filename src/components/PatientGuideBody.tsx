import { type PatientGuide } from '@/content/patient-guides';
export default function PatientGuideBody({ guide }: { guide: PatientGuide }) {
 return <article className="article-body">
  {guide.urgent && <aside className="article-urgent" aria-label="Urgent care information">{guide.urgent}</aside>}
  <div className="article-callout"><strong>The short answer</strong><p>{guide.answer}</p></div>
  {guide.intro.map(p => <p className="lead" key={p}>{p}</p>)}
  <p><a className="btn btn-dark btn-sm" href="#care-enquiry">Ask about rehabilitation care</a></p>
  <nav className="article-toc" aria-label="In this guide"><h2>In this guide</h2><ul>
   {guide.sections.map(s => <li key={s.id}><a href={`#${s.id}`}>{s.heading}</a></li>)}
   <li><a href="#article-faq">Patient questions</a></li><li><a href="#care-enquiry">Care enquiry</a></li>
  </ul></nav>
  {guide.sections.map(s => <section key={s.id} aria-labelledby={s.id}>
   <h2 id={s.id}>{s.heading}</h2>{s.paragraphs.map(p => <p key={p}>{p}</p>)}
   {s.bullets && <ul>{s.bullets.map(b => <li key={b}>{b}</li>)}</ul>}
   {s.table && <div className="article-table-wrap"><table className="article-table">
    <caption>{s.heading}</caption><thead><tr>{s.table.headers.map(h => <th scope="col" key={h}>{h}</th>)}</tr></thead>
    <tbody>{s.table.rows.map(row => <tr key={row[0]}>{row.map((cell, i) => i === 0 ? <th scope="row" key={i}>{cell}</th> : <td key={i}>{cell}</td>)}</tr>)}</tbody>
   </table></div>}
   {s.sources && <p className="article-source-note">Further reading: {s.sources.map((index, i) => <span key={index}>{i > 0 && '; '}<a href={guide.sources[index].url}>{guide.sources[index].title}</a></span>)}</p>}
  </section>)}
  <aside className="article-cta"><h2>Discuss the next step for your care</h2><p>{guide.cta}</p><a className="btn btn-primary" href="#care-enquiry">Make a care enquiry</a></aside>
  <section aria-labelledby="article-faq"><h2 id="article-faq">Frequently asked questions</h2>
   {guide.faqs.map(f => <div className="article-faq" key={f.question}><h3>{f.question}</h3><p>{f.answer}</p></div>)}
  </section>
  <section aria-labelledby="article-sources"><h2 id="article-sources">Sources and further reading</h2>
   <ul>{guide.sources.map(source => <li key={source.url}><a href={source.url}>{source.title}</a></li>)}</ul>
   <p className="article-source-note">Sources checked on 14 October 2026. Written by the NeuroFicio editorial team; no named clinical reviewer is represented here.</p>
  </section>
  <p className="article-disclaimer">General information, not an individual diagnosis or treatment plan. Ask the relevant qualified professional about your needs. For sudden or worsening neurological symptoms, seek urgent local medical care.</p>
 </article>;
}
