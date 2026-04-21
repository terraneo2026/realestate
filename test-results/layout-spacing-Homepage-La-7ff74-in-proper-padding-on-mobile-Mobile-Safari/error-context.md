# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: layout-spacing.spec.ts >> Homepage Layout & Spacing >> should maintain proper padding on mobile
- Location: tests\e2e\layout-spacing.spec.ts:62:7

# Error details

```
Error: page.goto: Could not connect to server
Call log:
  - navigating to "http://localhost:3001/en", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Homepage Layout & Spacing', () => {
  4  |   test.beforeEach(async ({ page }) => {
> 5  |     await page.goto('/en');
     |                ^ Error: page.goto: Could not connect to server
  6  |     await page.waitForLoadState('networkidle');
  7  |   });
  8  | 
  9  |   test('should render all main sections', async ({ page }) => {
  10 |     // Hero section
  11 |     const hero = page.locator('section').first();
  12 |     await expect(hero).toBeVisible();
  13 | 
  14 |     // Categories section
  15 |     const categories = page.getByRole('heading', { name: /Browse by Category/i });
  16 |     await expect(categories).toBeVisible();
  17 | 
  18 |     // Featured Properties section
  19 |     const featured = page.getByRole('heading', { name: /Featured Properties/i });
  20 |     await expect(featured).toBeVisible();
  21 | 
  22 |     // CTA section should be visible on scroll
  23 |     const cta = page.getByRole('heading', { name: /Ready to Find Your Dream Property/i });
  24 |     await expect(cta).toBeInViewport();
  25 |   });
  26 | 
  27 |   test('should have proper vertical spacing between sections', async ({ page }) => {
  28 |     const sections = page.locator('section');
  29 |     const count = await sections.count();
  30 | 
  31 |     expect(count).toBeGreaterThan(0);
  32 | 
  33 |     // Check that sections are not overlapping
  34 |     for (let i = 0; i < count - 1; i++) {
  35 |       const current = sections.nth(i);
  36 |       const next = sections.nth(i + 1);
  37 | 
  38 |       const currentBox = await current.boundingBox();
  39 |       const nextBox = await next.boundingBox();
  40 | 
  41 |       if (currentBox && nextBox) {
  42 |         // Next section should start after current one
  43 |         expect(nextBox.y).toBeGreaterThanOrEqual(currentBox.y + currentBox.height);
  44 |       }
  45 |     }
  46 |   });
  47 | 
  48 |   test('should have no horizontal scroll on desktop', async ({ page }) => {
  49 |     const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
  50 |     const viewportWidth = page.viewportSize()?.width || 0;
  51 | 
  52 |     expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // +1 for rounding
  53 |   });
  54 | 
  55 |   test('should have proper container max-width', async ({ page }) => {
  56 |     const containers = page.locator('div').filter({ has: page.locator('text=Browse by Category') }).first();
  57 |     const box = await containers.boundingBox();
  58 | 
  59 |     expect(box?.width).toBeLessThanOrEqual(1300); // max-w-7xl + padding
  60 |   });
  61 | 
  62 |   test('should maintain proper padding on mobile', async ({ page, browserName }) => {
  63 |     // Set mobile viewport
  64 |     await page.setViewportSize({ width: 375, height: 667 });
  65 | 
  66 |     const sections = page.locator('section');
  67 |     const firstSection = sections.first();
  68 |     const contentBox = await firstSection.boundingBox();
  69 | 
  70 |     // Should have horizontal padding
  71 |     expect(contentBox?.x).toBeGreaterThan(0);
  72 |   });
  73 | });
  74 | 
```