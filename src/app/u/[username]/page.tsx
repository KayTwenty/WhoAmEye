import { supabase } from '@/lib/supabaseClient';
import React from 'react';
import GalleryModal from '@/components/GalleryModal';
import { FaTwitter, FaInstagram, FaGithub, FaLinkedin, FaFacebook, FaYoutube, FaTiktok, FaTwitch } from 'react-icons/fa';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const hdrs = await headers();
  const host = hdrs.get('x-forwarded-host') || hdrs.get('host') || '';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  const ogImageUrl = `${baseUrl}/u/${encodeURIComponent(username)}/opengraph-image`;

  // Fetch profile for structured data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username.toLowerCase())
    .single();

  // JSON-LD structured data for Person
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile?.display_name || username,
    url: `${baseUrl}/u/${username}`,
    description: profile?.tagline || 'A modern, customizable bio card.',
    image: profile?.avatar || `${baseUrl}/logo.svg`,
  };

  return {
    title: `@${username} | WhoAmEye`,
    description: 'A modern, customizable bio card.',
    alternates: {
      canonical: `${baseUrl}/u/${username}`,
    },
    openGraph: {
      title: `@${username} | WhoAmEye`,
      description: 'A modern, customizable bio card.',
      url: `${baseUrl}/u/${username}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `@${username} on WhoAmEye`,
        },
      ],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `@${username} | WhoAmEye`,
      description: 'A modern, customizable bio card.',
      images: [ogImageUrl],
    },
    other: {
      'script:type': 'application/ld+json',
      'script:content': JSON.stringify(jsonLd),
    },
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
    { name: "Pink/Red", value: "from-pink-500 via-red-500 to-yellow-500", banner: "from-pink-200 via-red-200 to-yellow-200" },
    { name: "Aqua/Blue", value: "from-cyan-400 via-blue-500 to-indigo-500", banner: "from-cyan-200 via-blue-200 to-indigo-200" },
    { name: "Lime/Green", value: "from-lime-400 via-green-500 to-emerald-500", banner: "from-lime-200 via-green-200 to-emerald-200" },
    { name: "Indigo/Violet", value: "from-indigo-500 via-violet-500 to-fuchsia-500", banner: "from-indigo-200 via-violet-200 to-fuchsia-200" },
    { name: "Gold", value: "from-yellow-400 via-yellow-600 to-yellow-800", banner: "from-yellow-200 via-yellow-400 to-yellow-600" },
    { name: "Black/White", value: "from-black via-gray-700 to-white", banner: "from-gray-200 via-gray-400 to-white" },
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

  // Social media platforms and icons
  const socialPlatforms = [
    { name: 'Twitter', key: 'twitter', icon: <FaTwitter className="text-blue-400" /> },
    { name: 'Instagram', key: 'instagram', icon: <FaInstagram className="text-pink-500" /> },
    { name: 'GitHub', key: 'github', icon: <FaGithub className="text-gray-800" /> },
    { name: 'LinkedIn', key: 'linkedin', icon: <FaLinkedin className="text-blue-700" /> },
    { name: 'Facebook', key: 'facebook', icon: <FaFacebook className="text-blue-600" /> },
    { name: 'YouTube', key: 'youtube', icon: <FaYoutube className="text-red-500" /> },
    { name: 'TikTok', key: 'tiktok', icon: <FaTiktok className="text-black" /> },
    { name: 'Twitch', key: 'twitch', icon: <FaTwitch className="text-purple-600" /> },
  ];
  // Socials: expects profile.socials to be an object { twitter: url, instagram: url, ... }
  const socials = typeof profile.socials === 'object' && profile.socials !== null ? profile.socials : {};

  return (
    <>
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
          {/* Social Media Section */}
          {Object.keys(socials).length > 0 && (
            <div className="w-full mb-4">
              <label className="text-xs text-gray-500 mb-1 block">Social Media</label>
              <div className="flex flex-wrap gap-2">
                {socialPlatforms.map(platform =>
                  socials[platform.key] ? (
                    <a
                      key={platform.key}
                      href={socials[platform.key]}
                      className="flex items-center gap-2 px-3 py-2 rounded bg-black/90 hover:bg-black text-neon-green font-semibold text-xs transition border border-neon-green shadow-md hover:scale-105 focus:ring-2 focus:ring-neon-green outline-none"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="w-5 h-5 flex items-center justify-center">{platform.icon}</span>
                      <span className="truncate max-w-[100px]">{platform.name}</span>
                    </a>
                  ) : null
                )}
              </div>
            </div>
          )}
          {/* Gallery Section */}
          <GalleryModal gallery={profile.gallery || []} />
          <span className="text-xs text-gray-400 mt-3">WhoAmEye – powered by you</span>
        </section>
        {/* Made with WhoAmEye Badge (outside card, centered below, with eye logo) */}
        <div className="flex justify-center w-full mt-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-white via-gray-200 to-white border-2 border-black text-black font-bold text-xs shadow-xl hover:scale-105 hover:bg-gray-100 hover:text-gray-900 transition-all backdrop-blur-md"
            style={{ textDecoration: 'none', minWidth: '0', maxWidth: '100%' }}
            title="Made with WhoAmEye"
          >
            <span className="inline-block align-middle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 40 40"
                width="28"
                height="28"
                className="mr-2 drop-shadow-xl"
                aria-hidden="true"
              >
                <ellipse cx="20" cy="20" rx="16" ry="10" fill="#fff" fillOpacity="0.10" stroke="#222" strokeWidth="2.5" />
                <ellipse cx="20" cy="20" rx="13" ry="8" fill="#222" fillOpacity="0.10" />
                <circle cx="20" cy="20" r="6.5" fill="#222" />
                <circle cx="22.5" cy="18.5" r="2.2" fill="#fff" fillOpacity="0.9" />
              </svg>
            </span>
            <span className="font-extrabold tracking-tight whitespace-nowrap">WhoAmEye</span>
            <span className="hidden sm:inline-block font-normal text-xs text-gray-500 px-1">·</span>
            <span className="hidden sm:inline-block font-semibold text-xs text-gray-700">Create yours now!</span>
          </Link>
        </div>
      </main>
    </>
  );
}
