import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router'; // Import Link and useLocation
import { 
  FaSignOutAlt, 
  FaCog, 
  FaExchangeAlt, 
  FaWallet, 
  FaEye
} from 'react-icons/fa';
import { RiStockLine } from 'react-icons/ri';
import { VscGraph } from "react-icons/vsc";

// --- Best Practice: Define links as an array of objects ---
const navLinks = [
  { href: '/dashboard', icon: FaEye, label: 'Overview' },
  { href: '/depositpage', icon: RiStockLine, label: 'Deposit' }, // Note: paths are usually lowercase
  { href: '/wallet', icon: FaWallet, label: 'Wallet & Accounts' },
  { href: '/transactions', icon: FaExchangeAlt, label: 'Transactions' },
  { href: '/statistics', icon: VscGraph, label: 'Statistics' },
  { href: '/settings', icon: FaCog, label: 'Settings' },
];

const Sidebar = () => {
  // Get the current location object
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="w-20 md:w-64 bg-slate-900 p-4 flex flex-col justify-between border-r border-slate-800">
      <div>
        <div className="text-2xl font-bold text-blue-500 pb-12 px-2">BrokerX</div>
        <nav className="space-y-2">
          {navLinks.map((link) => {
            // Check if the current pathname matches the link's href
            const isActive = location.pathname === link.href;
            const Icon = link.icon; // Component names must be capitalized

            return (
              <Link
                key={link.label}
                to={link.href}
                className={`flex items-center gap-4 p-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-slate-100 bg-blue-600/30 font-semibold' // Active styles
                    : 'text-slate-400 hover:bg-slate-700 hover:text-white' // Inactive styles
                }`}
              >
                <Icon className="text-xl flex-shrink-0" />
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <button 
        onClick={handleLogout}
        className="flex items-center gap-4 p-2 rounded-lg text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors mt-10"
      >
        <FaSignOutAlt className="text-xl flex-shrink-0" />
        <span className="hidden md:inline">Sign Out</span>
      </button>
    </aside>
  );
};

export default Sidebar;