"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import VantaGlobeBackground from "../../components/common/VantaGlobeBackground";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { signUp, signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);

    try {
      const data = await signUp(email, password);
      if (data?.session) {
        router.push("/dashboard");
        return;
      }
      // Attempt auto-login if session was not returned by default
      try {
        await signIn(email, password);
        router.push("/dashboard");
      } catch (signInErr) {
        if (signInErr.message?.toLowerCase().includes("email not confirmed")) {
          setInfoMessage(
            "Account created! Email confirmation is enabled in your Supabase project. Please check your email inbox to confirm your account before logging in, or disable 'Confirm Email' in your Supabase Auth settings."
          );
        } else {
          setError(signInErr.message || "Account created, but failed to log in automatically.");
        }
      }
    } catch (err) {
      setError(err.message || "Failed to create account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <VantaGlobeBackground>
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-slate-950/60 p-8 backdrop-blur-xl shadow-2xl text-white">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">Create Account</h1>
          <p className="text-sm text-slate-400 mt-1">Start managing your finances with FinPilot</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-500/20 border border-rose-500/40 p-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        {infoMessage && (
          <div className="mb-4 rounded-lg bg-emerald-500/20 border border-emerald-500/40 p-3 text-sm text-emerald-300">
            {infoMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 py-3 font-bold text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-amber-400 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </VantaGlobeBackground>
  );
}
