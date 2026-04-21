# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui-visual-consistency.spec.ts >> UI Visual Consistency >> should have proper spacing inside sections
- Location: tests\e2e\ui-visual-consistency.spec.ts:167:7

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - generic [ref=e6]:
      - link "e" [ref=e7]:
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
            - paragraph [ref=e24]: Real estate business
            - heading "HOME FOR FOR SALE" [level=1] [ref=e25]:
              - text: HOME
              - generic [ref=e26]: FOR FOR SALE
            - paragraph [ref=e27]: Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper.
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
          - link "🏢 Villa 23 Properties" [ref=e70]:
            - /url: /en/category/villa
            - generic [ref=e71]: 🏢
            - heading "Villa" [level=3] [ref=e72]
            - paragraph [ref=e73]: 23 Properties
          - link "🏗️ Penthouse 3 Properties" [ref=e74]:
            - /url: /en/category/penthouse
            - generic [ref=e75]: 🏗️
            - heading "Penthouse" [level=3] [ref=e76]
            - paragraph [ref=e77]: 3 Properties
          - link "🏠 Banglow 5 Properties" [ref=e78]:
            - /url: /en/category/banglow
            - generic [ref=e79]: 🏠
            - heading "Banglow" [level=3] [ref=e80]
            - paragraph [ref=e81]: 5 Properties
          - link "🏡 House 7 Properties" [ref=e82]:
            - /url: /en/category/house
            - generic [ref=e83]: 🏡
            - heading "House" [level=3] [ref=e84]
            - paragraph [ref=e85]: 7 Properties
          - link "🏞️ Land 1 Property" [ref=e86]:
            - /url: /en/category/land
            - generic [ref=e87]: 🏞️
            - heading "Land" [level=3] [ref=e88]
            - paragraph [ref=e89]: 1 Property
          - link "📍 Piote 4 Properties" [ref=e90]:
            - /url: /en/category/piote
            - generic [ref=e91]: 📍
            - heading "Piote" [level=3] [ref=e92]
            - paragraph [ref=e93]: 4 Properties
          - link "🏪 Commercial 3 Properties" [ref=e94]:
            - /url: /en/category/commercial
            - generic [ref=e95]: 🏪
            - heading "Commercial" [level=3] [ref=e96]
            - paragraph [ref=e97]: 3 Properties
          - link "🏢 Condo 3 Properties" [ref=e98]:
            - /url: /en/category/condo
            - generic [ref=e99]: 🏢
            - heading "Condo" [level=3] [ref=e100]
            - paragraph [ref=e101]: 3 Properties
          - link "🏘️ Townhouse 2 Properties" [ref=e102]:
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
                - link "View Details" [ref=e136]:
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
                - link "View Details" [ref=e163]:
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
                - link "View Details" [ref=e189]:
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
                - link "View Details" [ref=e215]:
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
                - link "View Details" [ref=e239]:
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
                - link "View Details" [ref=e265]:
                  - /url: /en/property/luxurious-haven-villa
                  - button "View Details" [ref=e266]
        - link "Explore All Properties" [ref=e268]:
          - /url: /en/properties
          - button "Explore All Properties" [ref=e269]
      - generic [ref=e271]:
        - heading "Ready to Find Your Dream Property?" [level=2] [ref=e272]
        - paragraph [ref=e273]: Join thousands of satisfied customers who found their perfect home with us. Our expert team is here to help you every step of the way.
        - link "Browse All Properties" [ref=e274]:
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
              - link "Properties" [ref=e287]:
                - /url: /en/properties
            - listitem [ref=e288]:
              - link "Categories" [ref=e289]:
                - /url: /en/categories
            - listitem [ref=e290]:
              - link "Contact" [ref=e291]:
                - /url: /en/contact
            - listitem [ref=e292]:
              - link "About Us" [ref=e293]:
                - /url: /en/about
        - generic [ref=e294]:
          - heading "Support" [level=4] [ref=e295]
          - list [ref=e296]:
            - listitem [ref=e297]:
              - link "Help Center" [ref=e298]:
                - /url: "#help"
            - listitem [ref=e299]:
              - link "Privacy Policy" [ref=e300]:
                - /url: /en/privacy-policy
            - listitem [ref=e301]:
              - link "Terms of Service" [ref=e302]:
                - /url: /en/terms
            - listitem [ref=e303]:
              - link "Support" [ref=e304]:
                - /url: mailto:support@ebroker.com
        - generic [ref=e305]:
          - heading "Contact Info" [level=4] [ref=e306]
          - list [ref=e307]:
            - listitem [ref=e308]:
              - text: "Email:"
              - link "info@ebroker.com" [ref=e309]:
                - /url: mailto:info@ebroker.com
            - listitem [ref=e310]:
              - text: "Phone:"
              - link "+1 (234) 567-890" [ref=e311]:
                - /url: tel:+1234567890
      - generic [ref=e313]:
        - paragraph [ref=e314]: © 2024 eBroker. All rights reserved.
        - generic [ref=e315]:
          - link "Twitter" [ref=e316]:
            - /url: "#"
          - link "Facebook" [ref=e317]:
            - /url: "#"
          - link "LinkedIn" [ref=e318]:
            - /url: "#"
```

# Test source

```ts
  85  |     const buttons = page.locator('button');
  86  |     const count = await buttons.count();
  87  | 
  88  |     expect(count).toBeGreaterThan(0);
  89  | 
  90  |     // Check primary buttons have proper styling
  91  |     for (let i = 0; i < Math.min(2, count); i++) {
  92  |       const button = buttons.nth(i);
  93  |       const bgColor = await button.evaluate(el => window.getComputedStyle(el).backgroundColor);
  94  |       const textColor = await button.evaluate(el => window.getComputedStyle(el).color);
  95  | 
  96  |       // Should have both background and text color defined
  97  |       expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
  98  |       expect(textColor).not.toBe('rgba(0, 0, 0, 0)');
  99  |     }
  100 |   });
  101 | 
  102 |   test('CTA section should be prominent', async ({ page }) => {
  103 |     const cta = page.locator('section').filter({ has: page.getByRole('heading', { name: /Ready to Find Your Dream Property/i }) });
  104 |     
  105 |     if (await cta.isVisible()) {
  106 |       // CTA should have a distinct background
  107 |       const bgColor = await cta.evaluate(el => window.getComputedStyle(el).backgroundColor);
  108 |       expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
  109 | 
  110 |       // Should have a button
  111 |       const button = cta.locator('button').first();
  112 |       await expect(button).toBeVisible();
  113 |     }
  114 |   });
  115 | 
  116 |   test('should have no text overflow on cards', async ({ page }) => {
  117 |     const propertiesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Featured Properties/i }) });
  118 |     
  119 |     const cards = propertiesSection.locator('[class*="rounded"]').filter({ has: page.locator('h3') });
  120 | 
  121 |     for (let i = 0; i < Math.min(2, await cards.count()); i++) {
  122 |       const card = cards.nth(i);
  123 |       const title = card.locator('h3').first();
  124 | 
  125 |       if (await title.isVisible()) {
  126 |         const titleBox = await title.boundingBox();
  127 |         const cardBox = await card.boundingBox();
  128 | 
  129 |         if (titleBox && cardBox) {
  130 |           // Title should be within card bounds
  131 |           expect(titleBox.x).toBeGreaterThanOrEqual(cardBox.x);
  132 |           expect(titleBox.x + titleBox.width).toBeLessThanOrEqual(cardBox.x + cardBox.width);
  133 |         }
  134 |       }
  135 |     }
  136 |   });
  137 | 
  138 |   test('should have proper icon sizing in categories', async ({ page }) => {
  139 |     const categoriesSection = page.locator('section').filter({ has: page.getByRole('heading', { name: /Browse by Category/i }) });
  140 |     
  141 |     const icons = categoriesSection.locator('text=/🏢|🏗️|🏠|🏡/');
  142 |     const count = await icons.count();
  143 | 
  144 |     expect(count).toBeGreaterThan(0);
  145 | 
  146 |     // Icons should be rendered and visible
  147 |     for (let i = 0; i < Math.min(2, count); i++) {
  148 |       const icon = icons.nth(i);
  149 |       await expect(icon).toBeVisible();
  150 |     }
  151 |   });
  152 | 
  153 |   test('should display section headings consistently', async ({ page }) => {
  154 |     const headings = page.getByRole('heading');
  155 |     const count = await headings.count();
  156 | 
  157 |     expect(count).toBeGreaterThan(2);
  158 | 
  159 |     // Main section headings should be large
  160 |     const mainHeading = headings.nth(1); // First is likely in hero
  161 |     const fontSize = await mainHeading.evaluate(el => window.getComputedStyle(el).fontSize);
  162 |     const fontSizeNum = parseFloat(fontSize);
  163 | 
  164 |     expect(fontSizeNum).toBeGreaterThan(24); // Section headings should be substantial
  165 |   });
  166 | 
  167 |   test('should have proper spacing inside sections', async ({ page }) => {
  168 |     const sections = page.locator('section');
  169 |     const count = await sections.count();
  170 | 
  171 |     for (let i = 0; i < Math.min(2, count); i++) {
  172 |       const section = sections.nth(i);
  173 |       const padding = await section.evaluate(el => {
  174 |         const style = window.getComputedStyle(el);
  175 |         return {
  176 |           paddingTop: style.paddingTop,
  177 |           paddingBottom: style.paddingBottom,
  178 |         };
  179 |       });
  180 | 
  181 |       const topPadding = parseFloat(padding.paddingTop);
  182 |       const bottomPadding = parseFloat(padding.paddingBottom);
  183 | 
  184 |       // Should have reasonable padding
> 185 |       expect(topPadding).toBeGreaterThan(0);
      |                          ^ Error: expect(received).toBeGreaterThan(expected)
  186 |       expect(bottomPadding).toBeGreaterThan(0);
  187 |     }
  188 |   });
  189 | });
  190 | 
```