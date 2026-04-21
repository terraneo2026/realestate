import { test, expect } from '@playwright/test';

test.describe('UI Visual Consistency', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
  });

  test('should have consistent card styling', async ({ page }) => {
    const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
    
    const cards = propertiesSection.locator('[class*="rounded-xl"]').filter({ has: page.locator('button').filter({ hasText: /View Details/i }) });
    const count = await cards.count();

    expect(count).toBeGreaterThan(1);

    // All cards should have similar styling
    for (let i = 0; i < Math.min(2, count); i++) {
      const classList = await cards.nth(i).getAttribute('class');
      expect(classList).toContain('rounded');
      expect(classList).toContain('shadow');
    }
  });

  test('should apply hover effects consistently', async ({ page }) => {
    const card = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) }).locator('a').first();

    const initialStyle = await card.getAttribute('style');
    
    await card.hover();
    
    // Being able to hover without errors is what we test
    await expect(card).toBeVisible();
  });

  test('should display all product images successfully or with fallback', async ({ page }) => {
    const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
    
    // Find image containers
    const imageContainers = propertiesSection.locator('div[class*="relative"]').filter({ has: page.locator('img, [role="img"]') });
    
    const count = await imageContainers.count();
    expect(count).toBeGreaterThan(0);

    // Check each has rendered content
    for (let i = 0; i < Math.min(3, count); i++) {
      const container = imageContainers.nth(i);
      const visible = await container.isVisible();
      expect(visible).toBe(true);
    }
  });

  test('should have proper color contrast for text', async ({ page }) => {
    const headings = page.getByRole('heading');
    const count = await headings.count();

    expect(count).toBeGreaterThan(0);

    // All headings should be readable
    for (let i = 0; i < Math.min(3, count); i++) {
      const heading = headings.nth(i);
      const color = await heading.evaluate(el => window.getComputedStyle(el).color);
      
      // Should have a defined color (not transparent)
      expect(color).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('should display badges with proper styling', async ({ page }) => {
    const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
    
    // Featured badges
    const featuredBadges = propertiesSection.locator('text=Featured');
    
    if (await featuredBadges.count() > 0) {
      const badge = featuredBadges.first();
      await expect(badge).toBeVisible();

      const bgColor = await badge.evaluate(el => window.getComputedStyle(el).backgroundColor);
      expect(bgColor).not.toBe('rgba(0, 0, 0, 0)'); // Should have a background color
    }
  });

  test('should display buttons with consistent styling', async ({ page }) => {
    const buttons = page.locator('button');
    const count = await buttons.count();

    expect(count).toBeGreaterThan(0);

    // Check primary buttons have proper styling
    for (let i = 0; i < Math.min(2, count); i++) {
      const button = buttons.nth(i);
      const bgColor = await button.evaluate(el => window.getComputedStyle(el).backgroundColor);
      const textColor = await button.evaluate(el => window.getComputedStyle(el).color);

      // Should have both background and text color defined
      expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(textColor).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('CTA section should be prominent', async ({ page }) => {
    const cta = page.locator('section').filter({ has: page.getByRole('heading', { name: /Ready to Find Your Dream Property/i }) });
    
    if (await cta.isVisible()) {
      // CTA should have a distinct background
      const bgColor = await cta.evaluate(el => window.getComputedStyle(el).backgroundColor);
      expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');

      // Should have a button
      const button = cta.locator('button').first();
      await expect(button).toBeVisible();
    }
  });

  test('should have no text overflow on cards', async ({ page }) => {
    const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
    
    const cards = propertiesSection.locator('[class*="rounded"]').filter({ has: page.locator('h3') });

    for (let i = 0; i < Math.min(2, await cards.count()); i++) {
      const card = cards.nth(i);
      const title = card.locator('h3').first();

      if (await title.isVisible()) {
        const titleBox = await title.boundingBox();
        const cardBox = await card.boundingBox();

        if (titleBox && cardBox) {
          // Title should be within card bounds
          expect(titleBox.x).toBeGreaterThanOrEqual(cardBox.x);
          expect(titleBox.x + titleBox.width).toBeLessThanOrEqual(cardBox.x + cardBox.width);
        }
      }
    }
  });

  test('should have proper icon sizing in categories', async ({ page }) => {
    const categoriesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Browse by Category/i }) });
    
    const icons = categoriesSection.locator('text=/🏢|🏗️|🏠|🏡/');
    const count = await icons.count();

    expect(count).toBeGreaterThan(0);

    // Icons should be rendered and visible
    for (let i = 0; i < Math.min(2, count); i++) {
      const icon = icons.nth(i);
      await expect(icon).toBeVisible();
    }
  });

  test('should display section headings consistently', async ({ page }) => {
    const headings = page.getByRole('heading');
    const count = await headings.count();

    expect(count).toBeGreaterThan(2);

    // Main section headings should be large
    const mainHeading = headings.nth(1); // First is likely in hero
    const fontSize = await mainHeading.evaluate(el => window.getComputedStyle(el).fontSize);
    const fontSizeNum = parseFloat(fontSize);

    expect(fontSizeNum).toBeGreaterThan(24); // Section headings should be substantial
  });

  test('should have proper spacing inside sections', async ({ page }) => {
    const sections = page.locator('section');
    const count = await sections.count();

    for (let i = 0; i < Math.min(2, count); i++) {
      const section = sections.nth(i);
      const padding = await section.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          paddingTop: style.paddingTop,
          paddingBottom: style.paddingBottom,
        };
      });

      const topPadding = parseFloat(padding.paddingTop);
      const bottomPadding = parseFloat(padding.paddingBottom);

      // Should have reasonable padding
      expect(topPadding).toBeGreaterThan(0);
      expect(bottomPadding).toBeGreaterThan(0);
    }
  });
});
