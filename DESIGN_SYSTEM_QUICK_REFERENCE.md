# Design System - Quick Reference Guide

## 🎨 Color Palette

| Color | Hex | Usage | CSS Var |
|-------|-----|-------|---------|
| Primary | #087c7c | Buttons, headers, interactive elements | `var(--primary-color)` |
| Sell | #0186d8 | For-Sale badges, secondary buttons | `var(--secondary-sell)` |
| Rent | #db9305 | For-Rent badges, tertiary buttons | `var(--secondary-rent)` |
| Error | #DB3D26 | Error messages, delete buttons | `var(--error-color)` |
| Success | #25d366 | Success messages, checkmarks | `var(--success-color)` |
| Warning | #ff6b18 | Warning messages | `var(--warning-color)` |
| Text Primary | #282f39 | Body text | `var(--text-primary)` |
| Text Secondary | #595f65 | Secondary text | `var(--text-secondary)` |
| Border | #e1e1e1 | Dividers, borders | `var(--border-color)` |
| Background | #ffffff | Cards, containers | `var(--background)` |

## 📝 Typography

```
H1: 34px • Weight 600 • Use for page titles
H2: 26px • Weight 600 • Use for section titles
H3: 18px • Weight 500 • Use for subsections
Body: 14px • Weight 400 • Default text
Small: 12px • For captions, hints
Font: Manrope (Google Font)
```

**CSS Classes**:
```html
<h1>Main Title</h1>
<h2>Section Title</h2>
<p>Body text</p>
<p class="text-muted">Secondary text</p>
<small>Small text</small>
```

## 🔘 Buttons

```html
<!-- Primary (Most important action) -->
<button class="btn btn-primary">Submit</button>

<!-- Secondary (Alternative action) -->
<button class="btn btn-secondary">Save</button>

<!-- Outline (Less prominent action) -->
<button class="btn btn-outline">Cancel</button>

<!-- Ghost (Minimal style) -->
<button class="btn btn-ghost">Learn More</button>

<!-- Danger (Destructive action) -->
<button class="btn btn-danger">Delete</button>

<!-- Sizes: Default 40px, Small 32px, Large 48px -->
<button class="btn btn-primary btn-small">Small</button>
<button class="btn btn-primary">Default</button>
<button class="btn btn-primary btn-large">Large</button>
```

## 📦 Cards

```html
<div class="card">
  <!-- Image (200px height) -->
  <img class="card-image" src="image.jpg" alt="Description" />
  
  <!-- Body -->
  <div class="card-body">
    <h3>Title</h3>
    <p>Content goes here</p>
  </div>
  
  <!-- Footer (Optional) -->
  <div class="card-footer">
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

**Card Variants**:
- `.card-image` → 200px (default)
- `.card-image-tall` → 300px
- `.card-image-compact` → 150px

## 📋 Forms

```html
<div class="form-group">
  <label class="label">Email Address</label>
  <input type="email" class="input" placeholder="you@example.com" />
  <div class="form-hint">Helper text here</div>
</div>

<div class="form-group">
  <label class="label">Message</label>
  <textarea class="textarea" placeholder="Enter message"></textarea>
  <div class="form-error">Error message here</div>
</div>

<div class="form-group">
  <label class="label">Category</label>
  <select class="select">
    <option>Select...</option>
    <option>Option 1</option>
  </select>
</div>
```

## 🏷️ Badges

```html
<span class="badge badge-primary">Primary</span>
<span class="badge badge-secondary">Secondary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-error">Error</span>
<span class="badge badge-outline">Outline</span>
```

## 🎯 Spacing Scale

| Class | Value | Use Case |
|-------|-------|----------|
| `p-xs` / `m-xs` | 4px | Tight spacing |
| `p-sm` / `m-sm` | 8px | Small gaps |
| `p-md` / `m-md` | 12px | Medium gaps |
| `p-lg` / `m-lg` | 16px | Standard spacing |
| `p-xl` / `m-xl` | 24px | Large spacing |
| `p-2xl` / `m-2xl` | 32px | Extra large |
| `gap-sm` / `gap-md` / `gap-lg` / `gap-xl` | 8-24px | Grid gaps |

## 🔲 Grid System

```html
<!-- Responsive grid (4 cols desktop → 2 cols tablet → 1 col mobile) -->
<div class="grid grid-cols-4 gap-lg">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
  <div class="card">Item 3</div>
  <div class="card">Item 4</div>
</div>
```

**Responsive Behavior**:
- Desktop (> 1024px): 4 columns
- Tablet (768px-1024px): 3 columns
- Mobile (< 768px): 2 columns
- Small mobile (< 480px): 1 column

## 💎 Shadows

```html
<div class="shadow-xs">Extra small shadow</div>
<div class="shadow-sm">Small shadow</div>
<div class="shadow-md">Medium shadow (default for cards)</div>
<div class="shadow-lg">Large shadow</div>
<div class="shadow-xl">Extra large shadow</div>
```

## 🎨 Common Patterns

### Property Card
```tsx
<div class="card">
  <img class="card-image" src={property.image} alt={property.title} />
  <div class="card-body">
    <h3>{property.title}</h3>
    <p className="text-muted">📍 {property.location}</p>
    <p className="primaryColor" style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--weight-semibold)' }}>
      {property.price}
    </p>
  </div>
  <div className="card-footer flex-between">
    <span className="text-muted text-small">🛏 {property.bedrooms} | 🚿 {property.bathrooms}</span>
    <button className="btn btn-primary btn-small">View</button>
  </div>
</div>
```

### Filter Form
```tsx
<form className="card p-lg">
  <div className="grid grid-cols-2 gap-lg">
    <div className="form-group">
      <label className="label">Property Type</label>
      <select className="select">
        <option>All Types</option>
        <option>For Rent</option>
        <option>For Sale</option>
      </select>
    </div>
    
    <div className="form-group">
      <label className="label">Max Price</label>
      <input type="number" className="input" placeholder="0" />
    </div>
  </div>
  
  <button className="btn btn-primary btn-large" style={{ width: '100%' }}>
    Search Properties
  </button>
</form>
```

### Hero Section
```tsx
<section className="primaryBg text-white p-2xl m-2xl" style={{ borderRadius: 'var(--radius-lg)' }}>
  <div className="container">
    <h1>Find Your Dream Home</h1>
    <p className="text-lg m-lg">Browse thousands of properties in your area</p>
    <button className="btn btn-primary">Get Started</button>
  </div>
</section>
```

## Utility Classes Quick Reference

```html
<!-- Flexbox -->
<div class="flex">Row flex</div>
<div class="flex flex-column">Column flex</div>
<div class="flex-center">Centered</div>
<div class="flex-between">Space between</div>

<!-- Text -->
<p class="text-center">Centered text</p>
<p class="text-muted">Secondary color text</p>
<p class="text-uppercase">UPPERCASE</p>
<p class="truncate">Long text...</p>
<p class="line-clamp-2">Multi-line with clamp</p>

<!-- Display -->
<div class="hidden">Hidden always</div>
<div class="hidden-mobile">Hidden on mobile</div>
<div class="hidden-desktop">Hidden on desktop</div>

<!-- Icons -->
<i class="icon icon-sm icon-primary">📍</i>
<i class="icon icon-lg">🏠</i>
```

## ❌ What NOT to Do

```tsx
// ❌ DON'T: Use inline styles
<div style={{ color: '#087c7c', padding: '16px' }}>

// ✅ DO: Use CSS classes
<div className="primaryColor p-lg">

// ❌ DON'T: Use hardcoded colors
<button style={{ backgroundColor: '#0186d8' }}>

// ✅ DO: Use CSS variables
<button style={{ backgroundColor: 'var(--secondary-sell)' }}>

// ❌ DON'T: Create custom buttons
<div className="custom-button">

// ✅ DO: Use button classes
<button className="btn btn-primary">
```

## CSS Variables Available

All available CSS variables for direct use:

```css
/* Typography */
--font-family
--weight-light, --weight-normal, --weight-medium, --weight-semibold, --weight-bold

/* Colors */
--primary-color, --primary-light, --primary-dark
--secondary-sell, --secondary-rent
--success-color, --warning-color, --error-color, --info-color
--text-primary, --text-secondary, --text-light
--background, --background-light, --background-alt
--border-color

/* Spacing */
--spacing-xs, --spacing-sm, --spacing-md, --spacing-lg, --spacing-xl, --spacing-2xl, --spacing-3xl, --spacing-4xl

/* Border Radius */
--radius-sm, --radius-md, --radius-lg, --radius-xl, --radius-full

/* Shadows */
--shadow-xs, --shadow-sm, --shadow-md, --shadow-lg, --shadow-xl
```

## 🎯 Best Practices

1. **Always use utility classes** - Avoid inline styles
2. **Use CSS variables** - For consistent theming
3. **Follow spacing scale** - Use predefined spacing values
4. **Use semantic colors** - Use status colors (#25d366 for success, etc.)
5. **Responsive first** - Use grid system for layouts
6. **Typography hierarchy** - Use proper heading levels (H1→H6)
7. **Focus states** - All interactive elements auto-focus properly
8. **Accessibility** - Labels with form fields, alt text for images

## 📚 Documentation

- Full documentation: See `DESIGN_SYSTEM.md`
- Live examples: Visit `/design-system` (after adding route)
- Component examples: Check `src/components/` for implementation patterns

---

**Last Updated**: April 8, 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
