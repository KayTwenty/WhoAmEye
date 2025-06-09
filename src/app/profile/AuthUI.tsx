'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

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
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setError(error.message);
    else setMessage('Password reset email sent!');
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white font-geist-sans">
      {/* Animated background shapes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-gradient-to-br from-lime-400/30 via-green-400/20 to-emerald-500/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] bg-gradient-to-tr from-emerald-500/20 via-lime-400/10 to-green-400/30 rounded-full blur-2xl animate-float-medium" />
        <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] bg-gradient-to-br from-lime-400/20 via-emerald-400/20 to-green-400/10 rounded-full blur-2xl animate-float-fast" />
      </div>
      <div className="w-full max-w-md mx-auto bg-white/10 rounded-3xl shadow-2xl p-8 border border-lime-400/30 flex flex-col items-center z-10">
        <span className="flex items-center font-extrabold text-3xl mb-8 bg-gradient-to-r from-lime-400 via-green-400 to-emerald-500 bg-clip-text text-transparent tracking-tight drop-shadow-lg animate-gradient-x">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="38" height="38" className="mr-2 drop-shadow-xl" aria-hidden="true">
            <ellipse cx="20" cy="20" rx="16" ry="10" fill="#fff" fillOpacity="0.10" stroke="#22c55e" strokeWidth="2.5" />
            <ellipse cx="20" cy="20" rx="13" ry="8" fill="#a3e635" fillOpacity="0.18" />
            <circle cx="20" cy="20" r="6.5" fill="#22c55e" />
            <circle cx="22.5" cy="18.5" r="2.2" fill="#fff" fillOpacity="0.9" />
          </svg>
          WhoAmEye
        </span>
        {resetMode ? (
          <form className="flex flex-col gap-4 w-full mt-2" onSubmit={handlePasswordReset} aria-label="Password reset form">
            <label htmlFor="reset-email" className="sr-only">Email</label>
            <input
              id="reset-email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border rounded-lg p-3 focus:ring-2 focus:ring-pink-400 outline-none text-lg"
              required
              autoFocus
              aria-required="true"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-lime-400 via-green-400 to-emerald-500 text-black rounded-full p-3 font-bold shadow hover:brightness-110 transition disabled:opacity-50 text-lg"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? 'Sending...' : 'Send Password Reset Email'}
            </button>
            <div className="text-center mt-2 text-sm text-gray-500">
              Remembered?{' '}
              <button type="button" className="underline text-lime-400 hover:text-lime-300 font-semibold" onClick={() => { setResetMode(false); setError(''); setMessage(''); }}>
                Back to sign in
              </button>
            </div>
          </form>
        ) : mode === 'signin' ? (
          <form className="flex flex-col gap-4 w-full mt-2" onSubmit={handleSignIn} aria-label="Sign in form">
            <label htmlFor="signin-email" className="sr-only">Email</label>
            <input
              id="signin-email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border rounded-lg p-3 focus:ring-2 focus:ring-pink-400 outline-none text-lg"
              required
              autoFocus
              aria-required="true"
              aria-label="Email address"
            />
            <div className="relative">
              <label htmlFor="signin-password" className="sr-only">Password</label>
              <input
                id="signin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none text-lg w-full pr-12"
                required
                aria-required="true"
                aria-label="Password"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-blue-600 font-semibold"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-lime-400 via-green-400 to-emerald-500 text-black rounded-full p-3 font-bold shadow hover:brightness-110 transition disabled:opacity-50 text-lg"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            <div className="flex flex-col gap-2 text-center mt-2 text-sm text-gray-500">
              <span>
                <button type="button" className="inline-flex items-center gap-1 underline text-lime-400 hover:text-lime-300 font-semibold transition" onClick={() => { setMode('signup'); setError(''); setMessage(''); }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  Create an account
                </button>
              </span>
              <span>
                <button type="button" className="inline-flex items-center gap-1 underline text-lime-400 hover:text-lime-300 font-semibold transition" onClick={() => { setResetMode(true); setError(''); setMessage(''); }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17v-6m0 0V7m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
                  Forgot password?
                </button>
              </span>
            </div>
          </form>
          // One-click login (magic link) temporarily hidden
        ) : (
          <form className="flex flex-col gap-4 w-full mt-2" onSubmit={handleSignUp} aria-label="Sign up form">
            <label htmlFor="signup-email" className="sr-only">Email</label>
            <input
              id="signup-email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border rounded-lg p-3 focus:ring-2 focus:ring-pink-400 outline-none text-lg"
              required
              aria-required="true"
              aria-label="Email address"
            />
            <div className="relative">
              <label htmlFor="signup-password" className="sr-only">Password</label>
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none text-lg w-full pr-12"
                required
                aria-required="true"
                aria-label="Password"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-blue-600 font-semibold"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-lime-400 via-green-400 to-emerald-500 text-black rounded-full p-3 font-bold shadow hover:brightness-110 transition disabled:opacity-50 text-lg"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
            <div className="text-center mt-2 text-sm text-gray-500">
              Already have an account?{' '}
              <button type="button" className="underline text-lime-400 hover:text-lime-300 font-semibold" onClick={() => { setMode('signin'); setError(''); setMessage(''); }}>
                Sign in
              </button>
            </div>
          </form>
        )}
        {error && <div className="text-red-600 mt-4 text-base text-center font-semibold" role="alert">{getFriendlyError(error)}</div>}
        {message && <div className="text-green-600 mt-4 text-base text-center font-semibold" role="status">{message}</div>}
        <div className="mt-8 text-xs text-gray-400 text-center">Proudly made for everyone 🏳️‍🌈</div>
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