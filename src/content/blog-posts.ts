import { patientGuides, guideWordCount } from './patient-guides';

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  modified?: string;
  readTime: string;
  author: string;
  tags: string[];
  category: string;
};

const existingPosts: BlogPost[] = [
  {
    slug: 'robotic-neuro-rehabilitation-2026',
    title: "Robotic Stroke Rehabilitation: Benefits, Limits & Alternatives",
    excerpt:
      "Considering robotic therapy after a stroke? Understand the evidence, limitations, alternatives and questions to ask before choosing rehabilitation.",
    date: '2026-07-26',
    modified: '2026-10-14',
    readTime: '6 min read',
    author: 'NeuroFicio editorial team',
    tags: ['Stroke Recovery', 'Technology-Guided Recovery', 'Physiotherapy'],
    category: 'Specialised therapies',
  },
];

export const blogPosts: BlogPost[] = [
 ...patientGuides.map(guide => ({
  slug: guide.slug, title: guide.title, excerpt: guide.excerpt, date: '2026-10-14',
  author: 'NeuroFicio editorial team', category: guide.category, tags: [guide.category],
  readTime: `${Math.max(3, Math.ceil(guideWordCount(guide) / 200))} min read`,
 })), ...existingPosts,
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
