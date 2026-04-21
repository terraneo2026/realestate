"use client";

interface PropertyInfoProps {
  title: string;
  price: string;
  location: string;
  type: "rent" | "sell";
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  description?: string;
}

export default function PropertyInfo({
  title,
  price,
  location,
  type,
  bedrooms,
  bathrooms,
  area,
  description,
}: PropertyInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 flex items-center mb-4">
          📍 {location}
        </p>
      </div>

      {/* Price and Type */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
        <div>
          <p className="text-gray-600 text-sm mb-1">Price</p>
          <p className={`text-4xl font-bold ${type === "rent" ? "primaryColor" : "text-blue-600"}`}>
            {price}
          </p>
        </div>
        <div className={`px-4 py-2 rounded-lg font-semibold text-white ${type === "rent" ? "primaryBg" : "bg-blue-600"}`}>
          {type === "rent" ? "For Rent" : "For Sale"}
        </div>
      </div>

      {/* Property Details Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {bedrooms !== undefined && (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl mb-1">🛏️</p>
            <p className="text-gray-600 text-sm">Bedrooms</p>
            <p className="text-xl font-semibold text-gray-900">{bedrooms}</p>
          </div>
        )}
        {bathrooms !== undefined && (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl mb-1">🚿</p>
            <p className="text-gray-600 text-sm">Bathrooms</p>
            <p className="text-xl font-semibold text-gray-900">{bathrooms}</p>
          </div>
        )}
        {area && (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl mb-1">📐</p>
            <p className="text-gray-600 text-sm">Area</p>
            <p className="text-xl font-semibold text-gray-900">{area}</p>
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
          <p className="text-gray-700 leading-relaxed">{description}</p>
        </div>
      )}
    </div>
  );
}
