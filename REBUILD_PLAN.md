# Frontend UI Complete Rebuild Plan

**Date:** April 8, 2026  
**Objective:** Clean, scalable, production-quality rebuild while preserving existing design  
**Status:** IN PROGRESS

## Phase 1: Structure & Design System
- [ ] Create new folder structure under `/components`
- [ ] Create types directory with shared interfaces
- [ ] Build core design system
- [ ] Create tailwind configuration optimizations

## Phase 2: Core Components
- [ ] Container.tsx - max-w-[1280px] mx-auto wrapper
- [ ] Section.tsx - section wrapper with consistent spacing
- [ ] Button.tsx - variant-based button component
- [ ] Input.tsx - form input wrapper
- [ ] Select.tsx - form select wrapper
- [ ] Card.tsx - base card wrapper

## Phase 3: Layout Components
- [ ] Navbar.tsx - sticky navigation with optimized structure
- [ ] Footer.tsx - footer with improved structure
- [ ] SectionContainer.tsx - wraps section + container

## Phase 4: Card Components
- [ ] PropertyCard.tsx (clean rebuild)
- [ ] CategoryCard.tsx (clean rebuild)
- [ ] ArticleCard.tsx (new - if needed)

## Phase 5: Section Components
- [ ] Hero.tsx (clean rebuild)
- [ ] FeaturedProperties.tsx
- [ ] Categories.tsx (clean rebuild)
- [ ] MostViewed.tsx
- [ ] Articles.tsx
- [ ] CTA.tsx (clean rebuild)

## Phase 6: Pages
- [ ] Update homepage to use new components
- [ ] Rebuild inner pages with new structure

## Design System Preserved
- Primary Color: #087c7c
- Secondary: Sell #0186d8, Rent #db9305
- Font: Manrope (or Inter/Poppins)
- Spacing: 8px grid system
- Container: max-w-[1280px] mx-auto px-4
- Cards: rounded-xl with shadow system

## Current Pages to Preserve
1. Home
2. Properties/Categories
3. Articles/Blog
4. Contact/FAQs
5. Subscription Plans
6. Admin Dashboard
