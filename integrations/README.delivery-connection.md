# Connected food delivery test

Figma driver project: https://www.figma.com/make/ygtZtN9KJxnyOjs063uAjP/Create-food-delivery-system

Staging service: https://cosahub-delivery-staging.aiitpelective2005.chatgpt.site

Fixed assignment: FD-4821 → CSA-0913 → F03.

Complete the simulated rider QR scan in the Figma Preview. The service records the delivery, and the open CosaHub guest app receives its locker notification within the next polling interval (about five seconds). Unlock and collect from the guest app; confirmed collection releases the shared assignment. Start another delivery in the driver app to repeat.

The service is a separate staging Worker and D1 database. Existing hosted guest Site and production infrastructure were not changed. No paid upgrade was introduced. It contains one simulated delivery record, with no guest name, identity document, payment data or real guest information. Its public test access was explicitly approved by the user; this is not production authentication. Physical locks and QR scanning remain simulated. Background/closed-app OS push is not implemented.

Guest polling runs while visible/open and stops after 30 minutes per guest entry. Re-enter the booking to restart it. Driver acknowledgment polling stops after two minutes. The driver receipt distinguishes queued updates from actual guest-app acknowledgment. Restart test clears local guest state only; it does not erase the shared delivery. Finish any unlocked local sample before receiving a connected delivery.

Service source: delivery-staging/. Database schema: delivery-staging/drizzle/0000_delivery_test.sql. Original and connected driver source references: driver-reference/. Source was backed up, typechecked and edited in the original Figma Make file through its code editor. The Make Preview is connected; no separate published driver URL was created.

Site ID: appgprj_6ad9b6fb87b08191b208c89411879591.
Deployment ID: appgdep_6ad9baedac1081919babb0cbebb4d3ab.
Published service commit: be597b9d373bf5a733ac5b38232e685a2482ed80.

Verified 22 October 2026: SQL lifecycle/idempotency guards, driver TypeScript check, guest lint/typecheck/build, 18 reducer tests, two live iPhone/Pixel integration tests and four isolated sample-flow tests. Actual Figma Preview completion produced the notification in the actual localhost guest app and changed the rider receipt to Guest notified. The last delivery was left ready for the user to collect.
