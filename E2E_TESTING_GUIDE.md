# E2E Testing Quick Start Guide

## Installation & Setup

```bash
# Tests are already configured - Playwright is installed
npm run test:e2e
```

---

## Test Structure

```
tests/e2e/
├── layout-spacing.spec.ts          # Section alignment & spacing
├── property-cards.spec.ts          # Images, cards, badges
├── categories-grid.spec.ts         # Category grid layout
├── hero-section.spec.ts            # Hero & search filter
├── responsive-design.spec.ts       # Mobile, tablet, desktop
├── ui-visual-consistency.spec.ts   # Styles, colors, fonts
└── ui-validation.spec.ts           # Production-ready tests
```

---

## Running Tests

### Run All Tests
```bash
npm run test:e2e
```

### Run Specific Test File
```bash
npx playwright test tests/e2e/ui-validation.spec.ts
```

### Run on Specific Browser
```bash
# Chromium only
npx playwright test --project=chromium

# Firefox only  
npx playwright test --project=firefox

# WebKit only
npx playwright test --project=webkit

# Mobile Chrome
npx playwright test --project="Mobile Chrome"

# Mobile Safari
npx playwright test --project="Mobile Safari"
```

### Run with Different Reporters
```bash
# HTML report
npx playwright test --reporter=html

# Line-by-line output
npx playwright test --reporter=line

# Dot reporter (compact)
npx playwright test --reporter=dot

# JSON output
npx playwright test --reporter=json > results.json
```

### View Test Results
```bash
# Open HTML report
npx playwright show-report

# Or manually open
open playwright-report/index.html  # Mac
start playwright-report/index.html # Windows
```

### Debug Mode
```bash
# Run tests in UI with visual debugging
npx playwright test --ui

# Run single test with debugging
npx playwright test --debug tests/e2e/ui-validation.spec.ts
```

### Run Tests in Watch Mode
```bash
npx playwright test --watch
```

---

## Test Execution Examples

### Quick Validation (Chromium only, fast)
```bash
npx playwright test --project=chromium tests/e2e/ui-validation.spec.ts
```

### Complete Suite (All browsers, ~15-20 minutes)
```bash
npm run test:e2e
```

### CI/CD Pipeline
```bash
# For continuous integration
npx playwright test --reporter=html --workers=1
```

---

## What Gets Tested

### ✅ Layout & Spacing
- Sections properly aligned
- No overlapping content
- Consistent vertical rhythm
- No horizontal scroll

### ✅ Property Cards
- Images load correctly
- Card heights consistent
- Badges positioned properly
- Buttons always at bottom

### ✅ Responsive Design
- Mobile (375px)
- Tablet (768px)
- Desktop (1440px)
- Touch-friendly sizes

### ✅ Visual Consistency
- Color contrast readable
- Typography scales properly
- Hover effects smooth
- Icons sized correctly

### ✅ Form Elements
- Inputs functional
- Selects work
- Search filters visible
- Form styling consistent

### ✅ Image Optimization
- Next.js Image component used
- Proper aspect ratios
- Fallback images configured
- No layout shift

---

## Common Issues & Solutions

### Tests Timeout
```bash
# Increase timeout
npx playwright test --timeout=60000

# Or specify in test
test.setTimeout(60000);
```

### Tests Fail on CI
```bash
# Run with single worker
npx playwright test --workers=1

# Or use CI flag
export CI=true
npm run test:e2e
```

### Screenshots Not Generated
```bash
# Explicitly enable screenshots
npx playwright test --screenshot=only-on-failure
```

### Need to Update Snapshots
```bash
npx playwright test --update-snapshots
```

---

## Test Configuration

**File**: `playwright.config.ts`

- **Browsers**: Chromium, Firefox, WebKit
- **Devices**: Desktop, Mobile Chrome, Mobile Safari
- **Base URL**: `http://localhost:3001`
- **Timeout**: 30s per test
- **Retries**: 0 (2 on CI)
- **Parallel**: Disabled (sequential execution)
- **Web Server**: Auto-starts on port 3001

---

## Test Categories

### Critical Tests (Must Pass)
- ✅ ui-validation.spec.ts
- ✅ layout-spacing.spec.ts
- ✅ property-cards.spec.ts

### Comprehensive Tests (Recommended)
- ✅ responsive-design.spec.ts
- ✅ categories-grid.spec.ts
- ✅ hero-section.spec.ts

### Visual Tests (Additional)
- ✅ ui-visual-consistency.spec.ts

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: playwright-report/
```

---

## Performance Benchmarks

| Test Suite | Execution Time |
|------------|----------------|
| ui-validation | ~30-45 seconds |
| layout-spacing | ~20-30 seconds |
| property-cards | ~25-40 seconds |
| responsive-design | ~60-90 seconds |
| Full suite (all browsers) | ~15-20 minutes |

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3001
lsof -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Tests Hanging
```bash
# Run with timeout
timeout 120 npm run test:e2e

# Or cancel with Ctrl+C
```

### Image Loading Issues
```bash
# Tests may fail if images can't load from Unsplash
# This is expected - fallback images are tested
```

---

## Best Practices

1. **Run before deployment**
   ```bash
   npm run test:e2e
   ```

2. **Update page structure**
   - Rerun tests to catch broken selectors
   - Update tests if DOM changes

3. **Add new UI components**
   - Create new test spec file
   - Add tests for all states

4. **Debugging failed tests**
   ```bash
   npx playwright test --debug tests/e2e/failing-test.spec.ts
   ```

5. **Local development**
   ```bash
   npx playwright test --watch
   ```

---

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Test Report Location](playwright-report/index.html)
- [Configuration](playwright.config.ts)
- [E2E Test Report](E2E_TEST_REPORT.md)

---

**Status**: ✅ Production-ready E2E test suite configured and ready for use.
