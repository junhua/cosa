# Repository Guidelines

## Current App and Local Preview — 28 October 2026

The current guest app is the Expo/React Native project in `mobile/`. Read `mobile/AGENTS.md` and `mobile/README.md` for its requirements and commands. The `design/Cosa-Prototype-Local/` project described below is the older design prototype; its instructions apply only when working on that prototype.

When asked to open, refresh, or update the localhost app for testing:

- Fetch `origin` and compare the checkout with `origin/staging` (the default for latest development updates), unless the user names another branch. Bring in newer commits with a fast-forward where safe; preserve local changes and report any conflict instead of resetting or discarding work.
- Serve `mobile/` at `http://localhost:8081/` using `npm run web -- --port 8081 --localhost`. Confirm the listening process belongs to this folder. Do not serve the older Vite prototype or packaged export for this request.
- Keep Expo file watching and Fast Refresh enabled; do not set `CI=1` for an interactive test server. Reinstall locked dependencies when the dependency lock changes, and restart the server when configuration or dependencies require it.
- Reload the browser after synchronization and verify the current app renders. The current opening page is CosaHub / Find your stay with a booking-reference field (`CSA-0913` for the local sample).
- Verify both the served app folder and fetched commit before saying the preview is current. File watching updates local edits; it does not fetch remote commits. Perform the remote check on each requested preview update rather than claiming continuous remote synchronization.

## Project Structure & Module Organization

Paths below are relative to the `product/` repository. The current project is an interactive frontend prototype with a packaged local export and editable React/TypeScript source.

- `design/Cosa-Prototype-Local/index.html` and `assets/`: packaged app that opens directly in Chrome or Edge without installation. Keep the HTML and assets together.
- `design/Cosa-Prototype-Local/preview-full.html` and `qa-view.html`: larger preview and embedded design-review wrappers.
- `design/Cosa-Prototype-Local/README.txt`: current local-package instructions and feature summary.
- `design/Cosa-Prototype-Local/source/` (`source/` below): editable Vite project.
- `source/src/Prototype.tsx` and `source/src/prototype.css`: application journeys, state, and styling.
- `source/src/mobile/` and `source/src/mobile/COMPONENTS.md`: shared device runtime and component contract.
- `source/public/assets/`: app images, QR images, and protected device assets.
- `source/tests/`: Playwright runtime tests, fixtures, and Node worker/output tests.
- `source/reference/`, `source/qa/`, and `source/design-qa.md`: design references and historical visual evidence.
- `documentation/AI ITP/`: Obsidian vault, currently containing the starter `Welcome.md` and `.obsidian/` settings. Do not treat personal workspace settings as product requirements.

Edit the source rather than bundled assets. Source builds produce `source/dist/`; they do not refresh the parent local export automatically. The packaged export uses relative paths and a deferred browser script, while the source retains hosted-app settings. Refreshing the export requires an explicit packaging step and a direct-file browser check; do not alter protected runtime files to make a local export.

## Current Product Scope

Read `source/AGENTS.md` in full before prototype changes; its current product requirements supersede older refinement notes. Preserve the ivory/forest Cōsa design and Mina's demo stay.

Core flows include online pre-check-in with local NRIC/passport image selection, one locker per traveller with drop-off-only scheduling and QR lock/collection actions, room access, and reviewed checkout. Hotel presents Directions, Housekeeping, then Shower Availability, with no amenity reservations. Food & Delivery opens a multi-item Cōsa Coffee Bar basket for lobby pickup. English, Japanese, Simplified Chinese, Malay, Korean, and French cover navigation/key stay screens with disclosed English fallback. Delivery & Logistics and the dedicated View luggage pass shortcuts are removed.

All operational actions remain simulated. Browser session state survives reloads; identity images remain local and are not persisted. The source README and design QA describe earlier iterations, so do not use their old tag-printing, kiosk, amenity-booking, or single-item ordering descriptions as current requirements or current test evidence.

## Build, Test, and Development Commands

Run from `design/Cosa-Prototype-Local/source/`:

- `npm ci`: install locked dependencies.
- `npm run dev`: start Vite after the automatic runtime integrity check.
- `npm run check:runtime`: verify protected files against `mobile-runtime.lock.json`.
- `npm run build`: check runtime integrity, type-check, and generate `dist/client` plus the Sites-ready worker output.
- `npm run test:runtime`: run Playwright interaction tests against the runtime fixture; install Playwright Chromium if it is unavailable. `MOBILE_RUNTIME_TEST_PORT` overrides the default test port `4174`.
- `npm run test:sites`: run Node worker and output tests; build first.
- `npm run update:runtime-lock`: regenerate runtime hashes only after an explicitly requested runtime change and verification; never use it to bypass a failed check.

## Coding Style & Editing Boundaries

Use functional React components and strict TypeScript. Name components PascalCase and functions/variables camelCase. Follow existing formatting; use two-space indentation for new multiline code. No dedicated lint or formatting script is configured.

App work belongs in `src/Prototype.tsx` and `src/prototype.css`. Read `source/AGENTS.md` for protected files and `source/src/mobile/COMPONENTS.md` before composing runtime UI. Preserve device chrome, keyboard behavior, scrolling, and integrity checks. Keep session-state migration compatible with older demo stays.

## Validation Guidelines

For implementation changes, run the integrity check, build, and relevant tests before handoff. Playwright tests exercise the shared runtime; they do not establish end-to-end coverage of the guest journeys. Manually inspect changed journeys on both iPhone and Pixel presets and record fresh visual evidence for UI changes. For documentation-only changes, verify paths, commands, and claims against the files; a full application build is unnecessary. Do not claim historical screenshots verify new behavior.

## Commit & Pull Request Guidelines

Use concise imperative subjects, such as `Fix luggage collection confirmation`. Pull requests should describe changed behavior, validation, related issues, and screenshots for visual changes. Consolidate features on `staging` for internal alignment and testing; use `main` for stakeholder UAT.

## Backend, Deployment & Security

The backend architecture decision is Cloudflare Workers and D1 with free-tier resources only. The current folder contains a static Sites worker, not an implemented guest backend or D1 schema; source `.openai/hosting.json` has no D1/R2 binding configured. Do not describe planned infrastructure as already deployed.

When implementing backend environments, maintain separate staging and production Workers and D1 databases, linked to `staging` and `main` respectively. Keep configuration, secrets, and data separate. Do not introduce paid resources or upgrades. Deploy or publish only when requested, preserving the existing Site and audience where applicable. Never commit credentials or personal identity documents, and preserve local identity-image handling and simulation disclosures.
