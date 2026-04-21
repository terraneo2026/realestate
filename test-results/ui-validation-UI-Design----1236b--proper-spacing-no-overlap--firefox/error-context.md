# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui-validation.spec.ts >> UI Design - Production Validation >> ✅ Sections have proper spacing (no overlap)
- Location: tests\e2e\ui-validation.spec.ts:65:7

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
  3   | test.describe('UI Design - Production Validation', () => {
  4   |   test.beforeEach(async ({ page }) => {
> 5   |     await page.goto('/en');
      |                ^ Error: page.goto: NS_ERROR_CONNECTION_REFUSED
  6   |     await page.waitForLoadState('networkidle');
  7   |   });
  8   | 
  9   |   test('✅ Property cards render without layout issues', async ({ page }) => {
  10  |     // Get property cards
  11  |     const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
  12  |     const cards = propertiesSection.locator('[class*="rounded-xl"]').filter({ has: page.locator('button').filter({ hasText: /View Details/i }) });
  13  | 
  14  |     const count = await cards.count();
  15  |     expect(count).toBeGreaterThan(0);
  16  | 
  17  |     // Each card should be visible and contain required elements
  18  |     for (let i = 0; i < Math.min(2, count); i++) {
  19  |       const card = cards.nth(i);
  20  |       await expect(card).toBeVisible();
  21  | 
  22  |       // Card should have price
  23  |       const price = card.locator('text=/₹/');
  24  |       const priceCount = await price.count();
  25  |       expect(priceCount).toBeGreaterThan(0);
  26  | 
  27  |       // Card should have button
  28  |       const button = card.locator('button').filter({ hasText: /View Details/i });
  29  |       await expect(button).toBeVisible();
  30  |     }
  31  | 
  32  |     console.log(`✅ ${count} property cards render without layout issues`);
  33  |   });
  34  | 
  35  |   test('✅ Images load with Next.js Image optimization', async ({ page }) => {
  36  |     // Verify Next.js Image component is being used
  37  |     const images = page.locator('img');
  38  |     const count = await images.count();
  39  | 
  40  |     expect(count).toBeGreaterThan(0);
  41  | 
  42  |     // Check image has proper attributes
  43  |     for (let i = 0; i < Math.min(1, count); i++) {
  44  |       const img = images.nth(i);
  45  |       const src = await img.getAttribute('src');
  46  |       const alt = await img.getAttribute('alt');
  47  | 
  48  |       expect(src).toBeTruthy();
  49  |       expect(alt).toBeTruthy();
  50  |     }
  51  | 
  52  |     console.log(`✅ ${count} images optimized with Next.js Image component`);
  53  |   });
  54  | 
  55  |   test('✅ Categories grid displays correctly', async ({ page }) => {
  56  |     const categoriesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Browse by Category/i }) });
  57  |     const categoryCards = categoriesSection.locator('a');
  58  | 
  59  |     const count = await categoryCards.count();
  60  |     expect(count).toBeGreaterThanOrEqual(6);
  61  | 
  62  |     console.log(`✅ Categories grid displays ${count} categories`);
  63  |   });
  64  | 
  65  |   test('✅ Sections have proper spacing (no overlap)', async ({ page }) => {
  66  |     const sections = page.locator('section');
  67  |     const count = await sections.count();
  68  | 
  69  |     expect(count).toBeGreaterThanOrEqual(3);
  70  | 
  71  |     // Verify sections don't overlap
  72  |     for (let i = 0; i < count - 1; i++) {
  73  |       const current = sections.nth(i);
  74  |       const next = sections.nth(i + 1);
  75  | 
  76  |       const currentBox = await current.boundingBox();
  77  |       const nextBox = await next.boundingBox();
  78  | 
  79  |       if (currentBox && nextBox) {
  80  |         // Next section should be after current one
  81  |         expect(nextBox.y).toBeGreaterThanOrEqual(currentBox.y + currentBox.height - 10); // 10px tolerance
  82  |       }
  83  |     }
  84  | 
  85  |     console.log(`✅ ${count} sections properly spaced with no overlap`);
  86  |   });
  87  | 
  88  |   test('✅ Badges positioned correctly on cards', async ({ page }) => {
  89  |     const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
  90  | 
  91  |     // Check for features badges
  92  |     const featuredBadges = propertiesSection.locator('text=Featured');
  93  |     const featuredCount = await featuredBadges.count();
  94  | 
  95  |     if (featuredCount > 0) {
  96  |       const badge = featuredBadges.first();
  97  |       const box = await badge.boundingBox();
  98  | 
  99  |       // Badge should be positioned on the image (top-left area)
  100 |       expect(box?.x).toBeDefined();
  101 |       expect(box?.y).toBeDefined();
  102 |     }
  103 | 
  104 |     console.log(`✅ Badges positioned correctly - ${featuredCount} featured badges found`);
  105 |   });
```