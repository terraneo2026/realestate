# Relocate Design System

Complete design system documentation for the Relocate frontend.

## Table of Contents

1. [Colors](#colors)
2. [Typography](#typography)
3. [Spacing](#spacing)
4. [Buttons](#buttons)
5. [Cards](#cards)
6. [Forms](#forms)
7. [Badges](#badges)
8. [Icons](#icons)
9. [Shadows](#shadows)
10. [Responsive Grid](#responsive-grid)
11. [Utilities](#utilities)

---

## Colors

### Primary Palette

- **Primary**: `#087c7c` (Teal/Green) - Main brand color
- **Primary Light**: `#0a9999` - Lighter variant
- **Primary Lighter**: `#0db3b3` - Even lighter
- **Primary Dark**: `#066666` - Darker variant
- **Primary Darker**: `#054d4d` - Darkest variant

**Usage**: `var(--primary-color)` or utility class `.primaryColor` / `.primaryBg`

### Secondary Palette

- **Sell**: `#0186d8` (Blue) - For-Sale listings
- **Rent**: `#db9305` (Orange/Gold) - For-Rent listings

**Usage**: `var(--secondary-sell)` / `var(--secondary-rent)`

### Status Colors

- **Success**: `#25d366` (Green)
- **Warning**: `#ff6b18` (Orange)
- **Error**: `#DB3D26` (Red)
- **Info**: `#4267b2` (Blue)

### Neutral Colors

- **Text Primary**: `#282f39` (Dark Gray)
- **Text Secondary**: `#595f65` (Medium Gray)
- **Text Light**: `#6b7280` (Light Gray)
- **Border**: `#e1e1e1` (Light Gray)
- **Background**: `#ffffff` (White)
- **Background Light**: `#f5f5f4` (Off-White)
- **Background Alt**: `#f9fafb` (Very Light Gray)

---

## Typography

### Font Family

**Manrope** (Google Font)
- Weights: 300, 400, 500, 600, 700

**CSS Variable**: `var(--font-family)` or `var(--font-primary)`

### Typographic Scale

```
H1: 34px, weight 600, line-height 1.2
H2: 26px, weight 600, line-height 1.3
H3: 18px, weight 500, line-height 1.4
Body: 14px, weight 400, line-height 1.6
Small: 12px
XS: 11px
```

### Font Weights

- **Light**: 300
- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

**Usage**: 
```css
font-size: var(--text-h1);
font-weight: var(--weight-semibold);
```

---

## Spacing

Consistent 4px-based spacing scale:

- **XS**: 4px (`var(--spacing-xs)`)
- **SM**: 8px (`var(--spacing-sm)`)
- **MD**: 12px (`var(--spacing-md)`)
- **LG**: 16px (`var(--spacing-lg)`) - Standard
- **XL**: 24px (`var(--spacing-xl)`)
- **2XL**: 32px (`var(--spacing-2xl)`)
- **3XL**: 48px (`var(--spacing-3xl)`)
- **4XL**: 64px (`var(--spacing-4xl)`)

**Utility Classes**:
```html
<div class="p-lg m-lg gap-lg">Content</div>
```

---

## Buttons

### Button Sizes

```html
<!-- Default (40px) -->
<button class="btn btn-primary">Click me</button>

<!-- Small (32px) -->
<button class="btn btn-primary btn-small">Click me</button>

<!-- Large (48px) -->
<button class="btn btn-primary btn-large">Click me</button>
```

### Button Variants

```html
<!-- Primary -->
<button class="btn btn-primary">Primary Button</button>

<!-- Secondary -->
<button class="btn btn-secondary">Secondary Button</button>

<!-- Outline -->
<button class="btn btn-outline">Outline Button</button>

<!-- Ghost -->
<button class="btn btn-ghost">Ghost Button</button>

<!-- Danger -->
<button class="btn btn-danger">Delete</button>

<!-- Disabled -->
<button class="btn btn-primary" disabled>Disabled</button>
```

### Button Styles

- **Padding**: 10px 18px (default), 8px 12px (small), 12px 24px (large)
- **Height**: 40px (default), 32px (small), 48px (large)
- **Border Radius**: 8px
- **Font Size**: 14px
- **Font Weight**: 500
- **Hover**: Opacity 0.9, slight lift (translateY -2px)
- **Transition**: 0.3s ease

---

## Cards

### Basic Card

```html
<div class="card">
  <img class="card-image" src="image.jpg" alt="Description" />
  <div class="card-body">
    <h3>Card Title</h3>
    <p>Card content here</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

### Card Properties

- **Background**: White
- **Border Radius**: 12px
- **Shadow**: 0 4px 12px rgba(0,0,0,0.10) on hover
- **Images**: Height 200px, object-fit cover
- **Padding**: 16px (standard)
- **Hover Effect**: Lift up 4px, increased shadow

### Card Image Variants

```html
<!-- Standard (200px) -->
<img class="card-image" src="image.jpg" />

<!-- Tall (300px) -->
<img class="card-image card-image-tall" src="image.jpg" />

<!-- Compact (150px) -->
<img class="card-image card-image-compact" src="image.jpg" />
```

---

## Forms

### Input Fields

```html
<div class="form-group">
  <label class="label">Email Address</label>
  <input type="email" class="input" placeholder="you@example.com" />
  <div class="form-hint">We'll never share your email</div>
</div>

<div class="form-group">
  <label class="label">Message</label>
  <textarea class="textarea" placeholder="Enter your message"></textarea>
  <div class="form-error">This field is required</div>
</div>

<div class="form-group">
  <label class="label">Category</label>
  <select class="select">
    <option>Select an option</option>
    <option>Option 1</option>
  </select>
</div>
```

### Input Properties

- **Height**: 42px
- **Padding**: 10px 12px
- **Border**: 1px solid #e1e1e1
- **Border Radius**: 8px
- **Font Size**: 14px
- **Focus**: Teal border + light blue shadow
- **Disabled**: Light gray bg, gray text

---

## Badges

```html
<!-- Primary -->
<span class="badge badge-primary">Badge</span>

<!-- Secondary -->
<span class="badge badge-secondary">Badge</span>

<!-- Success -->
<span class="badge badge-success">Badge</span>

<!-- Warning -->
<span class="badge badge-warning">Badge</span>

<!-- Error -->
<span class="badge badge-error">Badge</span>

<!-- Outline -->
<span class="badge badge-outline">Badge</span>
```

### Badge Properties

- **Padding**: 4px 8px
- **Border Radius**: 999px (fully rounded)
- **Font Size**: 11px
- **Font Weight**: 600
- **White Space**: nowrap

---

## Icons

### Icon Sizing

```html
<i class="icon icon-xs">📍</i>
<i class="icon icon-sm">📍</i>
<i class="icon icon-md">📍</i>
<i class="icon icon-lg">📍</i>
<i class="icon icon-xl">📍</i>
<i class="icon icon-2xl">📍</i>
```

**Sizes**:
- **XS**: 14px
- **SM**: 16px
- **MD**: 18px
- **LG**: 22px
- **XL**: 28px
- **2XL**: 36px

### Icon Colors

```html
<i class="icon icon-primary">📍</i>
<i class="icon icon-secondary">📍</i>
<i class="icon icon-light">📍</i>
```

---

## Shadows

```
XS:  0 1px 2px rgba(0,0,0,0.05)
SM:  0 2px 4px rgba(0,0,0,0.08)
MD:  0 4px 12px rgba(0,0,0,0.10)
LG:  0 8px 24px rgba(0,0,0,0.12)
XL:  0 12px 32px rgba(0,0,0,0.15)
```

**Usage**: `<div class="shadow-md">Content</div>`

---

## Responsive Grid

### Grid System

```html
<!-- 4 Columns (Desktop) -->
<div class="grid grid-cols-4">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
  <div class="card">Item 3</div>
  <div class="card">Item 4</div>
</div>
```

### Responsive Breakpoints

```
Desktop:  grid-cols-4 (4 columns)
Tablet:   grid-cols-3 → grid-cols-2 (1024px → 768px)
Mobile:   grid-cols-1 (< 480px)
```

**Gap**: 16px (var(--spacing-lg))

---

## Utilities

### Flexbox

```html
<div class="flex">Flex row</div>
<div class="flex flex-column">Flex column</div>
<div class="flex-center">Centered flex</div>
<div class="flex-between">Space between</div>
<div class="flex flex-wrap">Wrap items</div>
```

### Text

```html
<p class="text-center">Centered text</p>
<p class="text-muted">Muted/secondary text</p>
<p class="text-uppercase">UPPERCASE TEXT</p>
<p class="truncate">Long text...</p>
<p class="line-clamp-2">Multi...</p>
```

### Display

```html
<div class="hidden">Hidden</div>
<div class="hidden-mobile">Hidden on mobile</div>
<div class="hidden-desktop">Hidden on desktop</div>
```

### Spacing

```html
<div class="p-lg m-lg gap-lg">Padded, margined, gapped</div>
```

---

## Component Examples

### Property Card (Homepage)

```tsx
import React from 'react';

export default function PropertyCard({ property }) {
  return (
    <div className="card">
      <img className="card-image" src={property.image} alt={property.title} />
      <div className="card-body">
        <h3>{property.title}</h3>
        <div className="flex-between m-lg">
          <span className="text-muted">📍 {property.location}</span>
          <span className="badge badge-primary">
            {property.type === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
        </div>
        <p className="text-h2 primaryColor">{property.price}</p>
      </div>
      <div className="card-footer flex-between">
        <span className="text-muted">🛏 {property.bedrooms} | 🚿 {property.bathrooms}</span>
        <button className="btn btn-primary btn-small">View Details</button>
      </div>
    </div>
  );
}
```

### Filter Form

```tsx
export default function FilterForm() {
  return (
    <form className="p-lg">
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
          <label className="label">Min Price</label>
          <input type="number" className="input" placeholder="0" />
        </div>
      </div>
      
      <button className="btn btn-primary btn-large" style={{ width: '100%' }}>
        Search
      </button>
    </form>
  );
}
```

---

## Accessibility Notes

- All buttons have `:disabled` state that disables pointer events
- Input fields have focus states with visible ring
- Text contrast ratios meet WCAG AA standards
- Icons are decorative (use aria-hidden) or have proper labels
- Form fields have associated labels

---

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS variables supported in all modern browsers
- Fallbacks for older browsers can be added as needed

---

## Notes

- Use CSS variables for all styling (color, spacing, typography)
- Avoid inline styles - use utility classes instead
- Maintain consistent spacing using the scale
- Use the button system for all actionable elements
- Use cards for content organization
- Test responsive behavior at breakpoints: 480px, 768px, 1024px

---

Last Updated: April 8, 2026
Version: 1.0.0
