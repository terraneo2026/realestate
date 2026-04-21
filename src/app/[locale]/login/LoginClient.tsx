"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, UserPlus, Home, Briefcase, Key, Loader2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LoginClientProps {
  locale: string;
}

export default function LoginClient({ locale }: LoginClientProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      toast.success("Login successful!");
      
      // Dynamic redirect based on role
      const redirectPath = result.role === 'admin' 
        ? `/${locale}/admin` 
        : `/${locale}/${result.role}/dashboard`;
      router.push(redirectPath);
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="max-w-md w-full space-y-6 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 relative z-10 transition-all duration-500 hover:shadow-primary/5">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Link href={`/${locale}`} className="relative w-24 h-24 overflow-hidden rounded-3xl transition-all duration-500 hover:scale-110 hover:rotate-3 shadow-lg hover:shadow-primary/20 bg-white p-2 border border-gray-50">
              <div className="relative w-full h-full">
                <Image
                  src="/logo.jpeg"
                  alt="Relocate"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
            Welcome Back
          </h2>
          <p className="text-[10px] text-gray-400 font-black tracking-[0.2em]">
            Access your property dashboard
          </p>
        </div>
 
        {/* Role Selection Moved to Top */}
        <div className="grid grid-cols-3 gap-3">
          <Link
            href={`/${locale}/tenant/register`}
            className="flex flex-col items-center gap-2 p-3 border-2 border-gray-50 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div className="p-2 rounded-xl bg-gray-50 group-hover:bg-primary/10 transition-colors">
              <Key size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[8px] font-black text-gray-400 group-hover:text-primary tracking-widest">Tenant</span>
          </Link>
          <Link
            href={`/${locale}/owner/register`}
            className="flex flex-col items-center gap-2 p-3 border-2 border-gray-50 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div className="p-2 rounded-xl bg-gray-50 group-hover:bg-primary/10 transition-colors">
              <Home size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[8px] font-black text-gray-400 group-hover:text-primary tracking-widest">Owner</span>
          </Link>
          <Link
            href={`/${locale}/agent/register`}
            className="flex flex-col items-center gap-2 p-3 border-2 border-gray-50 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div className="p-2 rounded-xl bg-gray-50 group-hover:bg-primary/10 transition-colors">
              <Briefcase size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[8px] font-black text-gray-400 group-hover:text-primary tracking-widest">Agent</span>
          </Link>
        </div>
 
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-[9px]">
            <span className="px-4 bg-white text-gray-300 font-black tracking-[0.3em]">Or sign in</span>
          </div>
        </div>
 
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="group">
              <label className="text-[9px] font-black text-gray-400 tracking-[0.2em] ml-2 mb-1.5 block group-focus-within:text-primary transition-colors uppercase">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-100 text-gray-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm bg-gray-50/50 hover:bg-white"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="group">
              <label className="text-[9px] font-black text-gray-400 tracking-[0.2em] ml-2 mb-1.5 block group-focus-within:text-primary transition-colors uppercase">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-11 pr-12 py-3.5 border-2 border-gray-100 text-gray-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm bg-gray-50/50 hover:bg-white"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
 
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-200 rounded transition-all cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-[10px] text-gray-400 font-black tracking-widest cursor-pointer hover:text-gray-600 uppercase">
                Remember me
              </label>
            </div>
 
            <Link href={`/${locale}/forgot-password`} className="text-[10px] font-black text-primary hover:text-teal-700 transition-colors tracking-widest uppercase">
              Forgot?
            </Link>
          </div>
 
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center items-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white primaryBg hover:shadow-xl hover:shadow-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 tracking-[0.2em]"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span className="mr-2 uppercase">Sign In</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
 
        <p className="text-[10px] text-center text-gray-400 font-black tracking-widest uppercase">
          No account?{" "}
          <Link href={`/${locale}/register`} className="text-primary font-black hover:underline transition-all ml-1">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
