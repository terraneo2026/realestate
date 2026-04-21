'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Option {
  value: string;
  label: string;
}

interface SearchableDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  label,
  icon,
  className
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {label && (
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">{label}</span>
        </div>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-transparent text-sm md:text-base font-black text-gray-900 focus:outline-none cursor-pointer group"
      >
        <span className={cn("truncate", !selectedOption && "text-gray-300 font-medium")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn(
          "w-4 h-4 text-gray-400 transition-transform duration-300",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-white border border-gray-100 shadow-2xl rounded-[2rem] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-4 duration-300 min-w-[240px]">
          <div className="p-4 border-b border-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                autoFocus
                className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
          
          <ul className="max-h-[250px] overflow-y-auto py-2 scrollbar-hide">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "px-6 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between transition-colors",
                    value === opt.value ? "bg-primary/5 text-primary" : "text-gray-700"
                  )}
                >
                  <span className="text-sm font-bold">{opt.label}</span>
                  {value === opt.value && <Check className="w-4 h-4" />}
                </li>
              ))
            ) : (
              <li className="px-6 py-8 text-center text-gray-400 text-sm font-medium">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
