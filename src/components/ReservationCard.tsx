// components/ReservationCard.tsx
import React from 'react';

interface ReservationCardProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
}

const ReservationCard: React.FC<ReservationCardProps> = ({ title, icon, children, className = '' }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-sm ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      <span className="material-icons-outlined text-indigo-600">{icon}</span>
      <h2 className="text-lg font-medium text-indigo-600">{title}</h2>
    </div>
    {children}
  </div>
);

export default ReservationCard;
