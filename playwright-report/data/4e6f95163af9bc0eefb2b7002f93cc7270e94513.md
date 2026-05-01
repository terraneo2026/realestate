# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security\rbac.spec.ts >> RBAC & Security >> tenant should not be able to access admin pages
- Location: tests\security\rbac.spec.ts:5:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/en\/tenant\/dashboard/
Received string:  "http://localhost:3000/en/login"
Timeout: 10000ms

Call log:
  - Expect "toHaveURL" with timeout 10000ms
    13 × unexpected value "http://localhost:3000/en/login"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - link "Relocate" [ref=e6] [cursor=pointer]:
        - /url: /en
        - img "Relocate" [ref=e8]
      - heading "Welcome Back" [level=2] [ref=e9]
      - paragraph [ref=e10]: Access your property dashboard
    - generic [ref=e11]:
      - link "Tenant" [ref=e12] [cursor=pointer]:
        - /url: /en/tenant/register
        - img [ref=e14]
        - generic [ref=e18]: Tenant
      - link "Owner" [ref=e19] [cursor=pointer]:
        - /url: /en/owner/register
        - img [ref=e21]
        - generic [ref=e24]: Owner
      - link "Agent" [ref=e25] [cursor=pointer]:
        - /url: /en/agent/register
        - img [ref=e27]
        - generic [ref=e30]: Agent
    - generic [ref=e35]: Or sign in
    - generic [ref=e36]:
      - generic [ref=e37]:
        - generic [ref=e38]:
          - generic [ref=e39]: Email
          - generic [ref=e40]:
            - img [ref=e41]
            - textbox "name@example.com" [ref=e44]: tenant@relocate.biz
        - generic [ref=e45]:
          - generic [ref=e46]: Password
          - generic [ref=e47]:
            - img [ref=e48]
            - textbox "••••••••" [ref=e51]: Password@123
            - button [ref=e52]:
              - img [ref=e53]
      - generic [ref=e56]:
        - generic [ref=e57]:
          - checkbox "Remember me" [ref=e58] [cursor=pointer]
          - generic [ref=e59] [cursor=pointer]: Remember me
        - link "Forgot Password?" [ref=e60] [cursor=pointer]:
          - /url: /en/forgot-password
      - generic [ref=e61]:
        - img [ref=e62]
        - paragraph [ref=e64]: Invalid email or password
      - button "Sign In" [ref=e65]:
        - generic [ref=e66]: Sign In
        - img [ref=e67]
    - paragraph [ref=e69]:
      - text: No account?
      - link "Register now" [ref=e70] [cursor=pointer]:
        - /url: /en/register
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e76] [cursor=pointer]:
    - generic [ref=e79]:
      - text: Compiling
      - generic [ref=e80]:
        - generic [ref=e81]: .
        - generic [ref=e82]: .
        - generic [ref=e83]: .
  - alert [ref=e84]
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
> 17 |     await expect(this.page).toHaveURL(new RegExp(expectedUrl), { timeout: 10000 });
     |                             ^ Error: expect(page).toHaveURL(expected) failed
  18 |   }
  19 | 
  20 |   async signupTenant(data: any) {
  21 |     await this.page.goto('/en/register');
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