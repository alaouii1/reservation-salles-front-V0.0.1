import React from 'react';

interface NavItemProps {
  icon: string;
  label: string;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive }) => (
  <a
    href="#"
    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 ${
      isActive ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
    }`}
  >
    <span className="material-icons-outlined">{icon}</span>
    <span className={isActive ? 'font-medium' : ''}>{label}</span>
  </a>
);

const Sidebar: React.FC = () => (
  <div className="w-64 min-h-screen bg-white p-6 flex flex-col">
    <div className="mb-8">
      <h1 className="text-indigo-600 text-xl font-medium mb-8">
        Réservation de Salles
      </h1>
      <nav className="space-y-1">
        <NavItem icon="home" label="Accueil" isActive={true} />
        <NavItem icon="meeting_room" label="Salles" />
        <NavItem icon="calendar_today" label="Mes Réservations" />
      </nav>
    </div>
    
    <div className="mt-auto">
      <NavItem icon="logout" label="Déconnexion" />
      <div className="mt-4 text-sm text-gray-500">
        © 2025 Université
      </div>
    </div>
  </div>
);

interface ReservationCardProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
}

const ReservationCard: React.FC<ReservationCardProps> = ({ title, icon, children, className = '' }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-sm ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      <span className="material-icons-outlined text-indigo-600">{icon}</span>
      <h2 className="text-lg font-medium text-indigo-600">{title}</h2>
    </div>
    {children}
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 p-8">
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
            <ReservationCard title="Prochaine réservation" icon="calendar_today">
              <div>
                <h3 className="text-xl font-medium mb-2">Amphithéâtre A</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="material-icons-outlined text-sm">schedule</span>
                    <span>18 avril 2025, 14:00 - 16:00</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-icons-outlined text-sm">place</span>
                    <span>Central</span>
                  </div>
                </div>
              </div>
            </ReservationCard>

            <ReservationCard title="Dernière action" icon="history">
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
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
              Réserver une salle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 