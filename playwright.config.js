// @ts-check
// Playwright configuration for the UEB Braille Reference project.
// Runs against index.html served by a local Python HTTP server on port 8080.
// Only Chromium is used: this is a static reference page with no engine-specific behaviour.

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  // Give each test up to 30 seconds. The page is static so this is generous.
  timeout: 30000,
  // Retry once on CI in case of transient flakiness.
  retries: process.env.CI ? 1 : 0,
  // Run tests sequentially. The page is stateless so parallelism is safe,
  // but serial keeps the output readable and the server load minimal.
  workers: 1,
  use: {
    baseURL: 'http://localhost:8080',
    // Wait for the page to reach the networkidle state before assertions.
    actionTimeout: 10000,
    // Collect trace on first retry so failures are diagnosable in CI.
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Playwright starts the server, waits for the URL, runs the tests, then shuts
  // the server down. This keeps local and CI runs identical.
  webServer: {
    command: 'python3 -m http.server 8080',
    url: 'http://localhost:8080',
    // In local development, reuse a server that is already running.
    // In CI, always start a fresh server.
    reuseExistingServer: !process.env.CI,
    // Give the server up to 10 seconds to start.
    timeout: 10000,
  },
});
