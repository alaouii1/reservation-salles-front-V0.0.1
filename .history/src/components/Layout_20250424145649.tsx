import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, Building2, CalendarDays, LogOut } from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 ${
        isActive ? 'bg-indigo-50 text-indigo-600 font-medium' : 'hover:bg-gray-50'
      }`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);



const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout; 