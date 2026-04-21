import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log('Proxy processing pathname:', pathname);

  // 1. Check if the path starts with a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    console.log('Path has locale, continuing:', pathname);
    return;
  }

  // 2. Ignore specific paths that shouldn't be localized
  const isIgnored = [
    '/admin',
    '/_next',
    '/api',
    '/favicon.ico',
    '/logo.jpeg',
    '/placeholder.svg',
    '/next.svg',
    '/vercel.svg',
    '/window.svg',
    '/globe.svg',
    '/file.svg'
  ].some(path => pathname.startsWith(path));

  if (isIgnored) {
    console.log('Path is ignored, continuing:', pathname);
    return;
  }

  // 3. Redirect if there is no locale
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  console.log('Redirecting to:', url.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|admin|favicon.ico|.*\\..*).*)',
    // Optional: only run on root (/) URL
    '/'
  ],
};
