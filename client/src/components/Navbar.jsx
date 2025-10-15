import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const handleMenuClose = () => {
    setOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="text-xl sm:text-2xl font-bold text-sky-700">BrokerX</div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-4 lg:gap-6 text-sm text-slate-700">
            <a href="#markets" className="hover:underline whitespace-nowrap">Markets</a>
            <a href="#platform" className="hover:underline whitespace-nowrap">Platform</a>
            <a href="#articles" className="hover:underline whitespace-nowrap">News</a>
          </nav>

          {/* Desktop Buttons & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Login Button */}
            <Link
              to="/login"
              className="hidden md:inline px-3 lg:px-4 py-1 rounded-full border border-sky-700 text-sky-700 text-sm hover:bg-sky-50 transition whitespace-nowrap"
            >
              Log in
            </Link>

            {/* Sign Up Button - Visible on all screens */}
            <Link
              to="/signup"
              className="bg-sky-600 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm hover:bg-sky-700 transition whitespace-nowrap"
            >
              <span className="hidden sm:inline">Open an Account</span>
              <span className="sm:hidden">Sign Up</span>
            </Link>

            {/* Hamburger Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-700 hover:text-sky-700 transition" 
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden pb-4 animate-fadeIn">
            <nav className="flex flex-col gap-1 text-sm border-t border-slate-200 pt-2">
              <a 
                href="#markets" 
                className="block p-3 rounded hover:bg-slate-100 text-slate-700 transition" 
                onClick={handleMenuClose}
              >
                Markets
              </a>
              <a 
                href="#platform" 
                className="block p-3 rounded hover:bg-slate-100 text-slate-700 transition" 
                onClick={handleMenuClose}
              >
                Platform
              </a>
              <a 
                href="#articles" 
                className="block p-3 rounded hover:bg-slate-100 text-slate-700 transition" 
                onClick={handleMenuClose}
              >
                News
              </a>
              {/* Mobile Login Link */}
              <Link
                to="/login"
                className="block p-3 rounded hover:bg-slate-100 text-slate-700 transition"
                onClick={handleMenuClose}
              >
                Log in
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}