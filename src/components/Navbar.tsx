import React from "react";
import { FaUserCircle } from "react-icons/fa";

interface NavbarProps {
  displayName: string;
  email: string;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  handleLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ displayName, email, menuOpen, setMenuOpen, handleLogout }) => (
  <nav className="w-full flex items-center justify-between px-6 py-3 bg-gradient-to-r from-black via-gray-900 to-gray-800 border-b border-gray-900 shadow-lg fixed top-0 left-0 z-30 h-20">
    <div className="flex items-center gap-3">
      {/* Logo with eye icon and brand name, more modern and spicy */}
      <span className="flex items-center font-extrabold text-2xl bg-gradient-to-r from-lime-400 via-green-400 to-emerald-500 bg-clip-text text-transparent tracking-tight drop-shadow-lg animate-gradient-x">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 40 40"
          width="38"
          height="38"
          className="mr-2 drop-shadow-xl"
          aria-hidden="true"
        >
          <ellipse cx="20" cy="20" rx="16" ry="10" fill="#fff" fillOpacity="0.10" stroke="#22c55e" strokeWidth="2.5" />
          <ellipse cx="20" cy="20" rx="13" ry="8" fill="#a3e635" fillOpacity="0.18" />
          <circle cx="20" cy="20" r="6.5" fill="#22c55e" />
          <circle cx="22.5" cy="18.5" r="2.2" fill="#fff" fillOpacity="0.9" />
        </svg>
        WhoAmEye
      </span>
    </div>
    <div className="relative flex items-center gap-4">
      <button
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900 text-white font-semibold shadow-md hover:bg-gray-800 transition-all duration-200 focus:outline-none group border border-gray-700 text-sm"
        aria-haspopup="true"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
        onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
      >
        <FaUserCircle className="text-xl text-white drop-shadow" aria-hidden="true" />
        <span className="hidden sm:inline text-sm font-bold tracking-tight text-white">
          {displayName}
        </span>
        <svg className="w-4 h-4 text-gray-300 group-hover:text-white transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {menuOpen && (
        <div className="absolute right-0 top-14 min-w-[220px] bg-white border border-gray-200 rounded-2xl shadow-2xl py-3 z-40 animate-fade-in backdrop-blur-xl">
          <div className="px-5 py-2 text-xs text-gray-500 font-semibold bg-gray-50 rounded-t-2xl border-b border-gray-100 flex flex-col items-start">
            <span className="text-gray-700">Signed in as</span>
            <span className="font-bold text-gray-900 break-all text-sm">{email}</span>
          </div>
          <a
            href={`/u/${displayName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-left px-5 py-2 text-base text-gray-800 hover:bg-lime-50 font-semibold transition rounded-none border-b border-gray-100"
            role="menuitem"
          >
            <span className="inline-block mr-2 align-middle">👁️</span> View Profile
          </a>
          <a
            href="/profile"
            className="block w-full text-left px-5 py-2 text-base text-gray-800 hover:bg-lime-50 font-semibold transition rounded-none border-b border-gray-100"
            role="menuitem"
          >
            <span className="inline-block mr-2 align-middle">✏️</span> Edit Profile
          </a>
          <button
            onClick={handleLogout}
            className="w-full text-left px-5 py-2 text-base text-red-600 hover:bg-red-50 font-semibold transition rounded-b-2xl"
            role="menuitem"
          >
            <span className="inline-block mr-2 align-middle">🚪</span> Log Out
          </button>
        </div>
      )}
    </div>
  </nav>
);

export default Navbar;
