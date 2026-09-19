"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownLeft, Receipt, ChevronRight } from "lucide-react";
import GlassCard from "../common/GlassCard";

/**
 * RecentTransactionsList (CryptoVault Fintech Theme)
 * - #0F1633 card surface with border-white/10
 * - Individual transaction rows rendered as #0B1029 surface tiles with hover lift
 * - Icon tiles in green (#22D36A) for income and red (#FF4D6A) for expense
 * - High-contrast text with Space Grotesk font accents
 */
export default function RecentTransactionsList({ transactions = [] }) {
  const displayItems = Array.isArray(transactions) ? transactions.slice(0, 5) : [];

  return (
    <div className="bg-[#0F1633] rounded-2xl p-6 shadow-xl border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between space-y-4 text-white font-['DM_Sans',sans-serif]">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-[#8A93B5] uppercase tracking-wider font-['Space_Grotesk',sans-serif]">
          Recent Transactions
        </h2>
        <Link
          href="/transactions"
          className="text-xs font-bold text-[#8A93B5] hover:text-[#39FF14] transition-colors flex items-center gap-0.5"
        >
          View All <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {!displayItems || displayItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-3 bg-[#0B1029] rounded-xl border border-white/5 p-6">
          <div className="w-12 h-12 rounded-xl bg-[#161F48] border border-white/10 flex items-center justify-center text-[#8A93B5]">
            <Receipt className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-white">
            No transactions yet — add your first one
          </p>
          <Link
            href="/transactions"
            className="text-xs font-bold bg-[#39FF14] hover:bg-[#32e012] text-[#0A0E27] px-4 py-2 rounded-xl transition-all shadow-[0_0_16px_rgba(57,255,20,0.25)] font-['Space_Grotesk',sans-serif]"
          >
            Go to Transactions
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {displayItems.map((item, idx) => {
            const isIncome = item.type === "income" || item.amount > 0;
            const amountVal = Math.abs(item.amount || 0);
            const formattedAmount = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(amountVal);

            return (
              <div
                key={item.id || idx}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#0B1029] hover:bg-[#161F48] border border-white/5 hover:border-white/15 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${isIncome
                        ? "bg-[#22D36A]/15 text-[#22D36A] border border-[#22D36A]/30"
                        : "bg-[#FF4D6A]/15 text-[#FF4D6A] border border-[#FF4D6A]/30"
                      }`}
                  >
                    {isIncome ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-text-primary">
                      {item.merchant || item.title || "Transaction"}
                    </div>
                    <div className="text-xs text-[#8A93B5]">
                      {item.category || "General"} • {item.date || "Today"}
                    </div>
                  </div>
                </div>

                <div
                  className={`font-bold text-sm font-['Space_Grotesk',sans-serif] ${isIncome ? "text-[#22D36A]" : "text-[#FF4D6A]"
                    }`}
                >
                  {isIncome ? "+" : "-"}{formattedAmount}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

