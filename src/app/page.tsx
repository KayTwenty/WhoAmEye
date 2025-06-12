"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/profile");
      } else {
        setLoading(false);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/profile");
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-100 to-gray-300"><span className="text-black text-xl font-bold animate-pulse">Loading...</span></div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-white via-gray-100 to-gray-300 text-black font-serif">
      <nav className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-300 bg-white/90 backdrop-blur-md">
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
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto mt-3 sm:mt-0 max-w-xs sm:max-w-none">
          <a href="/profile" className="px-5 py-2 rounded-full bg-black text-white font-bold shadow hover:scale-105 hover:shadow-xl transition-all duration-200 text-base sm:text-lg border border-gray-800 w-full sm:w-auto text-center">Sign In</a>
        </div>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-3 sm:px-4 w-full">
        <h1 className="text-3xl xs:text-4xl sm:text-6xl font-extrabold mb-4 sm:mb-6 text-black drop-shadow-lg font-serif leading-tight">
          Your Identity, <span className="bg-gradient-to-r from-black via-gray-700 to-black bg-clip-text text-transparent">Your Vibe.</span>
        </h1>
        <p className="max-w-2xl text-base xs:text-lg sm:text-2xl text-gray-700 mb-6 sm:mb-8 font-medium leading-relaxed">
          Create a stunning, customizable profile card that stands out. Share your story, links, and gallery with the world. <span className="text-black font-bold underline decoration-gray-400">WhoAmEye</span> lets you express yourself with modern design, creative freedom, and a unique public URL.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8 sm:mb-12 items-center justify-center w-full">
          <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-xs shadow-xl border border-gray-300 flex flex-col items-center hover:scale-[1.03] hover:shadow-2xl transition-all duration-200">
            <span className="text-3xl mb-2">🎨</span>
            <h2 className="font-bold text-lg sm:text-xl mb-1 text-black">Fully Customizable</h2>
            <p className="text-gray-700 text-sm sm:text-base">Choose your theme, font, banner, and layout. Make your card truly yours.</p>
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-xs shadow-xl border border-gray-300 flex flex-col items-center hover:scale-[1.03] hover:shadow-2xl transition-all duration-200">
            <span className="text-3xl mb-2">🔗</span>
            <h2 className="font-bold text-lg sm:text-xl mb-1 text-black">Share Everything</h2>
            <p className="text-gray-700 text-sm sm:text-base">Add custom links, a bio, pronouns, and a gallery. All in one beautiful card.</p>
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-xs shadow-xl border border-gray-300 flex flex-col items-center hover:scale-[1.03] hover:shadow-2xl transition-all duration-200">
            <span className="text-3xl mb-2">🚀</span>
            <h2 className="font-bold text-lg sm:text-xl mb-1 text-black">Instant & Secure</h2>
            <p className="text-gray-700 text-sm sm:text-base">Sign up in seconds. Your data is safe, and your username is uniquely yours.</p>
          </div>
        </div>
        <a href="/profile" className="inline-block px-8 sm:px-10 py-3 sm:py-4 rounded-full bg-gradient-to-r from-black via-gray-800 to-black text-white font-extrabold text-xl sm:text-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 mt-2 border border-gray-800 w-full max-w-xs sm:max-w-md">Get Started Free</a>
        <p className="mt-6 sm:mt-8 text-gray-500 text-xs sm:text-sm">No app download. No ads. Just your vibe, your way.</p>
      </main>
      <footer className="w-full flex flex-col items-center justify-center py-5 sm:py-6 text-gray-500 text-xs gap-2 border-t border-gray-300 bg-white/80">
        <span>© {new Date().getFullYear()} WhoAmEye. All rights reserved.</span>
        <span>Made with <span className="text-black">♥</span> for creative souls.</span>
        <span>
          <a href="https://github.com/KayTwenty/WhoAmEye" target="_blank" rel="noopener noreferrer" className="underline hover:text-black transition">View on GitHub</a>
        </span>
      </footer>
      <style jsx global>{`
        @media (max-width: 400px) {
          h1 { font-size: 2.1rem !important; }
        }
        .xs\\:text-4xl { font-size: 2.25rem; }
        .xs\\:text-lg { font-size: 1.125rem; }
      `}</style>
    </div>
  );
}
