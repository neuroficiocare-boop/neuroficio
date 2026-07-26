export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  tags: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'robotic-neuro-rehabilitation-2026',
    title: "Robotic Neuro-Rehabilitation for Stroke & Paralysis Recovery: What It Actually Involves",
    excerpt:
      "Robotic-assisted therapy is one of the most talked-about developments in stroke and paralysis recovery. Here's how it fits alongside physiotherapy, tele-rehab and home-based care.",
    date: '2026-07-26',
    readTime: '10 min read',
    author: 'Nero Ficio Physiotherapists',
    tags: ['Stroke Recovery', 'Technology-Guided Recovery', 'Physiotherapy'],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
