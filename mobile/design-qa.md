# Design QA — Cōsa native guest workflow

## Target and evidence

Source: https://cosa-guest-concierge.aiitpelective2005.chatgpt.site/ and the local design package. Source truth captures: `qa/reference/stay-screen.png` and `qa/reference/checkin-screen.png`. Additional workflow screenshots are in `qa/reference/`.

Implementation: React Native Web at http://localhost:8081/, using the same native components as iOS/Android. Final captures: `qa/clean/stay-final.png`, `qa/clean/checkin-final.png`; combined comparison inputs: `qa/clean/stay-comparison-final.png`, `qa/clean/checkin-comparison-final.png`; focused evidence: `qa/clean/pass-focused-final.png`.

Source browser viewport: 1400 × 1200. The measured `[data-phone-screen]` was 393 × 852 CSS pixels at scale 1, captured with a 393 × 852 clip. Implementation browser viewport and screenshot: 393 × 852, density 1. Both captures are 393 × 852 pixels with no density resampling. The combined full-view images are 806 × 882, with a label strip. The focused comparison uses equal-width, unscaled crops around the pass and primary action.

States: English, linked booking, before pre-check-in; then initial check-in form with consent unchecked and no photo. Both use Mina, CSA-0913 and 23–26 September 2026. The source includes a fake status bar, device bezel and gesture area; the native app leaves those to the OS. That chrome difference is intentional and is not treated as content drift. The request is to mimic the workflow in React Native, with all demos removed, rather than reproduce the web prototype's device simulator.

## Findings and comparison history

Initial comparison: `qa/clean/stay-comparison-1.png` showed three P2 content-surface differences: smaller home primary-action typography, absence of the highlighted luggage card, and Stay Pass labels placed on a single opposing row. These weakened the source hierarchy.

Fixed: home primary action now uses 19 px text; luggage storage has the sage card; pass branding is stacked; its middle/bottom content, dates and booking hierarchy follow the source. Rechecked in `stay-comparison-final.png` and the readable pass/action crop. These P2 findings are resolved.

The check-in comparison shows the same display heading wrap, three-step indicator, booking details, hourly arrival selector, consent and photo step. Native controls and the language sheet replace browser-native dropdowns. Screen scrolling preserves the bottom navigation and required actions.

No actionable P0/P1/P2 findings remain for the requested native workflow adaptation.

## Required fidelity surfaces

- **Fonts and typography:** bundled DM Serif Display for headings and DM Sans regular/medium/bold for UI. The 36 px arrival title wraps to the same two lines. Home primary action matches the source's larger emphasis. Native font rendering and compact pass caption spacing differ slightly without clipping.
- **Spacing and layout rhythm:** 393 px content frame, 20 px screen padding, 214 px stay pass, rounded forest primary actions, sage luggage emphasis and the same content ordering. Scrollable pages keep navigation accessible. The native header differs from the source's simulated OS chrome, as intended.
- **Colors/tokens:** ivory `#f7f5ef`, forest `#214f3d`, ink `#14251e`, sage panels, subdued supporting text and clear success/error notices retain the source palette. Disabled actions are visibly subdued and enforce their guards.
- **Image quality/assets:** the original local pass texture and both QR artworks are reused, with sharp QR rendering and no generated substitute imagery. Standard Feather icons provide the consistent native icon family. The source's decorative leaf stamp and phone shell are omitted in this native workflow adaptation; exact decorative/icon parity is a P3 follow-up, not a missing guest function.
- **Copy/content:** booking identity, dates, room/capsule, locker, Wi-Fi password, check-in timings and main workflow language match the inspected source. Demo/sample/simulation banners, scenario controls, reset and manual staff-status controls are removed. Local boundaries are documented outside the guest flow. Automatic status updates retain the preparing/ready workflow.

## Interaction and accessibility checks

Verified through the actual browser app: gated pre-check-in, photo selection/preview/removal on completion, arrival confirmation, automatic room readiness, room key, locker review/deposit, housekeeping status, hotel request persistence, reviewed checkout, post-checkout collection, persisted feedback, café automatic readiness and pickup, concierge help and language selection. Collection remains disabled until both luggage removal and empty-door confirmation. Nine reducer tests additionally cover timing, restoration, unavailable inventory and continuing storage.

Buttons, tabs, radios, text fields and checkboxes have accessible labels and states. Decorative icon glyphs are hidden from assistive technology. Controls use practical native tap targets. Fresh implementation console error inspection returned no entries. iOS/Android JavaScript exports passed; physical-device and large-text accessibility checks remain unverified.

## Implementation checklist

- [x] Match guest journey and navigation from the live source.
- [x] Separate hotel information/help from hotel directions/housekeeping.
- [x] Remove guest-facing demo controls and copy.
- [x] Persist status deadlines, requests, messages and feedback.
- [x] Resolve the P2 Stay page comparison findings and recapture.
- [x] Verify typecheck, lint, reducer tests and web/native JavaScript exports.

## Follow-up polish

P3: closer native icon glyph and decorative leaf parity, plus physical-device text scaling and screen-reader verification. These do not block the implemented local workflow.

final result: passed
