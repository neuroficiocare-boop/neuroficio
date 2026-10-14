 'use client';
import { useState } from 'react';
import Link from 'next/link';
import UiIcon from './UiIcon';
import { filterGuides, type GuideSummary } from '@/lib/guide-search';
const topics = ['All topics', 'Choosing care', 'Costs and assessment', 'Stroke recovery', 'Brain injury', 'Caregiver support', 'Specialised therapies'];
export default function PatientGuideLibrary({ guides }: { guides: GuideSummary[] }) {
 const [query, setQuery] = useState('');
 const [category, setCategory] = useState('All topics');
 const results = filterGuides(guides, query, category);
 function reset() { setQuery(''); setCategory('All topics'); }
 return <>
  <div className="library-controls"><label className="library-search"><UiIcon name="search" size={21} /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search a question, condition or care topic" aria-label="Search patient guides" />{query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><UiIcon name="close" size={17} /></button>}</label><p className="result-count" role="status" aria-live="polite">{results.length} {results.length === 1 ? 'guide' : 'guides'} to explore</p></div>
  <div className="topic-filters" role="group" aria-label="Filter guides by topic">{topics.map(topic => <button key={topic} type="button" aria-pressed={category === topic} onClick={() => setCategory(topic)}>{topic}</button>)}</div>
  {results.length ? <div className="guide-results-grid">{results.map(post => <Link className="guide-card" href={`/blog/${post.slug}`} key={post.slug}><div className="guide-card-top"><span className="topic-label">{post.category}</span><UiIcon name="diagonal" size={21} /></div><h3>{post.title}</h3><p>{post.excerpt}</p><span className="guide-card-bottom">{post.readTime}<span>Read the guide <UiIcon name="arrow" size={16} /></span></span></Link>)}</div> : <div className="library-empty"><UiIcon name="book" size={32} /><h2>No guides match this search yet.</h2><p>Try a broader word such as stroke, walking, cost or caregiver.</p><button type="button" className="btn btn-dark" onClick={reset}>Show all patient guides <UiIcon name="arrow" size={18} /></button></div>}
  <p className="library-footnote">These guides help you prepare for a conversation with your clinical team. Individual assessment is important, and available services are confirmed separately.</p>
 </>;
}
