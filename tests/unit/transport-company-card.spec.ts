/**
 * Unit contract — `tests/unit/transport-company-card.spec.ts`
 *
 * Vitest loads this file via `vitest.config.ts` (`include: ["unit/**/*.spec.ts"]`).
 * Each `describe` block maps to a slice of `instruction.md` so reviewers can
 * navigate behavior quickly:
 *
 * | Section in this file              | Instruction topics exercised                          |
 * | --------------------------------- | ----------------------------------------------------- |
 * | Layout: one semantic card…        | Two companies, `<article>`, `aria-label` = name       |
 * | Card header: logo or fallback…    | Logo `<img>`, Nova initial, `verifiedIconUrl` on `<img>` |
 * | Middle section: highlight badges| Verified / Top Reviewed / Customer Favorite           |
 * | Rating row and stars              | Conditional rating text; `Math.round` filled stars   |
 * | Trust score and quality metrics   | Trust %, `role="progressbar"`, `aria-valuenow`, ring hook |
 *
 * Responsive layout, real keyframe timing, and `getComputedStyle` checks live
 * in `e2e/transport-company-card.spec.ts` (Playwright), not here.
 *
 * Expected company fields mirror `environment/seed/src/companyData.js` (also
 * copied to `/app/src/companyData.js` in the task image). Update both if the
 * seed dataset changes.
 */
import React from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

const SEEDED_ATLAS = {
  logoUrl: "/atlas-logo.svg",
  verifiedIconUrl: "/verified-badge.svg",
} as const;

const SEEDED_NOVA_METRICS = {
  pricingAccuracy: 85,
  communication: 81,
  vehicleCondition: 84,
} as const;

afterEach(() => {
  cleanup();
});

async function loadAppModule() {
  return import("/app/src/App.jsx");
}

describe("Layout: one semantic card per company", () => {
  it("renders two articles whose aria-label names match the seeded companyData.js contract", async () => {
    const { default: App } = await loadAppModule();
    render(React.createElement(App));

    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(2);

    const labels = articles
      .map((el) => el.getAttribute("aria-label"))
      .filter(Boolean)
      .sort();
    expect(labels).toEqual(
      ["Atlas Freight Lines International", "Nova Transport Partners"].sort(),
    );
  });
});

describe("Card header: logo or fallback, title, verified icon", () => {
  it("Atlas: logo image, h2, verified img from verifiedIconUrl, alt Verified company", async () => {
    const { default: App } = await loadAppModule();
    render(React.createElement(App));

    const atlasCard = screen.getByRole("article", {
      name: /atlas freight lines international/i,
    });

    const logo = within(atlasCard).getByRole("img", {
      name: /atlas freight lines international logo/i,
    });
    expect(logo).toHaveAttribute("src", SEEDED_ATLAS.logoUrl);

    expect(
      within(atlasCard).getByRole("heading", { name: /atlas freight lines international/i }),
    ).toBeInTheDocument();

    const verified = within(atlasCard).getByRole("img", { name: /verified company/i });
    expect(verified).toHaveAttribute("src", SEEDED_ATLAS.verifiedIconUrl);
  });

  it("Nova: no logo img, first-letter fallback with initial aria-label", async () => {
    const { default: App } = await loadAppModule();
    render(React.createElement(App));

    const novaCard = screen.getByRole("article", {
      name: /nova transport partners/i,
    });

    expect(
      within(novaCard).queryByRole("img", { name: /nova transport partners logo/i }),
    ).not.toBeInTheDocument();
    expect(within(novaCard).getByLabelText(/nova transport partners initial/i)).toHaveTextContent(
      "N",
    );
  });
});

describe("Middle section: highlight badges", () => {
  it("renders Verified, Top Reviewed, Customer Favorite on each card", async () => {
    const { default: App } = await loadAppModule();
    render(React.createElement(App));

    for (const name of [/atlas freight lines international/i, /nova transport partners/i]) {
      const card = screen.getByRole("article", { name });
      expect(within(card).getByText("Verified")).toBeInTheDocument();
      expect(within(card).getByText("Top Reviewed")).toBeInTheDocument();
      expect(within(card).getByText("Customer Favorite")).toBeInTheDocument();
    }
  });
});

describe("Rating row and stars", () => {
  it("shows formatted rating text when both rating and review count exist", async () => {
    const { default: App } = await loadAppModule();
    render(React.createElement(App));

    const atlasCard = screen.getByRole("article", {
      name: /atlas freight lines international/i,
    });
    const novaCard = screen.getByRole("article", { name: /nova transport partners/i });

    expect(within(atlasCard).getByText("4.6 (214 reviews)")).toBeInTheDocument();
    expect(within(novaCard).getByText("4.1 (88 reviews)")).toBeInTheDocument();
  });

  it("renders five star slots; filled count follows Math.round(averageRating)", async () => {
    const { default: App } = await loadAppModule();
    render(React.createElement(App));

    const atlasCard = screen.getByRole("article", {
      name: /atlas freight lines international/i,
    });
    const novaCard = screen.getByRole("article", { name: /nova transport partners/i });

    expect(atlasCard.querySelectorAll(".stars .star")).toHaveLength(5);
    expect(atlasCard.querySelectorAll(".stars .star.filled")).toHaveLength(Math.round(4.6));

    expect(novaCard.querySelectorAll(".stars .star")).toHaveLength(5);
    expect(novaCard.querySelectorAll(".stars .star.filled")).toHaveLength(Math.round(4.1));
  });
});

describe("Trust score and quality metrics", () => {
  it("derives trust score percent from averageRating and shows Trust Score label", async () => {
    const { default: App } = await loadAppModule();
    render(React.createElement(App));

    const atlasCard = screen.getByRole("article", {
      name: /atlas freight lines international/i,
    });
    const novaCard = screen.getByRole("article", { name: /nova transport partners/i });

    expect(within(atlasCard).getByText("Trust Score")).toBeInTheDocument();
    expect(within(atlasCard).getByText("92%")).toBeInTheDocument();
    expect(within(novaCard).getByText("82%")).toBeInTheDocument();
  });

  it("renders three metric rows with progressbar roles and aria-valuenow from data", async () => {
    const { default: App } = await loadAppModule();
    render(React.createElement(App));

    const atlasCard = screen.getByRole("article", {
      name: /atlas freight lines international/i,
    });

    expect(atlasCard.querySelectorAll(".metric-row")).toHaveLength(3);
    expect(within(atlasCard).getByText("94%")).toBeInTheDocument();
    expect(within(atlasCard).getByText("89%")).toBeInTheDocument();
    expect(within(atlasCard).getByText("91%")).toBeInTheDocument();

    expect(
      within(atlasCard).getByRole("progressbar", { name: "Pricing Accuracy" }),
    ).toHaveAttribute("aria-valuenow", "94");
    expect(
      within(atlasCard).getByRole("progressbar", { name: "Communication" }),
    ).toHaveAttribute("aria-valuenow", "89");
    expect(
      within(atlasCard).getByRole("progressbar", { name: "Vehicle Condition" }),
    ).toHaveAttribute("aria-valuenow", "91");
  });

  it("Nova card exposes the same metric contract", async () => {
    const { default: App } = await loadAppModule();
    render(React.createElement(App));

    const novaCard = screen.getByRole("article", { name: /nova transport partners/i });

    expect(
      within(novaCard).getByRole("progressbar", { name: "Pricing Accuracy" }),
    ).toHaveAttribute("aria-valuenow", String(SEEDED_NOVA_METRICS.pricingAccuracy));
    expect(
      within(novaCard).getByRole("progressbar", { name: "Communication" }),
    ).toHaveAttribute("aria-valuenow", String(SEEDED_NOVA_METRICS.communication));
    expect(
      within(novaCard).getByRole("progressbar", { name: "Vehicle Condition" }),
    ).toHaveAttribute("aria-valuenow", String(SEEDED_NOVA_METRICS.vehicleCondition));
  });

  it("exposes the trust ring hook used by e2e tests", async () => {
    const { default: App } = await loadAppModule();
    render(React.createElement(App));

    const atlasCard = screen.getByRole("article", {
      name: /atlas freight lines international/i,
    });
    expect(atlasCard.querySelector('[data-testid="trust-ring"]')).not.toBeNull();
  });
});
