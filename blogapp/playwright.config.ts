import { defineConfig, devices } from "@playwright/test";
import path from "path";

const useSystemChrome = process.env.PLAYWRIGHT_USE_SYSTEM_CHROME === "1";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 60_000,
  reporter: [
    ["list"],
    ["json", { outputFile: path.join(__dirname, "playwright-report.json") }],
  ],
  use: {
    baseURL: "http://127.0.0.1:3055",
    trace: "on-first-retry",
    ...(useSystemChrome ? { channel: "chrome" as const } : {}),
  },
  webServer: {
    command: "node ./scripts/e2e-stack.cjs",
    url: "http://127.0.0.1:3055",
    timeout: 420_000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(useSystemChrome ? { channel: "chrome" as const } : {}),
      },
    },
  ],
});
