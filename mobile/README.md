# Cōsa · React Native

Expo SDK 57, React Native, TypeScript and Expo Router. Native components render on iOS, Android and web. No HTML prototype or simulated phone-frame runtime is embedded.

## Design source

Reviewed the existing `design/Cosa-Prototype-Local` prototype in the original repository checkout. Those untracked files were absent from this worktree. Current `source/src/Prototype.tsx`, `source/src/prototype.css` and the latest refinements in `source/AGENTS.md` take precedence over outdated Alex / arrival-QR screenshots and README journeys. The current reference is saved in `qa/reference-iphone.jpg`.

Preserved ivory / forest / sage colors, DM Serif Display and DM Sans, Phosphor icons, the original Stay Pass background, Mina's fictional booking, fully online arrival and Hotel navigation. The original artwork and demo luggage QR are copied locally into `assets/cosa/`.

## Scope

- Landing screen with scrollable services and persistent Stay / Hotel / Concierge tabs.
- Six-language landing copy and navigation. Supporting details disclose English fallback.
- Local pre-check-in sheet: sample image selection, preview, replace/remove, type/size checks, booking consent, then demo online arrival. No identity verification or server upload.
- Small luggage demonstration: size/day/hour selection, one sample locker, door confirmation before locking, demo QR unlocking, collection and release. No real availability, camera scanning, hardware integration or payments.
- Supporting hotel directions, housekeeping and shower-status demonstrations, plus scripted concierge replies.
- Café entry is informational; multi-item ordering and the full prototype's recovery / checkout flows are outside this landing-page implementation.

State is in memory and resets on reload. Identity images are never persisted. Sample stay dates remain 23–26 Sep 2026 as supplied by the design.

## Run

```powershell
npm ci
npm run start   # Expo Go / development device
npm run web     # browser preview
```

On Windows, an iOS simulator is unavailable; use a physical device or build on macOS. Native bundle export confirms bundling, not device execution.

## Validation

```powershell
npm run typecheck
npm run lint
npx expo-doctor
npm run build
npx expo export --platform android --output-dir dist-android
npx expo export --platform ios --output-dir dist-ios
```

See `design-qa.md` and `qa/` for browser interactions and visual evidence. Native device testing remains outstanding.
