"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootNotFound() {
  const pathname = usePathname();
  const locale = pathname ? (pathname.split('/')[1] || 'en') : 'en';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-black text-primaryBg mb-4">404</div>
          <div className="text-6xl font-bold text-gray-900 mb-2">Page Not Found</div>
        </div>

        {/* Description */}
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. Let's get you back on track.
        </p>

        {/* Action */}
        <Link
          href={`/${locale}`}
          className="bg-primaryBg hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg transition inline-block"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
