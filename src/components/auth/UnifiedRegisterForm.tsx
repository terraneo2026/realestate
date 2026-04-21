"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  User, Mail, Phone, Lock, Eye, EyeOff, 
  Building2, UserPlus, ArrowRight, ShieldCheck, 
  FileText, Briefcase, Loader2, MapPin, AlertCircle
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import PasswordStrengthMeter from "./ui/PasswordStrengthMeter";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UnifiedRegisterFormProps {
  initialRole: 'tenant' | 'agent' | 'owner';
  locale: string;
}

export default function UnifiedRegisterForm({ initialRole, locale }: UnifiedRegisterFormProps) {
  const router = useRouter();
  const [role, setRole] = useState<'tenant' | 'agent' | 'owner'>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: initialRole,
      fullName: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
    mode: "all", // Validate on all events for better UX
  });

  const passwordValue = watch("password");

  const onSubmit = async (data: RegisterInput) => {
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

      toast.success("Account created successfully!");
      
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

  const getRoleIcon = () => {
    switch (role) {
      case 'tenant': return <UserPlus size={16} />;
      case 'agent': return <ShieldCheck size={16} />;
      case 'owner': return <Building2 size={16} />;
    }
  };

  const handleRoleSwitch = (newRole: 'tenant' | 'agent' | 'owner') => {
    setRole(newRole);
    setValue("role", newRole);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[650px] w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
      {/* Left Side - Visual/Info */}
      <div className="hidden md:flex md:w-2/5 bg-primary p-12 text-white flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <Link href={`/${locale}`} className="inline-block bg-white p-3 rounded-2xl mb-8">
            <Image src="/logo.jpeg" alt="Relocate" width={60} height={60} className="object-contain" />
          </Link>
          <h2 className="text-3xl font-black tracking-tight mb-4 leading-tight">Join Our Real Estate Community</h2>
          <p className="text-white/80 font-medium leading-relaxed">
            {role === 'tenant' && "Access verified listings and experience a seamless home-finding journey."}
            {role === 'agent' && "Grow your network and leverage professional tools to scale your business."}
            {role === 'owner' && "List and manage your property portfolio with our advanced owner dashboard."}
          </p>
        </div>
 
        <div className="relative z-10 space-y-4">
          {[
            { label: "Verified Properties", icon: "✓" },
            { label: "Secure Auth & Data", icon: "✓" },
            { label: "24/7 Premium Support", icon: "✓" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 text-sm font-bold tracking-widest">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">{item.icon}</div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[95vh] scrollbar-hide">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-[0.2em] mb-2">
              {getRoleIcon()}
              <span className="uppercase">{role} Portal</span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Create Account</h2>
          </div>
          <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl border border-gray-200/50">
            {(['tenant', 'agent', 'owner'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleSwitch(r)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all duration-300",
                  role === r 
                    ? "bg-white text-primary shadow-lg shadow-primary/5" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Hidden role input for Zod */}
          <input type="hidden" {...register("role")} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase ml-1">Full Name</label>
              <div className="relative">
                <User className={cn("absolute left-4 top-1/2 -translate-y-1/2 transition-colors", errors.fullName ? "text-red-400" : "text-gray-400")} size={16} />
                <input 
                  {...register("fullName")}
                  className={cn(
                    "w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-2xl focus:ring-4 transition-all text-sm font-bold",
                    errors.fullName 
                      ? "border-red-100 focus:border-red-400 focus:ring-red-400/10" 
                      : "border-gray-100 focus:border-primary focus:ring-primary/10"
                  )} 
                  placeholder="John Doe" 
                />
              </div>
              {errors.fullName && <p className="text-[10px] font-bold text-red-500 ml-2 animate-in fade-in slide-in-from-left-1">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase ml-1">Phone Number</label>
              <div className="relative">
                <Phone className={cn("absolute left-4 top-1/2 -translate-y-1/2 transition-colors", errors.mobile ? "text-red-400" : "text-gray-400")} size={16} />
                <input 
                  {...register("mobile")}
                  className={cn(
                    "w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-2xl focus:ring-4 transition-all text-sm font-bold",
                    errors.mobile 
                      ? "border-red-100 focus:border-red-400 focus:ring-red-400/10" 
                      : "border-gray-100 focus:border-primary focus:ring-primary/10"
                  )} 
                  placeholder="9876543210" 
                />
              </div>
              {errors.mobile && <p className="text-[10px] font-bold text-red-500 ml-2 animate-in fade-in slide-in-from-left-1">{errors.mobile.message}</p>}
            </div>
          </div>
 
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase ml-1">Email Address</label>
            <div className="relative">
              <Mail className={cn("absolute left-4 top-1/2 -translate-y-1/2 transition-colors", errors.email ? "text-red-400" : "text-gray-400")} size={16} />
              <input 
                {...register("email")}
                className={cn(
                  "w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-2xl focus:ring-4 transition-all text-sm font-bold",
                  errors.email 
                    ? "border-red-100 focus:border-red-400 focus:ring-red-400/10" 
                    : "border-gray-100 focus:border-primary focus:ring-primary/10"
                )} 
                placeholder="name@example.com" 
              />
            </div>
            {errors.email && <p className="text-[10px] font-bold text-red-500 ml-2 animate-in fade-in slide-in-from-left-1">{errors.email.message}</p>}
          </div>
 
          {role === 'agent' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase ml-1">Agency Name</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input {...register("agencyName")} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold" placeholder="Relocate Agency" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase ml-1">License No.</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input {...register("licenseNumber")} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold" placeholder="LIC-12345" />
                </div>
              </div>
            </div>
          )}
 
          {role === 'owner' && (
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
              <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase ml-1">Company/Entity Name</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input {...register("agencyName")} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold" placeholder="e.g. Relocate Properties" />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase ml-1">Address (Optional)</label>
            <div className="relative">
              <MapPin className={cn("absolute left-4 top-1/2 -translate-y-1/2 transition-colors", errors.address ? "text-red-400" : "text-gray-400")} size={16} />
              <input 
                {...register("address")}
                className={cn(
                  "w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 rounded-2xl focus:ring-4 transition-all text-sm font-bold",
                  errors.address 
                    ? "border-red-100 focus:border-red-400 focus:ring-red-400/10" 
                    : "border-gray-100 focus:border-primary focus:ring-primary/10"
                )} 
                placeholder="Street address, City, State" 
              />
            </div>
            {errors.address && <p className="text-[10px] font-bold text-red-500 ml-2 animate-in fade-in slide-in-from-left-1">{errors.address.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase ml-1">Password</label>
              <div className="relative">
                <Lock className={cn("absolute left-4 top-1/2 -translate-y-1/2 transition-colors", errors.password ? "text-red-400" : "text-gray-400")} size={16} />
                <input 
                  {...register("password")}
                  type={showPassword ? "text" : "password"} 
                  className={cn(
                    "w-full pl-11 pr-12 py-3.5 bg-gray-50 border-2 rounded-2xl focus:ring-4 transition-all text-sm font-bold",
                    errors.password 
                      ? "border-red-100 focus:border-red-400 focus:ring-red-400/10" 
                      : "border-gray-100 focus:border-primary focus:ring-primary/10"
                  )} 
                  placeholder="••••••••" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <PasswordStrengthMeter password={passwordValue} />
              {errors.password && <p className="text-[10px] font-bold text-red-500 ml-2 animate-in fade-in slide-in-from-left-1 leading-relaxed">{errors.password.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className={cn("absolute left-4 top-1/2 -translate-y-1/2 transition-colors", errors.confirmPassword ? "text-red-400" : "text-gray-400")} size={16} />
                <input 
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"} 
                  className={cn(
                    "w-full pl-11 pr-12 py-3.5 bg-gray-50 border-2 rounded-2xl focus:ring-4 transition-all text-sm font-bold",
                    errors.confirmPassword 
                      ? "border-red-100 focus:border-red-400 focus:ring-red-400/10" 
                      : "border-gray-100 focus:border-primary focus:ring-primary/10"
                  )} 
                  placeholder="••••••••" 
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-[10px] font-bold text-red-500 ml-2 animate-in fade-in slide-in-from-left-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>
 
          {serverError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={16} />
              <p className="text-[10px] font-bold uppercase tracking-widest">{serverError}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || !isValid} 
            className={cn(
              "w-full py-4 bg-primary text-white rounded-2xl font-black tracking-widest shadow-xl shadow-primary/20 hover:shadow-2xl hover:translate-y-[-2px] transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 mt-4",
              !isValid && "cursor-not-allowed grayscale-[0.5]"
            )}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                <span>CREATE ACCOUNT</span>
                <ArrowRight size={18} strokeWidth={3} />
              </>
            )}
          </button>
        </form>
 
        <p className="mt-8 text-center text-xs font-bold text-gray-500 tracking-widest uppercase">
          Already have an account?{" "}
          <Link href={`/${locale}/login`} className="text-primary font-black hover:underline ml-1">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
