"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  // On mount, check if user is signed in (from reset link)
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        setError("Invalid or expired reset link. Please request a new one.");
      }
    });
  }, []);

  // Password strength requirements for reset
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

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    const reqs = getPasswordRequirements(password);
    if (!reqs.length || !reqs.lowercase || !reqs.uppercase || !reqs.digit || !reqs.symbol) {
      setError("Password must be at least 8 characters and include lowercase, uppercase, digit, and symbol.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMessage("Password updated! You can now sign in.");
      setTimeout(() => router.replace("/profile"), 2000);
    }
  }

  function handleShowPassword() {
    setShowPassword(true);
    setTimeout(() => setShowPassword(false), 5000);
  }
  function handleShowConfirm() {
    setShowConfirm(true);
    setTimeout(() => setShowConfirm(false), 5000);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-gray-100 to-gray-300 text-black font-serif">
      <div className="w-full max-w-md mx-auto bg-white/95 rounded-3xl shadow-2xl p-8 border border-gray-300 flex flex-col items-center z-10">
        <span className="font-extrabold text-2xl mb-6 text-black tracking-tight">Reset Your Password</span>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleReset}>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-400 outline-none text-lg bg-white text-black w-full pr-12"
              required
              minLength={8}
              autoFocus
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500 hover:text-black"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={handleShowPassword}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
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
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-400 outline-none text-lg bg-white text-black w-full pr-12"
              required
              minLength={8}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500 hover:text-black"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              onClick={handleShowConfirm}
              tabIndex={-1}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"
            className="bg-black text-white rounded-full p-3 font-bold shadow hover:brightness-110 transition disabled:opacity-50 text-lg border border-gray-800"
            disabled={loading}
          >
            {loading ? "Updating..." : "Set New Password"}
          </button>
        </form>
        {error && <div className="text-red-600 mt-4 text-base text-center font-semibold" role="alert">{error}</div>}
        {message && <div className="text-green-600 mt-4 text-base text-center font-semibold" role="status">{message}</div>}
      </div>
    </div>
  );
}
