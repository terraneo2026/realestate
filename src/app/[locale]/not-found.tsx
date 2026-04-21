"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
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
          Oops! The page you're looking for doesn't exist or has been moved. Don't worry, we've got you covered.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href={`/${locale}`}
            className="bg-primaryBg hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg transition inline-block"
          >
            Go to Home
          </Link>
          <Link
            href={`/${locale}/properties`}
            className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-lg transition inline-block"
          >
            Browse Properties
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="border-2 border-primaryBg text-primaryBg font-bold py-3 px-8 rounded-lg hover:bg-primaryBg hover:text-white transition inline-block"
          >
            Contact Us
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-sm text-gray-600 mb-4">Here are some helpful links:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={`/${locale}`} className="text-primaryBg font-semibold hover:underline">
              Home
            </Link>
            <span className="text-gray-400">•</span>
            <Link href={`/${locale}/properties`} className="text-primaryBg font-semibold hover:underline">
              Properties
            </Link>
            <span className="text-gray-400">•</span>
            <Link href={`/${locale}/projects`} className="text-primaryBg font-semibold hover:underline">
              Projects
            </Link>
            <span className="text-gray-400">•</span>
            <Link href={`/${locale}/about-us`} className="text-primaryBg font-semibold hover:underline">
              About Us
            </Link>
            <span className="text-gray-400">•</span>
            <Link href={`/${locale}/blog`} className="text-primaryBg font-semibold hover:underline">
              Blog
            </Link>
            <span className="text-gray-400">•</span>
            <Link href={`/${locale}/contact`} className="text-primaryBg font-semibold hover:underline">
              Contact
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-sm text-gray-500">
          <p>If you believe this is an error, please reach out to our support team at <a href="mailto:support@ebroker.in" className="text-primaryBg font-semibold">support@ebroker.in</a></p>
        </div>
      </div>
    </div>
  );
}
