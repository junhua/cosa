# Cōsa React Native landing-screen QA

final result: passed

## Visual target and evidence

Source: current `design/Cosa-Prototype-Local/index.html` in the original checkout, corroborated with `source/src/Prototype.tsx`, `source/src/prototype.css` and current `source/AGENTS.md`. Earlier Alex / arrival-QR images are superseded.

- Source capture: `qa/reference-iphone.jpg`, 393 × 852 pixels. The browser measured the reference screen at 393 × 852 CSS pixels inside a 1400 × 1200 viewport before capture.
- Initial implementation: `qa/landing-iphone.jpg`, 393 × 852 pixels.
- Initial combined comparison: `qa/comparison-iphone.jpg`, 786 × 852 pixels.
- Final implementation: `qa/landing-iphone-final.jpg`, verified 393 × 852 CSS pixels and screenshot pixels.
- Final combined comparison: `qa/comparison-iphone-final.jpg`, 786 × 852 pixels, opened and visually reviewed.
- Pixel-size responsive evidence: `qa/landing-pixel.jpg`, 427 × 952 pixels, opened during review.
- Concierge interaction evidence: `qa/concierge.jpg`.

State: English, Mina, booking linked, not prechecked, no reserved luggage. Density 1; no image resizing used. Full-view paired comparison was sufficient for the typography, pass, primary action and service rows; no focused crop was necessary.

Expected platform differences: the reference contains simulated iPhone status/camera/bezel/home-indicator infrastructure. This implementation uses React Native components and actual native safe areas; the web preview does not draw fake device chrome. Its bottom navigation ends at the browser viewport edge. The 61px web top inset aligns app-owned content with the iPhone reference; native devices use their real safe-area inset.

## Comparison history

1. P1: background image used its intrinsic width and extended beyond the Stay Pass card. Set an explicit full-width card and clip to its radius. Subsequent browser measurement showed a 357px image inside a 357px card at iPhone size.
2. P2: initial pass content sat too high, primary-action text was undersized, and the pass footer wrapped differently. Matched the reference's effective 125px middle region, set the landing action to 19px, and reserved 85px for the booking footer.
3. P2: a shared flex shorthand constrained the footer despite its explicit width. Removed flex from the shared text style and applied flex only to the first caption. Recaptured the final build; both footer captions now occupy their intended two lines.

Final paired evidence confirms these fixes. No actionable P0/P1/P2 visual differences remain within the landing-page scope.

## Required fidelity surfaces

- Typography: local DM Serif Display and DM Sans match the reference families and hierarchy. Greeting, wordmark, action, pass labels and supporting text remain readable. Small baseline / weight differences are P3.
- Spacing and layout: reference section ordering, 18px page margins, 214px pass, 56px action, service anatomy and persistent navigation are preserved. A few-pixel service-row drift is P3. Lower content scrolls above navigation.
- Colors: ivory `#f7f6f0`, forest `#214f3d`, sage `#e9ede5`, ink and muted text match the source tokens.
- Images and icons: original textured leaf-background artwork and demo QR reused locally; Phosphor native icons match the prototype's icon family. No placeholder artwork or hand-drawn asset substitutes.
- Copy: current Mina welcome, dates, booking, online check-in, luggage and Hotel content retained. Six-language landing/navigation copy is available; English supporting-detail fallback is disclosed.

## Browser interaction validation

Verified through the Codex in-app browser against the production web export:

- Check-in sheet opens; eleven arrival windows and document-type selection appear.
- Save is disabled before image and booking consent. Non-personal source artwork was selected as a local test image, previewed, consented and saved; online arrival then completes and the Stay Pass changes to room access.
- Luggage reservation changes the home card. Door confirmation gates locking. The final sequence reserves, locks, separately unlocks, confirms removal / empty-door closure and releases the locker, returning to the initial home card.
- Japanese language selection updates landing text and tabs; switching back restores English.
- Hotel tab displays Directions, Housekeeping and Shower Availability in the required order.
- Concierge accepts a typed luggage question, renders its scripted response and disables empty sends.
- Browser console warning/error inspection returned no entries for the production preview.

An inspection overlay interfered with development-preview clicks, so final interaction checks used the production export. Neither native device execution nor every secondary error case was tested.

## Technical validation

TypeScript and ESLint pass. Expo Doctor passed all 21 checks. Web, Android and iOS bundle exports succeed. Native exports verify bundling rather than installed-app execution. Git whitespace checks pass.

## Limits and follow-up polish

- P3: a few-pixel row spacing and font-baseline differences.
- Native device QA remains outstanding, including real system keyboard and photo-library behavior.
- This is a landing-page implementation with supporting local demos. Café basket, checkout, unavailable lockers and access-failure recovery are not migrated from the full design prototype.
- Demo state resets on reload. No live hotel service, identity verification, hardware, payment or AI is connected.

## Implementation checklist

- [x] Current design and refinements reviewed.
- [x] React Native landing page with original assets and fonts.
- [x] Same-size final paired visual comparison reviewed.
- [x] iPhone and Pixel-sized browser views inspected.
- [x] Core local interactions and console checked.
- [x] Typecheck, lint, Expo Doctor and platform exports validated.
