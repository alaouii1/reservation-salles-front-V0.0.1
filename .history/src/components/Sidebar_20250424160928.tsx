import { Home, Building2, CalendarDays, LogOut } from 'lucide-react';
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

interface NavItemProps {
  icon: React.ReactElement<{ className?: string }>;
  label: string;
  to: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
          isActive 
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`
      }
    >
      {({ isActive }) => {
        const iconElement = React.cloneElement(icon, {
          className: `w-5 h-5 ${isActive ? 'text-white' : 'text-indigo-600'}`
        });
        
        return (
          <>
            <span className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
              {iconElement}
            </span>
            <span className="font-medium">{label}</span>
          </>
        );
      }}
    </NavLink>
  );
};

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="w-72 min-h-screen bg-gradient-to-b from-gray-50 to-white p-6 flex flex-col border-r border-gray-200">
      <div className="mb-10">
        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-2xl font-bold mb-2">
          Réservation de Salles
        </h1>
        <div className="h-1 w-20 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
      </div>
      
      <nav className="space-y-2 flex-1">
        <NavItem 
          icon={<Home className="" />} 
          label="Accueil" 
          to="/" 
        />
        <NavItem 
          icon={<Building2 className="" />} 
          label="Salles" 
          to="/salles" 
        />
        <NavItem 
          icon={<CalendarDays className="" />} 
          label="Mes Réservations" 
          to="/reservations" 
        />
      </nav>
      
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 w-full transition-colors duration-300 group"
        >
          <span className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors duration-300">
            <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors duration-300" />
          </span>
          <span className="font-medium">Déconnexion</span>
        </button>
        
        <div className="mt-6 text-xs text-gray-400 tracking-wide">
       
          <div>© 2025 Faculté des sciences</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;