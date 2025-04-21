import React from 'react';
import { Clock, MapPin } from 'lucide-react';

const Reservations: React.FC = () => {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-medium">Mes Réservations</h1>
        </header>
        
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-medium">Réservations à venir</h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium mb-2">Amphithéâtre A</h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>18 avril 2025, 14:00 - 16:00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>Central</span>
                    </div>
                  </div>
                </div>
                <button className="text-red-600 hover:text-red-700">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations; 