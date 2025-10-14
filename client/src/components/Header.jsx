import React from 'react';
import NotificationBell from './NotificationBell';

const Header = () => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Search or other header content can go here */}
        </div>
        
        <div className="flex items-center gap-4">
          <NotificationBell />
        </div>
      </div>
    </header>
  );
};

export default Header;
