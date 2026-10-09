# Validation — clean local guest flow

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

Added the reference booking ID entry route and branded loading transition. Verified in the actual browser: `/arrival` redirects a fresh unlinked session to `/booking`; Continue is disabled for empty input; an unknown ID shows the loading state then a retry notice; ` csa-0913 ` opens Welcome, Mina; reload preserves the linked booking. Browser error logs returned no entries. Captures: `qa/clean/booking-entry.png` and `qa/clean/booking-loading.png`. The regression specifications now include this route guard and lookup journey. Current reducer suite has 10 tests, including booking validation, persistence and legacy migration.
