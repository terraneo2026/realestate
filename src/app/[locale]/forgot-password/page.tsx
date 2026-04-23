'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useParams } from 'next/navigation';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ForgotPasswordPage() {
  const params = useParams();
  const locale = params?.locale || 'en';
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to send reset email');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
        <div className="text-center">
          <Link href={`/${locale}`} className="inline-block mb-6">
            <Image src="/logo.jpeg" alt="Relocate" width={80} height={80} className="rounded-2xl" />
          </Link>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Reset Password</h2>
          <p className="mt-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
            Enter your email to receive a reset link
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-6 py-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-100">
              <CheckCircle2 size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">Check your email</h3>
              <p className="text-sm text-gray-500 font-medium">
                We've sent password reset instructions to <span className="font-bold text-gray-900">{email}</span>.
              </p>
            </div>
            <Link 
              href={`/${locale}/login`}
              className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:underline pt-4"
            >
              <ArrowLeft size={14} /> Return to login
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase ml-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 animate-in shake duration-300">
                <AlertCircle size={18} />
                <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs tracking-widest shadow-xl shadow-primary/20 hover:shadow-2xl hover:translate-y-[-2px] active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SEND RESET LINK'}
            </button>

            <div className="text-center">
              <Link 
                href={`/${locale}/login`}
                className="inline-flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-primary transition-colors"
              >
                <ArrowLeft size={14} /> Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
