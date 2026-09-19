import React from "react";
import { Wallet, TrendingUp, AlertTriangle, Sparkles, CreditCard, PieChart } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financial Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Welcome back! Here is your AI-powered financial overview and health score summary.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 bg-lime-500 hover:bg-lime-600 text-slate-950 font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm">
          <Sparkles className="w-4 h-4" />
          Ask AI Coach
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-sm">
            <span>Total Income</span>
            <Wallet className="w-5 h-5 text-lime-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">$8,450.00</div>
          <span className="inline-block text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            +12.4% from last month
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-sm">
            <span>Monthly Expenses</span>
            <CreditCard className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">$3,240.50</div>
          <span className="inline-block text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            68% of monthly budget used
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-sm">
            <span>Financial Health Score</span>
            <TrendingUp className="w-5 h-5 text-lime-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">82</span>
            <span className="text-sm font-semibold text-slate-400">/ 100</span>
          </div>
          <span className="inline-block text-xs font-medium text-lime-700 bg-lime-50 px-2 py-0.5 rounded-full">
            Excellent • Low Debt Risk
          </span>
        </div>
      </div>

      {/* Subscriptions & AI Insight Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Subscription Leaks Detected
            </h2>
            <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              2 Unused Leaks
            </span>
          </div>
          <p className="text-xs text-slate-500">
            FinPilot detected 2 recurring subscriptions with low activity over the last 60 days.
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm">
              <div>
                <div className="font-semibold text-slate-800">StreamMax HD</div>
                <div className="text-xs text-slate-500">Renews Oct 02 • $17.99/mo</div>
              </div>
              <button className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg transition-colors">
                Cancel Leak
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm">
              <div>
                <div className="font-semibold text-slate-800">GymPass Pro</div>
                <div className="text-xs text-slate-500">Renews Sep 28 • $45.00/mo</div>
              </div>
              <button className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg transition-colors">
                Cancel Leak
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-lime-600" />
              Budget Goal Progress
            </h2>
            <span className="text-xs font-semibold text-slate-500">September 2026</span>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Dining & Entertainment</span>
                <span>$450 / $600</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-lime-500 h-full rounded-full" style={{ width: "75%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Groceries & Supplies</span>
                <span>$680 / $800</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "85%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Utilities & Transport</span>
                <span>$310 / $350</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: "88%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
