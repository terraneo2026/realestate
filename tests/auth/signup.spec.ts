import { test, expect } from '../../fixtures/base';
import { AuthHelper } from '../../helpers/auth';
import { generateTenantData, generateOwnerData } from '../../utils/test-data';

test.describe('Authentication & Registration', () => {
  test('should register a new tenant successfully', async ({ page, consoleErrors, networkErrors }) => {
    const auth = new AuthHelper(page);
    const tenantData = generateTenantData();
    
    await auth.signupTenant(tenantData);
    
    // Check for success or redirect
    await expect(page).toHaveURL(/.*tenant\/dashboard/, { timeout: 15000 });
  });

  test('should register a new owner successfully', async ({ page, consoleErrors, networkErrors }) => {
    const auth = new AuthHelper(page);
    const ownerData = generateTenantData(); // Reuse tenant generator for basic fields
    
    await auth.signupOwner(ownerData);
    
    await expect(page).toHaveURL(/.*owner\/dashboard/, { timeout: 15000 });
  });

  test('should prevent duplicate registration', async ({ page }) => {
    const auth = new AuthHelper(page);
    const tenantData = generateTenantData();
    
    // First signup
    await auth.signupTenant(tenantData);
    
    // Logout
    await page.click('button:has-text("Logout")');
    
    // Second signup with same email
    await auth.signupTenant(tenantData);
    
    await expect(page.getByText(/already exists/i)).toBeVisible();
  });
});
