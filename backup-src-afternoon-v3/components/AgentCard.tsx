"use client";

import Link from "next/link";

interface AgentCardProps {
  name: string;
  title?: string;
  phone?: string;
  email?: string;
  image?: string;
}

export default function AgentCard({ name, title, phone, email, image }: AgentCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex gap-4 mb-4">
        {image && (
          <img
            src={image}
            alt={name}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          {title && <p className="text-sm text-gray-600">{title}</p>}
        </div>
      </div>

      <div className="space-y-3 mb-4 border-t border-gray-200 pt-4">
        {phone && (
          <div className="flex items-center space-x-2">
            <span className="text-lg">📞</span>
            <a href={`tel:${phone}`} className="text-primary hover:underline">
              {phone}
            </a>
          </div>
        )}
        {email && (
          <div className="flex items-center space-x-2">
            <span className="text-lg">✉️</span>
            <a href={`mailto:${email}`} className="text-primary hover:underline">
              {email}
            </a>
          </div>
        )}
      </div>

      <button className="w-full primaryBg text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all">
        Contact Agent
      </button>
    </div>
  );
}
