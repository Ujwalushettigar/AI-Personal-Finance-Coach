"use client";

import React from "react";

export default function TrustBar() {
  const trustPoints = [
    {
      icon: (
        <svg className="w-4 h-4 text-[#39FF88]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: "Free to start",
    },
    {
      icon: (
        <svg className="w-4 h-4 text-[#22D3EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      text: "No credit card required",
    },
    {
      icon: (
        <svg className="w-4 h-4 text-[#39FF88]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      text: "Your data stays private",
    },
    {
      icon: (
        <svg className="w-4 h-4 text-[#22D3EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      text: "Instant AI recommendations",
    },
  ];

  return (
    <div className="py-12 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1424]/80 border border-white/10 backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-around gap-6 text-xs sm:text-sm font-semibold text-slate-300">
          {trustPoints.map((pt, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center gap-2.5">
                <div className="p-1 rounded-md bg-white/5 border border-white/10">
                  {pt.icon}
                </div>
                <span>{pt.text}</span>
              </div>
              {index < trustPoints.length - 1 && (
                <div className="hidden md:block w-px h-5 bg-white/10" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
