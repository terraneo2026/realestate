import { test, expect } from '../../fixtures/base';
import { AuthHelper } from '../../helpers/auth';

test.describe('RBAC & Security', () => {
  test('tenant should not be able to access admin pages', async ({ page, consoleErrors, networkErrors }) => {
    const auth = new AuthHelper(page);
    await auth.login(process.env.TENANT_EMAIL || 'tenant@relocate.biz', 'tenant');
    
    // Try to access admin URL directly
    await page.goto('/en/admin');
    
    // Should redirect to dashboard or show 403
    await expect(page).toHaveURL(/.*tenant\/dashboard/);
    await expect(page.getByText(/Unauthorized/i).or(page.getByText(/Permission Denied/i))).toBeVisible();
  });

  test('owner should not be able to access agent-only APIs', async ({ page, consoleErrors, networkErrors }) => {
    const auth = new AuthHelper(page);
    await auth.login(process.env.OWNER_EMAIL || 'owner@relocate.biz', 'owner');
    
    // Attempt to trigger an agent-only API (mocked check)
    const response = await page.request.post('/api/agent/property/unlock', {
      data: { propertyId: 'prop_123' }
    });
    
    expect(response.status()).toBe(403);
  });
});
