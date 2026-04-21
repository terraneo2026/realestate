"use client";

import { useMemo } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PasswordStrengthMeterProps {
  password?: string;
}

export default function PasswordStrengthMeter({ password = "" }: PasswordStrengthMeterProps) {
  const strength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    return score;
  }, [password]);

  const strengthLabel = useMemo(() => {
    switch (strength) {
      case 0: return "Very Weak";
      case 1: return "Weak";
      case 2: return "Medium";
      case 3: return "Strong";
      case 4: return "Very Strong";
      default: return "";
    }
  }, [strength]);

  const strengthColor = useMemo(() => {
    switch (strength) {
      case 0: return "bg-gray-200";
      case 1: return "bg-red-500";
      case 2: return "bg-orange-500";
      case 3: return "bg-yellow-500";
      case 4: return "bg-green-500";
      default: return "bg-gray-200";
    }
  }, [strength]);

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1 h-1 w-full overflow-hidden rounded-full bg-gray-100">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={cn(
              "h-full flex-1 transition-all duration-300",
              step <= strength ? strengthColor : "bg-transparent"
            )}
          />
        ))}
      </div>
      <div className="flex justify-between items-center px-1">
        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
          Strength: <span className={cn(strength > 0 && "text-gray-900")}>{strengthLabel}</span>
        </span>
      </div>
    </div>
  );
}
