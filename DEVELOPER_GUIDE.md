# Frontend Rebuild - Quick Reference Guide

## 🚀 Getting Started

**Development Server:**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
npm run start
```

---

## 📂 File Structure

```
src/components/
├── ui/              → Button, Input, Select, Card
├── layout/          → Navbar, Footer, Container, Section
├── cards/           → PropertyCard, CategoryCard
└── sections/        → Hero, FeaturedProperties, Categories, CTA

src/types/index.ts  → All TypeScript interfaces
src/app/[locale]    → Pages using new components
```

---

## 🎨 Component Import Patterns

```tsx
// Import from index (preferred)
import { Button, Card } from '@/components/ui';
import { Container, Section, Navbar, Footer } from '@/components/layout';
import { PropertyCard, CategoryCard } from '@/components/cards';
import { HeroSection, FeaturedPropertiesSection } from '@/components/sections';

// Import types
import { Property, Category, SearchFilters } from '@/types';
```

---

## 🧱 Building a New Page

```tsx
import { Section, Container } from '@/components/layout';
import { Button } from '@/components/ui';

export default function NewPage() {
  return (
    <>
      <Section bg="white">
        <Container>
          <h1>My New Page</h1>
          <p>Content here</p>
          <Button variant="primary">Action</Button>
        </Container>
      </Section>
    </>
  );
}
```

---

## 🎯 Button Variants

```tsx
<Button variant="primary" size="md">Primary</Button>
<Button variant="secondary" size="lg">Secondary</Button>
<Button variant="outline" size="sm">Outline</Button>
<Button variant="ghost">Ghost</Button>
```

---

## 📋 Form Components

```tsx
import { Input, Select } from '@/components/ui';

<Input 
  label="Email"
  type="email"
  placeholder="you@example.com"
  error={emailError}
  hint="We'll never share your email"
/>

<Select 
  label="Type"
  options={[
    { value: 'rent', label: 'For Rent' },
    { value: 'sale', label: 'For Sale' }
  ]}
/>
```

---

## 🎴 Card Components

```tsx
import { Card } from '@/components/ui';

<Card clickable hover className="p-6">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

---

## 📊 Section Structure

```tsx
import { Section, Container } from '@/components/layout';

<Section bg="gray">
  <Container>
    <h2>Section Title</h2>
    {/* Content */}
  </Container>
</Section>

// Background options: "white" | "gray" | "primary" | "transparent"
// Padding options: "py-12" | "py-16" | "py-20" | "py-24" (customizable)
```

---

## 🛠️ Creating a Feature

1. **Define Types** in `/types/index.ts`
2. **Build UI Components** in `/components/ui/`
3. **Create Layout** if needed in `/components/layout/`
4. **Build Cards** in `/components/cards/` if showing data
5. **Build Sections** in `/components/sections/`
6. **Use in Pages** under `/app/[locale]/`

---

## 🎨 Color System

```tsx
// Primary
bg-[#087c7c]
text-[#087c7c]

// Secondary
bg-[#0186d8] (Sell)
bg-[#db9305] (Rent)

// Status
bg-[#DB3D26] (Error)
bg-[#25d366] (Success)
bg-[#ff6b18] (Warning)

// Use CSS variables where available
var(--primary-color)
var(--secondary-sell)
var(--secondary-rent)
```

---

## 📱 Responsive Breakpoints

```tsx
// Tailwind breakpoints used:
// sm:  640px
// md:  768px
// lg:  1024px
// xl:  1280px

// Example responsive grid:
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id}>{item}</Card>)}
</div>
```

---

## ⚡ Performance Tips

1. **Use Next.js Image** for all images
```tsx
import Image from 'next/image';
<Image 
  src={url}
  alt="description"
  fill
  className="object-cover"
  sizes="(max-width: 640px) 100vw, 50vw"
/>
```

2. **Lazy load sections** below the fold
3. **Memoize** expensive components with `memo()`
4. **Keep components small** and focused

---

## 🔍 Type Definitions

All key types are in `/types/index.ts`:

```tsx
Property {
  id, title, location, image, price, 
  bedrooms, bathrooms, area, type, slug
}

Category {
  id, name, count, icon, bgColor, iconBg
}

SearchFilters {
  type, location, minPrice, maxPrice, bedrooms
}
```

---

## 🚢 Deployment

**Current Status:**
- ✅ Build succeeds
- ✅ TypeScript passes
- ✅ All pages generated
- ✅ Ready for production

**Deploy Command:**
```bash
npm run build
npm run start
```

---

## 📚 CSS Variables

All design tokens available as CSS variables in `globals.css`:

```css
/* Colors */
--primary-color: #087c7c;
--secondary-sell: #0186d8;
--secondary-rent: #db9305;

/* Spacing */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 24px;
--spacing-2xl: 32px;
--spacing-3xl: 48px;
--spacing-4xl: 64px;

/* Shadows */
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.08);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.10);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
```

---

## ✅ Checklist for New Features

- [ ] Types defined in `/types/index.ts`
- [ ] Components in appropriate folder
- [ ] TypeScript passes (`npm run build`)
- [ ] Responsive tested at 3+ breakpoints
- [ ] Naming follows pattern (Component.tsx)
- [ ] Exported from folder index.ts
- [ ] Integrated into page or section
- [ ] No inline styles (use Tailwind)
- [ ] Accessibility considered
- [ ] Performance optimized

---

**Happy coding! 🚀**
