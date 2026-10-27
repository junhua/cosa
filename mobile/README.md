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

The opening page shows the CosaHub name, supplied logo and booking reference entry directly, followed by a brief lookup transition and the welcome page at `/stay`. Public entry has been removed. The local reference is **CSA-0913** (case-insensitive; spaces and hyphens are tolerated). Unknown references show a retry message. Cold starts, reloads and five minutes without interaction return to the CosaHub opening page; entering the guest area requires the reference again. Saved stay progress, luggage assignments and receipts remain intact. Guest-route deep links are gated by the current entry session. This is local lookup, not authentication or a live booking API.

Inactivity uses a wall-clock deadline, native AppState resume checks and web visibility/focus checks so suspended timers cannot extend the session. Touches and scrolling count as native activity; web typing, scrolling and pointer interaction count as activity. Expiry closes the guest gate, dismisses the keyboard and language sheet, and remounts the current screen to dispose temporary form/photo state. The timeout is configured in `src/inactivity.ts`.

## Implemented workflow

- Stay Pass and the prototype's Stay / Hotel / Concierge navigation.
- Pre-check-in: eleven arrival windows, booking confirmation, passport/NRIC photo choice, JPG/PNG/WebP size and decode validation (10 MB maximum), temporary preview, replace/remove, saved review, arrival confirmation and room access.
- Room readiness updates automatically. The key requires completed arrival and a ready room; checkout ends access.
- Luggage: size, day and hour selection, local inventory availability, alternative slots, oversized-item help, one complimentary locker per guest, 87 × 68 × 40 cm dimensions, £15 additional lockers with independent deposit and collection, closed-door deposit, the same QR for collection, optional relocking to continue storage, and release only after all bags are removed and the empty door is closed. Stored luggage remains accessible after checkout.
- Hotel sections for food collection lockers, directions, shower availability by period, housekeeping with preferred times/notes and cancellation, plus separate hotel information, Wi-Fi password copying and saved service requests.
- Directions include three numbered image steps for capsule rooms, luggage lockers, showers, laundry, toilets, lounge and vending machine. Ten bundled illustrative hotel images use the warm oak/ivory design; image descriptions support screen readers. These generated interiors are examples, and actual hotel signage remains the route authority. Source prompts are in `assets/directions/PROMPTS.md`.
- Café: category tabs, quantities across categories, editable basket, totals, order preparation, automatic readiness, pickup QR, collection confirmation and another order.
- Reviewed checkout, confirmation, persisted feedback, post-stay help, and local concierge guidance with saved conversations.
- Six languages for navigation and key stay copy; supporting services use English fallback.

Guest-facing demo labels, scenario selectors, restart controls, artificial failures and manual staff-status buttons have been removed.

## Local service boundary

Hotel, identity, staff, payments and physical locks remain simulated. The explicitly requested FD-4821 staging connection now exchanges fixed sample delivery status with https://cosahub-delivery-staging.aiitpelective2005.chatgpt.site. No identity documents or real guest records are sent. The booking is fixed to Mina / CSA-0913 / 23–26 September 2026, Room 201 / B12 and locker L08. QR artwork is retained from the design package and is not a production credential. See C:/Users/Asus/OneDrive/Desktop/AI ITP/product/integrations/README.delivery-connection.md for the connected test workflow, service and verification.

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

Seventeen reducer/timer tests cover food locker readiness and guarded collection, inactivity deadlines and saved progress on guest-area exit, local payment totals and saved receipts, duplicate purchases, paid locker collection, inventory limits, access, luggage and checkout guards, orders, deadline restoration, availability, housekeeping, feedback, continued storage and booking-reference validation. The updated Playwright regression specifications cover clean check-in, checkout/collection, café scheduling and hotel requests. They were authored and typechecked in this revision; interactive browser verification was performed through the in-app browser instead of rerunning the CLI suite.

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


## Shower and toilet availability — 27 October 2026

Hotel services now includes separate Shower availability and Toilet availability entries. Each page shows male and female cubicle counts and individual Available, In use or Cleaning statuses. The shower Time of day dropdown has been removed; both pages show indicative local statuses without time selection or reservations. Check the signs in the Level 2 facilities for current status. This supersedes the period-selection descriptions below.

Both pages now cover Levels 1–4, each with male and female facilities and two cubicles per gender. Level cards show each floor's male/female available counts for comparison; selecting a card updates the cubicle details, counts and signage guidance. Level 2 is selected initially. IDs include the level (S201–S204, T401–T404) and statuses remain illustrative local data. This supersedes the Level 2-only availability description above.

## Food collection lockers

Food lockers serve external-party food deliveries for collection and pickup only. Guests cannot reserve or cancel lockers, enter delivery references or choose an allocation. Cōsa Coffee Bar orders continue to use lobby pickup.

Hotel opens `/food-lockers` above Directions; shower availability has its own `/showers` page with separate male and female cubicle counts and statuses for each selected time period. Those shower statuses are illustrative; guests are directed to check signs for the current status. A hotel/provider delivery assignment supplies the reference and locker. The Stay page and Hotel shortcut show a ready-delivery notice, locker number and location. The pickup page shows the assigned locker prominently, dimensions 35 cm width × 40 cm depth × 20 cm height, locker directions, QR-style unlock, a leave-open prompt and a single Food collected successfully confirmation. The food locker stays unlocked and becomes available for the next delivery after confirmation; food collection does not require closing or re-locking the door. Completed collection and assignment records persist with the stay. No-delivery and already-collected states have no reservation controls.

Fresh Mina sessions start with no external food order or assigned locker. Restore discards the former EXT-204 sample delivery, while retaining other delivery records. Saved empty or completed delivery records are preserved; opening the page does not create another delivery. The `food-delivery-ready` reducer event represents a future hotel/provider assignment and is not called by any guest control. Legacy pending locker records retain their scheduled local transition. This remains a local simulation: no delivery-provider updates, physical locks, signed QR access credentials or push notification service are connected. The ready notice is shown inside the app.

## Identity document selection

Pre-check-in offers Upload file (JPG/PNG/WebP image files), Choose from photos, and Take a photo. All paths validate a readable image up to 10 MB, show the same preview and preserve local-only identity handling. Native photo selection also accepts decodable HEIC/HEIF images. Camera access is requested only when taking a photo; permission denial offers the other two paths. Microphone permission is disabled. Preview replacement, removal, form exit and inactivity cleanup use the existing cache/blob disposal. Native camera and photo-library behavior must be checked on a physical phone.

## Restarting a test

Development previews and Expo Go show a Restart test control at the bottom of every screen. Reset & start again clears saved local guest progress, locker/payment/order/message records and the current document preview, and returns to CosaHub. Enter CSA-0913 for a fresh run. Keep current test dismisses the prompt without changes. The control is hidden in production exports using __DEV__. Fresh tests start with no food delivery; a hotel/provider assignment supplies collection details when available.
## London food discovery and booking entry — 22 October 2026

The landing page now retains the supplied CosaHub logo and shows the booking-reference form directly. The former Public choice is removed; older /public links also show reference entry. The existing CSA-0913 validation, lookup, reload and inactivity gate are retained.

Food & delivery > External party shows Dumpling Shack, Nando’s Spitalfields and GAIL’s Spitalfields with one-sentence descriptions, bundled AI-generated food illustrations, official website links for menus/ordering and Google Maps searches. These are London/Spitalfields examples: the hotel has no confirmed street address, so no walking times or within-1-km claims are shown. Ordering takes place on the venue website; no external order or locker is created by browsing these cards. The café basket remains intact when switching tabs.

Official venue sources checked on 22 October 2026:
- https://www.dumplingshack.co.uk/ and https://www.dumplingshack.co.uk/spitalfields-menu
- https://www.nandos.co.uk/restaurants/spitalfields
- https://gails.com/pages/spitalfields

Images depict generic dishes, not venue photography or guaranteed menu items. Source illustrations are in assets/food-places/.

## Map-based food discovery and offer preview — 22 October 2026

External party now presents a 350 px OpenStreetMap street map, a projected 1 km radius, a sample hotel marker and three numbered, selectable venue markers. Selecting a pin or a named radio chip updates the single food detail card. The temporary centre is 51.5182, -0.0808 near Spitalfields, not a confirmed Cōsa address. Venue coordinates are approximate and nearby pins are slightly fanned apart for touch targets; this is disclosed beside the map. The map centre and pins must be confirmed before production. No GPS permission is requested. Street tiles load only for the displayed viewport with default HTTP caching, native app identification and visible attribution. A failed tile request shows an unavailable message while retaining selectable pins and the external larger-map link.

The 5% guest offer banner below the introduction opens https://www.ubereats.com/gb/city/london-eng. It is explicitly labelled as an offer preview: there is no approved promotion code, affiliate/partner link or integration to apply a real discount. No prices or orders in the Cōsa café are affected. An approved offer, terms and a confirmed hotel address are required before this can be presented as an active hotel discount or actual nearby search. The Uber Eats destination is a regular external HTTPS link, not a guarantee the native delivery app will open or any venue is deliverable.

## Piccadilly Circus area — 22 October 2026

Supersedes the sample Spitalfields location: the user selected a 1 km radius around Piccadilly Circus (51.51008, -0.13405). The centre is labelled Piccadilly Circus, not a hotel. Current venues are Din Tai Fung Centre Point (11 St Giles Square), Nando’s Soho (46 Glasshouse Street) and GAIL’s Soho (128 Wardour Street). Approximate coordinates put all three within the 1 km straight-line radius; this is not a walking-route distance. Menu/venue and map links were updated. Existing food imagery remains illustrative. Sources: https://dintaifung-uk.com/locations/, https://www.nandos.co.uk/restaurants/soho, https://gails.com/pages/soho. The 5% offer remains a preview pending partner promotion details.

Food-place cards now show the image, venue name, area and one-line description only. The per-venue Explore menu & ordering and Find on map links have been removed at the user's request. The introduction now refers to the local area. The map selection controls and Uber Eats offer link remain available.


## Delivery rider to food locker collection — 22 October 2026

A ready provider assignment creates an in-app delivery notice at the top of guest screens, with assigned locker ID, Level 1 location and a link to collection. The pickup screen includes expandable numbered directions, assigned-locker QR, unlock, an instruction to leave the door open and keep the lock unlocked, and Food collected successfully. Confirmation marks the assignment collected and makes it available for the next delivery. The QR disappears after completion. Guests no longer close, re-lock or defer a food locker. Luggage behavior remains independent.

Fresh stays still have no fabricated delivery. The existing food-delivery-ready event supplies the assignment; no guest-facing rider or staff controls were added. Legacy reserved assignments can transition through the existing local schedule. Ready, unlocked and collected records remain compatible with saved sessions. This is an in-app local workflow, not an OS push service, delivery-provider integration, live QR credential or physical lock connection. Production needs provider-confirmed delivery, reader/lock integration and server-owned release/inventory updates.

## Triggering a sample food delivery locally

The user requested a visible sample notification for testing. In development previews only, Food collection lockers shows Try a sample delivery when there is no waiting delivery or the previous delivery has been collected. Send sample food delivery creates an F03 provider-style assignment with a fresh SAMPLE-FOOD reference and opens My stay with the delivery notice. Tap the notice for directions, QR unlock and collection confirmation. After collection, the same control can start another sample. It never overwrites a waiting or unlocked delivery. Production exports hide this control with __DEV__; fresh stays do not invent a delivery. This explicit testing request supersedes the earlier restriction on guest-facing manual delivery controls for this development-only action.

## Illustrated food locker directions — 22 October 2026

Food collection directions now match the numbered hotel directions pattern, with a generated picture below each step: Level 1 lobby, Food collection wayfinding sign and F03 food compartment with reader. Rounded 3:2 images preserve the full illustration and include screen-reader descriptions. Generated assets are bundled in assets/directions/food-{lobby,wayfinding,locker-f03}.jpg; original generated images remain outside the repository. The instructions retain signage guidance because the interiors are illustrative. Removed the paragraph beginning The lock remains unlocked from the collection-in-progress screen; the leave-open instruction and successful-collection button remain.
