# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hero-section.spec.ts >> Hero Section >> should have navigation arrows
- Location: tests\e2e\hero-section.spec.ts:26:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Hero Section', () => {
> 4   |   test.beforeEach(async ({ page }) => {
      |        ^ Test timeout of 30000ms exceeded while running "beforeEach" hook.
  5   |     await page.goto('/en');
  6   |     await page.waitForLoadState('networkidle');
  7   |   });
  8   | 
  9   |   test('should display hero section with background image', async ({ page }) => {
  10  |     const heroSection = page.locator('section').first();
  11  |     await expect(heroSection).toBeVisible();
  12  | 
  13  |     // Check for hero content
  14  |     const heading = heroSection.locator('text=/HOME|PROJECTS/').first();
  15  |     await expect(heading).toBeVisible();
  16  |   });
  17  | 
  18  |   test('should display main headline and subheading', async ({ page }) => {
  19  |     const heroSection = page.locator('section').first();
  20  |     
  21  |     // Should have the word "HOME" or similar
  22  |     const mainHeading = heroSection.getByRole('heading').first();
  23  |     await expect(mainHeading).toBeVisible();
  24  |   });
  25  | 
  26  |   test('should have navigation arrows', async ({ page }) => {
  27  |     const heroSection = page.locator('section').first();
  28  |     
  29  |     // Look for navigation buttons
  30  |     const buttons = heroSection.locator('button');
  31  |     const count = await buttons.count();
  32  | 
  33  |     expect(count).toBeGreaterThan(0);
  34  |   });
  35  | 
  36  |   test('should display slide indicators (dots)', async ({ page }) => {
  37  |     const heroSection = page.locator('section').first();
  38  |     
  39  |     // Slide indicator dots
  40  |     const dots = heroSection.locator('button').filter({ hasText: '' }); // Empty text buttons are likely dots
  41  |     const count = await dots.count();
  42  | 
  43  |     expect(count).toBeGreaterThan(0);
  44  |   });
  45  | 
  46  |   test('should display search filter below hero', async ({ page }) => {
  47  |     // Search filter section
  48  |     const propertyTypeButton = page.locator('button').filter({ hasText: /Rent|Sale|Projects/i }).first();
  49  |     await expect(propertyTypeButton).toBeVisible();
  50  | 
  51  |     // Location select
  52  |     const locationSelect = page.locator('select').first();
  53  |     await expect(locationSelect).toBeVisible();
  54  |   });
  55  | 
  56  |   test('should have search filter inputs', async ({ page }) => {
  57  |     // Should have location, property type, price inputs
  58  |     const selects = page.locator('select');
  59  |     const selectCount = await selects.count();
  60  | 
  61  |     expect(selectCount).toBeGreaterThanOrEqual(2);
  62  | 
  63  |     const inputs = page.locator('input[type="number"]');
  64  |     const inputCount = await inputs.count();
  65  | 
  66  |     expect(inputCount).toBeGreaterThanOrEqual(2); // min and max price
  67  |   });
  68  | 
  69  |   test('should display search button', async ({ page }) => {
  70  |     const searchButton = page.locator('button').filter({ hasText: /Search Properties/i });
  71  |     await expect(searchButton).toBeVisible();
  72  |   });
  73  | 
  74  |   test('should have hero action buttons', async ({ page }) => {
  75  |     const heroSection = page.locator('section').first();
  76  |     
  77  |     const exploreButton = heroSection.locator('button').filter({ hasText: /Explore/i });
  78  |     await expect(exploreButton).toBeVisible();
  79  |   });
  80  | 
  81  |   test('hero section should be responsive on mobile', async ({ page }) => {
  82  |     await page.setViewportSize({ width: 375, height: 667 });
  83  |     await page.goto('/en');
  84  |     await page.waitForLoadState('networkidle');
  85  | 
  86  |     const heroSection = page.locator('section').first();
  87  |     
  88  |     // Should still display hero content
  89  |     const heading = heroSection.getByRole('heading').first();
  90  |     await expect(heading).toBeVisible();
  91  | 
  92  |     // Search filter should be visible
  93  |     const searchButton = page.locator('button').filter({ hasText: /Search Properties/i });
  94  |     await expect(searchButton).toBeVisible();
  95  |   });
  96  | 
  97  |   test('should display search filter inputs with proper sizing on mobile', async ({ page }) => {
  98  |     await page.setViewportSize({ width: 375, height: 667 });
  99  |     await page.goto('/en');
  100 |     await page.waitForLoadState('networkidle');
  101 | 
  102 |     // Check input sizes are reasonable
  103 |     const inputs = page.locator('input');
  104 |     for (let i = 0; i < Math.min(2, await inputs.count()); i++) {
```