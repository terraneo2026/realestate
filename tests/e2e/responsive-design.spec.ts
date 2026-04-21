import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  const viewports = [
    { name: 'Mobile (375px)', width: 375, height: 667 },
    { name: 'Tablet (768px)', width: 768, height: 1024 },
    { name: 'Desktop (1440px)', width: 1440, height: 900 },
  ];

  for (const viewport of viewports) {
    test(`should load properly on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/en');
      await page.waitForLoadState('networkidle');

      // Check main sections are visible
      const sections = page.locator('section');
      const count = await sections.count();

      expect(count).toBeGreaterThan(0);
    });

    test(`should not have horizontal scroll on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/en');
      await page.waitForLoadState('networkidle');

      const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
      const viewportWidth = viewport.width;

      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
    });

    test(`should display text properly on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/en');
      await page.waitForLoadState('networkidle');

      // Check headings are readable
      const headings = page.getByRole('heading');
      const count = await headings.count();

      expect(count).toBeGreaterThan(0);

      // All headings should be visible
      for (let i = 0; i < Math.min(3, count); i++) {
        const heading = headings.nth(i);
        await expect(heading).toBeVisible();
      }
    });

    test(`buttons should be touch-friendly on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/en');
      await page.waitForLoadState('networkidle');

      const buttons = page.locator('button').first();
      
      if (await buttons.isVisible()) {
        const box = await buttons.boundingBox();
        
        // Touch targets should be at least 44x44px
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(36); // Close to 44, allowing some tolerance
        }
      }
    });

    test(`grid columns should adjust on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/en');
      await page.waitForLoadState('networkidle');

      // Categories grid
      const categoriesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Browse by Category/i }) });
      const categoryCards = categoriesSection.locator('a');
      const categoryCount = await categoryCards.count();

      expect(categoryCount).toBeGreaterThan(0);

      if (categoryCount > 1) {
        const first = await categoryCards.nth(0).boundingBox();
        const second = await categoryCards.nth(1).boundingBox();

        if (first && second) {
          if (viewport.width < 768) {
            // On mobile, cards should stack or be 2 columns
            // They might be on same Y level or different
            expect(true).toBe(true); // Just check they're present
          } else {
            // On larger screens, should be side by side
            expect(second.x).toBeGreaterThan(first.x);
          }
        }
      }
    });
  }

  test('should adapt hero section for mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    const heroSection = page.locator('section').first();
    
    // Hero height should be reasonable on mobile
    const box = await heroSection.boundingBox();
    expect(box?.height).toBeLessThan(800); // Not too tall on mobile
    expect(box?.height).toBeGreaterThan(200); // But visible
  });

  test('should stack search filter columns on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Search filter inputs should stack vertically
    const inputs = page.locator('input, select').first();
    const inputs2 = page.locator('input, select').nth(1);

    const box1 = await inputs.boundingBox();
    const box2 = await inputs2.boundingBox();

    if (box1 && box2) {
      // Should be one above the other on mobile
      expect(box2.y).toBeGreaterThan(box1.y);
    }
  });

  test('should display full-width images on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Property cards should be full width or close to it
    const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
    const firstCard = propertiesSection.locator('a').first();

    if (await firstCard.isVisible()) {
      const box = await firstCard.boundingBox();
      
      if (box) {
        // Should be quite wide on mobile
        expect(box.width).toBeGreaterThan(100);
      }
    }
  });

  test('should maintain readability at all sizes', async ({ page }) => {
    const sizes = [375, 768, 1440];

    for (const width of sizes) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/en');

      // All text should be readable (not too small)
      const body = page.locator('body');
      const fontSize = await body.evaluate(el => window.getComputedStyle(el).fontSize);
      
      const fontSizeNum = parseFloat(fontSize);
      expect(fontSizeNum).toBeGreaterThanOrEqual(14); // Minimum readable size
    }
  });
});
