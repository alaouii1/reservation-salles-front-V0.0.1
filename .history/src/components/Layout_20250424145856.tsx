import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import Sidebar from './Sidebar';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}




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