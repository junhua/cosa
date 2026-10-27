# Validation — clean local guest flow

## Welcome food status and placement — 14 October 2026

Fresh/restarted sessions now start with no food delivery. The Welcome page always shows the external-delivery status row directly below Ask Cōsa; its default title is No food order yet. Ready and in-progress assignments still show the collection locker, while completed/pending states use their corresponding status. Restore discards the former EXT-204 sample fixture and retains other delivery records.

All 17 state tests, lint, typecheck and web/iOS/Android no-bytecode exports passed. The new regression checks fresh/reset defaults and migration of the old sample without removing other orders. Interactive visual inspection was not performed in this revision.

## Testing restart control — 14 October 2026

At the user's request, added a development-only Restart test control on all screens, including CosaHub and booking entry. A confirmation offers Reset & start again and Keep current test. Reset dispatches the existing full state reset, remounts the route to dispose ephemeral identity images/forms, closes sheets and returns to CosaHub. Existing ordered persistence writes save the fresh state. Production exports omit the control via __DEV__.

Lint, typecheck, all 16 state tests and web/iOS/Android no-bytecode exports passed. The live Expo tunnel returned HTTP 200 for the iPhone bundle containing the restart control and confirmation action. Physical-device interaction and visual layout were not verified in this revision.

## Identity upload sources — 14 October 2026

Added separate Upload file, Choose from photos and Take a photo controls to the NRIC/passport form. File selection keeps JPG/PNG/WebP filtering; photo/camera paths use Expo ImagePicker, accept readable native HEIC/HEIF images, and share the 10 MB validation, preview and temporary-file cleanup. Camera denial offers the other paths; no media-library permission is requested unnecessarily for image-only system selection. Camera/photo permission descriptions are configured and microphone permission is disabled.

Lint, typecheck and web/iOS/Android no-bytecode exports passed. Existing upload journey selectors now target Upload file. These Playwright journeys were not executed in this revision. Native camera/library selection, permission denial and browser file dialogs still need interactive device verification; bundle success does not verify those OS interactions.

## Assigned food pickup only — 9 October 2026

Supersedes the guest reservation flow below. Removed food order-reference entry, reservation/cancellation controls and guest reservation reducer actions. Assignment is represented by the hotel/provider `food-delivery-ready` event; no guest control dispatches it. A fresh local Mina session contains sample external delivery EXT-204 assigned to F03, Level 1. Saved empty/collected records remain unchanged. Existing legacy pending records retain their local readiness deadline. The Stay page and Hotel shortcut inform guests when food is ready; the collection page displays the locker prominently and retains guarded QR-style unlock/re-lock/finish actions. No external provider, physical locker or push service is connected.

Verified fresh-session ready notice, opening assigned F03 directly, absence of reservation/input/cancel controls, and completing collection to the no-pending-deliveries screen. Browser error logs were empty. Capture: `qa/clean/food-locker-assigned.png`. All 16 tests passed; lint, typecheck and web/iOS/Android no-bytecode exports passed. A subsequent placement-only change moving the assignment card higher on the page passed lint, typecheck and web export. Physical phone rendering remains unverified.

## Hotel food lockers and shower page — 9 October 2026

Scope clarification: the Hotel shortcut, locker page heading, policy notice and order-reference field now explicitly limit the flow to external-party food deliveries for collection and pickup. Café orders retain lobby coffee bar pickup. Verified the updated policy and reference field in the actual browser; lint and typecheck passed. Capture: `qa/clean/food-locker-external-only.png`.

Hotel now lists Food collection lockers, Directions, Housekeeping and Shower availability as separate linked sections, followed by stay essentials. Added independent persisted food locker F03, dimensions 35 cm width × 40 cm depth × 20 cm height, order reference entry, cancellation before readiness, scheduled local readiness, QR-style unlock, door closure/re-lock and collection confirmation. Outside food order references are not remotely verified; local readiness advances after 30 seconds. This flow is separate from luggage storage and café lobby pickup.

Verified in the actual browser at 393 × 852: hotel section ordering, food locker assignment and dimensions, automatic readiness, restoration after reload/relink, unlock, re-lock, disabled finish until both food removal and door closure, then locker release. Verified the separate shower page switches from 3 available cubicles in daytime to 1 in the morning. Browser error logs were empty. Captures: `qa/clean/hotel-sections.png`, `qa/clean/food-locker-reserved.png`, `qa/clean/food-locker-ready.png`, `qa/clean/shower-availability.png`.

All 16 state/timer tests passed, including food locker deadline restoration, guarded collection and independent café/luggage state. Lint, typecheck and web/iOS/Android no-bytecode exports passed. Physical locker access and native device rendering remain unverified; no hardware or delivery-provider integration is implemented.

## Food & delivery tabs — 9 October 2026

Added side-by-side Cosa coffee bar/External party tabs above the Food & delivery content. The existing menu, basket, review and pickup flow is under Cosa coffee bar. External party shows a coming-soon card about nearby food places within 1 km of Cōsa. Coffee content stays mounted while hidden so its category and review state survive tab switches.

Verified in the actual browser at 393 × 852: default coffee menu, external placeholder, hidden coffee controls on the external tab, and switching back retaining a one-item basket and its review screen. Removed the added test item afterward. Browser error logs were empty. Captures: `qa/clean/food-coffee-tabs.png`, `qa/clean/food-external.png`. Lint, typecheck and web export passed. Physical phone rendering remains unverified.

## CosaHub opening page — 9 October 2026

Added the supplied CosaHub logo, vertically stacked Staying guest/Public choices, and the Public coming-soon page. The opening page contains only the brand, logo and choices. Staying guest opens reference entry; successful lookup opens the existing welcome screen at `/stay`. Cold starts and reloads return to the opening page and require reference entry again. Stay progress, locker records and payment receipts are retained.

Verified in the actual browser at iPhone size 393 × 852: opening layout, Public layout, Staying guest lookup, automatic return from the welcome screen after five minutes without interaction, empty reference entry after that return, successful relinking, and reload returning to the opening page. Browser error logs were empty. Captures: `qa/clean/cosahub-entry.png`, `qa/clean/cosahub-public.png`, `qa/clean/cosahub-idle-return.png`.

All 15 reducer/timer tests passed, including inactivity extension, suspended-timer deadline enforcement and retaining paid locker receipts when leaving the guest session. Lint, typecheck and web/iOS/Android no-bytecode exports passed. The Playwright journey specifications were updated and typechecked but not CLI-executed. Native background/resume behavior uses AppState and a wall-clock deadline; this behavior remains unverified on a physical phone.

## Illustrated directions — 9 October 2026

Added seven destination choices with three numbered image steps each, using ten JPEG assets (about 2.6 MB total). Reviewed all generated images for landmark and label consistency. The existing room/luggage action routes remain intact. Inspected all destination selections in the in-app browser, iPhone-size 393 × 852 step layout and Pixel-size 412 × 915 vending guide. Confirmed decoded images and no browser errors on the final guide. Fixed React Native Web intrinsic image height by constraining images within 3:2 frames. Captures: `qa/clean/directions-capsule-iphone.png`, `qa/clean/directions-vending-pixel.png`. Lint, typecheck and web/iOS/Android no-bytecode exports passed. Native device rendering remains unverified. Images are explicitly labeled illustrative; no real property photographs or route survey were supplied.

## Additional lockers and local payments

Verified 7 October 2026: 13 reducer tests passed, typecheck and lint passed, and web/iOS/Android JavaScript exports passed with `--no-bytecode`. Payment tests cover GBP totals, duplicate purchase rejection, malformed receipts, inventory limits, receipt restoration, independent collection guards, checkout blocking and post-checkout access.

Interactive verification at 393 × 852: policy and dimensions, additional locker action directly below luggage size, quantity two updates total to £30, successful local payment assigns L09/L10, reload retains receipt and assignments, and saved receipt history is available. Deposited and collected L09 with required door/bag confirmations; L10 remained reserved and the complimentary reservation remained separate. Browser error logs were empty. Screenshots: `qa/clean/locker-policy.png` and `qa/clean/locker-receipt.png`. No real payment provider was used.

Verified 7 October 2026.

- `npm run typecheck`: passed.
- `npm run lint`: passed without warnings.
- `npm test`: 9 tests passed.
- `npx expo install --check`: dependencies match SDK 57.
- `npm run build`: web production export passed.
- `npm run build:bundles`: final web, iOS and Android JavaScript exports passed with `--no-bytecode`.

Browser verification used the actual app at localhost:8081 through the in-app browser. Verified booking consent/photo gating, local photo preview and disposal after save, arrival review/confirmation, automatic room readiness, unlocking, luggage availability/review/deposit, housekeeping automatic completion, separate hotel help, request persistence on reload, checkout with stored luggage, post-checkout collection with disabled finish until both confirmations, persisted feedback, café readiness after its five-minute deadline and collection, concierge help routing, and language selection. The café order survived a reload and reached pickup automatically without a status button. Fresh screenshot evidence is in `qa/clean/`.

Final fresh Stay/check-in browser console inspection returned no error entries. Earlier development-only unexpected empty-string text nodes were fixed using boolean conditional rendering and verified after reload.

The updated Playwright specifications were typechecked but not CLI-executed in this revision. Prior demo-era test results are superseded by this report. Native physical devices, native file-picker cleanup under abrupt termination, and signed release builds remain unverified. The Windows Hermes compiler previously reported `spawn UNKNOWN`; successful no-bytecode exports do not validate Hermes compilation.

## Booking entry addition

Added the reference booking ID entry route and branded loading transition. At that revision, verified in the actual browser: `/arrival` redirects a fresh unlinked session to `/booking`; Continue is disabled for empty input; an unknown ID shows the loading state then a retry notice; ` csa-0913 ` opens Welcome, Mina; reload preserves the linked booking. These entry/restore behaviors are superseded by the CosaHub opening page above. Browser error logs returned no entries. Captures: `qa/clean/booking-entry.png` and `qa/clean/booking-loading.png`. The regression specifications include the route guard and lookup journey. That revision had 10 reducer tests, including booking validation, persistence and legacy migration.

## Booking entry and London food — 22 October 2026

Validated the direct booking form, retained logo, unknown-reference retry, valid reference lookup, guest-route gating and reload behavior on iPhone (393 × 852) and Pixel (427 × 952). External party checks cover three restaurant cards, labelled illustrative images, menu/ordering links and retained café basket after tab switching. Final targeted Playwright run: 4 passed. Fresh visual evidence: booking-food-landing-{iphone,pixel}.png and london-food-{Dumpling,Nandos,GAILs}-{iphone,pixel}.png in this folder. Inspected generated assets and fresh screenshots; corrected oversized web image layout with explicit image heights. Lint, TypeScript and web production export passed. The preview server required a restart to clear reload timeouts during verification. No live external order was placed; physical native-device behavior was not tested.

## Food map and delivery offer — 22 October 2026

Added a real street-map viewport with a projected 1 km radius, sample hotel centre, numbered venue pins, named selection controls, one selected food card and visible OpenStreetMap attribution. The 5% offer preview opens the Uber Eats London page; it does not apply a discount. The centre is a sample Spitalfields location, and approximate venue pins are disclosed. Pending details: hotel address and an approved partner promotion/link. No geolocation or real order is used.

Lint, TypeScript and the web production export passed. Targeted iPhone/Pixel browser coverage checks all three pin selections and matching cards, retained café basket and a mocked external popup handoff to the correct Uber Eats URL. Screenshots wait for image decoding. Fresh evidence is in food-map-{iphone,pixel}.png, food-discount-{iphone,pixel}.png and food-map-{Dumpling,Nandos,GAILs}-{iphone,pixel}.png. The development server was restarted after export because hot reload intermittently stalled; the initial cold-start assertion now allows 30 seconds. Native phones were not tested.

## Piccadilly Circus update — 22 October 2026

Replaced the sample Spitalfields centre with Piccadilly Circus and nearby Din Tai Fung Centre Point, Nando’s Soho and GAIL’s Soho. Updated centre labels, approximate pins, venue links, map links and browser expectations. Lint, TypeScript and web export passed. Targeted browser suite passed on iPhone and Pixel (2 tests), including pin/card selection, image decoding, Uber Eats link handoff and retained café basket. Fresh visual evidence uses the piccadilly-food-map and piccadilly-food-discount prefixes. Inspected the map on both presets. Prior Spitalfields screenshots are historical.

## Food card link removal — 22 October 2026

Removed Explore menu & ordering and Find on map from all external-party food cards, along with their unused styles and URL fields. Updated the introduction to match the remaining experience. Lint, TypeScript and web export passed. The targeted browser checks passed on iPhone and Pixel, asserting both links are absent for each selected venue while map selection, the Uber Eats offer handoff and café basket retention work. Fresh piccadilly-food-map venue screenshots show the shortened cards and were inspected on both phone presets.

## Food collection workflow — 22 October 2026

Implemented delivered-food in-app notice, assigned F03 locker/location, expandable Level 1 directions, collection QR unlock, leave-open/unlocked instruction and single successful-collection confirmation. Removed food close-door checkboxes and re-lock action; completion accepts an open door and releases the assignment for a subsequent provider delivery. Existing ready/unlocked/collected records restore using the same status values. No fabricated delivery is added to a fresh stay.

Validation: 17 reducer/state tests pass, including collection only after unlock, refusal without removed-food confirmation, completion without door closure, restored state and subsequent delivery assignment. Lint, TypeScript and web production export pass. Four targeted Playwright cases pass across iPhone and Pixel for delivered notice, directions, QR, unlock/leave-open prompt, successful collection, inactive completed QR, persisted collection and no-delivery state. Fresh evidence: food-locker-{notice,qr,unlocked,collected}-{iphone,pixel}.png. Screenshots inspected on both presets. Real rider updates, OS push, physical readers/locks and production inventory are outside this local implementation.

## Sample delivery trigger — 22 October 2026

Added the explicitly requested development-only Send sample food delivery action for empty/completed food collection sessions. It creates a new F03 sample assignment and opens My stay with the delivered-food notification; an existing waiting/unlocked assignment cannot be overwritten. The action is available again after successful collection. Lint, TypeScript and web export passed. Four iPhone/Pixel browser cases passed, including triggering the sample through the visible UI, notification, directions, QR unlock, leave-open completion, persistence, repeat sample and empty-state behavior. Inspected fresh sample-food-delivery-{iphone,pixel}.png screenshots. Production exports exclude the sample button.

## Illustrated food locker directions — 22 October 2026

Removed the specified lock-remains-unlocked paragraph. Added three generated, bundled interior images beneath the corresponding numbered directions: Level 1 lobby, Food collection sign/alcove and F03 food locker/reader. Styling follows the hotel directions with forest circular step numbers, rounded full-image frames and dividers. Images have descriptive accessibility labels and an illustrative-image/signage note.

Lint, TypeScript and web export passed. Four targeted iPhone/Pixel cases passed for the sample notification, illustrated directions, QR unlock, removal of the paragraph, collection and no-delivery behavior. After adjusting screenshot framing, reran the two full-collection cases successfully. Fresh evidence: food-locker-direction-{1,2,3}-{iphone,pixel}.png and updated food-locker-unlocked-{iphone,pixel}.png. Inspected numbered image cards and unlocked screen on both presets. Prompt notes are in assets/directions/PROMPTS.md. No state or backend changes were made.


## Shower and toilet availability — 27 October 2026

Removed the shower Time of day dropdown and period switching. Added Hotel > Toilet availability with a dedicated route, separate male/female counts, and T01–T04 statuses using the same shared cubicle layout, help and back navigation as showers. Both pages retain indicative-availability copy; no live occupancy service or reservations were added.

Validation: lint, TypeScript, web production export and the protected design runtime integrity check passed. Two targeted Playwright cases passed on iPhone (393 × 852) and Pixel (427 × 952), covering Hotel entry, both groups and totals, no time selector, individual toilet statuses, and back navigation. Fresh screenshots were visually inspected for both device sizes: shower-availability-current-{iphone,pixel}.png, toilet-availability-{iphone,pixel}.png and hotel-toilet-entry-iphone.png. The rest of the guest regression suite was not run for this change.


## Four-level facility availability — 27 October 2026

Shower and toilet pages now show selectable Levels 1–4 with male/female availability counts on every level card. Each level has two male and two female cubicles for each facility, with floor-specific illustrative statuses and unique IDs. Level 2 is selected initially. Selected-floor details and signage guidance update together; no time selector, booking or live occupancy service was added.

Validation: lint, TypeScript, web production export and the protected design runtime check passed. Two targeted browser cases passed on iPhone and Pixel, each checking all four levels on both pages, per-floor totals, all cubicle IDs, no time dropdown, and Hotel/back navigation. Fresh level overview and scrolled detail screenshots were inspected: shower-levels-{iphone,pixel}.png, toilet-levels-{iphone,pixel}.png, shower-level-details-iphone.png and toilet-level-details-pixel.png. Existing default-level screenshots were refreshed. Full guest regressions and physical-device tests were not run.
