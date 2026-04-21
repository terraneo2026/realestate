import { test, expect } from '@playwright/test';

test.describe('Homepage Layout & Spacing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
  });

  test('should render all main sections', async ({ page }) => {
    // Hero section
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();

    // Categories section
    const categories = page.getByRole('heading', { name: /Browse by Category/i });
    await expect(categories).toBeVisible();

    // Featured Properties section
    const featured = page.getByRole('heading', { name: /Featured Properties/i });
    await expect(featured).toBeVisible();

    // CTA section should be visible on scroll
    const cta = page.getByRole('heading', { name: /Ready to Find Your Dream Property/i });
    await expect(cta).toBeInViewport();
  });

  test('should have proper vertical spacing between sections', async ({ page }) => {
    const sections = page.locator('section');
    const count = await sections.count();

    expect(count).toBeGreaterThan(0);

    // Check that sections are not overlapping
    for (let i = 0; i < count - 1; i++) {
      const current = sections.nth(i);
      const next = sections.nth(i + 1);

      const currentBox = await current.boundingBox();
      const nextBox = await next.boundingBox();

      if (currentBox && nextBox) {
        // Next section should start after current one
        expect(nextBox.y).toBeGreaterThanOrEqual(currentBox.y + currentBox.height);
      }
    }
  });

  test('should have no horizontal scroll on desktop', async ({ page }) => {
    const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
    const viewportWidth = page.viewportSize()?.width || 0;

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // +1 for rounding
  });

  test('should have proper container max-width', async ({ page }) => {
    const containers = page.locator('div').filter({ has: page.locator('text=Browse by Category') }).first();
    const box = await containers.boundingBox();

    expect(box?.width).toBeLessThanOrEqual(1300); // max-w-7xl + padding
  });

  test('should maintain proper padding on mobile', async ({ page, browserName }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const sections = page.locator('section');
    const firstSection = sections.first();
    const contentBox = await firstSection.boundingBox();

    // Should have horizontal padding
    expect(contentBox?.x).toBeGreaterThan(0);
  });
});
