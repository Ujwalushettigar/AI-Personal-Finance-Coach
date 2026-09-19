'use client';

import React from 'react';
import { SecondaryButton } from './ThemeCard';

/**
 * Delete Confirmation Dialog (CryptoVault Fintech Theme)
 * - Elevated #0F1633 card with 16px radius and subtle 1px border
 * - Red (#FF4D6A) confirmation button with loading spinner
 */
export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, budgetCategory, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0E27]/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm p-6 sm:p-7 rounded-[16px] bg-[#0F1633] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-white">

        {/* Warning Icon Tile */}
        <div className="w-12 h-12 rounded-[12px] bg-[#FF4D6A]/[0.12] border border-[#FF4D6A]/30 text-[#FF4D6A] flex items-center justify-center mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-white mb-1.5">
          Delete Budget Allocation
        </h3>
        <p className="text-xs sm:text-sm text-[#8A93B5] mb-6 leading-relaxed">
          Are you sure you want to remove the <span className="font-semibold text-white">"{budgetCategory}"</span> category? All spending limits and telemetry for this category will be removed.
        </p>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
          <SecondaryButton onClick={onClose} disabled={isDeleting}>
            Cancel
          </SecondaryButton>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-[12px] bg-[#FF4D6A] hover:bg-[#e03d58] text-white font-semibold text-xs transition-all duration-150 shadow-[0_0_20px_rgba(255,77,106,0.3)] disabled:opacity-50 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#FF4D6A]"
          >
            {isDeleting ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Deleting...</span>
              </>
            ) : (
              'Confirm Delete'
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

