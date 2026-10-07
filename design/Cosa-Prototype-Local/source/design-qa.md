# Cōsa design QA

final result: passed

## Evidence

- Source visual truth: `reference/selected-stay-pass.png`, the first displayed concept selected by the user.
- First implementation comparison: `qa/comparison.png`.
- Final browser-rendered implementation: `qa/home-final.png`.
- Final combined comparison: `qa/comparison-final.png`.
- State: initial arrival, English, fictional Alex booking, pre-check-in complete, no luggage reserved.
- Native app viewport: 393 × 852 CSS pixels at device pixel ratio 1. A same-origin QA viewer provides an unmodified 1400 × 1200 iframe viewport so the protected phone runtime renders at scale 1. The browser measured the phone screen at exactly 393 × 852 before capture. The outer viewer offsets the iframe vertically so the entire phone screen is captured by the cloud browser without resizing the app or its runtime.
- Source raster: 853 × 1844; normalized to 393 × 852 for comparison. Implementation crop: 393 × 852. Runtime-owned status bar, camera cutout, bezel-edge masking and home indicator are expected differences from the chrome-free reference.

## Comparison history

The initial paired comparison found a P2 issue: the concierge helper line met the fixed bottom navigation. Reduced the home header gap, date spacing, pass height and concierge-row padding. The subsequent browser capture and combined comparison show the concierge entry and navigation clearly separated. The pass's low-contrast subtitle was also corrected during implementation before the final comparison.

## Required fidelity surfaces

- Typography: local DM Serif Display and DM Sans preserve the serif greeting and clean UI hierarchy. Text is readable with no material clipping. Minor serif shape/weight differences are P3.
- Spacing and layout: pass, primary arrival action, luggage row and concierge row preserve the selected ordering and proportions. Vertical spacing accommodates protected native chrome. Persistent navigation remains accessible; longer secondary screens scroll above it.
- Palette: ivory, forest green and sage match the selected design. Pass text has adequate visual separation from the dark background.
- Images and icons: generated pass background preserves the tactile green surface and leaf motif. Phosphor icons provide the standard UI symbols. QR PNGs are generated from explicitly labelled demo data using a QR library. No fabricated SVG/image substitutes are used.
- Copy: initial screen matches the selected concept. Later screens use coherent arrival, storage, room, service and departure states, with simulation limitations labelled at consequential demo actions.
- Full-view evidence is the combined comparison. A separate focused crop was unnecessary because both 393px views are directly readable in that comparison.

## Primary interactions verified in the cloud browser

- Booking confirmation checkbox gates the arrival pass; kiosk simulation completes arrival.
- Luggage reservation, tag printing, bag deposit, door confirmation and stored status.
- Room readiness activates access; demo door unlock.
- Checkout confirmation ends room access while keeping stored-luggage collection available.
- Collection QR releases the assigned locker; explicit bag collection completes storage.
- Typed concierge message and send; reply correctly reports that room access ended after checkout.
- Food demo order, delivered status and collection confirmation.
- Navigation throughout the above journey.

Build and all 28 protected runtime integrity checks pass. Browser logs checked: browser-extension metadata errors occurred; no current app-origin runtime error was observed during the verified journey. Early missing QR requests were resolved by generating the QR assets and reloading.

## Limitations and follow-up polish

- P3: minor font and icon geometry differences from the generated reference.
- External AI, RFID, lockers, keys, payments and logistics are simulated. No production integrations or persistence are claimed.
- Other secondary service paths and the alternate Pixel device remain available but have not received exhaustive end-to-end testing.
- Runtime transition animations briefly retain departing screen nodes; tests scope/sequence active controls appropriately.

## Implementation checklist

- [x] Selected design implemented with local fonts and real assets.
- [x] Native-size browser comparison captured and reviewed.
- [x] P2 concierge-row overlap fixed and re-captured.
- [x] Primary arrival-to-departure journey tested.
- [x] Runtime integrity and production build checked.
