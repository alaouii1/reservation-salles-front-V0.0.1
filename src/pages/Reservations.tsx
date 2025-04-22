import { useEffect, useState } from 'react';
import { Clock, MapPin, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { getUserReservations, cancelReservation } from '../services/reservationService';
import { Reservation } from '../types/Reservation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const StatusBadge = ({ status }: { status: Reservation['status'] }) => {
  const statusConfig = {
    en_attente: {
      icon: AlertCircle,
      text: 'En attente',
      className: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    },
    confirmee: {
      icon: CheckCircle,
      text: 'Confirmée',
      className: 'bg-green-50 text-green-700 border-green-200'
    },
    annulee: {
      icon: XCircle,
      text: 'Annulée',
      className: 'bg-gray-50 text-gray-700 border-gray-200'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${config.className}`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{config.text}</span>
    </div>
  );
};

const ReservationCard = ({ reservation, onCancel }: { reservation: Reservation; onCancel: (id: number) => void }) => {
  const canCancel = reservation.status !== 'annulee';
  const dateDebut = new Date(reservation.dateDebut);
  const dateFin = new Date(reservation.dateFin);

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors relative">
      {/* Right side column with status and cancel button */}
      <div className="absolute top-6 right-6 flex flex-col items-center gap-4">
        <StatusBadge status={reservation.status} />
        {canCancel && (
          <button
            onClick={() => onCancel(reservation.id)}
            className="text-red-600 hover:text-red-700 font-medium text-sm"
          >
            Annuler
          </button>
        )}
      </div>

      {/* Main content */}
      <div className="pr-32">
        <h3 className="text-lg font-medium mb-3">{reservation.salleNom}</h3>
        <div className="space-y-2 text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>
              {format(dateDebut, "d MMMM yyyy, HH'h'mm", { locale: fr })} - {format(dateFin, "HH'h'mm", { locale: fr })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{reservation.localisationNom}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReservations = async () => {
    try {
      const response = await getUserReservations();
      setReservations(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await cancelReservation(id);
      // Reload reservations after cancellation
      loadReservations();
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la réservation:', error);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const groupedReservations = {
    upcoming: reservations.filter(r => new Date(r.dateDebut) > new Date() && r.status !== 'annulee'),
    past: reservations.filter(r => new Date(r.dateDebut) <= new Date() || r.status === 'annulee')
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes Réservations</h1>
          <p className="mt-2 text-gray-600">Gérez vos réservations de salles</p>
        </header>
        
        {/* Upcoming Reservations */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-medium">Réservations à venir</h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {groupedReservations.upcoming.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Aucune réservation à venir
              </div>
            ) : (
              groupedReservations.upcoming.map(reservation => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onCancel={handleCancel}
                />
              ))
            )}
          </div>
        </div>

        {/* Past Reservations */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-medium">Réservations passées</h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {groupedReservations.past.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Aucune réservation passée
              </div>
            ) : (
              groupedReservations.past.map(reservation => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onCancel={handleCancel}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations; 