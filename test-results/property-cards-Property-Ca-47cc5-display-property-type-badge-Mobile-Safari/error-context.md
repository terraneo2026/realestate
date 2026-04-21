# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: property-cards.spec.ts >> Property Cards & Images >> should display property type badge
- Location: tests\e2e\property-cards.spec.ts:57:7

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
  3   | test.describe('Property Cards & Images', () => {
  4   |   test.beforeEach(async ({ page }) => {
> 5   |     await page.goto('/en');
      |                ^ Error: page.goto: Could not connect to server
  6   |     await page.waitForLoadState('networkidle');
  7   |   });
  8   | 
  9   |   test('should display property cards in grid layout', async ({ page }) => {
  10  |     // Find Featured Properties section
  11  |     const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
  12  |     
  13  |     const cards = propertiesSection.locator('div').filter({ has: page.locator('text=View Details') });
  14  |     const cardCount = await cards.count();
  15  | 
  16  |     expect(cardCount).toBeGreaterThan(0);
  17  |   });
  18  | 
  19  |   test('should render images in cards with proper sizing', async ({ page }) => {
  20  |     const images = page.locator('[role="img"]').or(page.locator('img'));
  21  |     
  22  |     let imageCount = 0;
  23  |     for (let i = 0; i < Math.min(3, await images.count()); i++) {
  24  |       const img = images.nth(i);
  25  |       const box = await img.boundingBox();
  26  | 
  27  |       if (box && box.width > 0 && box.height > 0) {
  28  |         imageCount++;
  29  |         // Check reasonable aspect ratio
  30  |         const aspectRatio = box.width / box.height;
  31  |         expect(aspectRatio).toBeBetween(0.5, 2.5);
  32  |       }
  33  |     }
  34  | 
  35  |     expect(imageCount).toBeGreaterThan(0);
  36  |   });
  37  | 
  38  |   test('should have proper card structure with all elements', async ({ page }) => {
  39  |     const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
  40  |     
  41  |     // Get first card
  42  |     const firstCard = propertiesSection.locator('a').first();
  43  |     await expect(firstCard).toBeVisible();
  44  | 
  45  |     // Check card contains essential elements
  46  |     const cardParent = firstCard.locator('..');
  47  |     
  48  |     // Should have price
  49  |     const price = cardParent.locator('text=/₹/');
  50  |     await expect(price).toBeVisible();
  51  | 
  52  |     // Should have view details button
  53  |     const button = cardParent.locator('button, a').filter({ hasText: /View Details/i });
  54  |     await expect(button).toBeVisible();
  55  |   });
  56  | 
  57  |   test('should display property type badge', async ({ page }) => {
  58  |     const badges = page.locator('text=/Villa|House|Apartment/').first();
  59  |     await expect(badges).toBeVisible();
  60  |   });
  61  | 
  62  |   test('should maintain card height consistency', async ({ page }) => {
  63  |     const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
  64  |     const cards = propertiesSection.locator('[class*="rounded"]').filter({ has: page.locator('button').filter({ hasText: /View Details/i }) });
  65  | 
  66  |     const heights: number[] = [];
  67  |     for (let i = 0; i < Math.min(3, await cards.count()); i++) {
  68  |       const box = await cards.nth(i).boundingBox();
  69  |       if (box) heights.push(box.height);
  70  |     }
  71  | 
  72  |     // Cards should have similar heights (within 20% tolerance)
  73  |     if (heights.length > 1) {
  74  |       const avgHeight = heights.reduce((a, b) => a + b) / heights.length;
  75  |       const tolerance = avgHeight * 0.2;
  76  | 
  77  |       heights.forEach(height => {
  78  |         expect(Math.abs(height - avgHeight)).toBeLessThan(tolerance);
  79  |       });
  80  |     }
  81  |   });
  82  | 
  83  |   test('should show favorite button on cards', async ({ page }) => {
  84  |     const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
  85  |     const favoriteButtons = propertiesSection.locator('button').filter({ hasText: /❤️|🤍/ });
  86  | 
  87  |     const count = await favoriteButtons.count();
  88  |     expect(count).toBeGreaterThan(0);
  89  |   });
  90  | 
  91  |   test('should toggle favorite button on click', async ({ page }) => {
  92  |     const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
  93  |     const favoriteButton = propertiesSection.locator('button').filter({ hasText: /🤍/ }).first();
  94  | 
  95  |     if (await favoriteButton.isVisible()) {
  96  |       const initialText = await favoriteButton.textContent();
  97  |       
  98  |       await favoriteButton.click();
  99  |       
  100 |       // Wait for state update
  101 |       await page.waitForTimeout(100);
  102 |       
  103 |       const newText = await favoriteButton.textContent();
  104 |       expect(newText).not.toBe(initialText);
  105 |     }
```