'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { MapPin, Search, Mail, Phone, User, Menu, X, Globe, Camera, Users, LayoutDashboard } from 'lucide-react';
import LocationPicker from './LocationPicker';
import { Button } from '@/components/ui';
import { Container } from './Container';
import AuthModal from '../AuthModal';
import { auth, firestore } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Properties', href: '/properties' },
  { label: 'Projects', href: '/projects' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage first for faster response
    const stored = localStorage.getItem('userProfile');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setUserRole(parsed.role);
      } catch (e) {}
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role || "tenant");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setUserRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Main Header */}
      <div className="bg-white">
        <Container className="py-2 md:py-1">
          <div className="flex items-center justify-between gap-4">
            {/* Logo and Search */}
            <div className="flex items-center gap-6 flex-shrink-0 group">
              <Link href={`/${locale}`} className="flex items-center gap-3">
                <div className="relative w-16 md:w-20 h-16 md:h-20 overflow-hidden rounded-2xl transition-transform duration-300 group-hover:scale-105 shadow-sm">
                  <Image
                    src="/logo.jpeg"
                    alt="Logo"
                    fill
                    className="object-contain"
                    sizes="(min-width: 768px) 128px, 80px"
                    priority
                  />
                </div>
              </Link>

              {/* Quick Search Bar near Logo */}
              <div className="hidden lg:flex items-center relative group/search">
                <Search className="absolute left-4 w-4 h-4 text-gray-400 group-focus-within/search:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Quick search..."
                  className="pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold w-[200px] focus:w-[300px] focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      router.push(`/${locale}/properties?keyword=${encodeURIComponent(e.currentTarget.value)}`);
                    }
                  }}
                />
              </div>
            </div>

            {/* Location Selector - Desktop Only */}
            <div className="hidden md:block flex-shrink-0">
              <LocationPicker locale={locale} />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  className="text-gray-700 hover:text-primary transition font-medium text-sm leading-relaxed"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth/Dashboard Button */}
            {user ? (
              <Link href={userRole === 'admin' ? '/admin' : `/${locale}/${userRole}/dashboard`}>
                <Button
                  variant="primary"
                  size="md"
                  className="hidden md:flex items-center gap-2 flex-shrink-0 rounded-full px-8"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden lg:inline">Dashboard</span>
                </Button>
              </Link>
            ) : (
              <Button
                variant="primary"
                size="md"
                className="hidden md:flex items-center gap-2 flex-shrink-0 rounded-full px-8"
                onClick={() => setAuthModalOpen(true)}
              >
                <User className="w-4 h-4" />
                <span className="hidden lg:inline font-bold">Login/Register</span>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 p-2 transition-transform active:scale-95"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-4">
              {/* Mobile Location Search */}
              <div className="px-2">
                <LocationPicker locale={locale} />
              </div>
              
              <div className="space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={`/${locale}${link.href}`}
                    className="block text-gray-700 hover:text-primary transition px-3 py-2 font-medium rounded-lg hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              {user ? (
                <Link 
                  href={userRole === 'admin' ? '/admin' : `/${locale}/${userRole}/dashboard`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => {
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  <User className="w-5 h-5" />
                  <span>Login/Register</span>
                </Button>
              )}
            </nav>
          )}
        </Container>
      </div>
      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
}
