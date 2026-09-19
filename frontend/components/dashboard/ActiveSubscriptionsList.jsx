"use client";

import React from "react";
import Link from "next/link";
import { CreditCard, ChevronRight } from "lucide-react";
import GlassCard from "../common/GlassCard";

export default function ActiveSubscriptionsList({ subscriptions = [] }) {
  const displayItems = Array.isArray(subscriptions) ? subscriptions : [];

  return (
    <GlassCard className="hover:border-accent/30 transition-all duration-300 flex flex-col justify-between space-y-4 text-text-primary">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">
          Active Subscriptions
        </h2>
        <Link
          href="/subscriptions"
          className="text-xs font-bold text-text-muted hover:text-accent transition-colors flex items-center gap-0.5"
        >
          Manage <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {!displayItems || displayItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-border flex items-center justify-center text-text-muted">
            <CreditCard className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-text-primary">
            No active subscriptions detected
          </p>
          <Link
            href="/subscriptions"
            className="text-xs font-bold bg-accent text-[#0A0E1A] px-4 py-2 rounded-xl hover:bg-accent/90 transition-all shadow-md"
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
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-border transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent text-[#0A0E1A] flex items-center justify-center font-extrabold text-xs shadow-sm">
                    {item.name ? item.name.charAt(0).toUpperCase() : "S"}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-text-primary">
                      {item.name || "Subscription"}
                    </div>
                    <div className="text-xs text-text-muted">
                      {item.billingCycle || "Monthly"} • {item.nextBilling || "Active"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-text-primary">
                    {formattedAmount}
                  </span>
                  {item.isLeak && (
                    <span className="text-[10px] font-bold bg-negative/10 text-negative px-2 py-0.5 rounded-full border border-negative/30">
                      Unused Leak
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
