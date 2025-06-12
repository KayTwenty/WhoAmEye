'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { FaDiscord, FaGoogle, FaTwitter } from 'react-icons/fa';

export default function AuthUI() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const router = useRouter();

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    const reqs = getPasswordRequirements(password);
    if (!reqs.length || !reqs.lowercase || !reqs.uppercase || !reqs.digit || !reqs.symbol) {
      setError('Password must be at least 8 characters and include lowercase, uppercase, digit, and symbol.');
      setLoading(false);
      return;
    }
    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    setMessage('Check your email for a confirmation link!');
    setLoading(false);
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else setMessage('Signed in!');
    setLoading(false);
  }

  async function handlePasswordReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    if (error) setError(error.message);
    else setMessage('Password reset email sent! Please check your email and follow the link to set a new password.');
    setLoading(false);
  }

  // Third-party OAuth sign-in
  async function handleOAuth(provider: 'discord' | 'google' | 'twitter') {
    setLoading(true);
    setError('');
    setMessage('');
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) setError(error.message);
    setLoading(false);
  }

  // Improved error message mapping
  function getFriendlyError(msg: string) {
    if (!msg) return '';
    if (msg.includes('Invalid login credentials')) return 'Incorrect email or password.';
    if (msg.includes('User already registered')) return 'This email is already registered.';
    if (msg.includes('Password should be at least')) return 'Password must be at least 6 characters.';
    if (msg.includes('email is invalid')) return 'Please enter a valid email address.';
    if (msg.includes('reset password')) return 'Check your email for a password reset link.';
    return msg;
  }

  // Check for active session and redirect to /profile if logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace('/profile');
      }
    });
    // Also listen for auth state changes (e.g., after clicking confirmation link)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/profile');
      }
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, [router]);

  // Password strength requirements for sign up
  function getPasswordRequirements(pw: string) {
    return {
      length: pw.length >= 8,
      lowercase: /[a-z]/.test(pw),
      uppercase: /[A-Z]/.test(pw),
      digit: /[0-9]/.test(pw),
      symbol: /[^A-Za-z0-9]/.test(pw),
    };
  }
  const passwordReqs = getPasswordRequirements(password);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-white via-gray-100 to-gray-300 text-black font-serif">
      {/* Animated background shapes (subtle grayscale + bold black splurges) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full z-0">
        {/* Soft grayscale blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-gradient-to-br from-gray-200/40 via-gray-300/30 to-gray-400/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] bg-gradient-to-tr from-gray-400/20 via-gray-200/10 to-gray-300/30 rounded-full blur-2xl animate-float-medium" />
        <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] bg-gradient-to-br from-gray-200/20 via-gray-400/20 to-gray-300/10 rounded-full blur-2xl animate-float-fast" />
        {/* Bold black splurges */}
        <div className="absolute top-[10%] left-[5%] w-[180px] h-[120px] bg-black/80 rounded-[60%_40%_50%_70%/60%_30%_70%_40%] blur-2xl opacity-70 animate-float-slow" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-[8%] right-[8%] w-[140px] h-[100px] bg-black/70 rounded-[50%_60%_40%_60%/60%_40%_60%_50%] blur-2xl opacity-60 animate-float-medium" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[60%] left-[70%] w-[100px] h-[70px] bg-black/60 rounded-[60%_40%_60%_40%/40%_60%_40%_60%] blur-2xl opacity-50 animate-float-fast" style={{ animationDelay: '2.5s' }} />
      </div>
      <div className="w-full max-w-md mx-auto bg-white/95 rounded-3xl shadow-2xl p-8 border border-gray-300 flex flex-col items-center z-10">
        <span className="flex items-center font-extrabold text-3xl mb-8 text-black tracking-tight drop-shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="38" height="38" className="mr-2 drop-shadow-xl" aria-hidden="true">
            <ellipse cx="20" cy="20" rx="16" ry="10" fill="#fff" fillOpacity="0.10" stroke="#222" strokeWidth="2.5" />
            <ellipse cx="20" cy="20" rx="13" ry="8" fill="#222" fillOpacity="0.08" />
            <circle cx="20" cy="20" r="6.5" fill="#222" />
            <circle cx="22.5" cy="18.5" r="2.2" fill="#fff" fillOpacity="0.9" />
          </svg>
          WhoAmEye
        </span>
        {/* Third-party OAuth Providers */}
        <div className="w-full flex flex-col gap-3 mb-6">
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            className="flex items-center justify-center gap-3 w-full py-3 rounded-lg border border-gray-300 bg-white text-black font-bold shadow hover:bg-gray-100 transition text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Sign in with Google"
            disabled={loading}
          >
            <FaGoogle className="text-xl" /> Sign in with Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuth('discord')}
            className="flex items-center justify-center gap-3 w-full py-3 rounded-lg border border-gray-300 bg-[#5865F2] text-white font-bold shadow hover:bg-[#4752c4] transition text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Sign in with Discord"
            disabled={loading}
          >
            <FaDiscord className="text-xl" /> Sign in with Discord
          </button>
          <button
            type="button"
            onClick={() => handleOAuth('twitter')}
            className="flex items-center justify-center gap-3 w-full py-3 rounded-lg border border-gray-300 bg-[#1da1f2] text-white font-bold shadow hover:bg-[#0d8ddb] transition text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Sign in with Twitter"
            disabled={loading}
          >
            <FaTwitter className="text-xl" /> Sign in with Twitter
          </button>
        </div>
        {/* Redesigned Auth Section */}
        <div className="w-full flex flex-col gap-6">
          <div className="flex justify-center gap-2 mb-2">
            <button
              className={`px-4 py-2 rounded-l-lg border border-gray-300 bg-black text-white font-bold transition-all duration-150 ${mode === 'signin' && !resetMode ? 'bg-gray-900 border-gray-900' : 'hover:bg-gray-200 hover:text-black'}`}
              onClick={() => { setMode('signin'); setResetMode(false); setError(''); setMessage(''); }}
              type="button"
              aria-pressed={mode === 'signin' && !resetMode}
            >
              Sign In
            </button>
            <button
              className={`px-4 py-2 rounded-r-lg border border-gray-300 bg-white text-black font-bold transition-all duration-150 ${mode === 'signup' && !resetMode ? 'bg-gray-200 border-gray-900' : 'hover:bg-gray-100'}`}
              onClick={() => { setMode('signup'); setResetMode(false); setError(''); setMessage(''); }}
              type="button"
              aria-pressed={mode === 'signup' && !resetMode}
            >
              Sign Up
            </button>
          </div>
          {/* Auth Forms */}
          <div className="rounded-xl bg-white/90 border border-gray-200 shadow p-6 flex flex-col gap-4">
            {resetMode ? (
              <form className="flex flex-col gap-4 w-full" onSubmit={handlePasswordReset} aria-label="Password reset form">
                <h2 className="text-xl font-bold text-center mb-2">Reset Password</h2>
                <input
                  id="reset-email"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-400 outline-none text-lg bg-white text-black"
                  required
                  autoFocus
                  aria-required="true"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="bg-black text-white rounded-full p-3 font-bold shadow hover:brightness-110 transition disabled:opacity-50 text-lg border border-gray-800"
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? 'Sending...' : 'Send Password Reset Email'}
                </button>
                <div className="text-center mt-2 text-sm text-gray-500">
                  Remembered?{' '}
                  <button type="button" className="underline text-black hover:text-gray-700 font-semibold" onClick={() => { setResetMode(false); setError(''); setMessage(''); }}>
                    Back to sign in
                  </button>
                </div>
              </form>
            ) : mode === 'signin' ? (
              <form className="flex flex-col gap-4 w-full" onSubmit={handleSignIn} aria-label="Sign in form">
                <h2 className="text-xl font-bold text-center mb-2">Welcome Back</h2>
                <input
                  id="signin-email"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-400 outline-none text-lg bg-white text-black"
                  required
                  autoFocus
                  aria-required="true"
                  aria-label="Email address"
                />
                <div className="relative">
                  <input
                    id="signin-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-400 outline-none text-lg w-full pr-12 bg-white text-black"
                    required
                    aria-required="true"
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-black font-semibold"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <button
                  type="submit"
                  className="bg-black text-white rounded-full p-3 font-bold shadow hover:brightness-110 transition disabled:opacity-50 text-lg border border-gray-800"
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
                <div className="flex flex-col gap-2 text-center mt-2 text-sm text-gray-500">
                  <span>
                    <button type="button" className="inline-flex items-center gap-1 underline text-black hover:text-gray-700 font-semibold transition" onClick={() => { setMode('signup'); setError(''); setMessage(''); }}>
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                      Create an account
                    </button>
                  </span>
                  <span>
                    <button type="button" className="inline-flex items-center gap-1 underline text-black hover:text-gray-700 font-semibold transition" onClick={() => { setResetMode(true); setError(''); setMessage(''); }}>
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17v-6m0 0V7m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
                      Forgot password?
                    </button>
                  </span>
                </div>
              </form>
            ) : (
              <form className="flex flex-col gap-4 w-full" onSubmit={handleSignUp} aria-label="Sign up form">
                <h2 className="text-xl font-bold text-center mb-2">Create Your Account</h2>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-400 outline-none text-lg bg-white text-black"
                  required
                  aria-required="true"
                  aria-label="Email address"
                />
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-400 outline-none text-lg w-full pr-12 bg-white text-black"
                    required
                    aria-required="true"
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-black font-semibold"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {/* Password requirements pills */}
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${passwordReqs.length ? 'bg-green-200 text-green-800 border-green-400' : 'bg-gray-100 text-gray-500 border-gray-300'}`}>8+ chars</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${passwordReqs.lowercase ? 'bg-green-200 text-green-800 border-green-400' : 'bg-gray-100 text-gray-500 border-gray-300'}`}>lowercase</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${passwordReqs.uppercase ? 'bg-green-200 text-green-800 border-green-400' : 'bg-gray-100 text-gray-500 border-gray-300'}`}>uppercase</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${passwordReqs.digit ? 'bg-green-200 text-green-800 border-green-400' : 'bg-gray-100 text-gray-500 border-gray-300'}`}>digit</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${passwordReqs.symbol ? 'bg-green-200 text-green-800 border-green-400' : 'bg-gray-100 text-gray-500 border-gray-300'}`}>symbol</span>
                </div>
                <button
                  type="submit"
                  className="bg-black text-white rounded-full p-3 font-bold shadow hover:brightness-110 transition disabled:opacity-50 text-lg border border-gray-800"
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
                <div className="text-center mt-2 text-sm text-gray-500">
                  Already have an account?{' '}
                  <button type="button" className="underline text-black hover:text-gray-700 font-semibold" onClick={() => { setMode('signin'); setError(''); setMessage(''); }}>
                    Sign in
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        {error && <div className="text-red-600 mt-4 text-base text-center font-semibold" role="alert">{getFriendlyError(error)}</div>}
        {message && <div className="text-green-600 mt-4 text-base text-center font-semibold" role="status">{message}</div>}
        <div className="mt-8 text-xs text-gray-500 text-center">Proudly made for everyone 🏳️‍🌈</div>
      </div>
      <style jsx global>{`
        @keyframes gradient-move {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradient-move 8s ease-in-out infinite;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(40px) scale(0.98); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.03); }
        }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 8s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}