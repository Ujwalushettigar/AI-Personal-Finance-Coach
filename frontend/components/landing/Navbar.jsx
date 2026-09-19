"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#070A14]/90 backdrop-blur-md border-b border-white/10 py-3.5 shadow-2xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo matching reference icon style */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#22D3EE] to-[#39FF88] p-[1.5px] shadow-[0_0_15px_rgba(57,255,136,0.4)]">
            <div className="w-full h-full bg-[#070A14] rounded-[6.5px] flex items-center justify-center">
              <svg
                className="w-4 h-4 text-[#39FF88]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#39FF88] transition-colors">
            FinPilot
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a
            href="#features"
            className="hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-white transition-colors"
          >
            How It Works
          </a>
          <a
            href="#security"
            className="hover:text-white transition-colors"
          >
            Security
          </a>
          <a
            href="#pricing"
            className="hover:text-white transition-colors"
          >
            Pricing
          </a>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-5">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="text-sm font-bold text-[#070A14] bg-[#39FF88] hover:bg-[#2ded75] px-5 py-2 rounded-xl transition-all shadow-[0_0_20px_rgba(57,255,136,0.35)] active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
