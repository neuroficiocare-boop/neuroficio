# Homepage service carousel and visual refinement

Requested: make the top menu stronger in colour, improve the homepage presentation, and show all six service categories as scrollable homepage content rather than relying on a dropdown.

Implemented:
- Navy main header, stronger teal international navigation, mint enquiry CTA and clear hover/focus states. Dropdown panels retain dark text on a light background.
- Dedicated six-service carousel on the homepage, retaining every supplied title and full description in the initial HTML. Cards link to the existing relevant pages or service detail anchors.
- Previous/Next controls, native horizontal scrolling, mobile swipe scrolling, visible scrollbar, scroll snapping and keyboard-focusable region. Buttons disable at the start/end. No automatic rotation. Reduced-motion preference removes smooth scrolling and decorative movement.
- Three cards across on wide screens, two on tablet and a partial next card visible on phones to indicate more content.
- Direct hero link labelled Explore all six services to /#our-services, plus a more explicit service section heading and optional enquiry link.
- Warmer hero background, more balanced desktop proportions, refined image framing, a darker photo-note panel and smaller mobile image height.
- Clearer first service card emphasis, a separate dark international-options panel and more consistent section/card treatment.

Validation: production build and TypeScript pass; SEO checks pass all 32 routes; design checks confirm all six categories and descriptions, hero anchor and carousel controls; all 20 article checks pass. Served-page checks confirm the carousel markup and refreshed CSS load successfully. Calculated text contrast: white/teal 5.01:1, main navigation 13.26:1, CTA 9.80:1, featured-card copy 8.97:1 and international-panel copy 9.23:1.

Visual/interaction review could not be completed. The Windows browser tool stopped because it could not establish the current URL with sufficient confidence to enforce its policy. No further computer input was attempted. The native desktop/mobile carousel interactions remain unverified in the browser; source, build, accessibility attributes and HTTP checks were completed.

## Equal emphasis for all six services

Owner feedback on the live screenshot: highlighting only the first card made the other services appear secondary. All six cards now share the same deep teal background, white headings, light body text, mint icons and service numbers. The first- and last-card colour exceptions were removed. Previously verified text contrast applies equally to every service card.
