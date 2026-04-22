import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "off",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "sh -lc 'cd /app && npm run dev -- --host 0.0.0.0 --port 3000'",
    url: "http://localhost:3000",
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
