import { useEffect, useState } from 'react';
import { Clock, MapPin, AlertCircle, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { getUserReservations, cancelReservation } from '../services/reservationService';
import { Reservation, ReservationStatus } from '../types/Reservation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';

const StatusBadge = ({ statut }: { statut: ReservationStatus }) => {
  console.log('Statut received:', statut);

  const statusConfig: Record<ReservationStatus | 'default', {
    icon: typeof AlertCircle;
    text: string;
    className: string;
  }> = {
    EN_ATTENTE: {
      icon: AlertCircle,
      text: 'En attente',
      className: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    },
    CONFIRMEE: {
      icon: CheckCircle,
      text: 'Confirmée',
      className: 'bg-green-50 text-green-700 border-green-200'
    },
    ANNULEE: {
      icon: XCircle,
      text: 'Annulée',
      className: 'bg-gray-50 text-gray-700 border-gray-200'
    },
    default: {
      icon: AlertCircle,
      text: 'Status inconnu',
      className: 'bg-gray-50 text-gray-700 border-gray-200'
    }
  };

  const config = statusConfig[statut] || statusConfig.default;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${config.className}`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{config.text}</span>
    </div>
  );
};

const ReservationCard = ({ reservation, onCancel }: { reservation: Reservation; onCancel: (id: number) => void }) => {
  const canCancel = reservation.statut !== 'ANNULEE';
  const dateDebut = new Date(reservation.dateDebut);
  const dateFin = new Date(reservation.dateFin);

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors relative">
      {/* Right side column with status and cancel button */}
      <div className="absolute top-6 right-6 flex flex-col items-center gap-4">
        <StatusBadge statut={reservation.statut} />
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
        <h3 className="text-lg font-medium mb-3">{reservation.salle.nom}</h3>
        <div className="space-y-2 text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>
              {format(dateDebut, "d MMMM yyyy, HH'h'mm", { locale: fr })} - {format(dateFin, "HH'h'mm", { locale: fr })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{reservation.salle.localisationom}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserReservations();
      console.log('API Response:', response);
      
      // Handle both array and single object responses
      const reservationsData = Array.isArray(response.data) 
        ? response.data 
        : response.data ? [response.data] 
        : [];
      
      console.log('Processed reservations:', reservationsData);
      setReservations(reservationsData);
    } catch (error) {
      console.error('Erreur détaillée lors du chargement des réservations:', error);
      setError('Impossible de charger vos réservations. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await cancelReservation(id);
      loadReservations();
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la réservation:', error);
      alert('Impossible d\'annuler la réservation. Veuillez réessayer plus tard.');
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

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p>{error}</p>
            <button
              onClick={loadReservations}
              className="mt-2 text-sm font-medium text-red-700 hover:text-red-800"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  const groupedReservations = {
    upcoming: reservations.filter(r => new Date(r.dateDebut) > new Date() && r.statut !== 'ANNULEE'),
    past: reservations.filter(r => new Date(r.dateDebut) <= new Date() || r.statut === 'ANNULEE')
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Mes Réservations</h1>
          <p className="mt-1 text-gray-600">Consultez et gérez vos réservations de salles</p>
        </header>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex bg-gray-50 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-2.5 px-6 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              À venir
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 py-2.5 px-6 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'past'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Passées
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg">
          {activeTab === 'upcoming' && (!groupedReservations.upcoming || groupedReservations.upcoming.length === 0) ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="bg-gray-50 rounded-full p-3 mb-4">
                <Calendar className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune réservation à venir</h3>
              <p className="text-gray-500 mb-6">Vous n'avez pas encore de réservations planifiées.</p>
              <Link
                to="/salles"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Réserver une salle
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {(activeTab === 'upcoming' ? groupedReservations.upcoming : groupedReservations.past).map(reservation => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onCancel={handleCancel}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reservations; 