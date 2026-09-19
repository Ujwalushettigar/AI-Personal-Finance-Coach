"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Hero from "../components/landing/Hero";
import SecurityFeatures from "../components/landing/SecurityFeatures";
import TrustBar from "../components/landing/TrustBar";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // If user is already authenticated, redirect directly to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center text-text-muted font-medium text-sm">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span>Loading FinPilot...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="relative">
        <Hero />
        <SecurityFeatures />
        <TrustBar />
      </main>
      
      {/* Footer */}
      <footer className="py-8 border-t border-border bg-[#070A12]/80 backdrop-blur-md text-xs text-text-muted text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} FinPilot Inc. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a href="#security" className="hover:text-text-primary transition-colors">Privacy</a>
            <a href="#security" className="hover:text-text-primary transition-colors">Security</a>
            <a href="#how-it-works" className="hover:text-text-primary transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </>
  );
}
