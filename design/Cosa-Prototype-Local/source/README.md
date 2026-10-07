# Cōsa — connected guest concierge prototype

Selected direction: option 1, ivory and forest-green Stay Pass.

## Run

`npm ci` then `npm run dev`. The managed preview is already running in this session. `npm run build` produces the runnable static client in `dist/client` and the Sites-ready worker. The app uses the protected Product Design mobile runtime with iPhone and Pixel previews.

## Demonstration

1. Review the linked Mina booking, choose arrival time, simulate identity verification and save pre-check-in. Choose one of eleven hourly arrival windows (1pm–2pm through 11pm–12am), then complete arrival entirely online; no arrival QR, kiosk or front-desk visit is required.
2. Choose bag count/size and valid drop-off/collection dates. Review suitable lockers and sample fees. Reserve, simulate tag printing, scan the storage pass, then simulate bag detection and door locking. Test door failure recovery, temporary retrieval and collection extensions. The luggage QR is separate from printed bag identifiers; arrival has no QR step.
3. Open room access, simulate early readiness, follow indoor directions and unlock the demo capsule. Reserve a shower or laundry cycle in Amenities. Inspect disabled / overlapping slots, saved bookings and cancellation.
4. Use the concierge for hotel requests, food collection, parcels, luggage transfer or amenities. Responses are scripted and aware of the current demo stay.
5. Review luggage plans and unused amenity cancellations, then confirm express checkout. Room access ends, while stored-luggage collection remains available. Collect bags and leave feedback under Beyond stay.

## Scope and assumptions

This is an interactive frontend prototype. All names, booking details, prices, quotes, room statuses, operational actions and service information are sample data. QR images encode labelled demo identifiers. No camera, RFID reader, door, identity verification, AI service, payment, merchant or logistics partner is connected. Nothing is sent to a hotel or third party. Fictional demo state is saved in this browser tab’s session storage and survives reloads. Restart demo stay clears it. Language and help includes a restart control and English / Japanese / Simplified Chinese / Malay core-journey guidance.

The software can be adapted to another capsule hotel by configuring branding, booking requirements, storage rules, room and locker identifiers, service menus and integrations. The prototype includes a small property configuration in `src/Prototype.tsx`; a production platform would require property-level data separation, action-scoped expiring credentials and verified device/provider integrations.

## September 23 refinement

Grounded in Mina’s Budget Travel Persona Board, the pre/during/post-stay app journey maps, and Mina’s smooth CosaHub capsule stay storyboard. Existing forest / ivory style is retained. Explore is replaced by amenity booking. English, Japanese, Simplified Chinese and Malay cover core check-in, luggage, room and amenities flows; supporting services and some demo messages remain English. Quiet workspace is replaced by a self-guided hotel directions screen with six destinations from the main entrance. Prices, sizes, locker capacity, schedules and amenity inventory are illustrative product assumptions, not verified hotel policies. Notifications are in-app demo messages, not background push notifications.

## Design evidence

Selected source: `reference/selected-stay-pass.png`.
Review images and visual comparison: `qa/`.
See `design-qa.md` for verification details and limitations.

## Latest hotel section
Amenity booking has been removed. The Hotel tab now contains only Hotel Directions and Housekeeping. Housekeeping supports cleaning, towels, bedding and rubbish requests with preferred time, optional notes, saved confirmation and cancellation. Requests are simulated and require an active demo stay. No laundry booking charges or unused amenity reservations appear at checkout.
