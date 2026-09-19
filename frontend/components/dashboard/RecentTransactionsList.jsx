"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownLeft, Receipt, ChevronRight } from "lucide-react";

export default function RecentTransactionsList({ transactions = [] }) {
  const displayItems = Array.isArray(transactions) ? transactions.slice(0, 5) : [];

  return (
    <div className="bg-slate-950/70 rounded-2xl p-6 shadow-xl border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all duration-300 flex flex-col justify-between space-y-4 text-white">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Recent Transactions
        </h2>
        <Link
          href="/transactions"
          className="text-xs font-bold text-slate-300 hover:text-accent transition-colors flex items-center gap-0.5"
        >
          View All <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {!displayItems || displayItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
            <Receipt className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-300">
            No transactions yet — add your first one
          </p>
          <Link
            href="/transactions"
            className="text-xs font-bold bg-gradient-to-r from-rose-500 to-amber-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-all shadow-md"
          >
            Go to Transactions
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
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
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isIncome
                        ? "bg-accent/20 text-accent border border-accent/30"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    }`}
                  >
                    {isIncome ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">
                      {item.merchant || item.title || "Transaction"}
                    </div>
                    <div className="text-xs text-slate-400">
                      {item.category || "General"} • {item.date || "Today"}
                    </div>
                  </div>
                </div>

                <div
                  className={`font-bold text-sm ${
                    isIncome ? "text-accent" : "text-rose-400"
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
