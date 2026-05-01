import { test, expect } from '../../fixtures/base';
import { AuthHelper } from '../../helpers/auth';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    const auth = new AuthHelper(page);
    await auth.login('admin@relocate.biz', 'admin'); // Use test admin credentials
  });

  test('should display live metrics and navigation cards', async ({ page, consoleErrors, networkErrors }) => {
    // Check for metrics
    await expect(page.getByText(/Total Revenue/i)).toBeVisible();
    await expect(page.getByText(/Escrow Balance/i)).toBeVisible();
    
    // Check if configuration module is accessible
    await page.click('a:has-text("Configuration")');
    await expect(page).toHaveURL(/.*admin\/configuration/);
    
    // Check if submodules are visible
    await expect(page.getByText(/Token Configuration/i)).toBeVisible();
    await expect(page.getByText(/Commission Configuration/i)).toBeVisible();
  });

  test('should update token configuration successfully', async ({ page }) => {
    await page.goto('/en/admin/configuration');
    
    // Edit a token amount
    await page.click('button:has-text("Edit")');
    await page.fill('input[name="budgetToken"]', '600');
    await page.click('button:has-text("Save")');
    
    await expect(page.getByText(/Updated successfully/i)).toBeVisible();
  });
});
