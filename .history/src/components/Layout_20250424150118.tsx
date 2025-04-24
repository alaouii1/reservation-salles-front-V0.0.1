import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import Sidebar from './Sidebar';





const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <header className="bg-white shadow p-4 flex items-center justify-between">
          <h1 className="text-2xl font-medium text-indigo-600">Réservation de Salles</h1>
          <button className="text-gray-600 hover:text-gray-800">Déconnexion</button>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout; 