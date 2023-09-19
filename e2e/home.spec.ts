import { test, expect } from "@playwright/test";

test("index page renders", async ({ page }) => {
  await page.goto("/");

  // Intro bio
  const bio = await page.locator("text=Hi, I am Chenwei Jiang(Chever John).");
  expect(await bio.isVisible()).toBe(true);

  // Bio image
  const bioImage = await page.locator('[alt="Chever John."]');
  expect(await bioImage.isVisible()).toBe(true);
});
