import { test, expect } from '../../fixtures/base';

test.describe('Tenant Browsing', () => {
  test('should browse properties with filters', async ({ page, consoleErrors, networkErrors }) => {
    await page.goto('/en/properties');
    
    // Check if properties are listed
    await expect(page.locator('.property-card')).toHaveCount({ min: 1 });
    
    // Apply filters
    await page.click('button:has-text("Filters")');
    await page.fill('input[name="minRent"]', '20000');
    await page.click('button:has-text("Apply")');
    
    // Validate results
    const firstPrice = await page.locator('.property-price').first().innerText();
    expect(parseInt(firstPrice.replace(/[^0-9]/g, ''))).toBeGreaterThanOrEqual(20000);
  });

  test('should hide exact address for unverified tenants', async ({ page }) => {
    await page.goto('/en/properties');
    await page.locator('.property-card').first().click();
    
    // Check if address is masked
    await expect(page.getByText(/Exact address hidden/i)).toBeVisible();
    await expect(page.locator('.exact-address')).not.toBeVisible();
  });
});
