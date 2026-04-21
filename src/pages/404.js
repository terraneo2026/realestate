import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Custom404 = () => {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-10 relative">
          <h1 className="text-[12rem] font-black text-gray-100 leading-none select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-4xl font-black text-gray-800  tracking-tighter">Lost in Space</h2>
          </div>
        </div>
        
        <p className="text-gray-500 font-bold  tracking-widest text-sm mb-10 leading-relaxed">
          The page you are looking for has been moved or doesn't exist anymore.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href={isAdmin ? "/admin" : "/"}
            className="w-full sm:w-auto px-10 py-4 bg-[#087C7C] text-white font-black rounded-2xl shadow-xl shadow-[#087C7C]/20 hover:bg-[#066666] hover:translate-y-[-2px] active:translate-y-0 transition-all  tracking-widest text-xs"
          >
            {isAdmin ? "Back to Dashboard" : "Go to Homepage"}
          </Link>
          <button 
            onClick={() => router.back()}
            className="w-full sm:w-auto px-10 py-4 bg-white border border-gray-100 text-gray-400 font-black rounded-2xl shadow-sm hover:text-[#087C7C] hover:border-[#087C7C] transition-all  tracking-widest text-xs"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Custom404;
