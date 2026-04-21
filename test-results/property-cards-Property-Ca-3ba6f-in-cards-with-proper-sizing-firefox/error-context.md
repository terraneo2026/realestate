# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: property-cards.spec.ts >> Property Cards & Images >> should render images in cards with proper sizing
- Location: tests\e2e\property-cards.spec.ts:19:7

# Error details

```
Error: expect: Property 'toBeBetween' not found.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - link "e" [ref=e7] [cursor=pointer]:
        - /url: /en
        - generic [ref=e8]: e
    - main [ref=e9]:
      - generic [ref=e10]:
        - generic [ref=e11]:
          - generic [ref=e12]:
            - img "HOME" [ref=e14]
            - img "PROJECTS" [ref=e17]
            - button "‹" [ref=e19]
            - button "›" [ref=e20]
            - generic [ref=e22]:
              - paragraph [ref=e23]: Real estate business
              - heading "HOME FOR FOR SALE" [level=1] [ref=e24]:
                - text: HOME
                - generic [ref=e25]: FOR FOR SALE
              - paragraph [ref=e26]: Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper.
              - generic [ref=e27]:
                - button "Explore Properties" [ref=e28]
                - button "Learn More" [ref=e29]
            - generic [ref=e30]:
              - button "Go to slide 1" [ref=e31]
              - button "Go to slide 2" [ref=e32]
          - generic [ref=e36]:
            - generic [ref=e37]:
              - button "Rent" [ref=e38]
              - button "Sale" [ref=e39]
              - button "Projects" [ref=e40]
            - generic [ref=e41]:
              - generic [ref=e42]:
                - generic [ref=e43]: Location
                - combobox [ref=e44]:
                  - option "Select Location" [selected]
                  - option "Chennai"
                  - option "Mumbai"
                  - option "Bangalore"
                  - option "Delhi"
                  - option "Hyderabad"
              - generic [ref=e45]:
                - generic [ref=e46]: Type
                - combobox [ref=e47]:
                  - option "All Types" [selected]
                  - option "Apartment"
                  - option "Villa"
                  - option "House"
                  - option "Commercial"
              - generic [ref=e48]:
                - generic [ref=e49]: Min Price
                - generic [ref=e50]:
                  - generic [ref=e51]: ₹
                  - spinbutton [ref=e52]
              - generic [ref=e53]:
                - generic [ref=e54]: Max Price
                - generic [ref=e55]:
                  - generic [ref=e56]: ₹
                  - spinbutton [ref=e57]
              - generic [ref=e58]:
                - generic [ref=e59]: Bedrooms
                - combobox [ref=e60]:
                  - option "Any" [selected]
                  - option "1 BHK"
                  - option "2 BHK"
                  - option "3 BHK"
                  - option "4+ BHK"
              - button "Search" [ref=e62]
        - generic [ref=e64]:
          - generic [ref=e65]:
            - heading "Browse by Category" [level=2] [ref=e66]
            - paragraph [ref=e67]: Discover properties across all our available categories
          - generic [ref=e68]:
            - link "🏢 Villa 23 Properties" [ref=e69] [cursor=pointer]:
              - /url: /en/category/villa
              - generic [ref=e70]: 🏢
              - heading "Villa" [level=3] [ref=e71]
              - paragraph [ref=e72]: 23 Properties
            - link "🏗️ Penthouse 3 Properties" [ref=e73] [cursor=pointer]:
              - /url: /en/category/penthouse
              - generic [ref=e74]: 🏗️
              - heading "Penthouse" [level=3] [ref=e75]
              - paragraph [ref=e76]: 3 Properties
            - link "🏠 Banglow 5 Properties" [ref=e77] [cursor=pointer]:
              - /url: /en/category/banglow
              - generic [ref=e78]: 🏠
              - heading "Banglow" [level=3] [ref=e79]
              - paragraph [ref=e80]: 5 Properties
            - link "🏡 House 7 Properties" [ref=e81] [cursor=pointer]:
              - /url: /en/category/house
              - generic [ref=e82]: 🏡
              - heading "House" [level=3] [ref=e83]
              - paragraph [ref=e84]: 7 Properties
            - link "🏞️ Land 1 Property" [ref=e85] [cursor=pointer]:
              - /url: /en/category/land
              - generic [ref=e86]: 🏞️
              - heading "Land" [level=3] [ref=e87]
              - paragraph [ref=e88]: 1 Property
            - link "📍 Piote 4 Properties" [ref=e89] [cursor=pointer]:
              - /url: /en/category/piote
              - generic [ref=e90]: 📍
              - heading "Piote" [level=3] [ref=e91]
              - paragraph [ref=e92]: 4 Properties
            - link "🏪 Commercial 3 Properties" [ref=e93] [cursor=pointer]:
              - /url: /en/category/commercial
              - generic [ref=e94]: 🏪
              - heading "Commercial" [level=3] [ref=e95]
              - paragraph [ref=e96]: 3 Properties
            - link "🏢 Condo 3 Properties" [ref=e97] [cursor=pointer]:
              - /url: /en/category/condo
              - generic [ref=e98]: 🏢
              - heading "Condo" [level=3] [ref=e99]
              - paragraph [ref=e100]: 3 Properties
            - link "🏘️ Townhouse 2 Properties" [ref=e101] [cursor=pointer]:
              - /url: /en/category/townhouse
              - generic [ref=e102]: 🏘️
              - heading "Townhouse" [level=3] [ref=e103]
              - paragraph [ref=e104]: 2 Properties
        - generic [ref=e106]:
          - generic [ref=e107]:
            - heading "Featured Properties" [level=2] [ref=e108]
            - paragraph [ref=e109]: Explore our handpicked selection of premium properties in the market
          - generic [ref=e110]:
            - generic [ref=e111]:
              - generic [ref=e112]:
                - img "Lakeside Sereni..." [ref=e113]
                - generic [ref=e115]: ● Featured
                - button "Add to favorites" [ref=e116]: 🤍
              - generic [ref=e117]:
                - generic [ref=e119]: Villa
                - generic [ref=e120]:
                  - heading "Lakeside Sereni..." [level=3] [ref=e121]
                  - paragraph [ref=e122]: 📍 Bhuj, Gujarat
                  - generic [ref=e123]:
                    - generic [ref=e124]:
                      - generic [ref=e125]: 🛏️
                      - generic [ref=e126]: "5"
                    - generic [ref=e127]:
                      - generic [ref=e128]: 🚿
                      - generic [ref=e129]: "5"
                    - generic [ref=e130]:
                      - generic [ref=e131]: 📐
                      - generic [ref=e132]: "2000"
                - generic [ref=e133]:
                  - generic [ref=e134]: ₹1.6M
                  - link "View Details" [ref=e135] [cursor=pointer]:
                    - /url: /en/property/lakeside-sereni
                    - button "View Details" [ref=e136]
            - generic [ref=e137]:
              - generic [ref=e138]:
                - img "The Villa" [ref=e139]
                - generic [ref=e140]:
                  - generic [ref=e141]: ● Featured
                  - generic [ref=e142]: ⭐ Premium
                - button "Add to favorites" [ref=e143]: 🤍
              - generic [ref=e144]:
                - generic [ref=e146]: Villa
                - generic [ref=e147]:
                  - heading "The Villa" [level=3] [ref=e148]
                  - paragraph [ref=e149]: 📍 Bhuj, Gujarat
                  - generic [ref=e150]:
                    - generic [ref=e151]:
                      - generic [ref=e152]: 🛏️
                      - generic [ref=e153]: "6"
                    - generic [ref=e154]:
                      - generic [ref=e155]: 🚿
                      - generic [ref=e156]: "5"
                    - generic [ref=e157]:
                      - generic [ref=e158]: 📐
                      - generic [ref=e159]: "3000"
                - generic [ref=e160]:
                  - generic [ref=e161]: ₹5.0K
                  - link "View Details" [ref=e162] [cursor=pointer]:
                    - /url: /en/property/the-villa
                    - button "View Details" [ref=e163]
            - generic [ref=e164]:
              - generic [ref=e165]:
                - img "Mountain Majes..." [ref=e166]
                - generic [ref=e168]: ● Featured
                - button "Add to favorites" [ref=e169]: 🤍
              - generic [ref=e170]:
                - generic [ref=e172]: Villa
                - generic [ref=e173]:
                  - heading "Mountain Majes..." [level=3] [ref=e174]
                  - paragraph [ref=e175]: 📍 Bhuj, Gujarat
                  - generic [ref=e176]:
                    - generic [ref=e177]:
                      - generic [ref=e178]: 🛏️
                      - generic [ref=e179]: "5"
                    - generic [ref=e180]:
                      - generic [ref=e181]: 🚿
                      - generic [ref=e182]: "5"
                    - generic [ref=e183]:
                      - generic [ref=e184]: 📐
                      - generic [ref=e185]: "3500"
                - generic [ref=e186]:
                  - generic [ref=e187]: ₹1.8M
                  - link "View Details" [ref=e188] [cursor=pointer]:
                    - /url: /en/property/mountain-majes
                    - button "View Details" [ref=e189]
            - generic [ref=e190]:
              - generic [ref=e191]:
                - img "Serene Oasis Villa" [ref=e192]
                - generic [ref=e194]: ● Featured
                - button "Add to favorites" [ref=e195]: 🤍
              - generic [ref=e196]:
                - generic [ref=e198]: Villa
                - generic [ref=e199]:
                  - heading "Serene Oasis Villa" [level=3] [ref=e200]
                  - paragraph [ref=e201]: 📍 Bhuj, Gujarat
                  - generic [ref=e202]:
                    - generic [ref=e203]:
                      - generic [ref=e204]: 🛏️
                      - generic [ref=e205]: "6"
                    - generic [ref=e206]:
                      - generic [ref=e207]: 🚿
                      - generic [ref=e208]: "2"
                    - generic [ref=e209]:
                      - generic [ref=e210]: 📐
                      - generic [ref=e211]: "1500"
                - generic [ref=e212]:
                  - generic [ref=e213]: ₹1.8M
                  - link "View Details" [ref=e214] [cursor=pointer]:
                    - /url: /en/property/serene-oasis-villa
                    - button "View Details" [ref=e215]
            - generic [ref=e216]:
              - generic [ref=e217]:
                - img "Spotlight Homes" [ref=e218]
                - button "Add to favorites" [ref=e219]: 🤍
              - generic [ref=e220]:
                - generic [ref=e222]: House
                - generic [ref=e223]:
                  - heading "Spotlight Homes" [level=3] [ref=e224]
                  - paragraph [ref=e225]: 📍 Bhuj, Gujarat
                  - generic [ref=e226]:
                    - generic [ref=e227]:
                      - generic [ref=e228]: 🛏️
                      - generic [ref=e229]: "4"
                    - generic [ref=e230]:
                      - generic [ref=e231]: 🚿
                      - generic [ref=e232]: "3"
                    - generic [ref=e233]:
                      - generic [ref=e234]: 📐
                      - generic [ref=e235]: "1800"
                - generic [ref=e236]:
                  - generic [ref=e237]: ₹2.2M
                  - link "View Details" [ref=e238] [cursor=pointer]:
                    - /url: /en/property/spotlight-homes
                    - button "View Details" [ref=e239]
            - generic [ref=e240]:
              - generic [ref=e241]:
                - img "Luxurious Haven Villa" [ref=e242]
                - generic [ref=e244]: ● Featured
                - button "Add to favorites" [ref=e245]: 🤍
              - generic [ref=e246]:
                - generic [ref=e248]: Villa
                - generic [ref=e249]:
                  - heading "Luxurious Haven Villa" [level=3] [ref=e250]
                  - paragraph [ref=e251]: 📍 Bhuj, Gujarat
                  - generic [ref=e252]:
                    - generic [ref=e253]:
                      - generic [ref=e254]: 🛏️
                      - generic [ref=e255]: "5"
                    - generic [ref=e256]:
                      - generic [ref=e257]: 🚿
                      - generic [ref=e258]: "4"
                    - generic [ref=e259]:
                      - generic [ref=e260]: 📐
                      - generic [ref=e261]: "2200"
                - generic [ref=e262]:
                  - generic [ref=e263]: ₹2.5M
                  - link "View Details" [ref=e264] [cursor=pointer]:
                    - /url: /en/property/luxurious-haven-villa
                    - button "View Details" [ref=e265]
          - link "Explore All Properties" [ref=e267] [cursor=pointer]:
            - /url: /en/properties
            - button "Explore All Properties" [ref=e268]
        - generic [ref=e270]:
          - heading "Ready to Find Your Dream Property?" [level=2] [ref=e271]
          - paragraph [ref=e272]: Join thousands of satisfied customers who found their perfect home with us. Our expert team is here to help you every step of the way.
          - link "Browse All Properties" [ref=e273] [cursor=pointer]:
            - /url: /en/properties
    - contentinfo [ref=e274]:
      - generic [ref=e275]:
        - generic [ref=e276]:
          - generic [ref=e277]:
            - generic [ref=e278]:
              - generic [ref=e279]: e
              - heading "eBroker" [level=3] [ref=e280]
            - paragraph [ref=e281]: Your trusted real estate partner for finding dream properties.
          - generic [ref=e282]:
            - heading "Quick Links" [level=4] [ref=e283]
            - list [ref=e284]:
              - listitem [ref=e285]:
                - link "Properties" [ref=e286] [cursor=pointer]:
                  - /url: /en/properties
              - listitem [ref=e287]:
                - link "Categories" [ref=e288] [cursor=pointer]:
                  - /url: /en/categories
              - listitem [ref=e289]:
                - link "Contact" [ref=e290] [cursor=pointer]:
                  - /url: /en/contact
              - listitem [ref=e291]:
                - link "About Us" [ref=e292] [cursor=pointer]:
                  - /url: /en/about
          - generic [ref=e293]:
            - heading "Support" [level=4] [ref=e294]
            - list [ref=e295]:
              - listitem [ref=e296]:
                - link "Help Center" [ref=e297] [cursor=pointer]:
                  - /url: "#help"
              - listitem [ref=e298]:
                - link "Privacy Policy" [ref=e299] [cursor=pointer]:
                  - /url: /en/privacy-policy
              - listitem [ref=e300]:
                - link "Terms of Service" [ref=e301] [cursor=pointer]:
                  - /url: /en/terms
              - listitem [ref=e302]:
                - link "Support" [ref=e303] [cursor=pointer]:
                  - /url: mailto:support@ebroker.com
          - generic [ref=e304]:
            - heading "Contact Info" [level=4] [ref=e305]
            - list [ref=e306]:
              - listitem [ref=e307]:
                - text: "Email:"
                - link "info@ebroker.com" [ref=e308] [cursor=pointer]:
                  - /url: mailto:info@ebroker.com
              - listitem [ref=e309]:
                - text: "Phone:"
                - link "+1 (234) 567-890" [ref=e310] [cursor=pointer]:
                  - /url: tel:+1234567890
        - generic [ref=e312]:
          - paragraph [ref=e313]: © 2024 eBroker. All rights reserved.
          - generic [ref=e314]:
            - link "Twitter" [ref=e315] [cursor=pointer]:
              - /url: "#"
            - link "Facebook" [ref=e316] [cursor=pointer]:
              - /url: "#"
            - link "LinkedIn" [ref=e317] [cursor=pointer]:
              - /url: "#"
  - button "Open Next.js Dev Tools" [ref=e323] [cursor=pointer]:
    - img [ref=e324]
  - alert [ref=e328]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Property Cards & Images', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/en');
  6   |     await page.waitForLoadState('networkidle');
  7   |   });
  8   | 
  9   |   test('should display property cards in grid layout', async ({ page }) => {
  10  |     // Find Featured Properties section
  11  |     const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
  12  |     
  13  |     const cards = propertiesSection.locator('div').filter({ has: page.locator('text=View Details') });
  14  |     const cardCount = await cards.count();
  15  | 
  16  |     expect(cardCount).toBeGreaterThan(0);
  17  |   });
  18  | 
  19  |   test('should render images in cards with proper sizing', async ({ page }) => {
  20  |     const images = page.locator('[role="img"]').or(page.locator('img'));
  21  |     
  22  |     let imageCount = 0;
  23  |     for (let i = 0; i < Math.min(3, await images.count()); i++) {
  24  |       const img = images.nth(i);
  25  |       const box = await img.boundingBox();
  26  | 
  27  |       if (box && box.width > 0 && box.height > 0) {
  28  |         imageCount++;
  29  |         // Check reasonable aspect ratio
  30  |         const aspectRatio = box.width / box.height;
> 31  |         expect(aspectRatio).toBeBetween(0.5, 2.5);
      |                            ^ Error: expect: Property 'toBeBetween' not found.
  32  |       }
  33  |     }
  34  | 
  35  |     expect(imageCount).toBeGreaterThan(0);
  36  |   });
  37  | 
  38  |   test('should have proper card structure with all elements', async ({ page }) => {
  39  |     const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
  40  |     
  41  |     // Get first card
  42  |     const firstCard = propertiesSection.locator('a').first();
  43  |     await expect(firstCard).toBeVisible();
  44  | 
  45  |     // Check card contains essential elements
  46  |     const cardParent = firstCard.locator('..');
  47  |     
  48  |     // Should have price
  49  |     const price = cardParent.locator('text=/₹/');
  50  |     await expect(price).toBeVisible();
  51  | 
  52  |     // Should have view details button
  53  |     const button = cardParent.locator('button, a').filter({ hasText: /View Details/i });
  54  |     await expect(button).toBeVisible();
  55  |   });
  56  | 
  57  |   test('should display property type badge', async ({ page }) => {
  58  |     const badges = page.locator('text=/Villa|House|Apartment/').first();
  59  |     await expect(badges).toBeVisible();
  60  |   });
  61  | 
  62  |   test('should maintain card height consistency', async ({ page }) => {
  63  |     const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
  64  |     const cards = propertiesSection.locator('[class*="rounded"]').filter({ has: page.locator('button').filter({ hasText: /View Details/i }) });
  65  | 
  66  |     const heights: number[] = [];
  67  |     for (let i = 0; i < Math.min(3, await cards.count()); i++) {
  68  |       const box = await cards.nth(i).boundingBox();
  69  |       if (box) heights.push(box.height);
  70  |     }
  71  | 
  72  |     // Cards should have similar heights (within 20% tolerance)
  73  |     if (heights.length > 1) {
  74  |       const avgHeight = heights.reduce((a, b) => a + b) / heights.length;
  75  |       const tolerance = avgHeight * 0.2;
  76  | 
  77  |       heights.forEach(height => {
  78  |         expect(Math.abs(height - avgHeight)).toBeLessThan(tolerance);
  79  |       });
  80  |     }
  81  |   });
  82  | 
  83  |   test('should show favorite button on cards', async ({ page }) => {
  84  |     const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
  85  |     const favoriteButtons = propertiesSection.locator('button').filter({ hasText: /❤️|🤍/ });
  86  | 
  87  |     const count = await favoriteButtons.count();
  88  |     expect(count).toBeGreaterThan(0);
  89  |   });
  90  | 
  91  |   test('should toggle favorite button on click', async ({ page }) => {
  92  |     const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
  93  |     const favoriteButton = propertiesSection.locator('button').filter({ hasText: /🤍/ }).first();
  94  | 
  95  |     if (await favoriteButton.isVisible()) {
  96  |       const initialText = await favoriteButton.textContent();
  97  |       
  98  |       await favoriteButton.click();
  99  |       
  100 |       // Wait for state update
  101 |       await page.waitForTimeout(100);
  102 |       
  103 |       const newText = await favoriteButton.textContent();
  104 |       expect(newText).not.toBe(initialText);
  105 |     }
  106 |   });
  107 | 
  108 |   test('should have badge positioning on image container', async ({ page }) => {
  109 |     const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
  110 |     
  111 |     // Check for Featured badge
  112 |     const featuredBadge = propertiesSection.locator('text=Featured').first();
  113 |     if (await featuredBadge.isVisible()) {
  114 |       const box = await featuredBadge.boundingBox();
  115 |       expect(box).toBeDefined();
  116 |       expect(box?.x).toBeLessThan(200); // Should be on left side
  117 |     }
  118 |   });
  119 | 
  120 |   test('should have proper padding inside cards', async ({ page }) => {
  121 |     const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
  122 |     
  123 |     // Find card content area
  124 |     const cardContent = propertiesSection.locator('[class*="p-"]').filter({ hasText: /₹/ }).first();
  125 |     const box = await cardContent.boundingBox();
  126 |     
  127 |     if (box) {
  128 |       // Content should have padding (not be at edge)
  129 |       expect(box.x).toBeGreaterThan(0);
  130 |     }
  131 |   });
```