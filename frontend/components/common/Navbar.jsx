"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Search } from "lucide-react";

/**
 * Navbar (CryptoVault Fintech Theme)
 * - Deep navy backdrop blur (#0A0E27/90) with border-white/10
 * - Brand logo with #39FF14 neon green badge & Space Grotesk typography
 * - Center pill navigation with active #39FF14 neon glow state
 * - User pill badge with #161F48 avatar & #FF4D6A hover logout
 * - Preserved 100% of route detection, auth state, and hide-on-login/signup logic
 */
export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  // Hide Navbar on Login and Signup pages
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  const authenticatedNavItems = [
    { label: "Overview", href: "/dashboard" },
    { label: "Transactions", href: "/transactions" },
    { label: "Subscriptions", href: "/subscriptions" },
    { label: "Budget", href: "/budget" },
    { label: "AI Coach", href: "/coach" },
  ];

  const publicNavItems = [
    { label: "Features", href: "/#features" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Security", href: "/#security" },
    { label: "Pricing", href: "/#pricing" },
  ];

  const navItems = user ? authenticatedNavItems : publicNavItems;

  return (
    <header className="sticky top-0 z-50 bg-[#0A0E27]/90 backdrop-blur-xl border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/dashboard" className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2.5">
          <span className="bg-[#39FF14] text-[#0A0E27] rounded-lg px-2.5 py-1 text-xs font-black shadow-[0_0_16px_rgba(57,255,20,0.4)] tracking-wider">
            FP
          </span>
          <span className="bg-gradient-to-r from-white via-slate-100 to-[#8A93B5] bg-clip-text text-transparent">
            FinPilot
          </span>
        </Link>

        {/* Center Pill Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0B1029] p-1.5 rounded-full border border-white/10 shadow-inner">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${isActive
                  ? "bg-[#39FF14] text-[#0A0E27] font-extrabold shadow-[0_0_16px_rgba(57,255,20,0.35)] scale-105"
                  : "text-[#8A93B5] hover:text-white hover:bg-white/5"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right User Actions / Auth Controls */}
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-full bg-[#0B1029] hover:bg-[#161F48] border border-white/10 flex items-center justify-center text-[#8A93B5] hover:text-white transition-all">
            <Search className="w-4 h-4" />
          </button>

          {user ? (
            <div className="flex items-center gap-2.5 bg-[#0B1029] border border-white/10 rounded-full pl-1.5 pr-3 py-1 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-[#161F48] text-[#39FF14] border border-[#39FF14]/30 font-bold text-xs flex items-center justify-center uppercase shadow-sm">
                {user.email ? user.email.charAt(0) : "U"}
              </div>
              <span className="text-xs font-semibold text-text-primary hidden sm:inline max-w-[120px] truncate">
                {user.email ? user.email.split("@")[0] : "Pilot"}
              </span>
              <button
                onClick={signOut}
                title="Sign Out"
                className="text-[#8A93B5] hover:text-[#FF4D6A] transition-colors ml-1 p-0.5"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs font-bold bg-[#39FF14] hover:bg-[#32e012] text-[#0A0E27] px-4 py-1.5 rounded-full transition-all shadow-[0_0_16px_rgba(57,255,20,0.3)]"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

