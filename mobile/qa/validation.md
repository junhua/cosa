# Validation — clean local guest flow

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
