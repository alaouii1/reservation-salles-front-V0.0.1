import React, { useState, useMemo } from 'react';
import { Search, MapPin } from 'lucide-react';
import ReservationModal from '../components/ReservationModal';

interface RoomData {
  name: string;
  location: string;
  description: string;
  isAvailable: boolean;
}

interface RoomCardProps extends RoomData {
  onReserve: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ 
  name, 
  location, 
  description, 
  isAvailable,
  onReserve 
}) => (
  <div className="card p-6">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-primary text-xl font-medium">{name}</h3>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
        isAvailable 
          ? 'bg-green-50 text-green-700' 
          : 'bg-red-50 text-red-700'
      }`}>
        {isAvailable ? 'Disponible' : 'Occupée'}
      </span>
    </div>
    
    <div className="space-y-3 mb-6">
      <div className="flex items-center gap-2 text-gray-600">
        <MapPin className="w-4 h-4" aria-hidden="true" />
        <span className="text-sm">{location}</span>
      </div>
      <p className="text-sm text-gray-600">
        {description}
      </p>
    </div>

    <button 
      className={`w-full py-2.5 rounded-lg text-center font-medium text-sm transition-colors ${
        isAvailable
          ? 'bg-primary text-white hover:bg-primary-dark'
          : 'bg-gray-50 text-gray-400 cursor-not-allowed'
      }`}
      disabled={!isAvailable}
      onClick={onReserve}
    >
      {isAvailable ? 'Réserver' : 'Non disponible'}
    </button>
  </div>
);

const Rooms: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const handleReserve = (room: RoomData) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const rooms: RoomData[] = [
    {
      name: "Amphithéâtre A",
      location: "Bâtiment Principal",
      description: "Grand amphithéâtre avec équipement audiovisuel complet",
      isAvailable: true
    },
    {
      name: "Salle B204",
      location: "Bâtiment B",
      description: "Salle de cours avec tables modulables",
      isAvailable: false
    },
    {
      name: "Laboratoire C103",
      location: "Bâtiment C",
      description: "Laboratoire informatique avec postes de travail",
      isAvailable: true
    },
    {
      name: "Salle de Conférence D1",
      location: "Bâtiment D",
      description: "Salle de conférence équipée d'un système de visioconférence",
      isAvailable: true
    },
    {
      name: "Studio E5",
      location: "Bâtiment E",
      description: "Studio multimédia avec équipement audio et vidéo",
      isAvailable: false
    },
    {
      name: "Salle B103",
      location: "Bâtiment B",
      description: "Salle de réunion avec tableau interactif",
      isAvailable: true
    },
    {
      name: "Laboratoire C205",
      location: "Bâtiment C",
      description: "Laboratoire de langues avec cabines individuelles",
      isAvailable: true
    },
    {
      name: "Amphithéâtre D2",
      location: "Bâtiment D",
      description: "Amphithéâtre moderne avec système de sonorisation",
      isAvailable: true
    }
  ];

  // Extraire les locations uniques pour le filtre
  const locations = useMemo(() => {
    const uniqueLocations = new Set(rooms.map(room => room.location));
    return ['', ...Array.from(uniqueLocations)];
  }, [rooms]);

  // Filtrer les salles selon la recherche et le local
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesSearch = searchQuery === '' || 
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLocation = selectedLocation === '' || 
        room.location === selectedLocation;

      return matchesSearch && matchesLocation;
    });
  }, [rooms, searchQuery, selectedLocation]);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-primary text-2xl font-medium mb-2">
            Salles disponibles
          </h1>
          <p className="text-sm text-gray-600">
            Recherchez et réservez une salle selon vos critères
          </p>
        </header>

        {/* Search Section */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search Input */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1.5">
                Recherche
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" aria-hidden="true" />
                <input
                  id="search"
                  type="text"
                  placeholder="Nom ou description..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Location Select */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1.5">
                Local
              </label>
              <select 
                id="location"
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">Tous les locaux</option>
                {locations.slice(1).map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Input */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1.5">
                Date
              </label>
              <input
                id="date"
                type="date"
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                defaultValue="2025-04-18"
              />
            </div>
          </div>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.name}
              {...room}
              onReserve={() => handleReserve(room)}
            />
          ))}
        </div>
      </div>

      {selectedRoom && (
        <ReservationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          room={selectedRoom}
        />
      )}
    </div>
  );
};

export default Rooms; 