import { useEffect, useState, useMemo } from 'react';
import { getAllSalles } from '../services/salleService';
import { Salle } from '../types/Salle';
import { MapPin } from 'lucide-react';

const AfficherSalles = () => {
  const [salles, setSalles] = useState<Salle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string>('');

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

  // Extract unique locations for filtering
  const locations = useMemo(() => {
    const uniqueLocations = new Set(salles.map(salle => salle.localisationNom));
    return ['', ...Array.from(uniqueLocations)];
  }, [salles]);

  // Filter salles by location
  const filteredSalles = useMemo(() => {
    if (!selectedLocation) return salles;
    return salles.filter(salle => salle.localisationNom === selectedLocation);
  }, [salles, selectedLocation]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-500 text-sm">Chargement des salles...</span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold text-primary mb-6">
        Liste des Salles
      </h2>

      {/* Location Filter */}
      <div className="mb-6">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1.5">
          Filtrer par Localisation
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

      {filteredSalles.length === 0 ? (
        <p className="text-gray-600">Aucune salle trouvée pour cette localisation.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredSalles.map((salle) => (
            <div
              key={salle.id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {salle.nom}
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  {salle.localisationNom}
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                {salle.description || 'Pas de description disponible.'}
              </p>
              <button
                className="w-full bg-primary text-white text-sm font-medium py-2 rounded-lg hover:bg-primary-dark transition-colors"
                disabled
              >
                Réserver
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AfficherSalles;
