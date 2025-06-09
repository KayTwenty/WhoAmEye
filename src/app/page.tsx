"use client";

import Image from "next/image";
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
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800"><span className="text-white text-xl font-bold animate-pulse">Loading...</span></div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white font-geist-sans">
      <nav className="w-full flex items-center justify-between px-6 py-6">
        <span className="flex items-center font-extrabold text-2xl bg-gradient-to-r from-lime-400 via-green-400 to-emerald-500 bg-clip-text text-transparent tracking-tight drop-shadow-lg animate-gradient-x">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="38" height="38" className="mr-2 drop-shadow-xl" aria-hidden="true">
            <ellipse cx="20" cy="20" rx="16" ry="10" fill="#fff" fillOpacity="0.10" stroke="#22c55e" strokeWidth="2.5" />
            <ellipse cx="20" cy="20" rx="13" ry="8" fill="#a3e635" fillOpacity="0.18" />
            <circle cx="20" cy="20" r="6.5" fill="#22c55e" />
            <circle cx="22.5" cy="18.5" r="2.2" fill="#fff" fillOpacity="0.9" />
          </svg>
          WhoAmEye
        </span>
        <a href="/profile" className="px-6 py-2 rounded-full bg-gradient-to-r from-lime-400 via-green-400 to-emerald-500 text-black font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 text-lg">Sign In</a>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 bg-gradient-to-r from-lime-300 via-green-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">Your Identity, Your Vibe.</h1>
        <p className="max-w-2xl text-lg sm:text-2xl text-gray-200 mb-8 font-medium">Create a stunning, customizable profile card that stands out. Share your story, links, and gallery with the world. <span className="text-lime-300 font-bold">WhoAmEye</span> lets you express yourself with modern design, creative freedom, and a unique public URL.</p>
        <div className="flex flex-col sm:flex-row gap-6 mb-12 items-center justify-center">
          <div className="bg-white/10 rounded-2xl p-6 w-72 shadow-xl border border-lime-400/30 flex flex-col items-center">
            <span className="text-3xl mb-2">🎨</span>
            <h2 className="font-bold text-xl mb-1">Fully Customizable</h2>
            <p className="text-gray-200 text-sm">Choose your theme, font, banner, and layout. Make your card truly yours.</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-6 w-72 shadow-xl border border-lime-400/30 flex flex-col items-center">
            <span className="text-3xl mb-2">🔗</span>
            <h2 className="font-bold text-xl mb-1">Share Everything</h2>
            <p className="text-gray-200 text-sm">Add custom links, a bio, pronouns, and a gallery. All in one beautiful card.</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-6 w-72 shadow-xl border border-lime-400/30 flex flex-col items-center">
            <span className="text-3xl mb-2">🚀</span>
            <h2 className="font-bold text-xl mb-1">Instant & Secure</h2>
            <p className="text-gray-200 text-sm">Sign up in seconds. Your data is safe, and your username is uniquely yours.</p>
          </div>
        </div>
        <a href="/profile" className="inline-block px-10 py-4 rounded-full bg-gradient-to-r from-lime-400 via-green-400 to-emerald-500 text-black font-extrabold text-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 mt-4">Get Started Free</a>
        <p className="mt-8 text-gray-400 text-sm">No app download. No ads. Just your vibe, your way.</p>
      </main>
      <footer className="w-full flex flex-col items-center justify-center py-6 text-gray-400 text-xs gap-2">
        <span>© {new Date().getFullYear()} WhoAmEye. All rights reserved.</span>
        <span>Made with <span className="text-lime-400">♥</span> for creative souls.</span>
      </footer>
    </div>
  );
}
