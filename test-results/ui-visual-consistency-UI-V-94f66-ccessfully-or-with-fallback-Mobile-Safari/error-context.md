# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui-visual-consistency.spec.ts >> UI Visual Consistency >> should display all product images successfully or with fallback
- Location: tests\e2e\ui-visual-consistency.spec.ts:36:7

# Error details

```
Error: page.goto: Could not connect to server
Call log:
  - navigating to "http://localhost:3001/en", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('UI Visual Consistency', () => {
  4   |   test.beforeEach(async ({ page }) => {
> 5   |     await page.goto('/en');
      |                ^ Error: page.goto: Could not connect to server
  6   |     await page.waitForLoadState('networkidle');
  7   |   });
  8   | 
  9   |   test('should have consistent card styling', async ({ page }) => {
  10  |     const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
  11  |     
  12  |     const cards = propertiesSection.locator('[class*="rounded-xl"]').filter({ has: page.locator('button').filter({ hasText: /View Details/i }) });
  13  |     const count = await cards.count();
  14  | 
  15  |     expect(count).toBeGreaterThan(1);
  16  | 
  17  |     // All cards should have similar styling
  18  |     for (let i = 0; i < Math.min(2, count); i++) {
  19  |       const classList = await cards.nth(i).getAttribute('class');
  20  |       expect(classList).toContain('rounded');
  21  |       expect(classList).toContain('shadow');
  22  |     }
  23  |   });
  24  | 
  25  |   test('should apply hover effects consistently', async ({ page }) => {
  26  |     const card = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) }).locator('a').first();
  27  | 
  28  |     const initialStyle = await card.getAttribute('style');
  29  |     
  30  |     await card.hover();
  31  |     
  32  |     // Being able to hover without errors is what we test
  33  |     await expect(card).toBeVisible();
  34  |   });
  35  | 
  36  |   test('should display all product images successfully or with fallback', async ({ page }) => {
  37  |     const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
  38  |     
  39  |     // Find image containers
  40  |     const imageContainers = propertiesSection.locator('div[class*="relative"]').filter({ has: page.locator('img, [role="img"]') });
  41  |     
  42  |     const count = await imageContainers.count();
  43  |     expect(count).toBeGreaterThan(0);
  44  | 
  45  |     // Check each has rendered content
  46  |     for (let i = 0; i < Math.min(3, count); i++) {
  47  |       const container = imageContainers.nth(i);
  48  |       const visible = await container.isVisible();
  49  |       expect(visible).toBe(true);
  50  |     }
  51  |   });
  52  | 
  53  |   test('should have proper color contrast for text', async ({ page }) => {
  54  |     const headings = page.getByRole('heading');
  55  |     const count = await headings.count();
  56  | 
  57  |     expect(count).toBeGreaterThan(0);
  58  | 
  59  |     // All headings should be readable
  60  |     for (let i = 0; i < Math.min(3, count); i++) {
  61  |       const heading = headings.nth(i);
  62  |       const color = await heading.evaluate(el => window.getComputedStyle(el).color);
  63  |       
  64  |       // Should have a defined color (not transparent)
  65  |       expect(color).not.toBe('rgba(0, 0, 0, 0)');
  66  |     }
  67  |   });
  68  | 
  69  |   test('should display badges with proper styling', async ({ page }) => {
  70  |     const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
  71  |     
  72  |     // Featured badges
  73  |     const featuredBadges = propertiesSection.locator('text=Featured');
  74  |     
  75  |     if (await featuredBadges.count() > 0) {
  76  |       const badge = featuredBadges.first();
  77  |       await expect(badge).toBeVisible();
  78  | 
  79  |       const bgColor = await badge.evaluate(el => window.getComputedStyle(el).backgroundColor);
  80  |       expect(bgColor).not.toBe('rgba(0, 0, 0, 0)'); // Should have a background color
  81  |     }
  82  |   });
  83  | 
  84  |   test('should display buttons with consistent styling', async ({ page }) => {
  85  |     const buttons = page.locator('button');
  86  |     const count = await buttons.count();
  87  | 
  88  |     expect(count).toBeGreaterThan(0);
  89  | 
  90  |     // Check primary buttons have proper styling
  91  |     for (let i = 0; i < Math.min(2, count); i++) {
  92  |       const button = buttons.nth(i);
  93  |       const bgColor = await button.evaluate(el => window.getComputedStyle(el).backgroundColor);
  94  |       const textColor = await button.evaluate(el => window.getComputedStyle(el).color);
  95  | 
  96  |       // Should have both background and text color defined
  97  |       expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
  98  |       expect(textColor).not.toBe('rgba(0, 0, 0, 0)');
  99  |     }
  100 |   });
  101 | 
  102 |   test('CTA section should be prominent', async ({ page }) => {
  103 |     const cta = page.locator('section').filter({ has: page.getByRole('heading', { name: /Ready to Find Your Dream Property/i }) });
  104 |     
  105 |     if (await cta.isVisible()) {
```