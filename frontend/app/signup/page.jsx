"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import GlassCard from "../../components/common/GlassCard";

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-8 text-text-primary">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Create Account</h1>
          <p className="text-sm text-text-muted mt-1">Start managing your finances with FinPilot</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-negative/20 border border-negative/40 p-3 text-sm text-negative">
            {error}
          </div>
        )}

        {infoMessage && (
          <div className="mb-4 rounded-lg bg-positive/20 border border-positive/40 p-3 text-sm text-positive">
            {infoMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-border bg-white/5 px-4 py-2.5 text-sm text-text-primary placeholder-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-border bg-white/5 px-4 py-2.5 text-sm text-text-primary placeholder-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-border bg-white/5 px-4 py-2.5 text-sm text-text-primary placeholder-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-accent py-3 font-bold text-[#0A0E1A] shadow-[0_0_20px_rgba(57,255,136,0.3)] transition-all hover:bg-accent/90 active:scale-95 disabled:opacity-50"
          >
            {submitting ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-accent hover:underline">
            Log in
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}

