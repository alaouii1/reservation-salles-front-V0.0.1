import { useEffect, useState } from 'react';
import { Clock, MapPin, AlertCircle, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { getUserReservations, cancelReservation } from '../services/reservationService';
import { Reservation, ReservationStatus } from '../types/Reservation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';

const StatusBadge = ({ statut }: { statut: ReservationStatus }) => {
  const statusConfig: Record<ReservationStatus | 'default', {
    icon: typeof AlertCircle;
    text: string;
    className: string;
  }> = {
    EN_ATTENTE: {
      icon: AlertCircle,
      text: 'En attente',
      className: 'bg-yellow-50 text-yellow-600 border border-yellow-100'
    },
    CONFIRMEE: {
      icon: CheckCircle,
      text: 'Confirmée',
      className: 'bg-green-50 text-green-600 border border-green-100'
    },
    ANNULEE: {
      icon: XCircle,
      text: 'Annulée',
      className: 'bg-gray-50 text-gray-500 border border-gray-100'
    },
    default: {
      icon: AlertCircle,
      text: 'Status inconnu',
      className: 'bg-gray-50 text-gray-500 border border-gray-100'
    }
  };

  const config = statusConfig[statut] || statusConfig.default;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
      <Icon className="w-4 h-4" />
      {config.text}
    </div>
  );
};

const ReservationCard = ({ reservation, onCancel }: { reservation: Reservation; onCancel: (id: number) => void }) => {
  const canCancel = reservation.statut !== 'ANNULEE';
  const dateDebut = new Date(reservation.dateDebut);
  const dateFin = new Date(reservation.dateFin);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start gap-4">
        {/* Main content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {reservation.salle.nom}
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-50">
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-gray-700">
                {format(dateDebut, "d MMMM yyyy, HH'h'mm", { locale: fr })} - {format(dateFin, "HH'h'mm", { locale: fr })}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-50">
                <MapPin className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-gray-700">{reservation.salle.localisation.nom}</span>
            </div>
          </div>
        </div>

        {/* Right side column with status and cancel button */}
        <div className="flex flex-col items-end gap-4">
          <StatusBadge statut={reservation.statut} />
          
          {canCancel && (
            <button
              onClick={() => onCancel(reservation.id)}
              className="text-sm font-medium text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              Annuler
            </button>
          )}
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
      
      const reservationsData = Array.isArray(response.data) 
        ? response.data 
        : response.data ? [response.data] 
        : [];
      
      setReservations(reservationsData);
    } catch (error) {
      console.error('Error loading reservations:', error);
      setError('Impossible de charger vos réservations. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      try {
        await cancelReservation(id);
        loadReservations();
      } catch (error) {
        console.error('Error cancelling reservation:', error);
        alert('Impossible d\'annuler la réservation. Veuillez réessayer plus tard.');
      }
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          <p>{error}</p>
          <button
            onClick={loadReservations}
            className="mt-2 text-sm font-medium text-red-700 hover:text-red-800"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const groupedReservations = {
    upcoming: reservations.filter(r => new Date(r.dateDebut) > new Date() && r.statut !== 'ANNULEE'),
    past: reservations.filter(r => new Date(r.dateDebut) <= new Date() || r.statut === 'ANNULEE')
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes Réservations</h1>
        <p className="text-gray-600">Consultez et gérez vos réservations de salles</p>
      </header>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-2.5 px-6 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'upcoming'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            À venir
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-2.5 px-6 text-sm font-medium rounded-lg transition-all ${
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
      <div className="space-y-4">
        {activeTab === 'upcoming' && groupedReservations.upcoming.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
            <div className="bg-indigo-50 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réservation à venir</h3>
            <p className="text-gray-500 mb-6">Vous n'avez pas encore de réservations planifiées.</p>
            <Link
              to="/salles"
              className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Réserver une salle
            </Link>
          </div>
        ) : (
          (activeTab === 'upcoming' ? groupedReservations.upcoming : groupedReservations.past).map(reservation => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onCancel={handleCancel}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Reservations;