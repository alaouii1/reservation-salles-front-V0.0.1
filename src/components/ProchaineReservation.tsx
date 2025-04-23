import { useEffect, useState } from 'react';
import { getNextReservation } from '../services/reservationService';
import { Reservation } from '../types/Reservation';
import { Clock, MapPin } from 'lucide-react';

const ProchaineReservation = () => {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNextReservation()
      .then((response) => setReservation(response.data))
      .catch((err) => console.error('Erreur de chargement :', err))
      .finally(() => setLoading(false));
     
  }, []);
  

  if (loading) return <p className="text-gray-500">Chargement...</p>;
  if (!reservation) return <p className="text-gray-500">Aucune réservation à venir.</p>;

  const dateDebut = new Date(reservation.dateDebut);
  const dateFin = new Date(reservation.dateFin);

  const formattedDate = dateDebut.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const startTime = dateDebut.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const endTime = dateFin.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
   
      <div>
        <h3 className="text-xl font-medium mb-2">{reservation.salle.nom}</h3>
        <div className="space-y-2 text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{formattedDate}, {startTime} - {endTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{reservation.salle.localisation.nom}</span>
          
          </div>
        </div>
      </div>
  
  );
};

export default ProchaineReservation;
