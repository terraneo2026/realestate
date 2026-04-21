"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthTab = "signin" | "register" | "otp";

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState<AuthTab>("signin");
  const [loading, setLoading] = useState(false);

  const [signInData, setSignInData] = useState({ email: "", password: "", rememberMe: false });
  const [registerData, setRegisterData] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "", agreeTerms: false, role: "tenant" });
  const [otpData, setOtpData] = useState({ phone: "", otp: "", step: "phone" as "phone" | "verify" });

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

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSignInData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOtpData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: string) => setRegisterData(prev => ({ ...prev, role }));

  const navigateToRoleRegister = (role: string) => {
    const locale = pathname?.split("/")[1] || (typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "en");
    const route = `/${locale}/${role}/register`;
    try { setTimeout(() => router.push(route), 150); } catch (err) { if (typeof window !== "undefined") window.location.href = route; }
  };

  const handleSignIn = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onClose(); }, 800);
  };

  const handleRegister = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (registerData.password !== registerData.confirmPassword) { alert("Passwords do not match"); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
      navigateToRoleRegister(registerData.role as string);
    }, 900);
  };

  const handleSendOTP = async (e?: React.FormEvent) => { e?.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); setOtpData(prev => ({ ...prev, step: "verify" })); }, 900); };
  const handleVerifyOTP = async (e?: React.FormEvent) => { e?.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); onClose(); }, 900); };

  if (!isOpen) return null;

  const primaryColor = "var(--primary-color)";
  const ringColorStyle = { '--tw-ring-color': primaryColor } as React.CSSProperties;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div role="dialog" aria-modal="true" aria-labelledby="auth-modal-title" className="relative w-full max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
          <header className="text-white p-5 flex items-center justify-between" style={{ background: `linear-gradient(to right, ${primaryColor}, #16a34a)` }}>
            <h3 id="auth-modal-title" className="text-2xl font-bold">eBroker</h3>
            <button onClick={onClose} aria-label="Close" className="text-white text-2xl focus:outline-none focus:ring-2 focus:ring-white rounded">✕</button>
          </header>

          <nav className="flex border-b bg-gray-50">
            {[
              { id: "signin", label: "Sign In" },
              { id: "register", label: "Register" },
              { id: "otp", label: "OTP Login" }
            ].map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id as AuthTab); if (tab.id === 'otp') setOtpData(prev => ({ ...prev, step: 'phone' })); }} className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${activeTab === tab.id ? 'primaryColor border-b-2' : 'text-gray-600 border-b-transparent'}`} style={activeTab === tab.id ? { borderBottomColor: primaryColor } : {}}>
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="p-5 overflow-y-auto flex-1 min-h-0">
            {activeTab === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Email</label>
                  <input name="email" type="email" value={signInData.email} onChange={handleSignInChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2" style={ringColorStyle} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Password</label>
                  <input name="password" type="password" value={signInData.password} onChange={handleSignInChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2" style={ringColorStyle} />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <input id="rememberMe" name="rememberMe" type="checkbox" checked={signInData.rememberMe} onChange={handleSignInChange} className="w-4 h-4" />
                    <label htmlFor="rememberMe" className="text-sm text-gray-700">Remember me</label>
                  </div>
                  <button type="button" className="text-sm primaryColor">Forgot?</button>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                  <button type="submit" disabled={loading} className="flex-1 primaryBg text-white py-3 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-offset-2" style={ringColorStyle}>{loading ? 'Signing in...' : 'Sign In'}</button>
                  <button type="button" onClick={() => setActiveTab('register')} className="flex-1 bg-white border border-gray-200 primaryColor py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2" style={ringColorStyle}>Register</button>
                </div>
              </form>
            )}

            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Full name</label>
                  <input name="fullName" type="text" value={registerData.fullName} onChange={handleRegisterChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2" style={ringColorStyle} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Email</label>
                  <input name="email" type="email" value={registerData.email} onChange={handleRegisterChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2" style={ringColorStyle} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Phone</label>
                  <input name="phone" type="tel" value={registerData.phone} onChange={handleRegisterChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2" style={ringColorStyle} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Register as</label>
                  <div className="flex gap-2">
                    {['tenant', 'owner', 'agent'].map(r => (
                      <button key={r} type="button" onClick={() => handleRoleChange(r)} className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${registerData.role === r ? 'primaryBg text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Password</label>
                  <input name="password" type="password" value={registerData.password} onChange={handleRegisterChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2" style={ringColorStyle} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Confirm password</label>
                  <input name="confirmPassword" type="password" value={registerData.confirmPassword} onChange={handleRegisterChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2" style={ringColorStyle} />
                </div>

                <div className="flex gap-3 flex-col md:flex-row">
                  <button type="submit" disabled={loading} className="flex-1 primaryBg text-white py-3 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-offset-2" style={ringColorStyle}>{loading ? 'Registering...' : 'Create Account'}</button>
                  <button type="button" onClick={() => setActiveTab('signin')} className="flex-1 bg-white border border-gray-200 primaryColor py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2" style={ringColorStyle}>Sign In</button>
                </div>
              </form>
            )}

            {activeTab === 'otp' && (
              <form onSubmit={otpData.step === 'phone' ? handleSendOTP : handleVerifyOTP} className="space-y-4">
                {otpData.step === 'phone' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">Phone</label>
                      <input name="phone" type="tel" value={otpData.phone} onChange={handleOtpChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2" style={ringColorStyle} />
                    </div>
                    <button type="submit" disabled={loading} className="w-full primaryBg text-white py-3 rounded-lg font-bold">{loading ? 'Sending OTP...' : 'Send OTP'}</button>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">OTP</label>
                      <input name="otp" type="text" value={otpData.otp} onChange={handleOtpChange} maxLength={6} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-center text-2xl" style={ringColorStyle} />
                    </div>
                    <div className="flex gap-3 flex-col md:flex-row">
                      <button type="button" onClick={() => setOtpData(prev => ({ ...prev, step: 'phone', otp: '' }))} className="flex-1 bg-white border border-gray-200 primaryColor py-3 rounded-lg">Change Phone</button>
                      <button type="submit" disabled={loading} className="flex-1 primaryBg text-white py-3 rounded-lg">{loading ? 'Verifying...' : 'Verify OTP'}</button>
                    </div>
                  </>
                )}
              </form>
            )}
          </div>

          <div className="bg-gray-50 px-5 py-4 border-t text-center text-xs text-gray-600">By signing in, you agree to our Terms of Service and Privacy Policy</div>
        </div>
      </div>
    </div>
  );
}
