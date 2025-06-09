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
        <span className="flex items-center font-extrabold text-2xl tracking-tight drop-shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="38" height="38" className="mr-2 drop-shadow-xl" aria-hidden="true">
            <ellipse cx="20" cy="20" rx="16" ry="10" fill="#fff" fillOpacity="0.10" stroke="#222" strokeWidth="2.5" />
            <ellipse cx="20" cy="20" rx="13" ry="8" fill="#222" fillOpacity="0.08" />
            <circle cx="20" cy="20" r="6.5" fill="#222" />
            <circle cx="22.5" cy="18.5" r="2.2" fill="#fff" fillOpacity="0.9" />
          </svg>
          WhoAmEye
        </span>
        <a href="/profile" className="px-6 py-2 rounded-full bg-black text-white font-bold shadow hover:scale-105 hover:shadow-xl transition-all duration-200 text-lg border border-gray-800">Sign In</a>
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
