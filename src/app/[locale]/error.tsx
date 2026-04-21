"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-black text-red-500 mb-4">⚠️</div>
          <div className="text-6xl font-bold text-gray-900 mb-2">Oops! Something went wrong</div>
        </div>

        {/* Description */}
        <p className="text-xl text-gray-600 mb-4 max-w-md mx-auto">
          We encountered an unexpected error. Our team has been notified and we're working on a fix.
        </p>

        {error.message && (
          <p className="text-sm text-gray-500 font-mono bg-gray-200 p-4 rounded mb-8 max-w-md mx-auto">
            Error: {error.message}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-primaryBg hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg transition inline-block cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-lg transition inline-block"
          >
            Go to Home
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-12 text-sm text-gray-500">
          <p>Error ID: {error.digest}</p>
          <p className="mt-2">If the problem persists, please contact our support team at <a href="mailto:support@ebroker.in" className="text-primaryBg font-semibold">support@ebroker.in</a></p>
        </div>
      </div>
    </div>
  );
}
