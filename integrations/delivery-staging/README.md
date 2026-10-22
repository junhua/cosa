# CosaHub delivery staging bridge

Connected test only: FD-4821 -> CSA-0913 -> F03.

Service: https://cosahub-delivery-staging.aiitpelective2005.chatgpt.site
Site ID: appgprj_6ad9b6fb87b08191b208c89411879591
Deployment: appgdep_6ad9baedac1081919babb0cbebb4d3ab
Source commit: be597b9d373bf5a733ac5b38232e685a2482ed80

This is an isolated staging Worker and D1 database. Existing Cosa Guest Concierge publication and its audience are unchanged. No production guest backend or physical lock integration is provided. No paid upgrade/resource was requested. The Sites managed deployment provisions the Worker and D1 binding; no separate paid Cloudflare account setup was introduced.

Only simulated test identifiers are accepted. This publicly reachable demo is not production authentication. CORS admits the local guest preview and Figma preview origins; CORS is not an authentication mechanism. Do not add real guest records or identity documents. The database retains a single delivery row. Polling is five seconds while visible/open and stops after 30 minutes per guest entry; driver receipt polling stops after two minutes. Re-enter the guest booking to restart the observation window.

API paths under /api/staging/deliveries/FD-4821:
- GET ?booking=CSA-0913 returns the current cycle or null.
- POST /complete takes requestId, booking CSA-0913 and lockerId F03. It starts a cycle only if empty or the previous cycle was collected. Retries of the same request cannot recreate a completed cycle.
- POST /seen marks notification receipt.
- POST /unlock and /collect require the current cycleId; collection requires prior unlock. Stale cycles cannot mutate newer deliveries.

Database schema is migration-owned in drizzle/0000_delivery_test.sql. No request-time schema creation. npm test exercises the SQL using node:sqlite; npm run build prepares the Worker artifact. Publish via the Sites workflow, preserving the project ID. The source repository remains managed on its tool-provided main branch; the service itself is staging-only and is separate from the existing public guest Site.

The driver app source backup and connected reference are in ../driver-reference. The connected source was typechecked and saved through the existing Figma Make code editor. Its Preview runs the connection; a separate published Figma URL was not created. The CosaHub source is the active mobile checkout at C:/Users/Asus/.codex/worktrees/48c9/product/mobile. Identity documents remain device-local and never reach this service.

Verified on 22 October 2026:
- SQL service guards/idempotency test passes.
- Connected driver source typecheck passes.
- Guest lint, typecheck, build and reducer tests pass.
- Live connected tests pass on iPhone and Pixel: complete -> notice -> unlock -> collect -> shared database collected and seen.
- Actual Figma Preview action created a new delivery; the actual in-app localhost guest received it; the driver receipt changed from Queued to Guest notified. That delivery is left ready for the user to collect.
