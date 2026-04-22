/**
 * E2E suite — `tests/e2e/transport-company-card.spec.ts`
 *
 * Playwright drives the Vite dev server from `/app` (see `playwright.config.ts`).
 * Nested `test.describe` blocks group behaviors for reviewers:
 *
 * | Block                              | Focus                                              |
 * | ---------------------------------- | -------------------------------------------------- |
 * | Card multiplicity and identity     | Two `article` regions, seeded company names        |
 * | Atlas header and surface chrome    | Logo box CSS, ellipsis, badges, rating row visible |
 * | Nova logo fallback                 | No `.company-logo`, initial glyph                  |
 * | Trust score display                | Strong percentage text in UI                     |
 * | Trust ring animation               | `ring-fill` keyframe + stroke motion               |
 * | Metric bars and keyframes          | `metric-grow` + `stripes`, bar growth              |
 * | Responsive narrow viewport         | `flex-wrap`, metric text alignment                 |
 *
 * DOM/data contracts (roles, `aria-valuenow`, exact copy) are duplicated in
 * `unit/transport-company-card.spec.ts` for fast Vitest feedback.
 */
import { expect, test } from "@playwright/test";

test.describe("transport company card", () => {
  test.describe("card multiplicity and identity", () => {
    test("renders one article per seeded company (two cards total)", async ({ page }) => {
      await page.goto("/");
      await expect(page.getByRole("article")).toHaveCount(2);
      await expect(
        page.getByRole("article", { name: /atlas freight lines international/i }),
      ).toBeVisible();
      await expect(page.getByRole("article", { name: /nova transport partners/i })).toBeVisible();
    });
  });

  test.describe("atlas header and surface chrome", () => {
    test("renders the full company card structure with header details", async ({ page }) => {
      await page.goto("/");

      const atlasCard = page.getByRole("article", { name: /atlas freight lines international/i });
      await expect(atlasCard).toBeVisible();

      const logoBox = atlasCard.locator(".logo-box");
      const companyName = atlasCard.locator("h2");
      const ratingRow = atlasCard.locator(".rating-row");

      await expect(logoBox).toHaveCSS("background-color", "rgb(255, 255, 255)");
      await expect(logoBox).toHaveCSS("border-top-style", "solid");
      await expect(atlasCard.getByRole("img", { name: /atlas freight lines international logo/i })).toBeVisible();
      await expect(atlasCard.getByRole("img", { name: /verified company/i })).toBeVisible();
      await expect(companyName).toHaveCSS("white-space", "nowrap");
      await expect(companyName).toHaveCSS("text-overflow", "ellipsis");
      await expect(ratingRow).toBeVisible();
      await expect(atlasCard.locator(".stars .star")).toHaveCount(5);
      await expect(atlasCard.getByText("Verified", { exact: true })).toBeVisible();
      await expect(atlasCard.getByText("Top Reviewed", { exact: true })).toBeVisible();
      await expect(atlasCard.getByText("Customer Favorite", { exact: true })).toBeVisible();
      await expect(atlasCard.getByText("Trust Score", { exact: true })).toBeVisible();
      await expect(atlasCard.getByRole("progressbar", { name: "Pricing Accuracy" })).toBeVisible();
      await expect(atlasCard.getByRole("progressbar", { name: "Communication" })).toBeVisible();
      await expect(atlasCard.getByRole("progressbar", { name: "Vehicle Condition" })).toBeVisible();
      await expect(atlasCard.getByText("4.6 (214 reviews)", { exact: true })).toBeVisible();
    });
  });

  test.describe("nova logo fallback", () => {
    test("shows the fallback initial when no logo URL exists", async ({ page }) => {
      await page.goto("/");

      const fallbackCard = page.getByRole("article", { name: /nova transport partners/i });
      await expect(fallbackCard).toBeVisible();
      await expect(fallbackCard.getByLabel(/nova transport partners initial/i)).toHaveText("N");
      await expect(fallbackCard.locator(".company-logo")).toHaveCount(0);
    });
  });

  test.describe("trust score display", () => {
    test("derives and displays the trust score from the average rating", async ({ page }) => {
      await page.goto("/");

      const atlasCard = page.getByRole("article", { name: /atlas freight lines international/i });
      const fallbackCard = page.getByRole("article", { name: /nova transport partners/i });

      await expect(atlasCard.locator(".trust-score-text strong")).toHaveText("92%");
      await expect(fallbackCard.locator(".trust-score-text strong")).toHaveText("82%");
    });
  });

  test.describe("trust ring animation", () => {
    test("includes a divided summary section with an animated circular trust ring", async ({ page }) => {
      await page.goto("/");

      const atlasCard = page.getByRole("article", { name: /atlas freight lines international/i });
      const summarySection = atlasCard.locator(".summary-section");
      const ringProgress = atlasCard.locator(".ring-progress");

      await expect(summarySection).toHaveCSS("border-top-style", "solid");
      await expect(summarySection).toHaveCSS("justify-content", "flex-start");
      await expect(atlasCard.getByTestId("trust-ring")).toBeVisible();
      await expect(ringProgress).toHaveCSS("animation-name", "ring-fill");

      await page.waitForTimeout(1700);

      const ringOffset = await ringProgress.evaluate((node) => getComputedStyle(node).strokeDashoffset);
      expect(Number.parseFloat(ringOffset)).toBeLessThan(60);
    });
  });

  test.describe("metric bars and keyframes", () => {
    test("renders the three metric rows with labels, values, and animated striped bars", async ({ page }) => {
      await page.goto("/");

      const atlasCard = page.getByRole("article", { name: /atlas freight lines international/i });
      const metricRows = atlasCard.locator(".metric-row");
      const pricingBar = atlasCard
        .getByRole("progressbar", { name: "Pricing Accuracy" })
        .locator(".metric-bar-fill");

      await expect(metricRows).toHaveCount(3);
      await expect(atlasCard.locator(".metric-value")).toHaveText(["94%", "89%", "91%"]);
      await expect(atlasCard.getByRole("progressbar", { name: "Pricing Accuracy" })).toHaveAttribute("aria-valuenow", "94");
      await expect(atlasCard.getByRole("progressbar", { name: "Communication" })).toHaveAttribute("aria-valuenow", "89");
      await expect(atlasCard.getByRole("progressbar", { name: "Vehicle Condition" })).toHaveAttribute("aria-valuenow", "91");

      const stripeAnimation = await pricingBar.evaluate((node) => getComputedStyle(node).animationName);
      expect(stripeAnimation).toContain("stripes");
      expect(stripeAnimation).toContain("metric-grow");

      await page.waitForTimeout(1700);
      const pricingWidth = await pricingBar.evaluate((node) => node.getBoundingClientRect().width);
      expect(pricingWidth).toBeGreaterThan(150);
    });
  });

  test.describe("responsive narrow viewport", () => {
    test("keeps badges wrappable and metric values readable on narrow screens", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/");

      const atlasCard = page.getByRole("article", { name: /atlas freight lines international/i });
      const badgeRow = atlasCard.locator(".badge-row");
      const communicationValue = atlasCard.locator(".metric-row").nth(1).locator(".metric-value");

      await expect(badgeRow).toHaveCSS("flex-wrap", "wrap");
      await expect(communicationValue).toHaveText("89%");
      await expect(communicationValue).toHaveCSS("text-align", "left");
    });
  });
});
