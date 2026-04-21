# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hero-section.spec.ts >> Hero Section >> hero section should be responsive on mobile
- Location: tests\e2e\hero-section.spec.ts:81:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('button').filter({ hasText: /Search Properties/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('button').filter({ hasText: /Search Properties/i })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e6]:
        - link "e" [ref=e7] [cursor=pointer]:
          - /url: /en
          - generic [ref=e8]: e
        - button "☰" [ref=e9]
    - main [ref=e10]:
      - generic [ref=e11]:
        - generic [ref=e12]:
          - generic [ref=e13]:
            - img "HOME" [ref=e15]
            - img "PROJECTS" [ref=e18]
            - button "‹" [ref=e20]
            - button "›" [ref=e21]
            - generic [ref=e23]:
              - paragraph [ref=e24]: Stunning properties
              - heading "PROJECTS FOR COLLECTION" [level=1] [ref=e25]:
                - text: PROJECTS
                - generic [ref=e26]: FOR COLLECTION
              - paragraph [ref=e27]: Discover our exclusive collection of premium real estate properties in the most sought-after locations.
              - generic [ref=e28]:
                - button "Explore Properties" [ref=e29]
                - button "Learn More" [ref=e30]
            - generic [ref=e31]:
              - button "Go to slide 1" [ref=e32]
              - button "Go to slide 2" [ref=e33]
          - generic [ref=e37]:
            - generic [ref=e38]:
              - button "Rent" [ref=e39]
              - button "Sale" [ref=e40]
              - button "Projects" [ref=e41]
            - generic [ref=e42]:
              - generic [ref=e43]:
                - generic [ref=e44]: Location
                - combobox [ref=e45]:
                  - option "Select Location" [selected]
                  - option "Chennai"
                  - option "Mumbai"
                  - option "Bangalore"
                  - option "Delhi"
                  - option "Hyderabad"
              - generic [ref=e46]:
                - generic [ref=e47]: Type
                - combobox [ref=e48]:
                  - option "All Types" [selected]
                  - option "Apartment"
                  - option "Villa"
                  - option "House"
                  - option "Commercial"
              - generic [ref=e49]:
                - generic [ref=e50]: Min Price
                - generic [ref=e51]:
                  - generic [ref=e52]: ₹
                  - spinbutton [ref=e53]
              - generic [ref=e54]:
                - generic [ref=e55]: Max Price
                - generic [ref=e56]:
                  - generic [ref=e57]: ₹
                  - spinbutton [ref=e58]
              - generic [ref=e59]:
                - generic [ref=e60]: Bedrooms
                - combobox [ref=e61]:
                  - option "Any" [selected]
                  - option "1 BHK"
                  - option "2 BHK"
                  - option "3 BHK"
                  - option "4+ BHK"
              - button "Search" [ref=e63]
        - generic [ref=e65]:
          - generic [ref=e66]:
            - heading "Browse by Category" [level=2] [ref=e67]
            - paragraph [ref=e68]: Discover properties across all our available categories
          - generic [ref=e69]:
            - link "🏢 Villa 23 Properties" [ref=e70] [cursor=pointer]:
              - /url: /en/category/villa
              - generic [ref=e71]: 🏢
              - heading "Villa" [level=3] [ref=e72]
              - paragraph [ref=e73]: 23 Properties
            - link "🏗️ Penthouse 3 Properties" [ref=e74] [cursor=pointer]:
              - /url: /en/category/penthouse
              - generic [ref=e75]: 🏗️
              - heading "Penthouse" [level=3] [ref=e76]
              - paragraph [ref=e77]: 3 Properties
            - link "🏠 Banglow 5 Properties" [ref=e78] [cursor=pointer]:
              - /url: /en/category/banglow
              - generic [ref=e79]: 🏠
              - heading "Banglow" [level=3] [ref=e80]
              - paragraph [ref=e81]: 5 Properties
            - link "🏡 House 7 Properties" [ref=e82] [cursor=pointer]:
              - /url: /en/category/house
              - generic [ref=e83]: 🏡
              - heading "House" [level=3] [ref=e84]
              - paragraph [ref=e85]: 7 Properties
            - link "🏞️ Land 1 Property" [ref=e86] [cursor=pointer]:
              - /url: /en/category/land
              - generic [ref=e87]: 🏞️
              - heading "Land" [level=3] [ref=e88]
              - paragraph [ref=e89]: 1 Property
            - link "📍 Piote 4 Properties" [ref=e90] [cursor=pointer]:
              - /url: /en/category/piote
              - generic [ref=e91]: 📍
              - heading "Piote" [level=3] [ref=e92]
              - paragraph [ref=e93]: 4 Properties
            - link "🏪 Commercial 3 Properties" [ref=e94] [cursor=pointer]:
              - /url: /en/category/commercial
              - generic [ref=e95]: 🏪
              - heading "Commercial" [level=3] [ref=e96]
              - paragraph [ref=e97]: 3 Properties
            - link "🏢 Condo 3 Properties" [ref=e98] [cursor=pointer]:
              - /url: /en/category/condo
              - generic [ref=e99]: 🏢
              - heading "Condo" [level=3] [ref=e100]
              - paragraph [ref=e101]: 3 Properties
            - link "🏘️ Townhouse 2 Properties" [ref=e102] [cursor=pointer]:
              - /url: /en/category/townhouse
              - generic [ref=e103]: 🏘️
              - heading "Townhouse" [level=3] [ref=e104]
              - paragraph [ref=e105]: 2 Properties
        - generic [ref=e107]:
          - generic [ref=e108]:
            - heading "Featured Properties" [level=2] [ref=e109]
            - paragraph [ref=e110]: Explore our handpicked selection of premium properties in the market
          - generic [ref=e111]:
            - generic [ref=e112]:
              - generic [ref=e113]:
                - img "Lakeside Sereni..." [ref=e114]
                - generic [ref=e116]: ● Featured
                - button "Add to favorites" [ref=e117]: 🤍
              - generic [ref=e118]:
                - generic [ref=e120]: Villa
                - generic [ref=e121]:
                  - heading "Lakeside Sereni..." [level=3] [ref=e122]
                  - paragraph [ref=e123]: 📍 Bhuj, Gujarat
                  - generic [ref=e124]:
                    - generic [ref=e125]:
                      - generic [ref=e126]: 🛏️
                      - generic [ref=e127]: "5"
                    - generic [ref=e128]:
                      - generic [ref=e129]: 🚿
                      - generic [ref=e130]: "5"
                    - generic [ref=e131]:
                      - generic [ref=e132]: 📐
                      - generic [ref=e133]: "2000"
                - generic [ref=e134]:
                  - generic [ref=e135]: ₹1.6M
                  - link "View Details" [ref=e136] [cursor=pointer]:
                    - /url: /en/property/lakeside-sereni
                    - button "View Details" [ref=e137]
            - generic [ref=e138]:
              - generic [ref=e139]:
                - img "The Villa" [ref=e140]
                - generic [ref=e141]:
                  - generic [ref=e142]: ● Featured
                  - generic [ref=e143]: ⭐ Premium
                - button "Add to favorites" [ref=e144]: 🤍
              - generic [ref=e145]:
                - generic [ref=e147]: Villa
                - generic [ref=e148]:
                  - heading "The Villa" [level=3] [ref=e149]
                  - paragraph [ref=e150]: 📍 Bhuj, Gujarat
                  - generic [ref=e151]:
                    - generic [ref=e152]:
                      - generic [ref=e153]: 🛏️
                      - generic [ref=e154]: "6"
                    - generic [ref=e155]:
                      - generic [ref=e156]: 🚿
                      - generic [ref=e157]: "5"
                    - generic [ref=e158]:
                      - generic [ref=e159]: 📐
                      - generic [ref=e160]: "3000"
                - generic [ref=e161]:
                  - generic [ref=e162]: ₹5.0K
                  - link "View Details" [ref=e163] [cursor=pointer]:
                    - /url: /en/property/the-villa
                    - button "View Details" [ref=e164]
            - generic [ref=e165]:
              - generic [ref=e166]:
                - img "Mountain Majes..." [ref=e167]
                - generic [ref=e169]: ● Featured
                - button "Add to favorites" [ref=e170]: 🤍
              - generic [ref=e171]:
                - generic [ref=e173]: Villa
                - generic [ref=e174]:
                  - heading "Mountain Majes..." [level=3] [ref=e175]
                  - paragraph [ref=e176]: 📍 Bhuj, Gujarat
                  - generic [ref=e177]:
                    - generic [ref=e178]:
                      - generic [ref=e179]: 🛏️
                      - generic [ref=e180]: "5"
                    - generic [ref=e181]:
                      - generic [ref=e182]: 🚿
                      - generic [ref=e183]: "5"
                    - generic [ref=e184]:
                      - generic [ref=e185]: 📐
                      - generic [ref=e186]: "3500"
                - generic [ref=e187]:
                  - generic [ref=e188]: ₹1.8M
                  - link "View Details" [ref=e189] [cursor=pointer]:
                    - /url: /en/property/mountain-majes
                    - button "View Details" [ref=e190]
            - generic [ref=e191]:
              - generic [ref=e192]:
                - img "Serene Oasis Villa" [ref=e193]
                - generic [ref=e195]: ● Featured
                - button "Add to favorites" [ref=e196]: 🤍
              - generic [ref=e197]:
                - generic [ref=e199]: Villa
                - generic [ref=e200]:
                  - heading "Serene Oasis Villa" [level=3] [ref=e201]
                  - paragraph [ref=e202]: 📍 Bhuj, Gujarat
                  - generic [ref=e203]:
                    - generic [ref=e204]:
                      - generic [ref=e205]: 🛏️
                      - generic [ref=e206]: "6"
                    - generic [ref=e207]:
                      - generic [ref=e208]: 🚿
                      - generic [ref=e209]: "2"
                    - generic [ref=e210]:
                      - generic [ref=e211]: 📐
                      - generic [ref=e212]: "1500"
                - generic [ref=e213]:
                  - generic [ref=e214]: ₹1.8M
                  - link "View Details" [ref=e215] [cursor=pointer]:
                    - /url: /en/property/serene-oasis-villa
                    - button "View Details" [ref=e216]
            - generic [ref=e217]:
              - generic [ref=e218]:
                - img "Spotlight Homes" [ref=e219]
                - button "Add to favorites" [ref=e220]: 🤍
              - generic [ref=e221]:
                - generic [ref=e223]: House
                - generic [ref=e224]:
                  - heading "Spotlight Homes" [level=3] [ref=e225]
                  - paragraph [ref=e226]: 📍 Bhuj, Gujarat
                  - generic [ref=e227]:
                    - generic [ref=e228]:
                      - generic [ref=e229]: 🛏️
                      - generic [ref=e230]: "4"
                    - generic [ref=e231]:
                      - generic [ref=e232]: 🚿
                      - generic [ref=e233]: "3"
                    - generic [ref=e234]:
                      - generic [ref=e235]: 📐
                      - generic [ref=e236]: "1800"
                - generic [ref=e237]:
                  - generic [ref=e238]: ₹2.2M
                  - link "View Details" [ref=e239] [cursor=pointer]:
                    - /url: /en/property/spotlight-homes
                    - button "View Details" [ref=e240]
            - generic [ref=e241]:
              - generic [ref=e242]:
                - img "Luxurious Haven Villa" [ref=e243]
                - generic [ref=e245]: ● Featured
                - button "Add to favorites" [ref=e246]: 🤍
              - generic [ref=e247]:
                - generic [ref=e249]: Villa
                - generic [ref=e250]:
                  - heading "Luxurious Haven Villa" [level=3] [ref=e251]
                  - paragraph [ref=e252]: 📍 Bhuj, Gujarat
                  - generic [ref=e253]:
                    - generic [ref=e254]:
                      - generic [ref=e255]: 🛏️
                      - generic [ref=e256]: "5"
                    - generic [ref=e257]:
                      - generic [ref=e258]: 🚿
                      - generic [ref=e259]: "4"
                    - generic [ref=e260]:
                      - generic [ref=e261]: 📐
                      - generic [ref=e262]: "2200"
                - generic [ref=e263]:
                  - generic [ref=e264]: ₹2.5M
                  - link "View Details" [ref=e265] [cursor=pointer]:
                    - /url: /en/property/luxurious-haven-villa
                    - button "View Details" [ref=e266]
          - link "Explore All Properties" [ref=e268] [cursor=pointer]:
            - /url: /en/properties
            - button "Explore All Properties" [ref=e269]
        - generic [ref=e271]:
          - heading "Ready to Find Your Dream Property?" [level=2] [ref=e272]
          - paragraph [ref=e273]: Join thousands of satisfied customers who found their perfect home with us. Our expert team is here to help you every step of the way.
          - link "Browse All Properties" [ref=e274] [cursor=pointer]:
            - /url: /en/properties
    - contentinfo [ref=e275]:
      - generic [ref=e276]:
        - generic [ref=e277]:
          - generic [ref=e278]:
            - generic [ref=e279]:
              - generic [ref=e280]: e
              - heading "eBroker" [level=3] [ref=e281]
            - paragraph [ref=e282]: Your trusted real estate partner for finding dream properties.
          - generic [ref=e283]:
            - heading "Quick Links" [level=4] [ref=e284]
            - list [ref=e285]:
              - listitem [ref=e286]:
                - link "Properties" [ref=e287] [cursor=pointer]:
                  - /url: /en/properties
              - listitem [ref=e288]:
                - link "Categories" [ref=e289] [cursor=pointer]:
                  - /url: /en/categories
              - listitem [ref=e290]:
                - link "Contact" [ref=e291] [cursor=pointer]:
                  - /url: /en/contact
              - listitem [ref=e292]:
                - link "About Us" [ref=e293] [cursor=pointer]:
                  - /url: /en/about
          - generic [ref=e294]:
            - heading "Support" [level=4] [ref=e295]
            - list [ref=e296]:
              - listitem [ref=e297]:
                - link "Help Center" [ref=e298] [cursor=pointer]:
                  - /url: "#help"
              - listitem [ref=e299]:
                - link "Privacy Policy" [ref=e300] [cursor=pointer]:
                  - /url: /en/privacy-policy
              - listitem [ref=e301]:
                - link "Terms of Service" [ref=e302] [cursor=pointer]:
                  - /url: /en/terms
              - listitem [ref=e303]:
                - link "Support" [ref=e304] [cursor=pointer]:
                  - /url: mailto:support@ebroker.com
          - generic [ref=e305]:
            - heading "Contact Info" [level=4] [ref=e306]
            - list [ref=e307]:
              - listitem [ref=e308]:
                - text: "Email:"
                - link "info@ebroker.com" [ref=e309] [cursor=pointer]:
                  - /url: mailto:info@ebroker.com
              - listitem [ref=e310]:
                - text: "Phone:"
                - link "+1 (234) 567-890" [ref=e311] [cursor=pointer]:
                  - /url: tel:+1234567890
        - generic [ref=e313]:
          - paragraph [ref=e314]: © 2024 eBroker. All rights reserved.
          - generic [ref=e315]:
            - link "Twitter" [ref=e316] [cursor=pointer]:
              - /url: "#"
            - link "Facebook" [ref=e317] [cursor=pointer]:
              - /url: "#"
            - link "LinkedIn" [ref=e318] [cursor=pointer]:
              - /url: "#"
  - button "Open Next.js Dev Tools" [ref=e324] [cursor=pointer]:
    - img [ref=e325]
  - alert [ref=e329]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Hero Section', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/en');
  6   |     await page.waitForLoadState('networkidle');
  7   |   });
  8   | 
  9   |   test('should display hero section with background image', async ({ page }) => {
  10  |     const heroSection = page.locator('section').first();
  11  |     await expect(heroSection).toBeVisible();
  12  | 
  13  |     // Check for hero content
  14  |     const heading = heroSection.locator('text=/HOME|PROJECTS/').first();
  15  |     await expect(heading).toBeVisible();
  16  |   });
  17  | 
  18  |   test('should display main headline and subheading', async ({ page }) => {
  19  |     const heroSection = page.locator('section').first();
  20  |     
  21  |     // Should have the word "HOME" or similar
  22  |     const mainHeading = heroSection.getByRole('heading').first();
  23  |     await expect(mainHeading).toBeVisible();
  24  |   });
  25  | 
  26  |   test('should have navigation arrows', async ({ page }) => {
  27  |     const heroSection = page.locator('section').first();
  28  |     
  29  |     // Look for navigation buttons
  30  |     const buttons = heroSection.locator('button');
  31  |     const count = await buttons.count();
  32  | 
  33  |     expect(count).toBeGreaterThan(0);
  34  |   });
  35  | 
  36  |   test('should display slide indicators (dots)', async ({ page }) => {
  37  |     const heroSection = page.locator('section').first();
  38  |     
  39  |     // Slide indicator dots
  40  |     const dots = heroSection.locator('button').filter({ hasText: '' }); // Empty text buttons are likely dots
  41  |     const count = await dots.count();
  42  | 
  43  |     expect(count).toBeGreaterThan(0);
  44  |   });
  45  | 
  46  |   test('should display search filter below hero', async ({ page }) => {
  47  |     // Search filter section
  48  |     const propertyTypeButton = page.locator('button').filter({ hasText: /Rent|Sale|Projects/i }).first();
  49  |     await expect(propertyTypeButton).toBeVisible();
  50  | 
  51  |     // Location select
  52  |     const locationSelect = page.locator('select').first();
  53  |     await expect(locationSelect).toBeVisible();
  54  |   });
  55  | 
  56  |   test('should have search filter inputs', async ({ page }) => {
  57  |     // Should have location, property type, price inputs
  58  |     const selects = page.locator('select');
  59  |     const selectCount = await selects.count();
  60  | 
  61  |     expect(selectCount).toBeGreaterThanOrEqual(2);
  62  | 
  63  |     const inputs = page.locator('input[type="number"]');
  64  |     const inputCount = await inputs.count();
  65  | 
  66  |     expect(inputCount).toBeGreaterThanOrEqual(2); // min and max price
  67  |   });
  68  | 
  69  |   test('should display search button', async ({ page }) => {
  70  |     const searchButton = page.locator('button').filter({ hasText: /Search Properties/i });
  71  |     await expect(searchButton).toBeVisible();
  72  |   });
  73  | 
  74  |   test('should have hero action buttons', async ({ page }) => {
  75  |     const heroSection = page.locator('section').first();
  76  |     
  77  |     const exploreButton = heroSection.locator('button').filter({ hasText: /Explore/i });
  78  |     await expect(exploreButton).toBeVisible();
  79  |   });
  80  | 
  81  |   test('hero section should be responsive on mobile', async ({ page }) => {
  82  |     await page.setViewportSize({ width: 375, height: 667 });
  83  |     await page.goto('/en');
  84  |     await page.waitForLoadState('networkidle');
  85  | 
  86  |     const heroSection = page.locator('section').first();
  87  |     
  88  |     // Should still display hero content
  89  |     const heading = heroSection.getByRole('heading').first();
  90  |     await expect(heading).toBeVisible();
  91  | 
  92  |     // Search filter should be visible
  93  |     const searchButton = page.locator('button').filter({ hasText: /Search Properties/i });
> 94  |     await expect(searchButton).toBeVisible();
      |                                ^ Error: expect(locator).toBeVisible() failed
  95  |   });
  96  | 
  97  |   test('should display search filter inputs with proper sizing on mobile', async ({ page }) => {
  98  |     await page.setViewportSize({ width: 375, height: 667 });
  99  |     await page.goto('/en');
  100 |     await page.waitForLoadState('networkidle');
  101 | 
  102 |     // Check input sizes are reasonable
  103 |     const inputs = page.locator('input');
  104 |     for (let i = 0; i < Math.min(2, await inputs.count()); i++) {
  105 |       const box = await inputs.nth(i).boundingBox();
  106 |       expect(box?.height).toBeGreaterThanOrEqual(40); // Touch-friendly size
  107 |     }
  108 |   });
  109 | 
  110 |   test('search filter tabs should show active state', async ({ page }) => {
  111 |     const rentTab = page.locator('button').filter({ hasText: /^Rent$/i }).first();
  112 |     const saleTab = page.locator('button').filter({ hasText: /^Sale$/i }).first();
  113 | 
  114 |     // One should be active
  115 |     await expect(rentTab).toBeVisible();
  116 |     if (await saleTab.isVisible()) {
  117 |       // Clicking should change active state
  118 |       await saleTab.click();
  119 |       await page.waitForTimeout(100);
  120 |     }
  121 |   });
  122 | });
  123 | 
```