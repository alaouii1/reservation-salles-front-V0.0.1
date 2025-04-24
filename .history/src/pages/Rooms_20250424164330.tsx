import { useEffect, useState, useMemo, useRef } from 'react';
import { getAllSalles } from '../services/salleService';
import { Salle } from '../types/Salle';
import { Search, MapPin, Clock, Calendar, Users } from 'lucide-react';
import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import ReservationModal from '../components/ReservationModal';

const AfficherSalles = () => {
  const [salles, setSalles] = useState<Salle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [dateInput, setDateInput] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Salle | null>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  
  const timePickerRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getAllSalles()
      .then((res) => {
        setSalles(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des salles:', err);
        setLoading(false);
      });
  }, []);

  // ... (keep all your existing useEffect and other functions)

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Filtres</h2>

      {/* Search Filters (keep existing filter code) */}

      {/* Room Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSalles.map((salle) => (
          <div
            key={salle.id}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-5">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {salle.nom}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                salle.id % 2 === 0 
                  ? 'bg-green-50 text-green-600 border border-green-100' 
                  : 'bg-red-50 text-red-600 border border-red-100'
              }`}>
                {salle.id % 2 === 0 ? 'Disponible' : 'Occupée'}
              </span>
            </div>

            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="w-5 h-5 mr-2 text-indigo-500" />
              <span className="text-gray-700">{salle.localisationNom}</span>
            </div>

            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              {salle.description || 'Pas de description disponible.'}
            </p>

            <div className="flex justify-end mt-auto">
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  salle.id % 2 === 0
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                disabled={salle.id % 2 !== 0}
                onClick={() => {
                  if (salle.id % 2 === 0) {
                    setSelectedRoom(salle);
                    setShowReservationModal(true);
                  }
                }}
              >
                {salle.id % 2 === 0 ? 'Réserver' : 'Indisponible'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reservation Modal */}
      {selectedRoom && (
        <ReservationModal
          isOpen={showReservationModal}
          onClose={() => setShowReservationModal(false)}
          room={{
            name: selectedRoom.nom,
            location: selectedRoom.localisationNom,
            description: selectedRoom.description || 'Pas de description disponible.'
          }}
        />
      )}
    </div>
  );
};

export default AfficherSalles;