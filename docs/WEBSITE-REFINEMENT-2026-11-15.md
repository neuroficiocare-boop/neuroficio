# NeuroFicio website refinement review

Source: NeuroFicio Website.docx and the supplied logo in Downloads/websitesuggestions. Updated 15 November 2026.

## Implemented

| Brief requirement | Result |
| --- | --- |
| Official logo | Supplied artwork optimised for header/footer; matching app icon and Apple touch icon. No invented replacement logo. |
| Three separate journeys | Persistent three-link journey navigation and three homepage routes: Hyderabad home care, overseas families arranging care in India, international in-person care. |
| Opening section | Requested specialist home rehabilitation headline, supporting scope, assessment CTA and international CTA. |
| Programme explanation | Assessment, goals, named professional, oversight, caregiver participation, agreed visits and scheduled review. Details are presented for agreement before booking, without invented operational schedules. |
| How care starts | Enquiry, suitability/assessment, written programme, confirmed start and follow-up. |
| Progress and communication | Functional goals, baseline/progress documentation, reviews, agreed update recipients and escalation contact. |
| International in-person care | Dedicated /international page: suitability, authorisation and local checks, therapist matching, written proposal, travel/start, supervision, leave cover and handover. Remote guidance has its own /remote page. |
| Current countries | All 18 locations from the brief, with corrected spelling; clear individual checks rather than automatic deployment. Port of Spain and San Fernando included as enquiry locations. |
| Overseas-family page | New /nri page: patient location separate from family location, consent, professional/oversight questions, reviews, time zones and escalation. No nationwide immediate deployment claim. |
| Clinical limits | Medically stable adults; no emergency, ICU, tracheostomy or critical-care management. Qualified professionals required for additional disciplines. |
| Fees | Removed live repeated free-assessment claims. Individual written quotation process. No proposed package prices or replacement free-call offer. |
| Enquiry fields | Patient country/city; enquirer name/contact/country/time zone; relationship; requested service; optional category, timeframe and question; required privacy acknowledgement. WhatsApp is review-and-send, not a backend submission. |
| Privacy | Linked privacy notice and explicit WhatsApp disclosure. No marketing signup. Optional analytics choice and preference controls. |
| Measurement | Separate phone_click and whatsapp_click custom events, consent gated. No personal or care data in custom event payloads. No assessment_request_submitted event because no server-confirmed form response exists. |
| Brochures | Existing cards and source downloads retained. Telerehab links now lead to /remote. |
| Image labels | Removed visible illustrative captions from home/service imagery, library and articles. Descriptive alt text remains. |
| Technical SEO | Unique titles without duplicate brand suffix; canonicals; Open Graph/Twitter; crawlable static pages; 32-page sitemap; real revision dates where applicable; organisation/logo/website, webpage, service, breadcrumb and matching FAQ/article schema; real 404 response. |

## Waiting for source details

- Clinical leadership: owner will provide photographs and qualifications. Dr SRIVANI PASUPULETI PT must retain PT and must not be presented as a physician or neurologist. Verify qualifications, relevant registration, experience and oversight responsibilities before publication. No invented profile, registration or review credit is published.
- Team roster and relationships: distinguish employed, visiting and external partner clinicians when confirmed. Recruitment candidates are not current staff.
- Approved operational specification: assessment deliverables; visit/session length and frequency; documentation; oversight; review cadence; training; named escalation contact; enhanced programme disciplines and employment/partner status. Current pages ask visitors to agree these items before booking; they do not invent a staffed package.
- International proposals: actual working schedule, rest/leave cover, senior visits, supervision, local coordination and itemised travel/accommodation/equipment/other expenses remain case-specific.
- Case stories and testimonials: omitted pending consent and verified source details. No guarantees or success percentages added.
- Privacy operations: owner should supply actual clinical-record sharing, retention and deletion procedures; the website notice describes only the implemented enquiry handoff and analytics. It does not invent a retention schedule.
- CRM stages and source attribution: qualified enquiry, assessment booked and programme started require an actual CRM/backend connection. None exists in this checkout.
- Google Analytics property: verify Enhanced Measurement form interactions, outbound clicks and site search are disabled in the property to keep collection limited to the explicit site events. Property-level settings and production traffic could not be inspected here.

## Content review queue for the next stage

The existing article URLs are preserved. No unverified clinical reviewer is credited. Clinical sign-off, original content and keyword work remain separate from this technical pass.

| Existing guide | Review decision before content rollout |
| --- | --- |
| neuro-rehab-cost-insurance-medicare | Review US Medicare/insurance relevance to the Hyderabad and international-enquiry service; avoid implying coverage or provider participation. |
| pediatric-neurorehabilitation-center | Review against adult-only service scope; retarget or retire with an appropriate redirect after an approved content decision. |
| brain-injury-swelling-recovery | Review acute neurological guidance and ensure emergency-care boundaries. |
| severe-brain-injury-home-care | Review stability and critical-care/tracheostomy exclusions carefully. |
| tms-hyperbaric-oxygen-neurological-recovery | Review specialist therapies outside current operational scope; do not imply they are delivered by NeuroFicio. |
| aquatic-physiotherapy-parkinsons | Review therapy/facility availability and avoid implying an owned pool or service. |
| robotic-neuro-rehabilitation-2026 | Confirm equipment/facility ownership and partner claims; current guidance must not imply ownership. |
| speech-recovery-after-stroke-aphasia | Confirm appropriately qualified speech/swallowing professionals and clinical sign-off. |

Priority future original guides: choosing home neurorehabilitation, caregiver participation, understanding progress reviews and arranging care from abroad. Add named verified reviewers, references and real review dates when supplied. Competitor URLs in the brief are retained as research inputs for that content stage; no competitor wording or claims have been copied.

## Publication checks

This is a local repository change, not a production deployment. After deployment verify the primary domain and HTTP/HTTPS/www redirects, TLS, CDN crawler access, mobile/desktop layout, Core Web Vitals, Google Rich Results Test, Google Search Console and Bing Webmaster Tools sitemap ingestion. Search-engine crawling, indexing, rich results and AI inclusion are not guaranteed. No special AI visibility file or paid ranking promise has been added.

References: https://developers.google.com/search/docs/appearance/ai-features ; https://developers.google.com/search/docs/appearance/structured-data/organization ; https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a

## Local validation completed

- Production build and TypeScript passed.
- verify-seo.mjs passed all 32 pages, metadata/canonicals, sitemap, branding, journey navigation, image-label removal, required/optional enquiry fields, privacy acknowledgement, quotation messaging and matching service FAQs.
- verify-design.mjs passed all 32 pages, unique IDs, local destinations/anchors and patient-guide search checks.
- verify-patient-guides.mjs passed all 20 existing articles, contextual enquiry defaults, sources, related links and matching article FAQs.
- HTTP checks passed all 32 sitemap URLs, 404/noindex for invalid section and article URLs, logo/icons, social preview, robots and every brochure asset.
- git diff --check passed.
- Visual browser and mobile interaction checks were not completed: browser integration was unavailable and native browser app access timed out. No WhatsApp message was sent. Production indexing, CRM and Google Analytics property configuration were not changed.
