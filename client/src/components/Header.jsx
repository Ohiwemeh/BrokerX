import React from 'react';
import { Link, useLocation } from 'react-router';
import { FaUserShield } from 'react-icons/fa';
import NotificationBell from './NotificationBell';
import { authService } from '../api/services';

const Header = () => {
  const user = authService.getCurrentUser();
  const location = useLocation();
  const isAdmin = user && user.role === 'admin';
  const isOnAdminPage = location.pathname === '/admin';

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Search or other header content can go here */}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Admin Panel Button - Only visible to admins */}
          {isAdmin && !isOnAdminPage && (
            <Link
              to="/admin"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-semibold"
            >
              <FaUserShield className="text-lg" />
              <span className="hidden sm:inline">Admin Panel</span>
            </Link>
          )}
          
          {/* Back to Dashboard Button - Only on admin page */}
          {isOnAdminPage && (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-semibold"
            >
              <span>← Back to Dashboard</span>
            </Link>
          )}
          
          <NotificationBell />
        </div>
      </div>
    </header>
  );
};

export default Header;
