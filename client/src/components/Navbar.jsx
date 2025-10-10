import { FaBars } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-sky-700">BrokerX</div>
            <nav className="hidden md:flex gap-6 text-sm text-slate-700">
              <a href="#markets" className="hover:underline">Markets</a>
              <a href="#platform" className="hover:underline">Platform</a>
              <a href="#articles" className="hover:underline">News</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
    to="/login"
    className="hidden md:inline px-4 py-1 rounded-full border border-sky-700 text-sky-700 text-sm hover:bg-sky-50 transition"
  >
    Log in
  </Link>
  <Link
    to="/signup"
    className="bg-sky-600 text-white px-4 py-1 rounded-full text-sm hover:bg-sky-700 transition"
  >
    Open an Account
  </Link>
            <button className="md:hidden p-2" onClick={()=>setOpen(!open)}><FaBars /></button>
          </div>
        </div>

        {open && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col gap-2 text-sm">
              <a href="#markets" className="block p-2">Markets</a>
              <a href="#platform" className="block p-2">Platform</a>
              <a href="#articles" className="block p-2">News</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
