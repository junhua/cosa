import { test, expect, Page } from "@playwright/test";
import path from "node:path";
import { initialStay } from "../src/stay";

async function choose(page: Page, label: string, value: string) {
  await page.getByRole("button", { name: new RegExp(`^${label}:`) }).click();
  await page.getByRole("radio", { name: value, exact: true }).click();
}
async function start(page: Page, state = initialStay) {
  await page.addInitScript(
    (value) => sessionStorage.setItem("cosa-guest-v3", JSON.stringify(value)),
    { ...state, bookingLinked: true },
  );
  await page.goto("/");
  await page.getByRole("tab", { name: "Staying guest", exact: true }).click();
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
  await page
    .getByRole("button", { name: "Choose document photo", exact: true })
    .click();
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
  await page
    .getByRole("button", { name: "Choose document photo", exact: true })
    .click();
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
  await page.goto("/arrival");
  await expect(
    page.getByRole("heading", { name: "cosahub", exact: true }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Public", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "A little more Cōsa.", exact: true }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Staying guest", exact: true }).click();
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
  await page.reload();
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
  await page.getByRole("tab", { name: "Staying guest", exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: "Reference booking ID", exact: true }),
  ).toHaveValue("");
});
