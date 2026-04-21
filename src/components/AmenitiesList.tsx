"use client";

interface AmenitiesListProps {
  amenities: string[];
}

export default function AmenitiesList({ amenities }: AmenitiesListProps) {
  if (!amenities || amenities.length === 0) {
    return null;
  }

  const amenityIcons: { [key: string]: string } = {
    "air conditioning": "❄️",
    "wifi": "📶",
    "parking": "🅿️",
    "garden": "🌳",
    "pool": "🏊",
    "gym": "💪",
    "elevator": "🛗",
    "security": "🔒",
    "balcony": "🪟",
    "kitchen": "🍳",
    "laundry": "🧺",
    "dishwasher": "🍽️",
    "furnished": "🛋️",
    "pet friendly": "🐾",
    "heating": "🔥",
    "default": "✓",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {amenities.map((amenity, idx) => {
          const key = (amenity || "").toLowerCase();
          const icon = amenityIcons[key] || amenityIcons["default"];
          return (
            <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">{icon}</span>
              <span className="text-gray-700 capitalize">{amenity}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
