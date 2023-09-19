import { test, expect } from "@playwright/test";

test("posts", async ({ page }) => {
  await page.goto("/how-to-run-go-plugin-runner-in-apisix-ingress");

  // Post title
  // const title = await page.locator(
  //   'h1:has-text("How to run go plugin runner with Apisix-Ingress-controller")'
  // );
  // expect(await title.isVisible()).toBe(true);

  // Content
  // const aParagraph = await page.locator("text=APISIX Ingress environment");
  // expect(await aParagraph.isVisible());

  // Subscribe button
  const subButton = await page.locator('[value="Subscribe"]');
  expect(await subButton.isVisible());

  // Code block
  const codeBlock = await page.locator('span:has-text("move_by_offset")');
  expect(await codeBlock.isVisible());
});
