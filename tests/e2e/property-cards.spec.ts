import { test, expect } from '@playwright/test';

test.describe('Property Cards & Images', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
  });

  test('should display property cards in grid layout', async ({ page }) => {
    // Find Featured Properties section
    const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
    
    const cards = propertiesSection.locator('div').filter({ has: page.locator('text=View Details') });
    const cardCount = await cards.count();

    expect(cardCount).toBeGreaterThan(0);
  });

  test('should render images in cards with proper sizing', async ({ page }) => {
    const images = page.locator('[role="img"]').or(page.locator('img'));
    
    let imageCount = 0;
    for (let i = 0; i < Math.min(3, await images.count()); i++) {
      const img = images.nth(i);
      const box = await img.boundingBox();

      if (box && box.width > 0 && box.height > 0) {
        imageCount++;
        // Check reasonable aspect ratio
        const aspectRatio = box.width / box.height;
        expect(aspectRatio).toBeBetween(0.5, 2.5);
      }
    }

    expect(imageCount).toBeGreaterThan(0);
  });

  test('should have proper card structure with all elements', async ({ page }) => {
    const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
    
    // Get first card
    const firstCard = propertiesSection.locator('a').first();
    await expect(firstCard).toBeVisible();

    // Check card contains essential elements
    const cardParent = firstCard.locator('..');
    
    // Should have price
    const price = cardParent.locator('text=/₹/');
    await expect(price).toBeVisible();

    // Should have view details button
    const button = cardParent.locator('button, a').filter({ hasText: /View Details/i });
    await expect(button).toBeVisible();
  });

  test('should display property type badge', async ({ page }) => {
    const badges = page.locator('text=/Villa|House|Apartment/').first();
    await expect(badges).toBeVisible();
  });

  test('should maintain card height consistency', async ({ page }) => {
    const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
    const cards = propertiesSection.locator('[class*="rounded"]').filter({ has: page.locator('button').filter({ hasText: /View Details/i }) });

    const heights: number[] = [];
    for (let i = 0; i < Math.min(3, await cards.count()); i++) {
      const box = await cards.nth(i).boundingBox();
      if (box) heights.push(box.height);
    }

    // Cards should have similar heights (within 20% tolerance)
    if (heights.length > 1) {
      const avgHeight = heights.reduce((a, b) => a + b) / heights.length;
      const tolerance = avgHeight * 0.2;

      heights.forEach(height => {
        expect(Math.abs(height - avgHeight)).toBeLessThan(tolerance);
      });
    }
  });

  test('should show favorite button on cards', async ({ page }) => {
    const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
    const favoriteButtons = propertiesSection.locator('button').filter({ hasText: /❤️|🤍/ });

    const count = await favoriteButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should toggle favorite button on click', async ({ page }) => {
    const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
    const favoriteButton = propertiesSection.locator('button').filter({ hasText: /🤍/ }).first();

    if (await favoriteButton.isVisible()) {
      const initialText = await favoriteButton.textContent();
      
      await favoriteButton.click();
      
      // Wait for state update
      await page.waitForTimeout(100);
      
      const newText = await favoriteButton.textContent();
      expect(newText).not.toBe(initialText);
    }
  });

  test('should have badge positioning on image container', async ({ page }) => {
    const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
    
    // Check for Featured badge
    const featuredBadge = propertiesSection.locator('text=Featured').first();
    if (await featuredBadge.isVisible()) {
      const box = await featuredBadge.boundingBox();
      expect(box).toBeDefined();
      expect(box?.x).toBeLessThan(200); // Should be on left side
    }
  });

  test('should have proper padding inside cards', async ({ page }) => {
    const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
    
    // Find card content area
    const cardContent = propertiesSection.locator('[class*="p-"]').filter({ hasText: /₹/ }).first();
    const box = await cardContent.boundingBox();
    
    if (box) {
      // Content should have padding (not be at edge)
      expect(box.x).toBeGreaterThan(0);
    }
  });
});
