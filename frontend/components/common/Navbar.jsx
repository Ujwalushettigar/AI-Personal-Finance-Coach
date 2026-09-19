"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Search } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  // Hide Navbar on Login and Signup pages
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  const navItems = [
    { label: "Overview", href: "/dashboard" },
    { label: "Transactions", href: "/transactions" },
    { label: "Subscriptions", href: "/subscriptions" },
    { label: "Budget", href: "/budget" },
    { label: "Coach", href: "/coach" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/dashboard" className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2.5">
          <span className="bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-lg px-2.5 py-1 text-xs font-black shadow-lg">
            FP
          </span>
          <span>FinPilot</span>
        </Link>

        {/* Center Pill Navigation (Fitonist Reference Style) */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-full border border-white/10 shadow-inner">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-white text-slate-950 shadow-md scale-105"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right User Badge & Controls */}
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 transition-colors">
            <Search className="w-4 h-4" />
          </button>

          {user ? (
            <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-full pl-1.5 pr-3 py-1">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center uppercase shadow-sm">
                {user.email ? user.email.charAt(0) : "U"}
              </div>
              <span className="text-xs font-semibold text-slate-200 hidden sm:inline max-w-[120px] truncate">
                {user.email ? user.email.split("@")[0] : "User"}
              </span>
              <button
                onClick={signOut}
                title="Sign Out"
                className="text-slate-400 hover:text-rose-400 transition-colors ml-1 p-0.5"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs font-bold bg-gradient-to-r from-rose-500 to-amber-500 text-white px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity shadow-md"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
