'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui';
import { Container } from './Container';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Properties', href: '/properties' },
  { label: 'Projects', href: '/projects' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const LOCATIONS = ['Chennai', 'Mumbai', 'Bangalore'];

/**
 * Navbar Component
 * Sticky navigation with responsive design and mobile menu
 */
export function Navbar() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Info Bar - Desktop Only */}
      <div className="hidden md:block bg-[#087c7c] text-white text-xs py-2">
        <Container>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a
                href="mailto:adminn@ebroker.in"
                className="flex items-center gap-1 hover:opacity-80 transition"
              >
                <span>📧</span>
                adminn@ebroker.in
              </a>
              <a
                href="tel:7874664341"
                className="flex items-center gap-1 hover:opacity-80 transition"
              >
                <span>📱</span>
                7874664341
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Header */}
      <div className="bg-white">
        <Container className="py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-[#087c7c] rounded-full flex items-center justify-center text-white font-bold text-sm md:text-lg">
                e
              </div>
              <span className="text-lg md:text-2xl font-bold text-[#087c7c] hidden sm:inline">
                eBroker
              </span>
            </Link>

            {/* Location Selector - Desktop Only */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg flex-shrink-0">
              <span className="text-lg">📍</span>
              <div>
                <label className="text-xs text-gray-600 block">Location</label>
                <select className="bg-transparent border-0 font-semibold text-gray-800 text-xs focus:outline-none">
                  {LOCATIONS.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  className="text-gray-700 hover:text-[#087c7c] transition font-medium text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth Button */}
            <Link href={`/${locale}/login`}>
              <Button
                variant="primary"
                size="md"
                className="hidden md:flex flex-shrink-0"
              >
                <span>👤</span>
                <span className="hidden lg:inline ml-2">Login/Register</span>
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 text-2xl p-2"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  className="block text-gray-700 hover:text-[#087c7c] transition py-2 font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <Link href={`/${locale}/login`} className="block">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  <span>👤</span>
                  <span className="ml-2">Login/Register</span>
                </Button>
              </Link>
            </nav>
          )}
        </Container>
      </div>
    </header>
  );
}
