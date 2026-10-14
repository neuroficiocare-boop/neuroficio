# NeuroFicio design refresh

Implemented 14 October 2026.

The site now uses a warm cream, sage, navy and restrained teal design system with editorial headings, consistent navigation and a clear distinction between Hyderabad home visits and remote care enquiries.

## Experience changes

- One shared header and footer across all service and article pages. Native desktop disclosure menus group conditions and care options; the mobile dialog supports native focus containment and Escape dismissal.
- A redesigned homepage with home/online entry points, meaningful condition links, a readable care pathway, family support imagery and featured patient guides.
- Individual service, international, equipment, second opinion, caregiver, about and contact layouts with consistent typography and enquiry paths. Service links target real condition sections.
- A patient-guide library with case-insensitive keyword search, six topic filters, result counts, an empty state and reset controls. All 20 articles remain linked in the initial HTML.
- A refreshed reading layout with article metadata, contents, readable text, source links, matching FAQs, related guides, a desktop care sidebar and the existing contextual enquiry form.
- Mobile call/enquiry access uses the article form anchor on articles. Contact fields retain explicit labels, native validation and the review-and-send WhatsApp flow.
- Four generated illustrative editorial images, stored as WebP assets and served through Next Image with responsive sizes. The home hero image is preloaded; other images load lazily. Captions distinguish imagery from actual staff or patient evidence.
- The generated font variables are now used directly by the design system. Reduced-motion preferences are respected; no automatic carousels or essential reveal animations hide content.

## Preserved

The public URLs, titles, canonicals, sitemap, robots, all article content and sources, article FAQ schema and contextual enquiry messages remain in place. No invented credentials, reviews, recovery rates or service capabilities were added.

## Validation

Production build and TypeScript passed. SEO checks cover all 29 public content URLs. Article regression checks cover all 20 articles. Design checks validate shared menus, local link and anchor targets, unique IDs, four image assets and guide-search behaviour.

No browser surface is available in this environment. Desktop/mobile screenshots, actual interactive browser behaviour and live Core Web Vitals therefore remain unverified. The generated images themselves were visually inspected. No real WhatsApp enquiry was sent during testing.

## Assets

See IMAGE-ASSETS.md for the saved image paths, generation method and prompt set.
