import { test, expect, Page } from "@playwright/test";
import path from "node:path";
import { initialStay } from "../src/stay";

async function choose(page: Page, label: string, value: string) {
  await page.getByRole("button", { name: new RegExp(`^${label}:`) }).click();
  await page.getByRole("radio", { name: value, exact: true }).click();
}
async function start(page: Page, state = initialStay, connected = false) {
  if (!connected)
    await page.route(
      "https://cosahub-delivery-staging.aiitpelective2005.chatgpt.site/**",
      (route) =>
        route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({ delivery: null }),
        }),
    );
  await page.addInitScript(
    (value) => sessionStorage.setItem("cosa-guest-v3", JSON.stringify(value)),
    { ...state, bookingLinked: true },
  );
  await page.goto("/", { waitUntil: "commit" });
  await page
    .getByRole("textbox", { name: "Reference booking ID", exact: true })
    .fill("CSA-0913");
  await page
    .getByRole("button", { name: "Continue to my stay", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Welcome, Mina.", exact: true }),
  ).toBeVisible();
}

test("hotel cubicle availability shows showers and toilets without time selectors", async ({
  page,
}, testInfo) => {
  await start(page);
  await page.getByRole("tab", { name: "Hotel", exact: true }).click();
  await page
    .getByRole("button", {
      name: /Shower availability View cubicle availability/,
    })
    .click();
  await expect(page.getByText("Male cubicles", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Female cubicles", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /^Time of day:/ })).toHaveCount(
    0,
  );
  await expect(
    page.getByText("Male 2/2 · Female 1/2 available. No reservation needed.", {
      exact: true,
    }),
  ).toBeVisible();
  await page.screenshot({
    path: `qa/shower-availability-current-${testInfo.project.name}.png`,
    fullPage: true,
  });
  for (const [floor, counts] of [
    [1, "Male 1/2 · Female 2/2"],
    [2, "Male 2/2 · Female 1/2"],
    [3, "Male 0/2 · Female 1/2"],
    [4, "Male 1/2 · Female 2/2"],
  ] as const) {
    await page
      .getByRole("radio", { name: new RegExp(`^Level ${floor}:`) })
      .click();
    await expect(
      page.getByRole("heading", {
        name: `Level ${floor} cubicles`,
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByText(`${counts} available. No reservation needed.`, {
        exact: true,
      }),
    ).toBeVisible();
    for (const suffix of ["01", "02", "03", "04"]) {
      await expect(
        page.getByText(`S${floor}${suffix}`, { exact: true }),
      ).toBeVisible();
    }
  }
  await page.screenshot({
    path: `qa/shower-levels-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page
    .getByText("Female cubicles", { exact: true })
    .scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `qa/shower-level-details-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Back to previous screen", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: /Toilet availability View cubicle availability/,
    })
    .click();
  await expect(page).toHaveURL(/\/toilets$/);
  await expect(page.getByText("Male cubicles", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Female cubicles", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /^Time of day:/ })).toHaveCount(
    0,
  );
  await expect(
    page.getByText("Male 1/2 · Female 1/2 available. No reservation needed.", {
      exact: true,
    }),
  ).toBeVisible();
  for (const id of ["T201", "T202", "T203", "T204"]) {
    await expect(page.getByText(id, { exact: true })).toBeVisible();
  }
  await expect(page.getByText("In use", { exact: true })).toBeVisible();
  await expect(page.getByText("Cleaning", { exact: true })).toBeVisible();
  await page.screenshot({
    path: `qa/toilet-availability-${testInfo.project.name}.png`,
    fullPage: true,
  });
  for (const [floor, counts] of [
    [1, "Male 1/2 · Female 2/2"],
    [2, "Male 1/2 · Female 1/2"],
    [3, "Male 2/2 · Female 0/2"],
    [4, "Male 0/2 · Female 2/2"],
  ] as const) {
    await page
      .getByRole("radio", { name: new RegExp(`^Level ${floor}:`) })
      .click();
    await expect(
      page.getByRole("heading", {
        name: `Level ${floor} cubicles`,
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByText(`${counts} available. No reservation needed.`, {
        exact: true,
      }),
    ).toBeVisible();
    for (const suffix of ["01", "02", "03", "04"]) {
      await expect(
        page.getByText(`T${floor}${suffix}`, { exact: true }),
      ).toBeVisible();
    }
  }
  await page.screenshot({
    path: `qa/toilet-levels-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page
    .getByText("Female cubicles", { exact: true })
    .scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `qa/toilet-level-details-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Back to previous screen", exact: true })
    .click();
  await expect(page).toHaveURL(/\/hotel$/);
  await page.screenshot({
    path: `qa/hotel-toilet-entry-${testInfo.project.name}.png`,
    fullPage: true,
  });
});

test("connected driver delivery reaches guest and collection releases the shared locker", async ({
  page,
  request,
}, testInfo) => {
  const service =
    "https://cosahub-delivery-staging.aiitpelective2005.chatgpt.site/api/staging/deliveries/FD-4821";
  await start(page, initialStay, true);
  const complete = await request.post(`${service}/complete`, {
    data: {
      requestId: crypto.randomUUID(),
      booking: "CSA-0913",
      lockerId: "F03",
    },
  });
  expect(complete.ok()).toBeTruthy();
  const notice = page.getByRole("button", {
    name: "Food delivered · locker F03 · view collection",
    exact: true,
  });
  await expect(notice).toBeVisible({ timeout: 15000 });
  await notice.screenshot({
    path: `qa/connected-delivery-notice-${testInfo.project.name}.png`,
  });
  await notice.click();
  await expect(page.getByText("FD-4821", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Scan QR to unlock food locker", exact: true })
    .click();
  await expect(
    page.getByText("Take all your food and leave the locker door open.", {
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Food collected successfully", exact: true })
    .click();
  await expect(
    page.getByText(/Food collected successfully · locker F03 is available/),
  ).toBeVisible();
  const state = await (await request.get(`${service}?booking=CSA-0913`)).json();
  expect(state.delivery.status).toBe("collected");
  expect(state.delivery.notificationSeen).toBe(true);
  await page.screenshot({
    path: `qa/connected-delivery-collected-${testInfo.project.name}.png`,
    fullPage: true,
  });
});

test("food delivery notice leads to directions, QR unlock and leave-open collection", async ({
  page,
}, testInfo) => {
  await start(page);
  await page
    .getByRole("button", {
      name: "No food order yet External-party delivery & pickup",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Send sample food delivery", exact: true })
    .scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `qa/sample-food-delivery-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Send sample food delivery", exact: true })
    .click();
  const notice = page.getByRole("button", {
    name: "Food delivered · locker F03 · view collection",
    exact: true,
  });
  await expect(notice).toBeVisible();
  await notice.screenshot({
    path: `qa/food-locker-notice-${testInfo.project.name}.png`,
  });
  await notice.click();
  await expect(
    page.getByRole("heading", { name: "Your food has arrived.", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Directions to locker F03", exact: true })
    .click();
  await expect(
    page.getByText("Go to the Level 1 lobby.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Find locker F03 and scan the QR below at its reader.", {
      exact: true,
    }),
  ).toBeVisible();
  const directionPictures = page.getByRole("img", {
    name: /^Food locker directions, step/,
  });
  await expect(directionPictures).toHaveCount(3);
  for (let step = 0; step < 3; step++) {
    const pictureCard = directionPictures.nth(step).locator("../../..");
    await pictureCard.scrollIntoViewIfNeeded();
    await pictureCard
      .locator("img")
      .evaluateAll((images) =>
        Promise.all(
          images.map((image) => (image as HTMLImageElement).decode()),
        ),
      );
    await pictureCard.screenshot({
      path: `qa/food-locker-direction-${step + 1}-${testInfo.project.name}.png`,
    });
  }
  await expect(
    page.getByRole("img", { name: "Food locker collection QR", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Scan QR to unlock food locker", exact: true })
    .scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `qa/food-locker-qr-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Scan QR to unlock food locker", exact: true })
    .click();
  await expect(
    page.getByText("Take all your food and leave the locker door open.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByRole("checkbox")).toHaveCount(0);
  await expect(
    page.getByText(/The lock remains unlocked\. When you have everything/),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Lock & collect later", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Food collected successfully", exact: true })
    .scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `qa/food-locker-unlocked-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Food collected successfully", exact: true })
    .click();
  await expect(
    page.getByText(
      "Food collected successfully · locker F03 is available for the next delivery.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: "Food locker collection QR", exact: true }),
  ).toHaveCount(0);
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(sessionStorage.getItem("cosa-guest-v3") || "{}").foodLocker
            ?.status,
      ),
    )
    .toBe("collected");
  await page.screenshot({
    path: `qa/food-locker-collected-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Send sample food delivery", exact: true })
    .click();
  await expect(notice).toBeVisible();
});

test("food lockers never invent a delivery in a fresh stay", async ({
  page,
}) => {
  await start(page);
  await expect(
    page.getByRole("button", { name: /Food delivered · locker/ }),
  ).toHaveCount(0);
  await page
    .getByRole("button", {
      name: "No food order yet External-party delivery & pickup",
      exact: true,
    })
    .click();
  await expect(
    page.getByText(/No food deliveries are waiting for collection/),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: "Food locker collection QR", exact: true }),
  ).toHaveCount(0);
});

test("check-in requires consent and a readable photo, then room becomes ready automatically", async ({
  page,
}) => {
  await start(page);
  await page
    .getByRole("button", { name: "Complete pre-check-in", exact: true })
    .click();
  const save = page.getByRole("button", {
    name: "Save pre-check-in",
    exact: true,
  });
  await expect(save).toBeDisabled();
  await choose(page, "Expected arrival on 23 Sep", "11pm–12am");
  await page
    .getByRole("checkbox", {
      name: "The booking details are correct.",
      exact: true,
    })
    .click();
  let chooser = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Upload file", exact: true }).click();
  await (
    await chooser
  ).setFiles({
    name: "broken.png",
    mimeType: "image/png",
    buffer: Buffer.from("invalid image"),
  });
  await expect(
    page.getByText(
      "This image could not be opened. Please choose another photo.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(save).toBeDisabled();
  chooser = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Upload file", exact: true }).click();
  await (await chooser).setFiles(path.resolve("assets/cosa/qr-collection.png"));
  await expect(page.getByText("Photo ready", { exact: true })).toBeVisible();
  await save.click();
  await expect(
    page.getByRole("img", { name: "Selected identity document preview" }),
  ).toHaveCount(0);
  await page
    .getByRole("button", {
      name: "I’ve arrived · check in online",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "View room readiness & access", exact: true })
    .click();
  await page.getByRole("button", { name: "Unlock room", exact: true }).click();
  await expect(page.getByText("Door unlocked", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /Demo:/ })).toHaveCount(0);
});

test("checkout preserves stored luggage until the empty locker is closed", async ({
  page,
}) => {
  await start(page, {
    ...initialStay,
    prechecked: true,
    arrived: true,
    ready: true,
    bag: "stored",
  });
  await page
    .getByRole("button", {
      name: "Check out Review your stay and luggage plans",
      exact: true,
    })
    .click();
  await page
    .getByRole("checkbox", {
      name: "I have removed my belongings and left the capsule.",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Review checkout", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Confirm checkout", exact: true })
    .click();
  await expect(page.getByText(/Checkout confirmed · CO-0913/)).toBeVisible();
  await page
    .getByRole("button", {
      name: "Your bags are still with us L08 · collect with your luggage QR",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Scan QR to unlock", exact: true })
    .click();
  const finish = page.getByRole("button", {
    name: "Finish collection",
    exact: true,
  });
  await expect(finish).toBeDisabled();
  await page
    .getByRole("checkbox", {
      name: "I have removed all my luggage.",
      exact: true,
    })
    .click();
  await expect(finish).toBeDisabled();
  await page
    .getByRole("checkbox", {
      name: "I have closed the empty locker door.",
      exact: true,
    })
    .click();
  await finish.click();
  await expect(
    page.getByText("Luggage collected · locker released", { exact: true }),
  ).toBeVisible();
});

test("café retains basket items and advances to pickup without guest status controls", async ({
  page,
}) => {
  await start(page);
  await page.clock.install();
  await page
    .getByRole("button", {
      name: "Food & delivery Coffee, pastries & quick bites",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Add Flat white", exact: true })
    .click();
  await page.getByRole("tab", { name: "Quick bites", exact: true }).click();
  await page
    .getByRole("button", { name: "Add Butter croissant", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "Review basket · 2 items · S$9.30",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "Place order", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Made fresh for you." }),
  ).toBeVisible();
  await page.clock.runFor(301000);
  await expect(page.getByRole("img", { name: "Café pickup QR" })).toBeVisible();
  await page
    .getByRole("button", { name: "Confirm order collected", exact: true })
    .click();
  await expect(
    page.getByText("Order collected · thank you!", { exact: true }),
  ).toBeVisible();
});

test("hotel help saves and cancels a request", async ({ page }) => {
  await start(page);
  await page
    .getByRole("button", {
      name: "Hotel information & help Wi-Fi, directions, towels & repairs",
      exact: true,
    })
    .click();
  await page
    .getByRole("textbox", { name: "Request notes", exact: true })
    .fill("One towel please");
  await page.getByRole("button", { name: "Send request", exact: true }).click();
  await expect(page.getByText("Request saved", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Cancel request", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Send request", exact: true }),
  ).toBeVisible();
});

test("booking gate protects guest routes and opens the welcome page after lookup", async ({
  page,
}) => {
  await page.goto("/arrival", { waitUntil: "commit" });
  await expect(
    page.getByRole("heading", { name: "cosahub", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("tab", { name: "Public", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("img", { name: "CosaHub Capsule Hotel logo" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Find your stay." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Continue to my stay", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("textbox", { name: "Reference booking ID", exact: true })
    .fill("UNKNOWN");
  await page
    .getByRole("button", { name: "Continue to my stay", exact: true })
    .click();
  await expect(
    page.getByText("Finding your stay…", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/We couldn’t find that booking/)).toBeVisible();
  await page
    .getByRole("textbox", { name: "Reference booking ID", exact: true })
    .fill("CSA-0913");
  await page
    .getByRole("button", { name: "Continue to my stay", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Welcome, Mina.", exact: true }),
  ).toBeVisible();
  await page.reload({ waitUntil: "commit" });
  await expect(
    page.getByRole("heading", { name: "cosahub", exact: true }),
  ).toBeVisible();
});

test("idle guest sessions return to CosaHub and require the reference again", async ({
  page,
}) => {
  await page.clock.install();
  await start(page);
  await page.clock.runFor(5 * 60 * 1000);
  await expect(
    page.getByRole("heading", { name: "cosahub", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Reference booking ID", exact: true }),
  ).toHaveValue("");
});

test("London food places show illustrations, external links and retain the café basket", async ({
  page,
}, testInfo) => {
  await page.goto("/", { waitUntil: "commit" });
  await expect(
    page.getByRole("textbox", { name: "Reference booking ID", exact: true }),
  ).toBeVisible({ timeout: 30000 });
  await page.screenshot({
    path: `qa/booking-food-landing-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await start(page);
  await page
    .getByRole("button", {
      name: "Food & delivery Coffee, pastries & quick bites",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Add Flat white", exact: true })
    .click();
  await page.getByRole("tab", { name: "External party", exact: true }).click();
  for (const name of [
    "Din Tai Fung Centre Point",
    "Nando’s Soho",
    "GAIL’s Soho",
  ]) {
    await page
      .getByRole("button", { name: `Show ${name} on map`, exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", {
        name: `Explore menu & ordering at ${name} (external website)`,
        exact: true,
      }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", {
        name: `Find ${name} on map (external website)`,
        exact: true,
      }),
    ).toHaveCount(0);
    const card = page
      .getByRole("heading", { name, exact: true })
      .locator("../..");
    await card.scrollIntoViewIfNeeded();
    await card
      .locator("img")
      .evaluateAll((images) =>
        Promise.all(
          images.map((image) => (image as HTMLImageElement).decode()),
        ),
      );
    await card.screenshot({
      path: `qa/piccadilly-food-map-${name.split(" ")[0].replace(/[^a-z]/gi, "")}-${testInfo.project.name}.png`,
    });
  }
  await expect(page.getByRole("img", { name: /^Illustrative/ })).toHaveCount(1);
  const map = page.getByLabel("Piccadilly Circus food map, 1 km radius", {
    exact: true,
  });
  await map.scrollIntoViewIfNeeded();
  await map
    .locator("img")
    .evaluateAll((images) =>
      Promise.all(images.map((image) => (image as HTMLImageElement).decode())),
    );
  await map.screenshot({
    path: `qa/piccadilly-food-map-${testInfo.project.name}.png`,
  });
  const offer = page.getByRole("link", {
    name: "5% guest discount offer preview. Continue to Uber Eats (external website)",
    exact: true,
  });
  await expect(offer).toBeVisible();
  await offer.screenshot({
    path: `qa/piccadilly-food-discount-${testInfo.project.name}.png`,
  });
  await page.route("https://www.ubereats.com/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "Uber Eats handoff verified",
    }),
  );
  const popup = page.waitForEvent("popup");
  await offer.click();
  const deliveryPage = await popup;
  await expect(deliveryPage).toHaveURL(
    "https://www.ubereats.com/gb/city/london-eng",
  );
  await deliveryPage.close();
  await expect(
    page.getByText(
      "Explore a few London favourites within 1 km of Piccadilly Circus.",
      { exact: true },
    ),
  ).toBeVisible();
  await page.screenshot({
    path: `qa/london-food-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("tab", { name: "Cosa coffee bar", exact: true }).click();
  await expect(
    page.getByRole("button", { name: /Review basket · 1 items/ }),
  ).toBeEnabled();
});
