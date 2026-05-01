import { Page, expect } from '@playwright/test';

export class AuthHelper {
  constructor(private page: Page) {}

  async login(email: string, role: 'admin' | 'tenant' | 'owner' | 'agent', password?: string) {
    await this.page.goto('/en/login');
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', password || process.env.TEST_PASSWORD || 'Password@123');
    
    const submitBtn = this.page.locator('button[type="submit"]');
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();
    
    // Validate redirect based on role
    const expectedUrl = role === 'admin' ? '/en/admin' : `/en/${role}/dashboard`;
    await expect(this.page).toHaveURL(new RegExp(expectedUrl), { timeout: 10000 });
  }

  async signupTenant(data: any) {
    await this.page.goto('/en/register');
    await this.page.click('button:has-text("TENANT")');
    await this.page.fill('input[name="fullName"]', data.fullName);
    await this.page.fill('input[name="mobile"]', data.mobile);
    await this.page.fill('input[name="email"]', data.email);
    await this.page.fill('input[name="password"]', data.password);
    await this.page.fill('input[name="confirmPassword"]', data.password);
    
    const submitBtn = this.page.locator('button[type="submit"]');
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();
    
    await expect(this.page).toHaveURL(/.*tenant\/dashboard/, { timeout: 15000 });
  }

  async signupOwner(data: any) {
    await this.page.goto('/en/register');
    await this.page.click('button:has-text("OWNER")');
    await this.page.fill('input[name="fullName"]', data.fullName);
    await this.page.fill('input[name="mobile"]', data.mobile);
    await this.page.fill('input[name="email"]', data.email);
    await this.page.fill('input[name="password"]', data.password);
    await this.page.fill('input[name="confirmPassword"]', data.password);
    
    const submitBtn = this.page.locator('button[type="submit"]');
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();
    
    await expect(this.page).toHaveURL(/.*owner\/dashboard/, { timeout: 15000 });
  }
}
