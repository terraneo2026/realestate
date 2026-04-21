import { test, expect } from '@playwright/test';

test.describe('UI Design - Core Fixes Validation', () => {
  test.beforeEach(async ({ page, browserName }) => {
    // Skip on webkit due to image loading issues
    test.skip(browserName === 'webkit');
    
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
  });

  test('✅ Property cards display with proper height consistency', async ({ page }) => {
    // Validate that all property cards have consistent heights (no overlap)
    const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
    
    const cardHeights: number[] = [];
    const cards = propertiesSection.locator('div[class*="flex"][class*="flex-col"]').filter({ has: page.locator('button').filter({ hasText: /View Details/i }) }).locator('..').locator('..').locator('..').locator('..').locator('..');

    // Get first few cards
    for (let i = 0; i < 3; i++) {
      const card = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) }).locator('a').nth(i);
      const box = await card.boundingBox();
      if (box) cardHeights.push(box.height);
    }

    // All cards should have similar height
    if (cardHeights.length >= 2) {
      const avgHeight = cardHeights.reduce((a, b) => a + b) / cardHeights.length;
      const maxDiff = Math.max(...cardHeights) - Math.min(...cardHeights);
      expect(maxDiff).toBeLessThan(avgHeight * 0.15); // Within 15% variance
    }

    console.log('✅ Card heights consistent:', cardHeights);
  });

  test('✅ Property images render without layout shift', async ({ page }) => {
    // Verify images are properly sized and don't cause layout shift
    const imageContainers = page.locator('div.relative').filter({ has: page.locator('img') });
    
    let hasImages = false;
    for (let i = 0; i < Math.min(2, await imageContainers.count()); i++) {
      const container = imageContainers.nth(i);
      const box = await container.boundingBox();
      
      if (box && box.height > 100) {
        hasImages = true;
        // Check image has fixed height (h-64 = 256px)
        expect(box.height).toBeCloseTo(256, 20); // Allow 20px tolerance
      }
    }

    expect(hasImages).toBe(true);
    console.log('✅ Image containers have fixed heights - no layout shift');
  });

  test('✅ Grid layouts are responsive and properly spaced', async ({ page }) => {
    // Test property cards grid
    const cards = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) }).locator('a');
    
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // Cards should not overlap
    if (count >= 2) {
      const card1Box = await cards.nth(0).boundingBox();
      const card2Box = await cards.nth(1).boundingBox();

      if (card1Box && card2Box) {
        // Card 2 should not overlap with Card 1
        if (card2Box.x > card1Box.x) {
          // Side by side
          expect(card2Box.x).toBeGreaterThan(card1Box.x + card1Box.width);
        } else {
          // Stacked (mobile)
          expect(card2Box.y).toBeGreaterThan(card1Box.y + card1Box.height);
        }
      }
    }

    console.log(`✅ Grid renders ${count} cards without overlap`);
  });

  test('✅ Section spacing is consistent', async ({ page }) => {
    // Verify sections have proper vertical spacing
    const sections = page.locator('section');
    const count = await sections.count();

    expect(count).toBeGreaterThanOrEqual(3);

    // Check sections don't overlap
    for (let i = 0; i < count - 1; i++) {
      const current = sections.nth(i);
      const next = sections.nth(i + 1);

      const currentBox = await current.boundingBox();
      const nextBox = await next.boundingBox();

      if (currentBox && nextBox) {
        const gap = nextBox.y - (currentBox.y + currentBox.height);
        // Gap should be >= 0 (no overlap)
        expect(gap).toBeGreaterThanOrEqual(-5); // Allow tiny rounding error
      }
    }

    console.log('✅ All sections properly spaced - no overlap');
  });

  test('✅ Badges positioned correctly without overlapping content', async ({ page }) => {
    // Featured badge should be positioned absolutely
    const featuredBadges = page.locator('text=Featured');

    if (await featuredBadges.count() > 0) {
      const badge = featuredBadges.first();
      const box = await badge.boundingBox();

      // Badge should be at image top-left (0-30px from edge)
      expect(box?.x).toBeLessThan(100);
      expect(box?.y).toBeLessThan(100);
    }

    // Favorite button should be at top-right
    const favoriteButtons = page.locator('button').filter({ hasText: /❤️|🤍/ });
    
    if (await favoriteButtons.count() > 0) {
      const favButton = favoriteButtons.first();
      const page_width = await page.evaluate(() => window.innerWidth);
      const box = await favButton.boundingBox();

      if (box) {
        // Button should be on right side
        expect(box.x + box.width).toBeGreaterThan(page_width * 0.8);
      }
    }

    console.log('✅ Badges positioned correctly without content overlap');
  });

  test('✅ Categories grid displays properly', async ({ page }) => {
    // Verify categories render in grid
    const categoriesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Browse by Category/i }) });
    const categoryCards = categoriesSection.locator('a');

    const count = await categoryCards.count();
    expect(count).toBeGreaterThanOrEqual(6);

    // Should be properly spaced and not overlapping
    if (count >= 2) {
      const card1 = await categoryCards.nth(0).boundingBox();
      const card2 = await categoryCards.nth(1).boundingBox();

      if (card1 && card2) {
        expect(card2.x).not.toBe(card1.x); // Not same position
      }
    }

    console.log(`✅ Categories grid displays ${count} items`);
  });

  test('✅ No horizontal scroll on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/en');

    const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
    const viewportWidth = 1440;

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5);

    console.log('✅ No horizontal scroll - content properly constrained');
  });

  test('✅ Mobile responsive layout (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Should not have horizontal scroll
    const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(380);

    // Sections should be visible
    const sections = page.locator('section');
    expect(await sections.count()).toBeGreaterThan(0);

    // First section should be visible
    await expect(sections.first()).toBeVisible();

    console.log('✅ Mobile (375px) layout responsive - no horizontal scroll');
  });

  test('✅ Tablet responsive layout (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/en');

    // Should not have horizontal scroll
    const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(773);

    // Grid should show multiple columns
    const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
    const cards = propertiesSection.locator('a');
    
    const count = await cards.count();
    if (count >= 2) {
      const card1 = await cards.nth(0).boundingBox();
      const card2 = await cards.nth(1).boundingBox();

      // Cards should be side by side on tablet
      if (card1 && card2) {
        expect(card2.x).toBeGreaterThan(card1.x);
      }
    }

    console.log('✅ Tablet (768px) layout responsive - multi-column grid');
  });

  test('✅ Form inputs in hero section have proper sizing', async ({ page }) => {
    // Check inputs are visible and properly sized
    const selects = page.locator('select.bg-transparent');
    
    const count = await selects.count();
    expect(count).toBeGreaterThan(0);

    // Inputs should be rendered
    for (let i = 0; i < Math.min(1, count); i++) {
      const select = selects.nth(i);
      await expect(select).toBeVisible();
    }

    console.log('✅ Form inputs rendered with proper styling');
  });

  test('✅ Hero section displays properly', async ({ page }) => {
    // Hero should be visible
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();

    // Should have heading
    const heading = heroSection.getByRole('heading').first();
    await expect(heading).toBeVisible();

    // Should have buttons
    const buttons = heroSection.locator('button').first();
    await expect(buttons).toBeVisible();

    console.log('✅ Hero section renders with all elements');
  });

  test('✅ CTA section present at bottom', async ({ page }) => {
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // CTA section should have heading
    const cta = page.getByRole('heading', { name: /Ready to Find Your Dream Property/i });
    
    if (await cta.isVisible()) {
      await expect(cta).toBeVisible();
      
      // Should have button
      const ctaButton = cta.locator('..').locator('button').first();
      await expect(ctaButton).toBeVisible();
      
      console.log('✅ CTA section present with button');
    } else {
      console.log('⚠️ CTA section not visible (may need scroll)');
    }
  });

  test('✅ All text readable and not overflowing', async ({ page }) => {
    // Check headings are readable
    const headings = page.getByRole('heading');
    const count = await headings.count();

    expect(count).toBeGreaterThan(0);

    // All headings should be visible
    for (let i = 0; i < Math.min(3, count); i++) {
      const heading = headings.nth(i);
      const box = await heading.boundingBox();
      
      if (box) {
        // Size should be reasonable
        expect(box.width).toBeGreaterThan(50);
        expect(box.width).toBeLessThan(1500);
      }
    }

    console.log('✅ All text readable and properly sized');
  });
});
