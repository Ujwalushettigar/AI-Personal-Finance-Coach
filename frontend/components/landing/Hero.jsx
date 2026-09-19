"use client";

import React from "react";
import Link from "next/link";
import LiveStatsCard from "./LiveStatsCard";
import GlassCard from "../common/GlassCard";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Main 2-Column Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#39FF88]/10 border border-[#39FF88]/30 backdrop-blur-md text-xs font-semibold text-[#39FF88]">
              <span className="w-2 h-2 rounded-full bg-[#39FF88] animate-pulse" />
              <span>Live AI Coaching Available</span>
            </div>

            {/* Main Headline matching reference layout */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Take Control of <br />
              <span className="bg-gradient-to-r from-[#22D3EE] to-[#39FF88] bg-clip-text text-transparent">
                Your Money
              </span>
            </h1>

            {/* Subtext Paragraph */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              The most secure and advanced personal finance coaching platform. Track spending, eliminate subscription leaks, and manage your wealth with intelligent AI guidance.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#39FF88] hover:bg-[#2ded75] text-[#070A14] font-extrabold text-base transition-all shadow-[0_0_25px_rgba(57,255,136,0.4)] flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Start Tracking</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/5 border border-white/15 backdrop-blur-md text-white font-bold text-base hover:bg-white/10 hover:border-white/30 transition-all text-center"
              >
                View Insights
              </a>
            </div>

            {/* Trust Indicators matching reference bottom indicators */}
            <div className="flex items-center justify-center lg:justify-start gap-6 pt-3 text-xs text-text-muted font-medium">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Bank-grade Security</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Real-time Telemetry</span>
              </div>
            </div>

          </div>

          {/* Right Hero Column: Reference Dashboard Card UI */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            
            {/* Ambient Backlight Glow behind Preview */}
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/15 to-accent-2/15 rounded-3xl blur-3xl transform scale-95" />

            {/* Main Interactive Glass Card matching reference mockup */}
            <GlassCard className="relative w-full max-w-lg p-6 space-y-6">
              
              {/* Card Header Row */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-base font-extrabold text-text-primary tracking-tight">FinPilot / INR</div>
                  <div className="text-xs text-text-muted font-medium">Personal Health Index</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-extrabold text-text-primary">₹45,200</div>
                  <div className="text-xs font-bold text-positive flex items-center justify-end gap-1">
                    <span>+2.34%</span>
                  </div>
                </div>
              </div>

              {/* Glowing Line Chart Component matching screenshot */}
              <div className="h-44 w-full relative pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGlowArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#39FF88" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#39FF88" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Fill Area underneath curve */}
                  <path
                    d="M 0 100 Q 80 80, 160 50 T 320 25 T 400 10 L 400 120 L 0 120 Z"
                    fill="url(#chartGlowArea)"
                  />
                  
                  {/* Glowing Green Curve Line */}
                  <path
                    d="M 0 100 Q 80 80, 160 50 T 320 25 T 400 10"
                    fill="none"
                    stroke="#39FF88"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    style={{ filter: "drop-shadow(0px 0px 8px rgba(57, 255, 136, 0.6))" }}
                  />
                </svg>

                {/* Filter Pills Bottom Right matching reference */}
                <div className="absolute bottom-1 right-2 flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-border text-[11px] font-bold">
                  <span className="px-2 py-0.5 rounded bg-accent-2 text-[#0A0E1A]">1W</span>
                  <span className="px-2 py-0.5 rounded text-text-muted hover:text-text-primary transition-colors cursor-pointer">1M</span>
                  <span className="px-2 py-0.5 rounded text-text-muted hover:text-text-primary transition-colors cursor-pointer">1Y</span>
                </div>
              </div>

            </GlassCard>

            {/* Top Floating Glass Badge */}
            <LiveStatsCard
              icon="S"
              iconBg="bg-gradient-to-tr from-amber-500 to-orange-500 text-white"
              value="₹45,200"
              trend="+2.34%"
              className="absolute -top-5 -right-3 sm:-right-4 hidden sm:flex z-20 shadow-2xl border-white/15"
            />

            {/* Bottom Floating Glass Badge */}
            <LiveStatsCard
              icon="≡"
              iconBg="bg-gradient-to-tr from-accent to-accent-2 text-[#0A0E1A]"
              value="₹22,840"
              trend="+1.87%"
              className="absolute -bottom-5 -left-3 sm:-left-4 hidden sm:flex z-20 shadow-2xl border-white/15"
            />

          </div>

        </div>

        {/* Bottom Ticker Strip matching bottom bar in reference screenshot */}
        <GlassCard className="p-3.5 sm:p-4 flex flex-wrap items-center justify-around gap-6 text-xs sm:text-sm font-semibold text-text-muted">
          <div className="flex items-center gap-2">
            <span className="font-bold text-text-primary">FinPilot Health Score</span>
            <span className="text-text-primary font-extrabold">82 pts</span>
            <span className="text-positive text-xs font-bold">+2.34%</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-text-primary">Monthly Savings</span>
            <span className="text-text-primary font-extrabold">₹22,840</span>
            <span className="text-positive text-xs font-bold">+1.87%</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-text-primary">Subscription Leaks</span>
            <span className="text-text-primary font-extrabold">3 Tracked</span>
            <span className="text-negative text-xs font-bold">-0.54%</span>
          </div>
        </GlassCard>

      </div>
    </section>
  );
}

