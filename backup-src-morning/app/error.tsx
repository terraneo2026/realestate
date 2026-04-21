"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4">
          <div className="text-center">
            {/* Error Illustration */}
            <div className="mb-8">
              <div className="text-9xl font-black text-red-500 mb-4">⚠️</div>
              <div className="text-6xl font-bold text-gray-900 mb-2">Application Error</div>
            </div>

            {/* Description */}
            <p className="text-xl text-gray-600 mb-4 max-w-md mx-auto">
              We're experiencing technical difficulties. Please try again later.
            </p>

            {error.message && (
              <p className="text-sm text-gray-500 font-mono bg-gray-200 p-4 rounded mb-8 max-w-md mx-auto">
                {error.message}
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={reset}
                className="primaryBg hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg transition cursor-pointer"
              >
                Try Again
              </button>
              <Link
                href="/en"
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-lg transition"
              >
                Go to Home
              </Link>
            </div>

            {/* Support */}
            <div className="mt-12 text-sm text-gray-500">
              <p>If this problem persists, please contact: <a href="mailto:support@ebroker.in" className="text-blue-600">support@ebroker.in</a></p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
