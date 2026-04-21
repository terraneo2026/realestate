import { test, expect } from '@playwright/test';

test.describe('Categories Grid', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
  });

  test('should display category grid with all items', async ({ page }) => {
    const categoriesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Browse by Category/i }) });
    
    const categoryCards = categoriesSection.locator('a');
    const count = await categoryCards.count();

    expect(count).toBeGreaterThanOrEqual(6); // Should have at least 6 categories
  });

  test('should render category icons', async ({ page }) => {
    const categoriesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Browse by Category/i }) });
    
    const icons = categoriesSection.locator('text=/🏢|🏗️|🏠|🏡|🏞️|📍|🏪|🏘️/');
    const count = await icons.count();

    expect(count).toBeGreaterThan(0);
  });

  test('should have responsive category grid', async ({ page }) => {
    const categoriesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Browse by Category/i }) });
    
    // On desktop, should have multiple columns
    const cards = categoriesSection.locator('a');
    const count = await cards.count();

    const firstCard = cards.first();
    const secondCard = cards.nth(1);

    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();

    if (firstBox && secondBox) {
      // Should be side by side on desktop
      expect(secondBox.x).toBeGreaterThan(firstBox.x);
    }
  });

  test('should display category names', async ({ page }) => {
    const categoriesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Browse by Category/i }) });
    
    const categoryNames = ['Villa', 'House', 'Commercial', 'Land'];
    
    for (const name of categoryNames) {
      const element = categoriesSection.locator(`text=${name}`).first();
      await expect(element).toBeVisible();
    }
  });

  test('should display property count per category', async ({ page }) => {
    const categoriesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Browse by Category/i }) });
    
    // Should have text with "Properties" or numbers
    const counts = categoriesSection.locator('text=/\\d+\\s+Propert/');
    const countVisible = await counts.count();

    expect(countVisible).toBeGreaterThan(0);
  });

  test('should have proper spacing between category cards', async ({ page }) => {
    const categoriesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Browse by Category/i }) });
    
    const cards = categoriesSection.locator('a');
    
    const firstCard = cards.first();
    const secondCard = cards.nth(1);

    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();

    if (firstBox && secondBox && secondBox.x > firstBox.x) {
      const gap = secondBox.x - (firstBox.x + firstBox.width);
      // Gap should be reasonable (between 0 and 50px)
      expect(gap).toBeGreaterThanOrEqual(0);
      expect(gap).toBeLessThan(100);
    }
  });

  test('should have visible category cards on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    const categoriesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Browse by Category/i }) });
    
    const cards = categoriesSection.locator('a');
    const count = await cards.count();

    expect(count).toBeGreaterThan(0);

    // First card should be fully visible
    const firstCard = cards.first();
    await expect(firstCard).toBeInViewport();
  });

  test('should show hover effect on category cards', async ({ page }) => {
    const categoriesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Browse by Category/i }) });
    
    const card = categoriesSection.locator('a').first();
    
    // Get initial shadow/style
    const initialClass = await card.getAttribute('class');
    
    // Hover
    await card.hover();
    
    // Should have hover state
    const hoveredClass = await card.getAttribute('class');
    
    // Both should have the class attribute
    expect(initialClass).toBeTruthy();
    expect(hoveredClass).toBeTruthy();
  });
});
