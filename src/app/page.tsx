"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

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
      <nav className="w-full flex items-center justify-between px-6 py-6 border-b border-gray-300 bg-white/90 backdrop-blur-md">
        <a href="/" className="flex items-center group focus:outline-none" tabIndex={0} aria-label="Go to homepage">
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
        </a>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/KayTwenty/WhoAmEye"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full border border-gray-800 bg-white text-black font-bold shadow hover:bg-gray-100 hover:scale-105 transition-all duration-200 text-lg flex items-center gap-2"
            aria-label="View on GitHub"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.38-2.03 1.02-2.75-.1-.26-.44-1.3.1-2.7 0 0 .83-.27 2.75 1.02A9.36 9.36 0 0 1 12 6.84c.84.004 1.68.11 2.47.32 1.92-1.29 2.75-1.02 2.75-1.02.54 1.4.2 2.44.1 2.7.64.72 1.02 1.63 1.02 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"/></svg>
            GitHub
          </a>
          <a href="/profile" className="px-6 py-2 rounded-full bg-black text-white font-bold shadow hover:scale-105 hover:shadow-xl transition-all duration-200 text-lg border border-gray-800">Sign In</a>
        </div>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 text-black drop-shadow-lg font-serif">Your Identity, Your Vibe.</h1>
        <p className="max-w-2xl text-lg sm:text-2xl text-gray-700 mb-8 font-medium">Create a stunning, customizable profile card that stands out. Share your story, links, and gallery with the world. <span className="text-black font-bold underline decoration-gray-400">WhoAmEye</span> lets you express yourself with modern design, creative freedom, and a unique public URL.</p>
        <div className="flex flex-col sm:flex-row gap-6 mb-12 items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-72 shadow-xl border border-gray-300 flex flex-col items-center">
            <span className="text-3xl mb-2">🎨</span>
            <h2 className="font-bold text-xl mb-1 text-black">Fully Customizable</h2>
            <p className="text-gray-700 text-sm">Choose your theme, font, banner, and layout. Make your card truly yours.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 w-72 shadow-xl border border-gray-300 flex flex-col items-center">
            <span className="text-3xl mb-2">🔗</span>
            <h2 className="font-bold text-xl mb-1 text-black">Share Everything</h2>
            <p className="text-gray-700 text-sm">Add custom links, a bio, pronouns, and a gallery. All in one beautiful card.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 w-72 shadow-xl border border-gray-300 flex flex-col items-center">
            <span className="text-3xl mb-2">🚀</span>
            <h2 className="font-bold text-xl mb-1 text-black">Instant & Secure</h2>
            <p className="text-gray-700 text-sm">Sign up in seconds. Your data is safe, and your username is uniquely yours.</p>
          </div>
        </div>
        <a href="/profile" className="inline-block px-10 py-4 rounded-full bg-black text-white font-extrabold text-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 mt-4 border border-gray-800">Get Started Free</a>
        <p className="mt-8 text-gray-500 text-sm">No app download. No ads. Just your vibe, your way.</p>
      </main>
      <footer className="w-full flex flex-col items-center justify-center py-6 text-gray-500 text-xs gap-2 border-t border-gray-300 bg-white/80">
        <span>© {new Date().getFullYear()} WhoAmEye. All rights reserved.</span>
        <span>Made with <span className="text-black">♥</span> for creative souls.</span>
      </footer>
    </div>
  );
}
