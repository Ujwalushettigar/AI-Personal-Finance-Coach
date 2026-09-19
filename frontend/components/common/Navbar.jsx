"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { LogOut } from "lucide-react";

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
    <header className="sticky top-0 z-50 bg-[#070A14]/90 backdrop-blur-md border-b border-border text-text-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-2 to-accent p-[1.5px] shadow-[0_0_12px_rgba(57,255,136,0.3)]">
            <div className="w-full h-full bg-[#070A14] rounded-[6.5px] flex items-center justify-center">
              <svg
                className="w-4 h-4 text-accent"
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
          <span className="text-xl font-bold tracking-tight text-text-primary group-hover:text-accent transition-colors">
            Fin<span className="text-accent">Pilot</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-border">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-accent text-[#070A14] font-bold shadow-md"
                    : "text-text-muted hover:text-text-primary hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right User Actions / Auth Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5 bg-white/5 border border-border rounded-full pl-1.5 pr-3 py-1">
              <div className="w-7 h-7 rounded-full bg-accent text-[#070A14] font-black text-xs flex items-center justify-center uppercase shadow-sm">
                {user.email ? user.email.charAt(0) : "P"}
              </div>
              <span className="text-xs font-semibold text-text-primary hidden sm:inline max-w-[120px] truncate">
                {user.email ? user.email.split("@")[0] : "Pilot"}
              </span>
              <button
                onClick={signOut}
                title="Sign Out"
                className="text-text-muted hover:text-negative transition-colors ml-1 p-0.5"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-semibold text-text-muted hover:text-text-primary transition-colors px-3 py-1.5"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-xs font-bold text-[#070A14] bg-accent hover:bg-accent/90 px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(57,255,136,0.3)] active:scale-95"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
