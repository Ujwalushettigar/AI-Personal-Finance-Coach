"use client";

import React from "react";
import Link from "next/link";
import { CreditCard, ChevronRight } from "lucide-react";

export default function ActiveSubscriptionsList({ subscriptions = [] }) {
  const displayItems = Array.isArray(subscriptions) ? subscriptions : [];

  return (
    <div className="bg-slate-950/70 rounded-2xl p-6 shadow-xl border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all duration-300 flex flex-col justify-between space-y-4 text-white">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Active Subscriptions
        </h2>
        <Link
          href="/subscriptions"
          className="text-xs font-bold text-slate-300 hover:text-accent transition-colors flex items-center gap-0.5"
        >
          Manage <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {!displayItems || displayItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
            <CreditCard className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-300">
            No active subscriptions detected
          </p>
          <Link
            href="/subscriptions"
            className="text-xs font-bold bg-gradient-to-r from-rose-500 to-amber-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-all shadow-md"
          >
            Check Subscription Leaks
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {displayItems.map((item, idx) => {
            const formattedAmount = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(item.amount || 0);

            return (
              <div
                key={item.id || idx}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {item.name ? item.name.charAt(0).toUpperCase() : "S"}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">
                      {item.name || "Subscription"}
                    </div>
                    <div className="text-xs text-slate-400">
                      {item.billingCycle || "Monthly"} • {item.nextBilling || "Active"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">
                    {formattedAmount}
                  </span>
                  {item.isLeak && (
                    <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
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
