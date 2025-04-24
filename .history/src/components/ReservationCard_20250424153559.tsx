// components/ReservationCard.tsx
import React from 'react';

interface ReservationCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const ReservationCard: React.FC<ReservationCardProps> = ({ 
  title, 
  icon, 
  children, 
  className = '' 
}) => (
  <div className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
    <div className="flex items-center gap-4 mb-5">
      <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100">
        {React.cloneElement(icon as React.ReactElement, {
          className: "w-6 h-6 text-indigo-600"
        })}
      </div>
      <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        {title}
      </h2>
    </div>
    <div className="space-y-4 text-gray-700">
      {children}
    </div>
  </div>
);

export default ReservationCard;
