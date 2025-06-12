import React from "react";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import toast from 'react-hot-toast';

interface NavbarProps {
  displayName: string;
  email: string;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  handleLogout: () => void;
  shareUrl?: string;
}

const Navbar: React.FC<NavbarProps> = ({ displayName, email, menuOpen, setMenuOpen, handleLogout, shareUrl }) => {
  const [shareOpen, setShareOpen] = React.useState(false);
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches;

  // Delete profile function
  async function handleDeleteProfile() {
    if (!window.confirm('Are you sure you want to delete your profile? This cannot be undone.')) return;
    try {
      // Call API or Supabase to delete profile
      const res = await fetch('/api/delete-profile', { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        toast.success('Profile deleted.');
        setMenuOpen(false);
        setTimeout(() => { window.location.href = '/'; }, 1200);
      } else {
        toast.error('Failed to delete profile.');
      }
    } catch (e) {
      toast.error('Error deleting profile.');
    }
  }

  return (
    <nav className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3 bg-gradient-to-r from-white via-gray-100 to-gray-300 border-b border-gray-300 shadow-lg fixed top-0 left-0 z-30 h-auto sm:h-20 gap-2 sm:gap-0">
      <div className="flex items-center gap-3 select-none justify-center sm:justify-start w-full sm:w-auto">
        <Link href="/" className="flex items-center group focus:outline-none" tabIndex={0} aria-label="Go to homepage">
          <span className="relative flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 40 40"
              width="44"
              height="44"
              className="mr-2 drop-shadow-xl transition-transform group-hover:scale-110 group-hover:rotate-2"
              aria-hidden="true"
            >
              <ellipse cx="20" cy="20" rx="16" ry="10" fill="#fff" fillOpacity="0.16" stroke="#111" strokeWidth="2.5" />
              <ellipse cx="20" cy="20" rx="13" ry="8" fill="#222" fillOpacity="0.13" />
              <ellipse cx="20" cy="20" rx="8.5" ry="6.5" fill="#fff" fillOpacity="0.13" />
              <circle cx="20" cy="20" r="7.5" fill="#111" />
              <ellipse cx="20" cy="23.5" rx="4.5" ry="1.2" fill="#fff" fillOpacity="0.10" />
              <ellipse cx="20" cy="27" rx="5.5" ry="1.5" fill="#222" fillOpacity="0.13" />
              <ellipse cx="20" cy="13" rx="3.5" ry="1.2" fill="#fff" fillOpacity="0.18" />
              <circle cx="22.5" cy="18.5" r="2.5" fill="#fff" fillOpacity="0.97" />
              <ellipse cx="17.5" cy="18.5" rx="1.1" ry="0.7" fill="#fff" fillOpacity="0.5" />
            </svg>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-black/60 via-gray-400/30 to-black/60 rounded-full blur-sm opacity-60" />
          </span>
          <span className="ml-1 font-extrabold tracking-tight text-2xl sm:text-2xl text-black whitespace-nowrap flex items-end">
            WhoAmEye
            <span className="text-[0.85em] align-super font-mono text-gray-500 ml-1 tracking-tight pb-0.5">.bio</span>
          </span>
        </Link>
      </div>
      <div className="relative flex flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end">
        {shareUrl && (
          <div className="relative w-full sm:w-auto flex-1">
            <button
              className="flex items-center gap-2 w-full sm:w-auto px-3 py-1.5 rounded-lg bg-black text-white font-semibold shadow-md hover:bg-gray-900 transition-all duration-200 focus:outline-none border border-gray-700 text-sm justify-center"
              onClick={async () => {
                if (typeof window !== 'undefined' && window.navigator.share && window.matchMedia('(max-width: 640px)').matches) {
                  try {
                    await window.navigator.share({
                      title: 'Check out my WhoAmEye card!',
                      text: 'See my profile on WhoAmEye:',
                      url: shareUrl,
                    });
                  } catch (e) { /* user cancelled or error */ }
                  return;
                }
                setShareOpen((v) => !v);
              }}
              aria-haspopup="true"
              aria-expanded={shareOpen}
            >
              Share
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {shareOpen && (
              <div className="absolute right-0 mt-2 min-w-[260px] bg-white border border-gray-200 rounded-2xl shadow-2xl py-3 z-50 animate-fade-in backdrop-blur-xl">
                <div className="px-5 py-2 text-xs text-gray-500 font-semibold bg-gray-50 rounded-t-2xl border-b border-gray-100">Share your card</div>
                <div className="flex flex-col gap-2 px-5 py-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="flex-1 text-xs border rounded p-2 bg-gray-50 text-gray-700 select-all font-mono"
                      onFocus={e => e.target.select()}
                    />
                    <button
                      type="button"
                      className="px-3 py-1 rounded bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 border border-blue-600"
                      onClick={() => {
                        navigator.clipboard.writeText(shareUrl);
                        setShareOpen(false);
                        toast.success('Copied!');
                      }}
                    >
                      Copy
                    </button>
                  </div>
                  <button
                    type="button"
                    className="w-full mt-1 px-3 py-2 rounded bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 border border-gray-300 transition"
                    onClick={() => window.open(shareUrl, '_blank', 'noopener,noreferrer')}
                  >
                    Open in New Tab
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        <button
          className="flex items-center gap-2 w-full sm:w-auto px-3 py-1.5 rounded-lg bg-white text-black font-semibold shadow-md hover:bg-gray-200 transition-all duration-200 focus:outline-none group border border-gray-300 text-sm justify-center"
          aria-haspopup="true"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
        >
          <FaUserCircle className="text-xl text-gray-700 drop-shadow" aria-hidden="true" />
          <span className="hidden sm:inline text-sm font-bold tracking-tight text-black">
            {displayName}
          </span>
          <svg className="w-4 h-4 text-gray-400 group-hover:text-black transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
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
              className="block w-full text-left px-5 py-2 text-base text-gray-900 hover:bg-gray-100 font-semibold transition rounded-none border-b border-gray-100 focus:bg-gray-200 focus:outline-none"
              role="menuitem"
            >
              View Profile
            </a>
            <a
              href="/profile"
              className="block w-full text-left px-5 py-2 text-base text-gray-900 hover:bg-gray-100 font-semibold transition rounded-none border-b border-gray-100 focus:bg-gray-200 focus:outline-none"
              role="menuitem"
            >
              Edit Profile
            </a>
            <button
              onClick={handleLogout}
              className="w-full text-left px-5 py-2 text-base text-red-600 hover:bg-red-50 font-semibold transition rounded-none border-b border-gray-100 focus:bg-red-100 focus:outline-none"
              role="menuitem"
            >
              Log Out
            </button>
            <button
              onClick={handleDeleteProfile}
              className="w-full text-left px-5 py-2 text-base text-red-700 hover:bg-red-100 font-semibold transition rounded-b-2xl focus:bg-red-200 focus:outline-none"
              role="menuitem"
            >
              Delete Profile
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
