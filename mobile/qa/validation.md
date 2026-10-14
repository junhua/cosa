# Validation — clean local guest flow

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
