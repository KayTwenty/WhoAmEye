import { supabase } from '@/lib/supabaseClient';
import React from 'react';
import GalleryModal from '@/components/GalleryModal';

export function generateMetadata({ params }: { params: { username: string } }) {
  return {
    title: 'WhoAmEye',
    description: 'A modern, customizable bio card.'
  };
}

export default async function PublicProfileByUsername({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username.toLowerCase())
    .single();

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
          <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-gray-500">This card does not exist or is private.</p>
        </div>
      </main>
    );
  }

  const gradients = [
    { name: 'Blue/Purple/Pink', value: 'from-blue-900 via-purple-900 to-pink-700', banner: 'from-blue-400 via-fuchsia-500 to-pink-400' },
    { name: 'Green/Teal/Blue', value: 'from-green-700 via-teal-600 to-blue-700', banner: 'from-green-300 via-teal-400 to-blue-400' },
    { name: 'Orange/Red/Yellow', value: 'from-yellow-500 via-orange-500 to-red-500', banner: 'from-yellow-200 via-orange-300 to-red-300' },
    { name: 'Gray/Slate', value: 'from-gray-800 via-slate-700 to-gray-900', banner: 'from-gray-400 via-slate-400 to-gray-500' },
  ];
  const fonts = [
    { name: 'Sans', class: 'font-sans' },
    { name: 'Serif', class: 'font-serif' },
    { name: 'Mono', class: 'font-mono' },
  ];
  const selectedGradient = gradients.find(g => g.name === profile.banner) || gradients[0];
  const fontClass = fonts.find(f => f.class === profile.font) ? profile.font : fonts[0].class;

  // Strongly type links as { label: string; url: string }[]
  const links: { label: string; url: string }[] = Array.isArray(profile.links) ? profile.links : [];

  return (
    <main className={`flex min-h-screen flex-col items-center justify-center bg-gradient-to-br ${selectedGradient.value} p-4 ${fontClass}`} style={{ minHeight: '100vh', paddingTop: '3rem' }}>
      <section className="relative w-full max-w-lg rounded-3xl bg-white/95 shadow-2xl p-8 flex flex-col items-center border border-gray-100">
        {/* Banner */}
        <div className={`w-full h-36 rounded-2xl mb-[-56px] shadow-lg relative flex items-center justify-center overflow-hidden`}>
          {profile.banner_image ? (
            <img src={profile.banner_image} alt="Banner" className="absolute w-full h-full object-cover rounded-2xl" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-r ${selectedGradient.banner} rounded-2xl`} />
          )}
        </div>
        {/* Avatar */}
        <div className="relative z-10 -mt-20 mb-3 flex flex-col items-center">
          <img
            src={profile.avatar}
            alt="Avatar"
            className="w-36 h-36 rounded-full border-4 border-white shadow-xl object-cover bg-gray-100"
          />
        </div>
        {/* Display Name, Pronouns & Tagline */}
        <h1 className="text-3xl font-extrabold text-black tracking-tight">{profile.display_name || profile.username}</h1>
        {profile.pronouns && (
          <div className="text-xs text-gray-600 font-semibold mb-1">{profile.pronouns}</div>
        )}
        <p className="text-base text-gray-700 mb-3">{profile.tagline}</p>
        {/* About/Bio */}
        <p className="text-center text-gray-800 mb-5 whitespace-pre-line">{profile.bio}</p>
        {/* Custom Links Section */}
        <div className="w-full mb-4">
          <label className="text-xs text-gray-500 mb-1 block">Custom Links</label>
          <div className="flex flex-col gap-2">
            {links.filter((l) => l.label && l.url).map((link, i) => (
              <a
                key={i}
                href={link.url}
                className="flex items-center gap-2 px-3 py-2 rounded bg-gray-100 hover:bg-blue-50 text-black font-semibold text-xs transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="truncate">{link.label}</span>
                <span className="truncate text-gray-400">{link.url.replace(/^https?:\/\//, '')}</span>
              </a>
            ))}
          </div>
        </div>
        {/* Gallery Section */}
        <GalleryModal gallery={profile.gallery || []} />
        <span className="text-xs text-gray-400 mt-3">WhoAmEye – powered by you</span>
      </section>
    </main>
  );
}
