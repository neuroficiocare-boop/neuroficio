# Service presentation update

Implemented from the owner's 16 November 2026 instructions.

- Replaced the homepage hero with the exact requested headline and supporting service description.
- Added six always-visible linked service cards directly below the hero, with the supplied descriptions. They form a three-column desktop grid, two columns on tablet and one column on small screens.
- Replaced the previous three-journey header strip with the four requested international labels. The mobile layout uses a two-by-two grid so no option is hidden in a horizontally scrolling list.
- Added a visible international-options section with the four descriptions, plus corresponding navigation, page headings and enquiry choices.
- Added dedicated Advanced Rehabilitation Technology and Multidisciplinary Neurorehabilitation sections at /services#technology and /services#multidisciplinary. Existing public routes are preserved.
- Updated speech and swallowing availability on the service page, scope notes, home/service FAQs, enquiry choices and speech-recovery guide. Availability depends on appropriately qualified specialists, location and clinical suitability. This supersedes the earlier uncertainty about providing those services; no staffing or universal availability is invented.
- Clarified rehabilitation-focused second opinions versus medical diagnostic opinions in the page intro, FAQ, service description and enquiry flow.
- Updated service metadata, sharing copy, service schema and sitemap revision dates. The speech article has a genuine modification date for this change.
- Repaired possessive punctuation damaged by the previous Windows text pipeline.

Validation: production build and TypeScript passed. Design checks confirm the exact headline, all six rendered cards and descriptions, four international navigation entries on all 32 pages, working service anchors, and speech/swallowing wording. SEO checks pass all 32 public routes; all 20 article regression checks pass. git diff --check passes. Browser preview remains unavailable, so rendered desktop/mobile visual inspection was not completed. No patient enquiry or WhatsApp message was submitted during testing.
