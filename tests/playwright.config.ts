import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 120_000,
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "off",
    // CI hosts sometimes default prefers-reduced-motion; these tests assert on
    // running animations (stroke-dashoffset, bar width after keyframes).
    reducedMotion: "no-preference",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        reducedMotion: "no-preference",
      },
    },
  ],
  webServer: {
    command: "npm run dev -- --host 0.0.0.0 --port 3000",
    cwd: "/app",
    url: "http://localhost:3000",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
