import React from 'react';
import { CalendarDays, Clock, MapPin, History } from 'lucide-react';
import ProchaineReservation from '../components/ProchaineReservation';


interface ReservationCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}



const ReservationCard: React.FC<ReservationCardProps> = ({ title, icon, children, className = '' }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-sm ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <h2 className="text-lg font-medium text-indigo-600">{title}</h2>
    </div>
    {children}
  </div>
);

const Home: React.FC = () => {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-medium">
            Bonjour, Dr. Dupont <span role="img" aria-label="wave">👋</span>
          </h1>
          <button className="text-gray-600 hover:text-gray-800">
            Prêt à réserver une salle ?
          </button>
        </header>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ReservationCard title="Prochaine réservation" 
            icon={<CalendarDays className="w-5 h-5 text-indigo-600" />}>

        <ProchaineReservation />
        </ReservationCard>
       



          <ReservationCard 
            title="Dernière action" 
            icon={<History className="w-5 h-5 text-indigo-600" />}
          >
            <div>
              <h3 className="text-lg font-medium mb-2">Réservation</h3>
              <div className="space-y-2 text-gray-600">
                <p>Salle B204</p>
                <p>15 avril 2025</p>
              </div>
            </div>
          </ReservationCard>
        </div>

        {/* Reserve Button */}
        <div className="flex justify-center">
          <Link to="../components/ReservationMpdal" className="w-full max-w-xs">
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Réserver une salle
          </button>
          </Link>
        
        </div>
      </div>
    </div>
  );
};

export default Home; 