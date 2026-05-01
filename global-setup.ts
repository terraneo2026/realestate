import { chromium, FullConfig, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage({ baseURL });

  try {
    // 1. Admin Login
    console.log(`Logging in as admin with: ${process.env.ADMIN_EMAIL || 'admin@relocate.biz'}`);
    await page.goto('/en/login');
    const email = process.env.ADMIN_EMAIL || 'admin@relocate.com';
    const password = process.env.ADMIN_PASSWORD || 'AdminPassword123';
    
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    
    // Trigger validation by clicking elsewhere or pressing Tab
    await page.keyboard.press('Tab');
    
    // Ensure button is enabled before clicking
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeEnabled({ timeout: 10000 });
    await submitBtn.click();
    
    // Diagnostic: Wait for either the URL change or an error message
    try {
      await page.waitForURL('**/admin**', { timeout: 15000 });
    } catch (e) {
      // If we timeout, check if there's an error message on the page
      const errorVisible = await page.getByText(/Invalid email or password/i).isVisible();
      if (errorVisible) {
        const errorText = await page.getByText(/Invalid email or password/i).innerText();
        throw new Error(`Login failed with error on page: ${errorText}`);
      }
      
      const currentUrl = page.url();
      throw new Error(`Login failed: Timeout waiting for /admin. Current URL is ${currentUrl}. Check if ADMIN_PASSWORD in .env.test is correct.`);
    }
    
    // Save state
    await page.context().storageState({ path: (storageState as string) || 'storageState.json' });
    console.log('Authentication state saved successfully.');
  } catch (error) {
    console.error('Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
