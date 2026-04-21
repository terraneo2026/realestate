# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: categories-grid.spec.ts >> Categories Grid >> should display category names
- Location: tests\e2e\categories-grid.spec.ts:46:7

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
  3   | test.describe('Categories Grid', () => {
  4   |   test.beforeEach(async ({ page }) => {
> 5   |     await page.goto('/en');
      |                ^ Error: page.goto: Could not connect to server
  6   |     await page.waitForLoadState('networkidle');
  7   |   });
  8   | 
  9   |   test('should display category grid with all items', async ({ page }) => {
  10  |     const categoriesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Browse by Category/i }) });
  11  |     
  12  |     const categoryCards = categoriesSection.locator('a');
  13  |     const count = await categoryCards.count();
  14  | 
  15  |     expect(count).toBeGreaterThanOrEqual(6); // Should have at least 6 categories
  16  |   });
  17  | 
  18  |   test('should render category icons', async ({ page }) => {
  19  |     const categoriesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Browse by Category/i }) });
  20  |     
  21  |     const icons = categoriesSection.locator('text=/🏢|🏗️|🏠|🏡|🏞️|📍|🏪|🏘️/');
  22  |     const count = await icons.count();
  23  | 
  24  |     expect(count).toBeGreaterThan(0);
  25  |   });
  26  | 
  27  |   test('should have responsive category grid', async ({ page }) => {
  28  |     const categoriesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Browse by Category/i }) });
  29  |     
  30  |     // On desktop, should have multiple columns
  31  |     const cards = categoriesSection.locator('a');
  32  |     const count = await cards.count();
  33  | 
  34  |     const firstCard = cards.first();
  35  |     const secondCard = cards.nth(1);
  36  | 
  37  |     const firstBox = await firstCard.boundingBox();
  38  |     const secondBox = await secondCard.boundingBox();
  39  | 
  40  |     if (firstBox && secondBox) {
  41  |       // Should be side by side on desktop
  42  |       expect(secondBox.x).toBeGreaterThan(firstBox.x);
  43  |     }
  44  |   });
  45  | 
  46  |   test('should display category names', async ({ page }) => {
  47  |     const categoriesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Browse by Category/i }) });
  48  |     
  49  |     const categoryNames = ['Villa', 'House', 'Commercial', 'Land'];
  50  |     
  51  |     for (const name of categoryNames) {
  52  |       const element = categoriesSection.locator(`text=${name}`).first();
  53  |       await expect(element).toBeVisible();
  54  |     }
  55  |   });
  56  | 
  57  |   test('should display property count per category', async ({ page }) => {
  58  |     const categoriesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Browse by Category/i }) });
  59  |     
  60  |     // Should have text with "Properties" or numbers
  61  |     const counts = categoriesSection.locator('text=/\\d+\\s+Propert/');
  62  |     const countVisible = await counts.count();
  63  | 
  64  |     expect(countVisible).toBeGreaterThan(0);
  65  |   });
  66  | 
  67  |   test('should have proper spacing between category cards', async ({ page }) => {
  68  |     const categoriesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Browse by Category/i }) });
  69  |     
  70  |     const cards = categoriesSection.locator('a');
  71  |     
  72  |     const firstCard = cards.first();
  73  |     const secondCard = cards.nth(1);
  74  | 
  75  |     const firstBox = await firstCard.boundingBox();
  76  |     const secondBox = await secondCard.boundingBox();
  77  | 
  78  |     if (firstBox && secondBox && secondBox.x > firstBox.x) {
  79  |       const gap = secondBox.x - (firstBox.x + firstBox.width);
  80  |       // Gap should be reasonable (between 0 and 50px)
  81  |       expect(gap).toBeGreaterThanOrEqual(0);
  82  |       expect(gap).toBeLessThan(100);
  83  |     }
  84  |   });
  85  | 
  86  |   test('should have visible category cards on mobile', async ({ page }) => {
  87  |     await page.setViewportSize({ width: 375, height: 667 });
  88  |     await page.goto('/en');
  89  |     await page.waitForLoadState('networkidle');
  90  | 
  91  |     const categoriesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Browse by Category/i }) });
  92  |     
  93  |     const cards = categoriesSection.locator('a');
  94  |     const count = await cards.count();
  95  | 
  96  |     expect(count).toBeGreaterThan(0);
  97  | 
  98  |     // First card should be fully visible
  99  |     const firstCard = cards.first();
  100 |     await expect(firstCard).toBeInViewport();
  101 |   });
  102 | 
  103 |   test('should show hover effect on category cards', async ({ page }) => {
  104 |     const categoriesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Browse by Category/i }) });
  105 |     
```