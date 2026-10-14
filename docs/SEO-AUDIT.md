# NeuroFicio SEO and patient-content audit

Reviewed: 14 October 2026. Scope: repository source, generated production pages and public guidance. This is not a live-domain crawl, a keyword-volume study or a ranking guarantee.

## Outcome

The main acquisition obstacle was architectural: eight views shared one URL and changed via fragments and React state. Only the homepage initially rendered. The other views could not have independent canonical URLs, titles or descriptions. They now have real, prerendered routes, descriptive navigation links and page-specific metadata. Existing homepage fragment links continue to open the corresponding route after JavaScript loads.

The booking form only changed local state and incorrectly announced receipt. The revised contact flow prepares a WhatsApp message and explicitly requires the visitor to send it. Telephone and email remain available. There is no backend intake or confirmed appointment at this stage.

## SEO elements reviewed

| Element | Finding and refinement | Remaining work |
| --- | --- | --- |
| Crawlability and rendering | Separate routes; content available in initial production HTML; navigation and condition links use href attributes | Verify live indexability and Google URL Inspection after deployment |
| Titles and descriptions | Unique metadata for all existing indexable routes; patient language rather than vague slogans | Refine using measured query intent; snippets may be rewritten by search engines |
| Canonicals and domain | Shared domain configuration, self-referencing page URLs and blog canonical | Owner must confirm primary domain; set NEXT_PUBLIC_SITE_URL and redirect alternate hosts at hosting level |
| Sitemap and robots | Generated sitemap includes all public content routes; robots references sitemap | Submit to Search Console and Bing Webmaster Tools; verify hosting does not block crawling |
| Headings and semantics | One page-level H1 per view, clearer service headings, main landmarks and visible patient FAQs | Visual and accessibility review on mobile; expand condition-specific content after keyword research |
| Internal links | Real service links, article related-service links and blog breadcrumb | Add contextual links as new patient guides are clinically reviewed |
| Structured data | Business identity from existing site; article, breadcrumb and matching article FAQ markup; safe JSON serialization | Validate live markup in Rich Results Test; confirm business details. No invented ratings, credentials or global offices |
| Social metadata and identity | Open Graph, Twitter card, generated sharing image and brand SVG icon | A brand touch icon and page-specific photography may be added later |
| Medical accuracy and trust | Robotics article rewritten with NICE/NHS/WHO references; fixed unsupported early-exercise timetable; removed unverified testimonials and recovery claims | Obtain named clinician reviewer, qualifications, registrations and consent-backed case studies. Editorial author is not a claim of medical review |
| International targeting | Global English content distinguishes local home visits from remote enquiries; time-zone-aware contact flow | Confirm service eligibility by country. No fabricated country landing pages or hreflang for untranslated content |
| Patient enquiries | Questions cover eligibility, cost, frequency, referrals, caregivers, remote limitations and equipment | Confirm actual pricing, offer terms, insurance, consultation duration and response commitments |
| Images and performance | Current site uses SVG illustrations, not content photography; redundant runtime Google font stylesheet removed in favour of next/font | Measure live Core Web Vitals, mobile Lighthouse, LCP/INP/CLS and contrast. No performance score claimed |
| Error handling | Unknown service and article routes return not-found; metadata routes build correctly | Verify live 404 behavior and host redirects |
| Analytics and conversion | No operational measurement found in repository | Configure consent-appropriate analytics and enquiry events; measure qualified patients and bookings, not traffic alone |
| Privacy and publishing | First enquiry avoids asking for detailed medical records; explains external WhatsApp handoff | Add verified privacy notice, data-handling process, cancellation terms and secure clinical-record intake |

## Content changes and editorial constraints

27 service/home/contact FAQs plus five article FAQs address current patient concerns. The robotics article distinguishes devices from rehabilitation programmes, describes evidence limitations and does not advertise an unverified hospital robotics facility. Existing free offers are qualified with eligibility confirmation; no prices or outcomes were invented. Existing business address, phone and Therapy Partners relationship were retained from repository content and require owner verification.

The existing equipment page has no product catalogue; it is an advice/enquiry page. Do not describe individual devices as stocked or internationally shipped until confirmed. Existing community schedules and consultant coordination descriptions also require business verification before live publication.

Unused legacy components still contain earlier marketing copy and placeholder contact details. Current routes do not import them. Do not reconnect them without updating and checking them; the active contact component is EnquiryForm and the active shared site experience is SiteExperience.

## Next: research patient questions, then publish substantive answers

Keyword research should identify different intents, combine overlapping questions into useful pages, and map each cluster to a service and an enquiry action. A page for every wording variation would create repetition rather than comprehensive coverage. Do not create a page for every country without a real differentiated service.

| Topic cluster | Questions to research | Likely destination |
| --- | --- | --- |
| Stroke rehabilitation | Can I walk again? How long does recovery take? Can progress continue months later? Home versus clinic? Cost? | Dedicated stroke service page plus clinician-reviewed recovery guides |
| Brain injury | What rehabilitation is needed after TBI? What about fatigue, balance or memory? How can family help? | Brain injury service page and practical caregiver guides |
| Spinal cord injury | Complete versus incomplete injury? Transfers, wheelchair use, home adaptations and long-term goals? | Spinal cord injury service page and specialist-reviewed guides |
| Parkinson's | Balance, freezing, falls, exercise and maintaining daily function? Is online physiotherapy suitable? | Parkinson's physiotherapy page and symptom-specific guides |
| Remote rehabilitation | Who is eligible? What can video assess? Is a caregiver needed? Time zones, fees, local-care coordination? | International page, expanded only with confirmed service facts |
| Local home visits | Neuro physiotherapy at home, service areas, availability and pricing? | Hyderabad home-care page supported by verified business profile |
| Equipment | Walking aids, wheelchairs, fitting, maintenance and robotics versus standard therapy? | Equipment guide and only verified products |
| Caregiver support | How to help safely, prepare the home, arrange care abroad and seek support? | Caregiver hub linked to relevant conditions |
| Choosing a provider | Qualifications, specialist experience, referral requirements, expected goals, fees and second opinions? | About, service and contact pages with verified credentials |

For the keyword phase, use global English variants such as physiotherapy/physical therapy and neurorehabilitation/neurological rehabilitation. Research demand separately by country, weigh relevance and service eligibility, and prioritise questions associated with a realistic care pathway. Multilingual expansion needs professionally reviewed translations and real availability.

## Acquisition measurement

Track discovery queries and indexed pages, then service-page visits, contact clicks, sent enquiries where measurable, eligible enquiries, booked assessments and patients starting care. Use country and care format to assess lead quality. Build clinical trust and useful answers before scaling article volume. Backlinks should come from legitimate clinical/community partnerships; no paid-link schemes or invented testimonials.

## Verification and release

Validation: production build and TypeScript checks passed. The SEO verification script checks all ten public content pages for initial HTML, unique titles, one H1, canonical and social metadata, enquiry links and parseable structured data, plus sitemap completeness. Local HTTP checks returned 200 for representative content, sitemap, robots and the PNG sharing image; unknown service and blog routes returned 404. Run `npm run build` then `node scripts/verify-seo.mjs` after further edits. Domain configuration, clinical/business verification, mobile visual QA, live Core Web Vitals and search-console access remain separate release checks. Changes are local repository work; no GitHub push or live deployment has been performed.

## Sources

- Google people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google crawlable links: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Google JavaScript SEO: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Google structured-data policies: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Google FAQ rich-result limitations: https://developers.google.com/search/blog/2023/08/howto-faq-changes
- NICE stroke rehabilitation: https://www.nice.org.uk/guidance/ng236/chapter/Recommendations
- NICE robotics rationale: https://www.nice.org.uk/guidance/ng236/chapter/Rationale-and-impact
- NHS stroke recovery: https://www.nhs.uk/conditions/stroke/recovery/
- WHO rehabilitation: https://www.who.int/news-room/fact-sheets/detail/rehabilitation

FAQs improve usefulness, but their markup does not guarantee a rich result. Google limits FAQ rich results to eligible authoritative health and government websites. No ranking or patient-volume outcome is guaranteed.

## Article expansion, 14 October 2026

A second content pass adds 19 patient guides and expands the existing robotics guide. The blog now has 20 articles across six topics, and the sitemap has 29 public content URLs. See ARTICLE-KEYWORD-MAP.md for all 39 supplied search phrases, source decisions and enquiry paths. Every article includes a care enquiry form; FAQ schema is specific to the article. The original audit describes the first pass; the keyword map records the later validation.
