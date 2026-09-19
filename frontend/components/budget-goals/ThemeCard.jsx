'use client';

import React from 'react';

/**
 * Reusable Crypto Fintech Design System Elements
 * Extracted from CryptoVault reference design:
 * --bg-base: #0A0E27
 * --bg-card: #0F1633
 * --bg-tile: #0B1029
 * --border-subtle: rgba(255,255,255,0.06)
 * --blue: #0A84FF
 * --teal: #1FB5A5
 * --green-mid: #22D36A
 * --green-neon: #39FF14
 */

// 1. Signature Badge Pill (e.g., "Bank-Grade Security", "Protected 24/7")
export function BadgePill({ icon, text, className = '' }) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wide bg-[#0A84FF]/[0.12] border border-[#0A84FF]/30 text-[#0A84FF] backdrop-blur-sm ${className}`}
    >
      {icon && <span className="text-sm leading-none flex items-center justify-center">{icon}</span>}
      <span>{text}</span>
    </div>
  );
}

// 2. Signature Section Heading with Gradient Highlight Text
export function SectionHeading({
  badgeText,
  badgeIcon,
  normalText,
  gradientText,
  subtitle,
  align = 'left',
  className = ''
}) {
  const alignmentClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col ${alignmentClass} ${className}`}>
      {badgeText && (
        <BadgePill icon={badgeIcon} text={badgeText} className="mb-3" />
      )}
      <h2 className="text-2xl sm:text-3xl md:text-[38px] font-bold text-white tracking-tight leading-[1.15]">
        {normalText}{' '}
        <span className="bg-gradient-to-r from-[#0A84FF] via-[#22D36A] to-[#39FF14] bg-clip-text text-transparent">
          {gradientText}
        </span>
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-[#8A93B5] mt-2 max-w-2xl font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// 3. Signature Feature Card (16px radius, #0F1633, subtle border, smooth hover lift)
export function Card({ children, className = '', hover = true, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#0F1633] border border-white/[0.06] rounded-[16px] p-6 relative transition-all duration-200 ${
        hover ? 'hover:-translate-y-0.5 hover:border-[#0A84FF]/35' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

// 4. Nested Tile (Darker surface #0B1029 inside cards)
export function Tile({ children, className = '' }) {
  return (
    <div className={`bg-[#0B1029] border border-white/[0.05] rounded-[12px] p-4 ${className}`}>
      {children}
    </div>
  );
}

// 5. Signature 48x48px Icon Tile
export function IconTile({ children, className = '' }) {
  return (
    <div
      className={`w-12 h-12 rounded-[12px] bg-gradient-to-br from-[#0A84FF]/[0.22] to-[#22D36A]/[0.18] border border-[#0A84FF]/25 flex items-center justify-center text-[#0A84FF] flex-shrink-0 ${className}`}
    >
      {children}
    </div>
  );
}

// 6. Signature Primary Neon Button (#39FF14 with #0A0E27 text & soft green glow)
export function PrimaryButton({ children, className = '', onClick, type = 'button', disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 rounded-[12px] bg-[#39FF14] hover:bg-[#32e012] text-[#0A0E27] font-semibold text-sm tracking-tight transition-all duration-200 hover:shadow-[0_0_24px_rgba(57,255,20,0.35)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 ${className}`}
    >
      {children}
    </button>
  );
}

// 7. Signature Secondary / Ghost Button
export function SecondaryButton({ children, className = '', onClick, type = 'button', disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-[12px] bg-transparent hover:bg-white/[0.05] text-[#8A93B5] hover:text-white font-medium text-sm transition-all duration-150 border border-white/[0.08] hover:border-white/[0.18] flex items-center justify-center gap-2 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
