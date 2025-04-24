import { useEffect, useState, useMemo, useRef } from 'react';
import { getAllSalles } from '../services/salleService';
import { Salle } from '../types/Salle';
import { Search, MapPin, Clock, Calendar } from 'lucide-react';
import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';

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

  // Close time pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setShowStartTimePicker(false);
        setShowEndTimePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const locations = useMemo(() => {
    const uniqueLocations = new Set(salles.map(salle => salle.localisationNom));
    return ['Tous les locaux', ...Array.from(uniqueLocations)];
  }, [salles]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateInput(e.target.value);
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 20; hour++) {
      options.push(`${hour.toString().padStart(2, '0')}:00`);
      options.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return options;
  };

  const timeOptions = useMemo(() => generateTimeOptions(), []);

  const filteredSalles = useMemo(() => {
    let filtered = salles;
    
    if (searchQuery) {
      filtered = filtered.filter(salle => 
        salle.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salle.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedLocation && selectedLocation !== 'Tous les locaux') {
      filtered = filtered.filter(salle => salle.localisationNom === selectedLocation);
    }
    
    return filtered;
  }, [salles, searchQuery, selectedLocation]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-[#F8F9FF]">
      <h2 className="text-xl font-semibold mb-6">Filtres</h2>

      {/* Search Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Nom de salle */}
          <div>
            <label htmlFor="room-search" className="block text-sm font-medium text-gray-700 mb-1">Nom de salle</label>
            <div className="relative">
              <input
                id="room-search"
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Local */}
          <div>
            <label htmlFor="location-select" className="block text-sm font-medium text-gray-700 mb-1">Local</label>
            <select
              id="location-select"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              {locations.map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="relative">
            <label htmlFor="date-input" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <div className="relative">
              <input
                ref={dateInputRef}
                id="date-input"
                type="text"
                placeholder="JJ/MM/AAAA"
                className="w-full pl-4 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={dateInput}
                onChange={handleDateChange}
              />
              <Calendar className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 cursor-pointer" 
                onClick={() => {
                  if (dateInputRef.current) {
                    dateInputRef.current.type = 'date';
                    dateInputRef.current.showPicker();
                  }
                }}
              />
            </div>
          </div>

          {/* Début */}
          <div>
            <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1">Début</label>
            <div className="relative" ref={timePickerRef}>
              <input
                id="start-time"
                type="text"
                placeholder="HH:mm"
                className="w-full pl-4 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                onClick={() => setShowStartTimePicker(true)}
              />
              <Clock className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 cursor-pointer" 
                onClick={() => setShowStartTimePicker(!showStartTimePicker)}
              />
              
              {showStartTimePicker && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg z-10 w-full max-h-48 overflow-y-auto border border-gray-200">
                  {timeOptions.map(time => (
                    <div 
                      key={time} 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        setStartTime(time);
                        setShowStartTimePicker(false);
                      }}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Fin */}
          <div>
            <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
            <div className="relative" ref={timePickerRef}>
              <input
                id="end-time"
                type="text"
                placeholder="HH:mm"
                className="w-full pl-4 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                onClick={() => setShowEndTimePicker(true)}
              />
              <Clock className="w-5 h-5 text-gray-400 absolute right-3 top-2.5 cursor-pointer" 
                onClick={() => setShowEndTimePicker(!showEndTimePicker)}
              />
              
              {showEndTimePicker && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg z-10 w-full max-h-48 overflow-y-auto border border-gray-200">
                  {timeOptions.map(time => (
                    <div 
                      key={time} 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        setEndTime(time);
                        setShowEndTimePicker(false);
                      }}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Room Cards
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredSalles.map((salle) => (
          <div
            key={salle.id}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-[#4F46E5]">
                {salle.nom}
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm ${
                salle.id % 2 === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {salle.id % 2 === 0 ? 'Disponible' : 'Occupée'}
              </span>
            </div>

            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="w-4 h-4 mr-2" />
              {salle.localisationNom}
            </div>

            <p className="text-gray-600 mb-6 text-sm">
              {salle.description || 'Pas de description disponible.'}
            </p>

            <button
              className={`w-full py-3 rounded-lg text-center font-medium ${
                salle.id % 2 === 0
                  ? 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={salle.id % 2 !== 0}
            >
              {salle.id % 2 === 0 ? 'Réserver' : 'Non disponible'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}; */}
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

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center text-sm text-gray-500">
          <Users className="w-4 h-4 mr-1" />
          <span>Capacité: {salle.capacite || 'N/A'}</span>
        </div>
        <button
          className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
            salle.id % 2 === 0
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          disabled={salle.id % 2 !== 0}
        >
          {salle.id % 2 === 0 ? 'Réserver' : 'Indisponible'}
        </button>
      </div>
    </div>
  ))}
</div>

export default AfficherSalles;