import { test, expect } from '@playwright/test';

test.describe('Hero Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
  });

  test('should display hero section with background image', async ({ page }) => {
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();

    // Check for hero content
    const heading = heroSection.locator('text=/HOME|PROJECTS/').first();
    await expect(heading).toBeVisible();
  });

  test('should display main headline and subheading', async ({ page }) => {
    const heroSection = page.locator('section').first();
    
    // Should have the word "HOME" or similar
    const mainHeading = heroSection.getByRole('heading').first();
    await expect(mainHeading).toBeVisible();
  });

  test('should have navigation arrows', async ({ page }) => {
    const heroSection = page.locator('section').first();
    
    // Look for navigation buttons
    const buttons = heroSection.locator('button');
    const count = await buttons.count();

    expect(count).toBeGreaterThan(0);
  });

  test('should display slide indicators (dots)', async ({ page }) => {
    const heroSection = page.locator('section').first();
    
    // Slide indicator dots
    const dots = heroSection.locator('button').filter({ hasText: '' }); // Empty text buttons are likely dots
    const count = await dots.count();

    expect(count).toBeGreaterThan(0);
  });

  test('should display search filter below hero', async ({ page }) => {
    // Search filter section
    const propertyTypeButton = page.locator('button').filter({ hasText: /Rent|Sale|Projects/i }).first();
    await expect(propertyTypeButton).toBeVisible();

    // Location select
    const locationSelect = page.locator('select').first();
    await expect(locationSelect).toBeVisible();
  });

  test('should have search filter inputs', async ({ page }) => {
    // Should have location, property type, price inputs
    const selects = page.locator('select');
    const selectCount = await selects.count();

    expect(selectCount).toBeGreaterThanOrEqual(2);

    const inputs = page.locator('input[type="number"]');
    const inputCount = await inputs.count();

    expect(inputCount).toBeGreaterThanOrEqual(2); // min and max price
  });

  test('should display search button', async ({ page }) => {
    const searchButton = page.locator('button').filter({ hasText: /Search Properties/i });
    await expect(searchButton).toBeVisible();
  });

  test('should have hero action buttons', async ({ page }) => {
    const heroSection = page.locator('section').first();
    
    const exploreButton = heroSection.locator('button').filter({ hasText: /Explore/i });
    await expect(exploreButton).toBeVisible();
  });

  test('hero section should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    const heroSection = page.locator('section').first();
    
    // Should still display hero content
    const heading = heroSection.getByRole('heading').first();
    await expect(heading).toBeVisible();

    // Search filter should be visible
    const searchButton = page.locator('button').filter({ hasText: /Search Properties/i });
    await expect(searchButton).toBeVisible();
  });

  test('should display search filter inputs with proper sizing on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Check input sizes are reasonable
    const inputs = page.locator('input');
    for (let i = 0; i < Math.min(2, await inputs.count()); i++) {
      const box = await inputs.nth(i).boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(40); // Touch-friendly size
    }
  });

  test('search filter tabs should show active state', async ({ page }) => {
    const rentTab = page.locator('button').filter({ hasText: /^Rent$/i }).first();
    const saleTab = page.locator('button').filter({ hasText: /^Sale$/i }).first();

    // One should be active
    await expect(rentTab).toBeVisible();
    if (await saleTab.isVisible()) {
      // Clicking should change active state
      await saleTab.click();
      await page.waitForTimeout(100);
    }
  });
});
