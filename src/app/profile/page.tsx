"use client";

import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
const AuthUI = dynamic(() => import('./AuthUI'), { ssr: false });
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from "@/components/Navbar";

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
    gallery: []
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
                      className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-blue-500 via-fuchsia-500 to-pink-500 text-white font-semibold shadow hover:brightness-110 transition mb-2"
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
              {/* Gradient Picker */}
              {editing && (
                <div className="w-full flex flex-col items-center mb-4">
                  <label className="text-xs text-gray-500 mb-1">Profile Color Theme</label>
                  <div className="relative w-full max-w-xs mb-2">
                    <select
                      value={profile.banner}
                      onChange={e => setProfile(prev => ({ ...prev, banner: e.target.value }))}
                      className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-400 outline-none bg-white text-gray-800 shadow"
                    >
                      {gradients.map((g) => (
                        <option key={g.name} value={g.name}>{g.name}</option>
                      ))}
                    </select>
                    <div className={`w-full h-3 rounded mt-2 bg-gradient-to-r ${gradients.find(g => g.name === profile.banner)?.banner || gradients[0].banner}`}></div>
                  </div>
                  <label className="text-xs text-gray-500 mb-1">Font Style</label>
                  <div className="relative w-full max-w-xs">
                    <select
                      value={font}
                      onChange={e => setFont(e.target.value)}
                      className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-400 outline-none bg-white text-gray-800 shadow"
                    >
                      {fonts.map((f) => (
                        <option key={f.class} value={f.class}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              {/* Edit/Save Button */}
              <button
                onClick={editing ? saveProfile : () => setEditing(true)}
                className="mt-2 px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 via-fuchsia-500 to-pink-500 text-white font-semibold shadow hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
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
