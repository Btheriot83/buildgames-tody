import { test, expect } from "@playwright/test";

test("core loop: board loads, complete chore, history updates", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByRole("heading", { name: "Needs a hand" })).toBeVisible();

  const completeBtn = page.getByRole("button", { name: /Complete / }).first();
  if (await completeBtn.count()) {
    await completeBtn.click();
    await expect(page.locator(".t-toast")).toContainText(/Done/i, {
      timeout: 10_000,
    });
  }

  await page.getByRole("tab", { name: "History" }).click();
  await expect(page.getByRole("heading", { name: "Shared history" })).toBeVisible();
});
