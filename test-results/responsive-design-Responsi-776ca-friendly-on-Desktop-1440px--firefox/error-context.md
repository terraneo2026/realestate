# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive-design.spec.ts >> Responsive Design >> buttons should be touch-friendly on Desktop (1440px)
- Location: tests\e2e\responsive-design.spec.ts:52:9

# Error details

```
Error: page.goto: NS_ERROR_CONNECTION_REFUSED
Call log:
  - navigating to "http://localhost:3001/en", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - heading [level=1] [ref=e5]
  - paragraph
  - paragraph
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Responsive Design', () => {
  4   |   const viewports = [
  5   |     { name: 'Mobile (375px)', width: 375, height: 667 },
  6   |     { name: 'Tablet (768px)', width: 768, height: 1024 },
  7   |     { name: 'Desktop (1440px)', width: 1440, height: 900 },
  8   |   ];
  9   | 
  10  |   for (const viewport of viewports) {
  11  |     test(`should load properly on ${viewport.name}`, async ({ page }) => {
  12  |       await page.setViewportSize({ width: viewport.width, height: viewport.height });
  13  |       await page.goto('/en');
  14  |       await page.waitForLoadState('networkidle');
  15  | 
  16  |       // Check main sections are visible
  17  |       const sections = page.locator('section');
  18  |       const count = await sections.count();
  19  | 
  20  |       expect(count).toBeGreaterThan(0);
  21  |     });
  22  | 
  23  |     test(`should not have horizontal scroll on ${viewport.name}`, async ({ page }) => {
  24  |       await page.setViewportSize({ width: viewport.width, height: viewport.height });
  25  |       await page.goto('/en');
  26  |       await page.waitForLoadState('networkidle');
  27  | 
  28  |       const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
  29  |       const viewportWidth = viewport.width;
  30  | 
  31  |       expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
  32  |     });
  33  | 
  34  |     test(`should display text properly on ${viewport.name}`, async ({ page }) => {
  35  |       await page.setViewportSize({ width: viewport.width, height: viewport.height });
  36  |       await page.goto('/en');
  37  |       await page.waitForLoadState('networkidle');
  38  | 
  39  |       // Check headings are readable
  40  |       const headings = page.getByRole('heading');
  41  |       const count = await headings.count();
  42  | 
  43  |       expect(count).toBeGreaterThan(0);
  44  | 
  45  |       // All headings should be visible
  46  |       for (let i = 0; i < Math.min(3, count); i++) {
  47  |         const heading = headings.nth(i);
  48  |         await expect(heading).toBeVisible();
  49  |       }
  50  |     });
  51  | 
  52  |     test(`buttons should be touch-friendly on ${viewport.name}`, async ({ page }) => {
  53  |       await page.setViewportSize({ width: viewport.width, height: viewport.height });
> 54  |       await page.goto('/en');
      |                  ^ Error: page.goto: NS_ERROR_CONNECTION_REFUSED
  55  |       await page.waitForLoadState('networkidle');
  56  | 
  57  |       const buttons = page.locator('button').first();
  58  |       
  59  |       if (await buttons.isVisible()) {
  60  |         const box = await buttons.boundingBox();
  61  |         
  62  |         // Touch targets should be at least 44x44px
  63  |         if (box) {
  64  |           expect(box.height).toBeGreaterThanOrEqual(36); // Close to 44, allowing some tolerance
  65  |         }
  66  |       }
  67  |     });
  68  | 
  69  |     test(`grid columns should adjust on ${viewport.name}`, async ({ page }) => {
  70  |       await page.setViewportSize({ width: viewport.width, height: viewport.height });
  71  |       await page.goto('/en');
  72  |       await page.waitForLoadState('networkidle');
  73  | 
  74  |       // Categories grid
  75  |       const categoriesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Browse by Category/i }) });
  76  |       const categoryCards = categoriesSection.locator('a');
  77  |       const categoryCount = await categoryCards.count();
  78  | 
  79  |       expect(categoryCount).toBeGreaterThan(0);
  80  | 
  81  |       if (categoryCount > 1) {
  82  |         const first = await categoryCards.nth(0).boundingBox();
  83  |         const second = await categoryCards.nth(1).boundingBox();
  84  | 
  85  |         if (first && second) {
  86  |           if (viewport.width < 768) {
  87  |             // On mobile, cards should stack or be 2 columns
  88  |             // They might be on same Y level or different
  89  |             expect(true).toBe(true); // Just check they're present
  90  |           } else {
  91  |             // On larger screens, should be side by side
  92  |             expect(second.x).toBeGreaterThan(first.x);
  93  |           }
  94  |         }
  95  |       }
  96  |     });
  97  |   }
  98  | 
  99  |   test('should adapt hero section for mobile', async ({ page }) => {
  100 |     await page.setViewportSize({ width: 375, height: 667 });
  101 |     await page.goto('/en');
  102 |     await page.waitForLoadState('networkidle');
  103 | 
  104 |     const heroSection = page.locator('section').first();
  105 |     
  106 |     // Hero height should be reasonable on mobile
  107 |     const box = await heroSection.boundingBox();
  108 |     expect(box?.height).toBeLessThan(800); // Not too tall on mobile
  109 |     expect(box?.height).toBeGreaterThan(200); // But visible
  110 |   });
  111 | 
  112 |   test('should stack search filter columns on mobile', async ({ page }) => {
  113 |     await page.setViewportSize({ width: 375, height: 667 });
  114 |     await page.goto('/en');
  115 |     await page.waitForLoadState('networkidle');
  116 | 
  117 |     // Search filter inputs should stack vertically
  118 |     const inputs = page.locator('input, select').first();
  119 |     const inputs2 = page.locator('input, select').nth(1);
  120 | 
  121 |     const box1 = await inputs.boundingBox();
  122 |     const box2 = await inputs2.boundingBox();
  123 | 
  124 |     if (box1 && box2) {
  125 |       // Should be one above the other on mobile
  126 |       expect(box2.y).toBeGreaterThan(box1.y);
  127 |     }
  128 |   });
  129 | 
  130 |   test('should display full-width images on mobile', async ({ page }) => {
  131 |     await page.setViewportSize({ width: 375, height: 667 });
  132 |     await page.goto('/en');
  133 |     await page.waitForLoadState('networkidle');
  134 | 
  135 |     // Property cards should be full width or close to it
  136 |     const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
  137 |     const firstCard = propertiesSection.locator('a').first();
  138 | 
  139 |     if (await firstCard.isVisible()) {
  140 |       const box = await firstCard.boundingBox();
  141 |       
  142 |       if (box) {
  143 |         // Should be quite wide on mobile
  144 |         expect(box.width).toBeGreaterThan(100);
  145 |       }
  146 |     }
  147 |   });
  148 | 
  149 |   test('should maintain readability at all sizes', async ({ page }) => {
  150 |     const sizes = [375, 768, 1440];
  151 | 
  152 |     for (const width of sizes) {
  153 |       await page.setViewportSize({ width, height: 900 });
  154 |       await page.goto('/en');
```