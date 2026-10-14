import data from './patient-guides.json';
export type PatientGuide = {
 slug: string; title: string; category: string; excerpt: string; answer: string; intro: string[];
 sections: { id: string; heading: string; paragraphs: string[]; bullets?: string[]; sources?: number[];
  table?: { headers: string[]; rows: string[][] } }[];
 faqs: { question: string; answer: string }[];
 sources: { title: string; url: string }[];
 related: string[]; service: string; cta: string; urgent?: string;
};
export const patientGuides: PatientGuide[] = data;
export function getPatientGuide(slug: string) { return patientGuides.find(guide => guide.slug === slug); }
export function guideWordCount(guide: PatientGuide) {
 return [guide.answer, ...guide.intro, ...guide.sections.flatMap(s => [s.heading, ...s.paragraphs, ...(s.bullets || []), ...(s.table?.rows.flat() || [])]),
 ...guide.faqs.flatMap(f => [f.question, f.answer])].join(' ').split(/\s+/).length;
}
