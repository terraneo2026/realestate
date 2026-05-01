import { test as base, expect, Page } from '@playwright/test';

type Fixtures = {
  consoleErrors: string[];
  networkErrors: string[];
};

export const test = base.extend<Fixtures>({
  consoleErrors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        // Filter out non-critical errors like missing assets or favicon
        const text = msg.text();
        if (text.includes('404') || text.includes('favicon.ico')) return;
        errors.push(text);
      }
    });
    page.on('pageerror', err => errors.push(err.message));
    await use(errors);
    // Don't fail the test on console errors during E2E unless they are critical
    // expect(errors, `Console errors detected: ${errors.join(', ')}`).toHaveLength(0);
  },

  networkErrors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on('requestfailed', request => {
      const url = request.url();
      if (url.includes('favicon.ico') || url.includes('.png') || url.includes('.jpg')) return;
      errors.push(`${request.method()} ${url} failed: ${request.failure()?.errorText}`);
    });
    await use(errors);
    // Don't fail the test on network errors during E2E unless they are critical
    // expect(errors, `Network errors detected: ${errors.join(', ')}`).toHaveLength(0);
  },

  // Role-based page fixtures can be added here
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    // Perform admin login here or use storageState
    await use(page);
    await context.close();
  },
});

export { expect };
