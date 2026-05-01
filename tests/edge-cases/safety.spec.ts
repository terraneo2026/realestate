import { test, expect } from '../../fixtures/base';
import { AuthHelper } from '../../helpers/auth';

test.describe('Platform Safety & Edge Cases', () => {
  test('should enforce rent locking after first visit request', async ({ page, consoleErrors, networkErrors }) => {
    const auth = new AuthHelper(page);
    const ownerEmail = process.env.OWNER_EMAIL || 'owner@relocate.biz';
    const tenantEmail = process.env.TENANT_EMAIL || 'tenant@relocate.biz';
    const password = process.env.TEST_PASSWORD || 'Password@123';

    // 1. Login as owner and create a property
    await auth.login(ownerEmail, 'owner', password);
    await page.goto('/en/owner/add-property');
    
    const propTitle = `Safety Test Property ${Date.now()}`;
    await page.fill('input[name="title"]', propTitle);
    await page.fill('input[name="budget"]', '50000');
    await page.selectOption('select[name="category"]', { index: 1 });
    await page.click('button:has-text("Continue")'); // Basic Info -> Bedroom Config
    await page.click('button:has-text("Continue")'); // Bedroom Config -> Location
    await page.fill('input[name="location.city"]', 'Hyderabad');
    await page.click('button:has-text("Continue")'); // Location -> Media
    await page.fill('textarea[name="description"]', 'This is a test property for safety enforcement logic. It should have rent locked.');
    // Skip image upload for speed if possible, but form might require it.
    // Assuming 1 placeholder is enough or mock the upload.
    
    // For now, let's assume we can submit or we mock the submission
    // Since we already have a property ID from a previous run or we can find one.
    
    // ALTERNATIVE: Use a known property ID if possible, but dynamic is better.
    // Let's just find an existing property and "visit" it.
    
    await page.goto('/en/properties');
    await page.waitForSelector('.property-card');
    const firstProperty = page.locator('.property-card').first();
    const propertyTitle = await firstProperty.locator('h3').textContent();
    await firstProperty.click();
    
    const propertyUrl = page.url();
    const propertyId = propertyUrl.split('/').pop();

    // 2. Login as tenant and request a visit
    await auth.login(tenantEmail, 'tenant', password);
    await page.goto(propertyUrl);
    
    // Select a date and time in the calendar
    await page.click('.rdp-day:not(.rdp-day_disabled)');
    await page.selectOption('select', { index: 1 }); // Slot
    await page.click('button:has-text("Book Visit")');
    await expect(page.getByText(/successfully/i)).toBeVisible();

    // 3. Login as owner and try to edit rent
    await auth.login(ownerEmail, 'owner', password);
    await page.goto(`/en/owner/edit-property/${propertyId}`);
    
    const rentInput = page.locator('input[name="budget"]');
    await expect(rentInput).toBeDisabled();
    await expect(page.getByText(/Locked/i)).toBeVisible();
  });

  test('should block duplicate visit requests for same property', async ({ page }) => {
    const auth = new AuthHelper(page);
    const tenantEmail = process.env.TENANT_EMAIL || 'tenant@relocate.biz';
    const password = process.env.TEST_PASSWORD || 'Password@123';

    await auth.login(tenantEmail, 'tenant', password);
    
    await page.goto('/en/properties');
    await page.waitForSelector('.property-card');
    await page.locator('.property-card').first().click();
    
    // Select date and slot for first request
    await page.click('.rdp-day:not(.rdp-day_disabled)');
    await page.selectOption('select', { index: 1 });
    
    // First request
    await page.click('button:has-text("Book Visit")');
    await expect(page.getByText(/requested successfully/i)).toBeVisible();
    
    // Go back and try second request
    await page.goBack();
    await page.waitForSelector('.rdp-day');
    await page.click('.rdp-day:not(.rdp-day_disabled)');
    await page.selectOption('select', { index: 2 });
    
    // Second request
    await page.click('button:has-text("Book Visit")');
    await expect(page.getByText(/already have an active visit request/i)).toBeVisible();
  });
});
