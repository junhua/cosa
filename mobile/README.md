# Cōsa React Native guest app

Expo SDK 57, React Native 0.86, strict TypeScript and Expo Router. The same native screens run on iOS, Android and React Native Web.

## Run

From `mobile/`:

```sh
npm ci
npm run web
# Or start for a compatible Expo Go app / development build:
npm start
```

The browser preview is at http://localhost:8081/. Native simulator/device builds require the relevant Expo development environment; iOS simulator builds require macOS. No credentials or environment variables are required for the local flow.

## Booking entry

Fresh guests enter their reference booking ID, see a brief branded loading screen, then reach the welcome page. The local booking reference is **CSA-0913** (case-insensitive; spaces and hyphens are tolerated). Unknown references show a retry message. Linked bookings persist for the current web tab/native session; guest routes redirect unlinked sessions to `/booking`. Previously checked-in local stays retain their progress during migration. This is local lookup, not authentication or a live booking API.

## Implemented workflow

- Stay Pass and the prototype's Stay / Hotel / Concierge navigation.
- Pre-check-in: eleven arrival windows, booking confirmation, passport/NRIC photo choice, JPG/PNG/WebP size and decode validation (10 MB maximum), temporary preview, replace/remove, saved review, arrival confirmation and room access.
- Room readiness updates automatically. The key requires completed arrival and a ready room; checkout ends access.
- Luggage: size, day and hour selection, local inventory availability, alternative slots, oversized-item help, one complimentary locker per guest, 87 × 68 × 40 cm dimensions, £15 additional lockers with independent deposit and collection, closed-door deposit, the same QR for collection, optional relocking to continue storage, and release only after all bags are removed and the empty door is closed. Stored luggage remains accessible after checkout.
- Hotel directions, shower availability by period, housekeeping with preferred times/notes and cancellation, plus separate hotel information, Wi-Fi password copying and saved service requests.
- Café: category tabs, quantities across categories, editable basket, totals, order preparation, automatic readiness, pickup QR, collection confirmation and another order.
- Reviewed checkout, confirmation, persisted feedback, post-stay help, and local concierge guidance with saved conversations.
- Six languages for navigation and key stay copy; supporting services use English fallback.

Guest-facing demo labels, scenario selectors, restart controls, artificial failures and manual staff-status buttons have been removed.

## Local service boundary

The user explicitly selected a **clean local guest flow**. This app does not contact a live hotel, identity service, staff, payment processor or AI provider, and does not control physical doors or lockers. The booking is fixed to Mina / CSA-0913 / 23–26 September 2026, Room 201 / B12 and locker L08. QR artwork is retained from the design package and is not a production credential.

Local status deadlines are persisted: room readiness two seconds after arrival, café readiness five minutes after ordering, and housekeeping completion thirty seconds after requesting. The reducer advances due updates on hydration and every second while mounted. Production integration should replace these schedules and the fixed inventory provider with server-owned statuses and real access credentials.

## Persistence and document handling

“Add additional locker” appears below the luggage-size selector and remains available after complimentary storage is reserved or deposited. Guests choose quantity and drop-off, review the GBP total and complete a local payment. The transaction saves a receipt and assigns available local lockers L09–L16. Duplicate transaction IDs and insufficient inventory cannot create another purchase. Collection releases an assignment for reuse. Saved receipts are accessible from the payment page and survive reloads with the guest session (web storage is tab-scoped). No card details are collected or real money charged. Production payments require a secure backend, provider confirmation and server-owned inventory.

Native uses AsyncStorage; web uses tab-scoped sessionStorage under `cosa-guest-v3`. Existing `cosa-demo-v2` sessions are migrated if a new session is absent. The allow-list restore excludes document paths and unknown fields, normalizes older luggage/orders, and preserves deadlines, requests, conversations and feedback. Native writes are serialized. Storage errors are displayed.

Document photo URIs never enter saved stay state. Browser blob URLs are revoked and native cache copies deleted on replace, remove or leaving the form. The original selected file is untouched. An abrupt OS termination can leave an OS-managed cache copy until eviction. The local flow does not verify identity.

## Validation

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run build:bundles
# Optional browser regression suite:
npx playwright install chromium
npm run test:e2e
```

Thirteen reducer tests cover local payment totals and saved receipts, duplicate purchases, paid locker collection, inventory limits, access, luggage and checkout guards, orders, deadline restoration, availability, housekeeping, feedback, continued storage and booking-reference validation. The updated Playwright regression specifications cover clean check-in, checkout/collection, café scheduling and hotel requests. They were authored and typechecked in this revision; interactive browser verification was performed through the in-app browser instead of rerunning the CLI suite.

Web production export and iOS/Android/web JavaScript exports pass. `build:bundles` uses `--no-bytecode` because the earlier Windows Hermes export reported `spawn UNKNOWN`; this is a bundle check, not a signed APK/IPA or native-device test. Physical device behavior and release Hermes compilation remain unverified.

See `qa/validation.md` for current evidence and `design-qa.md` for the source comparison.

## Design and code

Reviewed the local `design/Cosa-Prototype-Local` instructions, implementation, styles and assets in the primary checkout, then inspected the linked live prototype through its main guest journeys. This worktree initially contained only README; the React Native implementation lives in `mobile/` and does not modify the Vite design prototype.

- `src/app/`: Expo Router routes; `_layout.tsx` uses the shared application shell.
- `App.tsx`: fonts, safe areas, route navigation, hydration, scheduled updates and language sheet.
- `src/StayScreens.tsx`: Stay Pass, arrival, room, checkout and post-stay.
- `src/LuggageScreens.tsx`: reservation, deposit, collection and relocking.
- `src/ServiceScreens.tsx`: hotel information, directions, housekeeping, café and concierge.
- `src/IdentityPhoto.tsx`: temporary photo validation and lifecycle.
- `src/stay.ts`: typed state transitions, guards, totals and restoration.
- `src/localAvailability.ts`: replaceable local locker inventory.
- `src/components.tsx`, `src/i18n.ts`: native UI primitives and key-screen translations.

