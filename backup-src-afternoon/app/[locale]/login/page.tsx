"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", formData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h1 className="text-3xl font-bold mb-8 text-center primaryColor">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 space-y-2">
          <p className="text-sm text-center">New to Relocate?</p>
          <div className="grid grid-cols-3 gap-2">
            <Link
              href="/tenant/register"
              className="text-center text-sm px-3 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all"
            >
              Tenant
            </Link>
            <Link
              href="/owner/register"
              className="text-center text-sm px-3 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all"
            >
              Owner
            </Link>
            <Link
              href="/agent/register"
              className="text-center text-sm px-3 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all"
            >
              Agent
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}