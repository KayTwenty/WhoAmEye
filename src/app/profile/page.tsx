"use client";

import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
const AuthUI = dynamic(() => import('./AuthUI'), { ssr: false });
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from "@/components/Navbar";
import { FaTwitter, FaInstagram, FaGithub, FaLinkedin, FaFacebook, FaYoutube, FaTiktok, FaTwitch } from 'react-icons/fa';

// Tailwind color class to hex mapping for previewing gradients
const tailwindToHex: { [key: string]: string } = {
  'blue-400': '#60a5fa',
  'fuchsia-500': '#a21caf',
  'pink-400': '#f472b6',
  'green-300': '#6ee7b7',
  'teal-400': '#2dd4bf',
  'yellow-200': '#fef9c3',
  'orange-300': '#fdba74',
  'red-300': '#fca5a5',
  'gray-400': '#9ca3af',
  'slate-400': '#94a3b8',
  'pink-200': '#fbcfe8',
  'red-200': '#fecaca',
  'cyan-200': '#a5f3fc',
  'blue-200': '#bfdbfe',
  'indigo-200': '#c7d2fe',
  'violet-200': '#ddd6fe',
  'fuchsia-200': '#fae8ff',
  'yellow-400': '#facc15',
  'yellow-600': '#ca8a04',
  'yellow-800': '#713f12',
  'gray-200': '#e5e7eb',
  'gray-700': '#374151',
  'black': '#000000',
  'white': '#ffffff',
  'blue-900': '#1e3a8a',
  'purple-900': '#581c87',
  'pink-700': '#be185d',
  'green-700': '#15803d',
  'teal-600': '#0d9488',
  'blue-700': '#1d4ed8',
  'gray-800': '#1f2937',
  'slate-700': '#334155',
  'gray-900': '#111827',
  'pink-500': '#ec4899',
  'red-500': '#ef4444',
  'yellow-500': '#eab308',
  'cyan-400': '#22d3ee',
  'blue-500': '#3b82f6',
  'lime-400': '#a3e635',
  'green-500': '#22c55e',
  'emerald-500': '#10b981',
  'violet-500': '#8b5cf6',
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  }

  const [profile, setProfile] = useState<{
    username: string;
    displayName: string;
    pronouns: string;
    tagline: string;
    bio: string;
    avatar: string;
    banner: string;
    bannerImage: string;
    links: { label: string; url: string; icon: string }[];
    gallery: string[];
    socials?: { [key: string]: string };
  }>({
    username: "",
    displayName: "",
    pronouns: "",
    tagline: "Express yourself!",
    bio: "Welcome to my profile. I love building cool things and meeting new people!",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=profile",
    banner: "gradient",
    bannerImage: "",
    links: [
      { label: "My Portfolio", url: "", icon: "FaLink" }
    ],
    gallery: [],
    socials: {
      twitter: '',
      instagram: '',
      github: '',
      linkedin: '',
      facebook: '',
      youtube: '',
      tiktok: '',
      twitch: '',
    }
  });
  const [editing, setEditing] = useState(true);
  const [usernameLocked, setUsernameLocked] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Font style options
  const fonts = [
    { name: "Sans", class: "font-sans" },
    { name: "Serif", class: "font-serif" },
    { name: "Mono", class: "font-mono" },
  ];

  // More color themes
  const gradients = [
    { name: "Blue/Purple/Pink", value: "from-blue-900 via-purple-900 to-pink-700", banner: "from-blue-400 via-fuchsia-500 to-pink-400" },
    { name: "Green/Teal/Blue", value: "from-green-700 via-teal-600 to-blue-700", banner: "from-green-300 via-teal-400 to-blue-400" },
    { name: "Orange/Red/Yellow", value: "from-yellow-500 via-orange-500 to-red-500", banner: "from-yellow-200 via-orange-300 to-red-300" },
    { name: "Gray/Slate", value: "from-gray-800 via-slate-700 to-gray-900", banner: "from-gray-400 via-slate-400 to-gray-500" },
    { name: "Pink/Red", value: "from-pink-500 via-red-500 to-yellow-500", banner: "from-pink-200 via-red-200 to-yellow-200" },
    { name: "Aqua/Blue", value: "from-cyan-400 via-blue-500 to-indigo-500", banner: "from-cyan-200 via-blue-200 to-indigo-200" },
    { name: "Lime/Green", value: "from-lime-400 via-green-500 to-emerald-500", banner: "from-lime-200 via-green-200 to-emerald-200" },
    { name: "Indigo/Violet", value: "from-indigo-500 via-violet-500 to-fuchsia-500", banner: "from-indigo-200 via-violet-200 to-fuchsia-200" },
    { name: "Gold", value: "from-yellow-400 via-yellow-600 to-yellow-800", banner: "from-yellow-200 via-yellow-400 to-yellow-600" },
    { name: "Black/White", value: "from-black via-gray-700 to-white", banner: "from-gray-200 via-gray-400 to-white" },
  ];

  const selectedGradient = gradients.find(g => g.name === profile.banner) || gradients[0];

  // Add font to profile state
  const [font, setFont] = useState(fonts[0].class);

  // Banner image upload
  const bannerInputRef = React.useRef<HTMLInputElement>(null);
  function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfile((prev) => ({ ...prev, bannerImage: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    if (name === "pronouns") {
      // Only allow letters, slashes, spaces, hyphens, periods, and commas, max 32 chars
      const safe = value.replace(/[^a-zA-Z\s/.,-]/g, "").slice(0, 32);
      setProfile((prev) => ({ ...prev, pronouns: safe }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfile((prev) => ({ ...prev, avatar: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  }

  function handleLinkChange(index: number, field: string, value: string) {
    setProfile((prev) => {
      const links = [...prev.links];
      links[index] = { ...links[index], [field]: value };
      return { ...prev, links };
    });
  }
  function addLink() {
    setProfile((prev) => ({ ...prev, links: [...prev.links, { label: "", url: "", icon: "🔗" }] }));
  }
  function removeLink(index: number) {
    setProfile((prev) => {
      const links = prev.links.filter((_, i) => i !== index);
      return { ...prev, links };
    });
  }

  const [menuOpen, setMenuOpen] = useState(false);

  // Load profile from Supabase on mount or user change
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (data) {
        setProfile({
          username: data.username || '',
          displayName: data.username || data.display_name || '',
          pronouns: data.pronouns || '',
          tagline: data.tagline || '',
          bio: data.bio || '',
          avatar: data.avatar || 'https://api.dicebear.com/7.x/shapes/svg?seed=profile',
          banner: data.banner || 'gradient',
          bannerImage: data.banner_image || '',
          links: data.links || [],
          gallery: data.gallery || [],
          socials: data.socials || {
            twitter: '',
            instagram: '',
            github: '',
            linkedin: '',
            facebook: '',
            youtube: '',
            tiktok: '',
            twitch: '',
          },
        });
        setFont(data.font || fonts[0].class);
        setUsernameLocked(!!data.username); // lock if username is set in DB
      }
    }
    fetchProfile();
  }, [user]);

  // Gallery image upload (Supabase Storage)
  const galleryInputRef = React.useRef<HTMLInputElement>(null);
  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      const fileArr = Array.from(files).slice(0, 9 - profile.gallery.length); // max 9 images
      for (const file of fileArr) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const { error } = await supabase.storage.from('gallery').upload(fileName, file, { upsert: false });
        if (error) {
          toast.error('Failed to upload image.');
          continue;
        }
        const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(fileName);
        if (urlData?.publicUrl) {
          setProfile(prev => ({ ...prev, gallery: [...prev.gallery, urlData.publicUrl] }));
        }
      }
    }
  }
  async function removeGalleryImage(idx: number) {
    const url = profile.gallery[idx];
    // Extract file name from URL
    const fileName = url.split('/').pop()?.split('?')[0];
    if (fileName) {
      await supabase.storage.from('gallery').remove([fileName]);
    }
    setProfile(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== idx) }));
  }

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

  // Save profile to Supabase
  async function saveProfile() {
    if (!user) return;
    const updates = {
      user_id: user.id,
      username: profile.username.toLowerCase(),
      display_name: profile.displayName,
      pronouns: profile.pronouns,
      tagline: profile.tagline,
      bio: profile.bio,
      avatar: profile.avatar,
      banner: profile.banner,
      banner_image: profile.bannerImage,
      links: profile.links,
      font: font,
      gallery: profile.gallery,
      socials: profile.socials, // <-- save socials
      updated_at: new Date().toISOString(),
    };
    // Username validation
    if (!profile.username.match(/^[a-zA-Z0-9_]{3,20}$/)) {
      toast.error('Username must be 3-20 characters, a-z, 0-9, or _');
      return;
    }
    const { error } = await supabase
      .from('profiles')
      .upsert(updates, { onConflict: 'user_id' });
    if (!error) {
      setEditing(false);
      if (!usernameLocked && profile.username) setUsernameLocked(true); // lock after save
      toast.success('Profile saved!');
    } else {
      // Show the full error message for debugging
      toast.error('Error saving profile: ' + error.message);
      console.error('Supabase profile save error:', error);
    }
  }

  // Nav bar and main content
  return (
    <>
      {user ? (
        <>
          <Toaster position="top-center" toastOptions={{ duration: 3500 }} />
          <Navbar
            displayName={profile.displayName || user.email || ""}
            email={user.email || ""}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            handleLogout={handleLogout}
          />
          <main className={`flex min-h-screen flex-col items-center justify-center bg-gradient-to-br ${selectedGradient.value} p-4 ${font}`} style={{ minHeight: '100vh', paddingTop: '5.5rem' }}>
            <section className="relative w-full max-w-lg rounded-3xl bg-white/95 shadow-2xl p-8 flex flex-col items-center border border-gray-100">
              {/* Banner */}
              <div className={`w-full h-36 rounded-2xl mb-[-56px] shadow-lg relative flex items-center justify-center overflow-hidden`}>
                {profile.bannerImage ? (
                  <img src={profile.bannerImage} alt="Banner" className="absolute w-full h-full object-cover rounded-2xl" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-r ${selectedGradient.banner} rounded-2xl`} />
                )}
                {editing && (
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="absolute right-2 top-2 px-2 py-1 text-xs rounded bg-white/80 text-gray-700 font-semibold shadow hover:bg-white"
                  >
                    Upload Banner
                  </button>
                )}
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="hidden"
                />
              </div>
              {/* Avatar */}
              <div className="relative z-10 -mt-20 mb-3 flex flex-col items-center">
                {editing ? (
                  <>
                    <img
                      src={profile.avatar}
                      alt="Avatar Preview"
                      className="w-36 h-36 rounded-full border-4 border-white shadow-xl object-cover bg-gray-100 mb-2"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1 text-xs rounded-full bg-black text-white font-semibold shadow hover:bg-gray-900 transition mb-2 border border-gray-700"
                    >
                      Upload Avatar
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </>
                ) : (
                  <img
                    src={profile.avatar}
                    alt="Avatar"
                    className="w-36 h-36 rounded-full border-4 border-white shadow-xl object-cover bg-gray-100"
                  />
                )}
              </div>
              {/* Display Name, Pronouns & Tagline */}
              {editing ? (
                <>
                  {usernameLocked ? (
                    <input
                      type="text"
                      name="username"
                      value={profile.username}
                      className="text-base font-mono text-blue-700 text-center w-full mb-1 border rounded p-2 bg-gray-100 cursor-not-allowed"
                      disabled
                      readOnly
                    />
                  ) : (
                    <input
                      type="text"
                      name="username"
                      value={profile.username}
                      onChange={e => setProfile(prev => ({ ...prev, username: e.target.value }))}
                      className={`text-base font-mono text-blue-700 text-center w-full mb-1 border rounded p-2 ${usernameLocked ? 'bg-gray-100 cursor-not-allowed' : ''} focus:ring-2 focus:ring-blue-400 outline-none`}
                      placeholder="Username (unique, a-z, 0-9, _ only)"
                      maxLength={20}
                      pattern="^[a-zA-Z0-9_]{3,20}$"
                      required
                      disabled={usernameLocked}
                      readOnly={usernameLocked}
                    />
                  )}
                  <input
                    type="text"
                    name="displayName"
                    value={profile.displayName}
                    onChange={handleChange}
                    className="text-3xl font-extrabold text-black text-center w-full mb-1 border rounded p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    placeholder="Display Name"
                    maxLength={32}
                    autoFocus
                  />
                  <input
                    type="text"
                    name="pronouns"
                    value={profile.pronouns}
                    onChange={handleChange}
                    className="text-sm text-gray-700 text-center w-full mb-1 border rounded p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    placeholder="Pronouns (e.g. she/her, he/him, they/them)"
                    maxLength={32}
                  />
                  <input
                    type="text"
                    name="tagline"
                    value={profile.tagline}
                    onChange={handleChange}
                    className="text-base text-gray-700 mb-3 w-full border rounded p-2 focus:ring-2 focus:ring-pink-400 outline-none"
                    placeholder="Tagline"
                    maxLength={64}
                  />
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-extrabold text-black tracking-tight">{profile.displayName}</h1>
                  {profile.pronouns && (
                    <div className="text-xs text-gray-600 font-semibold mb-1">{profile.pronouns}</div>
                  )}
                  <p className="text-base text-gray-700 mb-3">{profile.tagline}</p>
                </>
              )}
              {/* About/Bio */}
              {editing ? (
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  className="text-center text-gray-800 mb-5 w-full border rounded p-2 focus:ring-2 focus:ring-fuchsia-400 outline-none"
                  rows={4}
                  placeholder="About/Bio"
                  maxLength={300}
                />
              ) : (
                <p className="text-center text-gray-800 mb-5 whitespace-pre-line">{profile.bio}</p>
              )}
              {/* Custom Links Section */}
              <div className="w-full mb-4">
                <label className="text-xs text-gray-500 mb-1 block">Custom Links</label>
                {editing ? (
                  <>
                    {profile.links.map((link, i) => (
                      <div key={i} className="flex gap-2 mb-2 items-center">
                        <input
                          type="text"
                          value={link.label}
                          onChange={e => handleLinkChange(i, 'label', e.target.value)}
                          className="w-32 text-xs border rounded p-1 focus:ring-2 focus:ring-blue-400 outline-none text-black"
                          placeholder="Label"
                          maxLength={24}
                        />
                        <input
                          type="text"
                          value={link.url}
                          onChange={e => handleLinkChange(i, 'url', e.target.value)}
                          className="flex-1 text-xs border rounded p-1 focus:ring-2 focus:ring-blue-400 outline-none text-black"
                          placeholder="https://example.com"
                        />
                        <button
                          type="button"
                          onClick={() => removeLink(i)}
                          className="text-xs px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200"
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addLink}
                      className="mt-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200"
                    >
                      + Add Link
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    {profile.links.filter(l => l.label && l.url).map((link, i) => (
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
                )}
              </div>
              {/* Gallery Section */}
              <div className="w-full mb-4">
                <label className="text-xs text-gray-500 mb-1 block">Gallery (up to 9 images)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {profile.gallery && profile.gallery.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} alt={`Gallery ${i + 1}`} className="w-20 h-20 object-cover rounded-lg border shadow" />
                      {editing && (
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(i)}
                          className="absolute top-1 right-1 bg-white/80 text-red-600 rounded-full p-1 text-xs shadow group-hover:scale-110 transition"
                          title="Remove"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {editing && profile.gallery.length < 9 && (
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-blue-300 rounded-lg text-blue-400 hover:bg-blue-50 text-3xl font-bold"
                      title="Add Image"
                    >
                      +
                    </button>
                  )}
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                </div>
              </div>
              {/* Gradient & Font Picker - Redesigned */}
              {editing && (
                <div className="w-full flex flex-col sm:flex-row gap-4 items-start mb-6 mt-2">
                  {/* Color Theme */}
                  <div className="flex-1 flex flex-col items-start">
                    <label className="text-xs text-gray-500 mb-1 font-semibold">Profile Color Theme</label>
                    <div className="flex flex-wrap gap-2">
                      {gradients.map((g) => (
                        <button
                          key={g.name}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 ${profile.banner === g.name ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center`}
                          aria-label={g.name}
                          onClick={() => setProfile(prev => ({ ...prev, banner: g.name }))}
                          style={{ padding: 0, background: 'none' }}
                        >
                          <span
                            className="block w-6 h-6 rounded-full"
                            style={{
                              background: (() => {
                                // Extract color stops from Tailwind classes
                                const stops = g.banner.split(' ')
                                  .map(cls => {
                                    // Remove from-, via-, to- and get the color name
                                    const color = cls.replace('from-', '').replace('via-', '').replace('to-', '');
                                    // If it's a Tailwind color, use the mapping, else fallback to the color string
                                    if (tailwindToHex[color]) return tailwindToHex[color];
                                    // Hardcoded fallback for lime-200 and slate-400/slate-700
                                    if (color === 'lime-200') return '#d9f99d';
                                    if (color === 'lime-400') return '#a3e635';
                                    if (color === 'emerald-200') return '#a7f3d0';
                                    if (color === 'emerald-500') return '#10b981';
                                    if (color === 'slate-400') return '#94a3b8';
                                    if (color === 'slate-700') return '#334155';
                                    if (color === 'gray-400') return '#9ca3af';
                                    if (color === 'gray-200') return '#e5e7eb';
                                    if (color === 'gray-900') return '#111827';
                                    if (color === 'gray-800') return '#1f2937';
                                    if (color === 'gray-700') return '#374151';
                                    if (color === 'gray-100') return '#f3f4f6';
                                    if (color === 'gray-50') return '#f9fafb';
                                    return color;
                                  });
                                return `linear-gradient(to right, ${stops.join(', ')})`;
                              })()
                            }}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-black mt-1">{profile.banner}</span>
                  </div>
                  {/* Font Style */}
                  <div className="flex-1 flex flex-col items-start">
                    <label className="text-xs text-gray-500 mb-1 font-semibold">Font Style</label>
                    <div className="flex gap-2">
                      {fonts.map((f) => (
                        <button
                          key={f.class}
                          type="button"
                          className={`px-3 py-1 rounded-full border-2 ${font === f.class ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'} font-semibold text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400`}
                          onClick={() => setFont(f.class)}
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {/* Social Media Section */}
              <div className="w-full mb-4">
                <label className="text-xs text-gray-500 mb-1 block">Social Media</label>
                <div className="flex flex-col gap-2">
                  {socialPlatforms.map(platform => (
                    <div key={platform.key} className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 flex items-center justify-center">{platform.icon}</span>
                      <input
                        type="text"
                        value={profile.socials?.[platform.key] || ''}
                        onChange={e => setProfile(prev => ({
                          ...prev,
                          socials: { ...prev.socials, [platform.key]: e.target.value }
                        }))}
                        className="flex-1 text-xs border rounded p-1 focus:ring-2 focus:ring-blue-400 outline-none text-black"
                        placeholder={`Your ${platform.name} URL`}
                        maxLength={64}
                      />
                    </div>
                  ))}
                </div>
              </div>
              {/* Edit/Save Button */}
              <button
                onClick={editing ? saveProfile : () => setEditing(true)}
                className="mt-2 px-6 py-2 rounded-full bg-black text-white font-semibold shadow hover:bg-gray-900 transition focus:outline-none focus:ring-2 focus:ring-gray-700 border border-gray-700"
              >
                {editing ? "Save" : "Edit Profile"}
              </button>
              {/* Shareable Profile Link */}
              {user && (
                <div className="flex flex-col items-center mt-4 w-full">
                  <span className="text-xs text-gray-500 mb-1">Share your card:</span>
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      readOnly
                      value={`${typeof window !== 'undefined' ? window.location.origin : ''}/u/${profile.displayName || user.id}`}
                      className="flex-1 text-xs border rounded p-2 bg-gray-50 text-gray-700 select-all"
                      onFocus={e => e.target.select()}
                    />
                    <button
                      type="button"
                      className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200"
                      onClick={() => {
                        const url = `${window.location.origin}/u/${profile.displayName || user.id}`;
                        navigator.clipboard.writeText(url);
                      }}
                    >
                      Copy
                    </button>
                    <a
                      href={`/u/${profile.displayName || user.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200"
                    >
                      View
                    </a>
                  </div>
                </div>
              )}
              {/* Customization note */}
              <span className="text-xs text-gray-400 mt-3">Your own platform bio card – make it yours!</span>
            </section>
          </main>
        </>
      ) : (
        <AuthUI />
      )}
    </>
  );
}
