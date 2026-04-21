'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  initialMin?: number;
  initialMax?: number;
  onChange: (min: number, max: number) => void;
  formatLabel?: (value: number) => string;
}

export function RangeSlider({
  min,
  max,
  step = 1000,
  initialMin,
  initialMax,
  onChange,
  formatLabel = (val) => `₹${val.toLocaleString()}`
}: RangeSliderProps) {
  const [minVal, setMinVal] = useState(initialMin ?? min);
  const [maxVal, setMaxVal] = useState(initialMax ?? max);
  const minValRef = useRef(initialMin ?? min);
  const maxValRef = useRef(initialMax ?? max);
  const range = useRef<HTMLDivElement>(null);

  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  useEffect(() => {
    setMinVal(initialMin ?? min);
    minValRef.current = initialMin ?? min;
  }, [initialMin, min]);

  useEffect(() => {
    setMaxVal(initialMax ?? max);
    maxValRef.current = initialMax ?? max;
  }, [initialMax, max]);

  const handleMinChange = (value: number) => {
    setMinVal(value);
    minValRef.current = value;
    onChange(value, maxVal);
  };

  const handleMaxChange = (value: number) => {
    setMaxVal(value);
    maxValRef.current = value;
    onChange(minVal, value);
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="relative w-full h-10 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxVal - step);
            handleMinChange(value);
          }}
          className="thumb thumb--left z-30"
          style={{ zIndex: minVal > max - 100 ? "5" : undefined }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minVal + step);
            handleMaxChange(value);
          }}
          className="thumb thumb--right z-40"
        />

        <div className="slider">
          <div className="slider__track bg-gray-100" />
          <div ref={range} className="slider__range bg-primary" />
        </div>
      </div>

      <div className="flex justify-between items-center px-1">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Min</span>
          <span className="text-sm font-black text-gray-900">{formatLabel(minVal)}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Max</span>
          <span className="text-sm font-black text-gray-900">{formatLabel(maxVal)}</span>
        </div>
      </div>

      <style jsx>{`
        .slider {
          position: relative;
          width: 100%;
        }

        .slider__track,
        .slider__range,
        .slider__left-value,
        .slider__right-value {
          position: absolute;
        }

        .slider__track,
        .slider__range {
          height: 6px;
          border-radius: 3px;
        }

        .slider__track {
          width: 100%;
          z-index: 1;
        }

        .slider__range {
          z-index: 2;
        }

        .thumb,
        .thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          -webkit-tap-highlight-color: transparent;
        }

        .thumb {
          pointer-events: none;
          position: absolute;
          height: 0;
          width: 100%;
          outline: none;
        }

        .thumb--left {
          z-index: 3;
        }

        .thumb--right {
          z-index: 4;
        }

        .thumb::-webkit-slider-thumb {
          background-color: #ffffff;
          border: 3px solid #FFC107;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          height: 24px;
          width: 24px;
          margin-top: 4px;
          pointer-events: all;
          position: relative;
        }

        .thumb::-moz-range-thumb {
          background-color: #ffffff;
          border: 3px solid #FFC107;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          height: 24px;
          width: 24px;
          margin-top: 4px;
          pointer-events: all;
          position: relative;
        }
      `}</style>
    </div>
  );
}
