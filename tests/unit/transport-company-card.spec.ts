import path from "node:path";
import { pathToFileURL } from "node:url";
import React from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

afterEach(() => {
  cleanup();
});

async function loadAppModule() {
  const appPath = path.join("/app", "src", "App.jsx");
  return import(pathToFileURL(appPath).href);
}

describe("transport company card unit contract", () => {
  it("renders transport company cards with the expected header and badges", async () => {
    const { default: App } = await loadAppModule();

    render(React.createElement(App));

    const atlasCard = screen.getByRole("article", {
      name: /atlas freight lines international/i,
    });

    expect(atlasCard).toBeInTheDocument();
    expect(within(atlasCard).getByRole("heading", { name: /atlas freight lines international/i })).toBeInTheDocument();
    expect(within(atlasCard).getByRole("img", { name: /atlas freight lines international logo/i })).toBeInTheDocument();
    expect(within(atlasCard).getByRole("img", { name: /verified company/i })).toBeInTheDocument();
    expect(within(atlasCard).getByText("Verified")).toBeInTheDocument();
    expect(within(atlasCard).getByText("Top Reviewed")).toBeInTheDocument();
    expect(within(atlasCard).getByText("Customer Favorite")).toBeInTheDocument();
    expect(within(atlasCard).getByText("4.6 (214 reviews)")).toBeInTheDocument();
    expect(within(atlasCard).getByText("Trust Score")).toBeInTheDocument();
  });

  it("shows a fallback initial when a company has no logo url", async () => {
    const { default: App } = await loadAppModule();

    render(React.createElement(App));

    const novaCard = screen.getByRole("article", {
      name: /nova transport partners/i,
    });

    expect(within(novaCard).getByLabelText(/nova transport partners initial/i)).toHaveTextContent("N");
    expect(within(novaCard).queryByRole("img", { name: /nova transport partners logo/i })).not.toBeInTheDocument();
  });

  it("derives trust score text and progressbar values from the provided rating data", async () => {
    const { default: App } = await loadAppModule();

    render(React.createElement(App));

    const atlasCard = screen.getByRole("article", {
      name: /atlas freight lines international/i,
    });
    const novaCard = screen.getByRole("article", {
      name: /nova transport partners/i,
    });

    expect(within(atlasCard).getByText("92%")).toBeInTheDocument();
    expect(within(novaCard).getByText("82%")).toBeInTheDocument();

    expect(within(atlasCard).getByRole("progressbar", { name: "Pricing Accuracy" })).toHaveAttribute("aria-valuenow", "94");
    expect(within(atlasCard).getByRole("progressbar", { name: "Communication" })).toHaveAttribute("aria-valuenow", "89");
    expect(within(atlasCard).getByRole("progressbar", { name: "Vehicle Condition" })).toHaveAttribute("aria-valuenow", "91");
  });

  it("renders five stars and three metric rows for the primary company card", async () => {
    const { default: App } = await loadAppModule();

    render(React.createElement(App));

    const atlasCard = screen.getByRole("article", {
      name: /atlas freight lines international/i,
    });

    expect(atlasCard.querySelectorAll(".stars .star")).toHaveLength(5);
    expect(atlasCard.querySelectorAll(".metric-row")).toHaveLength(3);
    expect(within(atlasCard).getByText("94%")).toBeInTheDocument();
    expect(within(atlasCard).getByText("89%")).toBeInTheDocument();
    expect(within(atlasCard).getByText("91%")).toBeInTheDocument();
    expect(atlasCard.querySelector('[data-testid="trust-ring"]')).not.toBeNull();
  });
});
