import { Home, Building2, CalendarDays, LogOut } from 'lucide-react';
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
const Sidebar: React.FC = () => {
    const navigate = useNavigate();
  
    const handleLogout = () => {
      // Add logout logic here
      navigate('/login');
    };
  
    return (
      <div className="w-64 min-h-screen bg-white p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-indigo-600 text-xl font-medium mb-8">
            Réservation de Salles
          </h1>
          <nav className="space-y-1">
            <NavItem 
              icon={<Home className="w-5 h-5" />} 
              label="Accueil" 
              to="/" 
            />
            <NavItem 
              icon={<Building2 className="w-5 h-5" />} 
              label="Salles" 
              to="/salles" 
            />
            <NavItem 
              icon={<CalendarDays className="w-5 h-5" />} 
              label="Mes Réservations" 
              to="/reservations" 
            />
          </nav>
        </div>
        
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
          <div className="mt-4 text-sm text-gray-500">
            © 2025 Université
          </div>
        </div>
      </div>
    );
  };

  export default Sidebar;