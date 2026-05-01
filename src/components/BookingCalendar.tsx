'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Loader2, CreditCard } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BookingCalendarProps {
  propertyId: string;
  onBookingSubmit: (date: Date, slot: string) => Promise<void>;
  loading?: boolean;
  tokenAmount?: number;
}

const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
];

export function BookingCalendar({ propertyId, onBookingSubmit, loading, tokenAmount = 500 }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) return;
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const renderDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isPast = date < today;
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isToday = today.toDateString() === date.toDateString();

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={isPast}
          className={cn(
            "h-10 w-10 rounded-xl text-xs font-black transition-all flex items-center justify-center relative",
            isPast ? "text-gray-200 cursor-not-allowed" : "text-gray-700 hover:bg-primary/10 hover:text-primary",
            isSelected && "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary hover:text-white",
            isToday && !isSelected && "border-2 border-primary/20"
          )}
        >
          {day}
          {isToday && !isSelected && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 p-8 border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
          <CalendarIcon className="text-primary" size={20} strokeWidth={3} />
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight">Book a Visit</h3>
          <p className="text-[9px] font-black text-gray-400 tracking-widest uppercase">Select Date & Time</p>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-black text-gray-900 uppercase tracking-widest">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all border border-gray-100">
            <ChevronLeft size={16} />
          </button>
          <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all border border-gray-100">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="h-10 w-10 flex items-center justify-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2 mb-8">
        {renderDays()}
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2">
            <Clock className="text-primary/70" size={14} />
            <span className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Available Slots</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {TIME_SLOTS.map(slot => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={cn(
                  "py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest",
                  selectedSlot === slot 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-100"
                )}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-8 pt-8 border-t border-gray-50">
        <button
          onClick={() => selectedDate && selectedSlot && onBookingSubmit(selectedDate, selectedSlot)}
          disabled={!selectedDate || !selectedSlot || loading}
          className={cn(
            "w-full py-4 rounded-[1.5rem] font-black tracking-widest text-xs uppercase shadow-xl transition-all flex items-center justify-center gap-3",
            selectedDate && selectedSlot 
              ? "bg-primary text-white shadow-primary/20 hover:bg-primary/90 active:scale-95" 
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <CreditCard size={18} />
              <span>Pay ₹{tokenAmount} & Book</span>
            </>
          )}
        </button>
        <p className="mt-4 text-[9px] font-bold text-gray-400 text-center leading-relaxed">
          * A token payment of ₹{tokenAmount} is required to secure your visit. Refundable upon visit completion.
        </p>
      </div>
    </div>
  );
}
