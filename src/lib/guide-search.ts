export type GuideSummary = { slug: string; title: string; excerpt: string; category: string; readTime: string };
export function filterGuides(guides: GuideSummary[], query: string, category: string) {
 const terms = query.trim().toLocaleLowerCase('en').split(/\s+/).filter(Boolean);
 return guides.filter(guide => (category === 'All topics' || guide.category === category) &&
  terms.every(term => `${guide.title} ${guide.excerpt} ${guide.category}`.toLocaleLowerCase('en').includes(term)));
}
