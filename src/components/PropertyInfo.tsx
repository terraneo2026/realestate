"use client";

interface PropertyInfoProps {
  title: string;
  price: string;
  location: string;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string | number;
  possession?: string;
  furnishing?: string;
  facing?: string;
  description?: string;
  postedBy?: string;
  floor?: string | number;
  total_floors?: string | number;
  age?: string | number;
  landmarks?: string[];
  loan_eligible?: boolean;
}

export default function PropertyInfo({
  title,
  price,
  location,
  type,
  bedrooms,
  bathrooms,
  area,
  possession,
  furnishing,
  facing,
  description,
  postedBy,
  floor,
  total_floors,
  age,
  landmarks,
  loan_eligible
}: PropertyInfoProps) {
  const formatValue = (val: any) => {
    if (!val && val !== 0) return 'N/A';
    const strVal = String(val);
    return strVal.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 p-8 md:p-12 border border-gray-100">
      {postedBy && (
        <div className="mb-6 inline-flex items-center gap-3 px-4 py-2 bg-primary/10 text-primary rounded-2xl border border-primary/20">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-[10px] font-black tracking-[0.2em] uppercase">Posted by {postedBy}</span>
        </div>
      )}
      
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 leading-[1.1] tracking-tighter">{title}</h1>
        <div className="flex items-center gap-2 text-gray-400 font-bold text-sm tracking-tight">
          <span className="text-xl">📍</span> {location}
        </div>
      </div>

      {/* Rental Amount or Budget and Type */}
      <div className="flex flex-wrap items-center justify-between gap-8 mb-12 pb-12 border-b border-gray-100">
        <div>
          <p className="text-gray-400 text-[10px] font-black tracking-[0.3em] uppercase mb-2">Budget / Rental Amount</p>
          <p className="text-5xl md:text-6xl font-black text-primary tracking-tighter">
            {price}
          </p>
        </div>
        <div className="px-8 py-3.5 rounded-2xl font-black text-xs tracking-widest uppercase text-white bg-primary shadow-xl shadow-primary/20">
          {type === "rent" || type === "1" ? "For Rent" : "For Lease"}
        </div>
      </div>

      {/* Property Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 transition-all hover:bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-gray-200/30 group">
          <p className="text-2xl mb-3 group-hover:scale-110 transition-transform">🛏️</p>
          <p className="text-gray-400 text-[10px] font-black tracking-widest mb-1 uppercase">Bedrooms</p>
          <p className="text-base font-black text-gray-900">{bedrooms || 'N/A'} BHK</p>
        </div>
        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 transition-all hover:bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-gray-200/30 group">
          <p className="text-2xl mb-3 group-hover:scale-110 transition-transform">🚿</p>
          <p className="text-gray-400 text-[10px] font-black tracking-widest mb-1 uppercase">Bathrooms</p>
          <p className="text-base font-black text-gray-900">{bathrooms || 'N/A'} Bath</p>
        </div>
        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 transition-all hover:bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-gray-200/30 group">
          <p className="text-2xl mb-3 group-hover:scale-110 transition-transform">📐</p>
          <p className="text-gray-400 text-[10px] font-black tracking-widest mb-1 uppercase">Total Area</p>
          <p className="text-base font-black text-gray-900">{area || 'N/A'} sqft</p>
        </div>
        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 transition-all hover:bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-gray-200/30 group">
          <p className="text-2xl mb-3 group-hover:scale-110 transition-transform">📅</p>
          <p className="text-gray-400 text-[10px] font-black tracking-widest mb-1 uppercase">Possession</p>
          <p className="text-base font-black text-gray-900">{formatValue(possession)}</p>
        </div>
        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 transition-all hover:bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-gray-200/30 group">
          <p className="text-2xl mb-3 group-hover:scale-110 transition-transform">🛋️</p>
          <p className="text-gray-400 text-[10px] font-black tracking-widest mb-1 uppercase">Furnishing</p>
          <p className="text-base font-black text-gray-900">{formatValue(furnishing)}</p>
        </div>
        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 transition-all hover:bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-gray-200/30 group">
          <p className="text-2xl mb-3 group-hover:scale-110 transition-transform">🧭</p>
          <p className="text-gray-400 text-[10px] font-black tracking-widest mb-1 uppercase">Facing</p>
          <p className="text-base font-black text-gray-900">{formatValue(facing)}</p>
        </div>
        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 transition-all hover:bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-gray-200/30 group">
          <p className="text-2xl mb-3 group-hover:scale-110 transition-transform">🏢</p>
          <p className="text-gray-400 text-[10px] font-black tracking-widest mb-1 uppercase">Floor</p>
          <p className="text-base font-black text-gray-900">{floor || 'N/A'} of {total_floors || 'N/A'}</p>
        </div>
        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 transition-all hover:bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-gray-200/30 group">
          <p className="text-2xl mb-3 group-hover:scale-110 transition-transform">⏳</p>
          <p className="text-gray-400 text-[10px] font-black tracking-widest mb-1 uppercase">Property Age</p>
          <p className="text-base font-black text-gray-900">{age || 'N/A'} Years</p>
        </div>
      </div>

      {/* Loan Eligibility & Landmarks */}
      {(loan_eligible || landmarks) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {loan_eligible && (
            <div className="p-6 bg-green-50 rounded-3xl border border-green-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <span className="text-2xl">🏦</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-green-600 tracking-widest uppercase mb-1">Financing</p>
                <p className="text-sm font-black text-green-900">Loan Eligibility Approved</p>
              </div>
            </div>
          )}
          {landmarks && landmarks.length > 0 && (
            <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
              <p className="text-[10px] font-black text-blue-600 tracking-widest uppercase mb-3">Nearby Landmarks</p>
              <div className="flex flex-wrap gap-2">
                {landmarks.map(landmark => (
                  <span key={landmark} className="px-3 py-1 bg-white rounded-lg text-[10px] font-bold text-blue-900 border border-blue-100">
                    {landmark}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      {description && (
        <div className="animate-fade-in pt-8 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center">
              <span className="text-xl">📝</span>
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Description</h3>
              <p className="text-[9px] font-black text-gray-400 tracking-widest uppercase">Everything you need to know</p>
            </div>
          </div>
          <p className="text-gray-500 leading-relaxed font-medium whitespace-pre-wrap text-base">{description}</p>
        </div>
      )}
    </div>
  );
}
