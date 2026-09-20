"use client";

import React from "react";
import Link from "next/link";
import { CreditCard, ChevronRight } from "lucide-react";

/**
 * ActiveSubscriptionsList (CryptoVault Fintech Theme)
 * - #0F1633 card surface with border-white/10
 * - Subscription items as #0B1029 surface tiles with hover lift
 * - Icon avatar tiles using #161F48 surface with blue (#0A84FF) accent
 * - "Unused Leak" pill styled with red accent (#FF4D6A)
 */
export default function ActiveSubscriptionsList({ subscriptions = [] }) {
  const displayItems = Array.isArray(subscriptions) ? subscriptions : [];

  return (
    <div className="bg-[#0F1633] rounded-2xl p-6 shadow-xl border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-start space-y-4 text-white">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-[#8A93B5] uppercase tracking-wider">
          Active Subscriptions
        </h2>
        <Link
          href="/subscriptions"
          className="text-xs font-bold text-[#8A93B5] hover:text-[#0A84FF] transition-colors flex items-center gap-0.5"
        >
          Manage <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {!displayItems || displayItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-3 bg-[#0B1029] rounded-xl border border-white/5 p-6">
          <div className="w-12 h-12 rounded-xl bg-[#161F48] border border-white/10 flex items-center justify-center text-[#8A93B5]">
            <CreditCard className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-white">
            No active subscriptions detected
          </p>
          <Link
            href="/subscriptions"
            className="text-xs font-bold bg-[#0A84FF] hover:bg-[#0077e6] text-white px-4 py-2 rounded-xl transition-all shadow-[0_0_16px_rgba(10,132,255,0.3)]"
          >
            Check Subscription Leaks
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {displayItems.map((item, idx) => {
            const formattedAmount = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(item.amount || item.monthly_cost || item.monthlyCost || 0);

            const merchantName = item.merchant || item.name || "Subscription";

            return (
              <div
                key={item.id || idx}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#0B1029] hover:bg-[#161F48] border border-white/5 hover:border-white/15 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#161F48] text-[#0A84FF] border border-[#0A84FF]/30 flex items-center justify-center font-bold text-xs shadow-sm">
                    {merchantName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">
                      {merchantName}
                    </div>
                    <div className="text-xs text-[#8A93B5] capitalize">
                      {item.cadence || item.billingCycle || "Monthly"} • {item.next_expected_payment || item.nextBilling || "Active"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">
                    {formattedAmount}
                  </span>
                  {(item.rarely_used || item.isLeak) && (
                    <span className="text-[10px] font-bold bg-[#FF4D6A]/15 text-[#FF4D6A] px-2 py-0.5 rounded-full border border-[#FF4D6A]/30">
                      Unused Leak
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
