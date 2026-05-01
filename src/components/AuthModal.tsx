"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  X, Mail, Lock, User, Phone, CheckCircle2, 
  AlertCircle, ChevronDown, ArrowRight, ShieldCheck, 
  Building2, Users, Loader2, Eye, EyeOff
} from 'lucide-react';

import { Button } from "./ui";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import PasswordStrengthMeter from "./auth/ui/PasswordStrengthMeter";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthTab = "signin" | "register";

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  const [activeTab, setActiveTab] = useState<AuthTab>("signin");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Clear server error when tab changes
  useEffect(() => {
    setServerError(null);
  }, [activeTab]);

  // Sign In Form
  const {
    register: registerSignIn,
    handleSubmit: handleSignInSubmit,
    formState: { errors: signInErrors },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  // Register Form
  const {
    register: registerSignUp,
    handleSubmit: handleRegisterSubmit,
    watch,
    setValue,
    formState: { errors: signUpErrors, isValid: isSignUpValid },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "tenant",
      fullName: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      aadhaarNumber: "",
      agencyName: "",
      licenseNumber: "",
      address: "",
    },
    mode: "all",
  });

  const signUpPassword = watch("password");
  const signUpRole = watch("role");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  const onSignIn = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      // Save profile to localStorage for UI persistence
      localStorage.setItem('userProfile', JSON.stringify({
        fullName: result.fullName,
        email: result.email,
        role: result.role,
        id: result.uid
      }));

      // Dynamic redirect based on role
      const redirectPath = result.role === 'admin' 
        ? `/${locale}/admin` 
        : `/${locale}/${result.role}/dashboard`;
      router.push(redirectPath);
    } catch (err: any) {
      toast.error(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const onSignUp = async (data: RegisterInput) => {
    setLoading(true);
    setServerError(null);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.message || "Registration failed");
        return;
      }

      // Save profile to localStorage for UI persistence
      localStorage.setItem('userProfile', JSON.stringify({
        fullName: result.fullName,
        email: result.email,
        role: result.role,
        id: result.uid
      }));

      // Dynamic redirect based on role
      const redirectPath = result.role === 'admin' 
        ? `/${locale}/admin` 
        : `/${locale}/${result.role}/dashboard`;
      router.push(redirectPath);
    } catch (err: any) {
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-500" onClick={onClose} />

      <div role="dialog" aria-modal="true" className="relative w-full max-w-lg mx-auto animate-in zoom-in-95 duration-300">
        <div className="bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-gray-100">
          {/* Header */}
          <header className="p-6 flex items-center justify-between bg-white border-b border-gray-50">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-gray-100 shadow-sm p-2 bg-white">
                <Image src="/logo.jpeg" alt="Relocate" fill className="object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Relocate Auth</h3>
                <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">Secure Portal Access</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-gray-100 transition-all text-gray-400 hover:text-gray-900"
            >
              <X size={20} />
            </button>
          </header>

          {/* Tabs */}
          <nav className="flex p-2 bg-gray-50/50">
            {[
              { id: "signin", label: "Sign In" },
              { id: "register", label: "Create Account" }
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as AuthTab)} 
                className={cn(
                  "flex-1 py-3 text-xs font-black tracking-widest uppercase transition-all duration-300 rounded-2xl",
                  activeTab === tab.id 
                    ? "bg-white text-primary shadow-sm" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)] scrollbar-hide pb-24">
            {activeTab === 'signin' && (
              <form onSubmit={handleSignInSubmit(onSignIn)} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      {...registerSignIn("email")}
                      type="email" 
                      required 
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold" 
                      placeholder="name@example.com" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Password</label>
                    <Link 
                      href={`/${locale}/forgot-password`} 
                      onClick={onClose}
                      className="text-[10px] font-black text-primary hover:underline tracking-widest uppercase"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      {...registerSignIn("password")}
                      type={showPassword ? "text" : "password"} 
                      required 
                      className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold" 
                      placeholder="••••••••" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Sticky CTA Button Container for Sign In */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-50 z-20">
                  <Button type="submit" disabled={loading} variant="primary" className="w-full py-4 text-sm font-black tracking-widest rounded-2xl shadow-xl shadow-primary/20">
                    {loading ? <Loader2 className="animate-spin" /> : 'SIGN IN TO PORTAL'}
                  </Button>
                </div>
              </form>
            )}

            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit(onSignUp)} className="space-y-5">
                <div className="space-y-3 mb-6">
                  <label className="block text-center text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Select User Type</label>
                  <div className="flex gap-3">
                    {(['tenant', 'agent', 'owner'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setValue("role", r)}
                        className={cn(
                          "flex-1 py-3 px-2 rounded-2xl text-[10px] font-black tracking-widest transition-all duration-300 uppercase",
                          signUpRole === r
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase ml-1">Full Name</label>
                    <input {...registerSignUp("fullName")} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold" placeholder="John Doe" />
                    {signUpErrors.fullName && <p className="text-[9px] font-bold text-red-500 ml-2">{signUpErrors.fullName.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase ml-1">Phone</label>
                    <input {...registerSignUp("mobile")} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold" placeholder="9876543210" />
                    {signUpErrors.mobile && <p className="text-[9px] font-bold text-red-500 ml-2">{signUpErrors.mobile.message}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase ml-1">Aadhaar Number</label>
                  <input {...registerSignUp("aadhaarNumber")} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold" placeholder="1234 5678 9012" maxLength={12} />
                  {signUpErrors.aadhaarNumber && <p className="text-[9px] font-bold text-red-500 ml-2">{signUpErrors.aadhaarNumber.message}</p>}
                </div>

                {signUpRole === 'owner' && (
                  <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase ml-1">Permanent Address</label>
                    <textarea 
                      {...registerSignUp("address")} 
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold min-h-[80px]" 
                      placeholder="Enter your full address as per records..." 
                    />
                    {signUpErrors.address && <p className="text-[9px] font-bold text-red-500 ml-2">{signUpErrors.address.message}</p>}
                  </div>
                )}

                {signUpRole === 'agent' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase ml-1">Agency Name (Optional)</label>
                      <input {...registerSignUp("agencyName")} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold" placeholder="Elite Realty" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase ml-1">RERA / License No.</label>
                      <input {...registerSignUp("licenseNumber")} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold" placeholder="RERA123456" />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase ml-1">Email Address</label>
                  <input {...registerSignUp("email")} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold" placeholder="name@example.com" />
                  {signUpErrors.email && <p className="text-[9px] font-bold text-red-500 ml-2">{signUpErrors.email.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase ml-1">Password</label>
                  <input {...registerSignUp("password")} type="password" className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold" placeholder="••••••••" />
                  <PasswordStrengthMeter password={signUpPassword} />
                  {signUpErrors.password && <p className="text-[9px] font-bold text-red-500 ml-2 leading-relaxed">{signUpErrors.password.message}</p>}
                </div>

                <div className="space-y-1.5 pb-4">
                  <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase ml-1">Confirm Password</label>
                  <input {...registerSignUp("confirmPassword")} type="password" className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold" placeholder="••••••••" />
                  {signUpErrors.confirmPassword && <p className="text-[9px] font-bold text-red-500 ml-2">{signUpErrors.confirmPassword.message}</p>}
                </div>

                {serverError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={16} />
                    <p className="text-[10px] font-bold uppercase tracking-widest">{serverError}</p>
                  </div>
                )}

                {/* Sticky CTA Button Container for Register */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-50 z-20">
                  <Button type="submit" disabled={loading || !isSignUpValid} variant="primary" className="w-full py-4 text-sm font-black tracking-widest rounded-2xl shadow-xl shadow-primary/20">
                    {loading ? <Loader2 className="animate-spin" /> : 'CREATE SECURE ACCOUNT'}
                  </Button>
                </div>
              </form>
            )}
          </div>

          <footer className="bg-gray-50 p-6 text-center">
            <p className="text-[9px] font-bold text-gray-400 tracking-widest leading-relaxed">
              By continuing, you agree to Relocate's <Link href={`/${locale}/terms`} className="text-gray-600 underline">Terms of Service</Link> and <Link href={`/${locale}/privacy`} className="text-gray-600 underline">Privacy Policy</Link>.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
