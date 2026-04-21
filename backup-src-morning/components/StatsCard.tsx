"use client";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: string;
  color?: "primary" | "blue" | "green" | "orange";
}

export default function StatsCard({ label, value, icon, color = "primary" }: StatsCardProps) {
  const colorClasses = {
    primary: "bg-teal-50 text-primary",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {icon && (
          <div className={`text-4xl p-3 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
