# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth\signup.spec.ts >> Authentication & Registration >> should prevent duplicate registration
- Location: tests\auth\signup.spec.ts:25:7

# Error details

```
TimeoutError: page.goto: Timeout 15000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/en/register", waiting until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e9]:
        - link "Relocate" [ref=e10] [cursor=pointer]:
          - /url: /en
          - img "Relocate" [ref=e11]
        - heading "Join Our Real Estate Community" [level=2] [ref=e12]
        - paragraph [ref=e13]: Access verified listings and experience a seamless home-finding journey.
      - generic [ref=e14]:
        - generic [ref=e15]:
          - generic [ref=e16]: ✓
          - generic [ref=e17]: Verified Properties
        - generic [ref=e18]:
          - generic [ref=e19]: ✓
          - generic [ref=e20]: Secure Auth & Data
        - generic [ref=e21]:
          - generic [ref=e22]: ✓
          - generic [ref=e23]: 24/7 Premium Support
    - generic [ref=e24]:
      - generic [ref=e25]:
        - generic [ref=e26]:
          - generic [ref=e27]:
            - img [ref=e28]
            - generic [ref=e31]: tenant Portal
          - heading "Create Account" [level=2] [ref=e32]
        - generic [ref=e33]:
          - button "TENANT" [ref=e34]
          - button "AGENT" [ref=e35]
          - button "OWNER" [ref=e36]
      - generic [ref=e37]:
        - generic [ref=e38]:
          - generic [ref=e39]:
            - text: Full Name
            - generic [ref=e40]:
              - img [ref=e41]
              - textbox "John Doe" [ref=e44]
          - generic [ref=e45]:
            - text: Phone Number
            - generic [ref=e46]:
              - img [ref=e47]
              - textbox "9876543210" [ref=e49]
        - generic [ref=e50]:
          - text: Email Address
          - generic [ref=e51]:
            - img [ref=e52]
            - textbox "name@example.com" [ref=e55]
        - generic [ref=e56]:
          - text: Address (Optional)
          - generic [ref=e57]:
            - img [ref=e58]
            - textbox "Street address, City, State" [ref=e61]
        - generic [ref=e62]:
          - generic [ref=e63]:
            - text: Password
            - generic [ref=e64]:
              - img [ref=e65]
              - textbox "••••••••" [ref=e68]
              - button [ref=e69]:
                - img [ref=e70]
            - generic [ref=e80]: "Strength: Very Weak"
          - generic [ref=e81]:
            - text: Confirm Password
            - generic [ref=e82]:
              - img [ref=e83]
              - textbox "••••••••" [ref=e86]
              - button [ref=e87]:
                - img [ref=e88]
        - button "CREATE ACCOUNT" [disabled] [ref=e91]:
          - generic [ref=e92]: CREATE ACCOUNT
          - img [ref=e93]
      - paragraph [ref=e95]:
        - text: Already have an account?
        - link "Sign in" [ref=e96] [cursor=pointer]:
          - /url: /en/tenant/login
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e102] [cursor=pointer]:
    - img [ref=e103]
  - alert [ref=e106]
```

# Test source

```ts
  1  | import { Page, expect } from '@playwright/test';
  2  | 
  3  | export class AuthHelper {
  4  |   constructor(private page: Page) {}
  5  | 
  6  |   async login(email: string, role: 'admin' | 'tenant' | 'owner' | 'agent', password?: string) {
  7  |     await this.page.goto('/en/login');
  8  |     await this.page.fill('input[name="email"]', email);
  9  |     await this.page.fill('input[name="password"]', password || process.env.TEST_PASSWORD || 'Password@123');
  10 |     
  11 |     const submitBtn = this.page.locator('button[type="submit"]');
  12 |     await expect(submitBtn).toBeEnabled();
  13 |     await submitBtn.click();
  14 |     
  15 |     // Validate redirect based on role
  16 |     const expectedUrl = role === 'admin' ? '/en/admin' : `/en/${role}/dashboard`;
  17 |     await expect(this.page).toHaveURL(new RegExp(expectedUrl), { timeout: 10000 });
  18 |   }
  19 | 
  20 |   async signupTenant(data: any) {
> 21 |     await this.page.goto('/en/register');
     |                     ^ TimeoutError: page.goto: Timeout 15000ms exceeded.
  22 |     await this.page.click('button:has-text("TENANT")');
  23 |     await this.page.fill('input[name="fullName"]', data.fullName);
  24 |     await this.page.fill('input[name="mobile"]', data.mobile);
  25 |     await this.page.fill('input[name="email"]', data.email);
  26 |     await this.page.fill('input[name="password"]', data.password);
  27 |     await this.page.fill('input[name="confirmPassword"]', data.password);
  28 |     
  29 |     const submitBtn = this.page.locator('button[type="submit"]');
  30 |     await expect(submitBtn).toBeEnabled();
  31 |     await submitBtn.click();
  32 |     
  33 |     await expect(this.page).toHaveURL(/.*tenant\/dashboard/, { timeout: 15000 });
  34 |   }
  35 | 
  36 |   async signupOwner(data: any) {
  37 |     await this.page.goto('/en/register');
  38 |     await this.page.click('button:has-text("OWNER")');
  39 |     await this.page.fill('input[name="fullName"]', data.fullName);
  40 |     await this.page.fill('input[name="mobile"]', data.mobile);
  41 |     await this.page.fill('input[name="email"]', data.email);
  42 |     await this.page.fill('input[name="password"]', data.password);
  43 |     await this.page.fill('input[name="confirmPassword"]', data.password);
  44 |     
  45 |     const submitBtn = this.page.locator('button[type="submit"]');
  46 |     await expect(submitBtn).toBeEnabled();
  47 |     await submitBtn.click();
  48 |     
  49 |     await expect(this.page).toHaveURL(/.*owner\/dashboard/, { timeout: 15000 });
  50 |   }
  51 | }
  52 | 
```