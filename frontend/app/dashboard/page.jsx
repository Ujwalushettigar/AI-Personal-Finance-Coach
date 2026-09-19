"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { getDashboardSummary } from "../../services/api/dashboard";
import StatCard from "../../components/dashboard/StatCard";
import HealthScoreGauge from "../../components/dashboard/HealthScoreGauge";
import RecentTransactionsList from "../../components/dashboard/RecentTransactionsList";
import ActiveSubscriptionsList from "../../components/dashboard/ActiveSubscriptionsList";
import GlassCard from "../../components/common/GlassCard";
import { Sparkles, Calendar, Zap } from "lucide-react";

/**
 * Dashboard Overview Page (CryptoVault Fintech Theme)
 * - Deep navy background #0A0E27
 * - Header banner card #0F1633 with border-white/10
 * - Signature badge pill "FinPilot AI Overview" in blue/green styling
 * - Ask AI Coach CTA with neon green hover glow
 * - Quick summary leak notification tile with blue #0A84FF accent button
 * - Preserved 100% of auth, data fetching, loading state, & router navigation
 */
export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [summaryData, setSummaryData] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace("/login");
            return;
        }

        if (user) {
            const fetchSummary = async () => {
                try {
                    const data = await getDashboardSummary();
                    setSummaryData(data);
                } catch (error) {
                    console.error("Failed to fetch dashboard summary:", error);
                } finally {
                    setDataLoading(false);
                }
            };

            fetchSummary();
        }
    }, [user, authLoading, router]);

    if (authLoading || dataLoading) {
        return (
            <div className="min-h-screen bg-[#0A0E27] p-6 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-white/10 border-t-[#39FF14] rounded-full animate-spin"></div>
                    <p className="text-sm font-semibold text-[#8A93B5]">
                        Loading your financial telemetry...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0E27] text-white p-4 sm:p-6 md:p-8 space-y-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Top Header Banner */}
                <div className="bg-[#0F1633] rounded-2xl p-6 shadow-xl border border-white/10 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-[#39FF14] bg-[#39FF14]/10 px-2.5 py-0.5 rounded-full border border-[#39FF14]/30">
                                FinPilot AI Overview
                            </span>
                            <span className="text-xs text-[#8A93B5] font-medium flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-[#8A93B5]" />
                                {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Welcome back, {user?.email ? user.email.split("@")[0] : "Pilot"} 👋
                        </h1>
                        <p className="text-sm text-[#8A93B5]">
                            Here is your real-time financial status, health score, and active account telemetry.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push("/coach")}
                            className="inline-flex items-center gap-2 bg-[#39FF14] hover:bg-[#32e012] text-[#0A0E27] font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-[0_0_24px_rgba(57,255,20,0.35)] hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Sparkles className="w-4 h-4 text-[#0A0E27]" />
                            Ask AI Coach
                        </button>
                    </div>
                </div>

                {/* Top Row Grid: Income Stat, Expense Stat & Prominent Health Score Gauge */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <StatCard
                            label="Total Income"
                            value={summaryData?.totalIncome ?? 0}
                            trend={12.4}
                        />
                        <StatCard
                            label="Total Expense"
                            value={summaryData?.totalExpense ?? 0}
                            trend={-3.2}
                        />
                        {/* Quick Summary Leak Detection Pill Card */}
                        <div className="sm:col-span-2 bg-[#0F1633] rounded-2xl p-5 shadow-xl border border-white/10 flex items-center justify-between text-sm hover:border-white/20 transition-all duration-300">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#0A84FF]/15 text-[#0A84FF] border border-[#0A84FF]/30 flex items-center justify-center font-bold">
                                    <Zap className="w-5 h-5 text-[#0A84FF]" />
                                </div>
                                <div>
                                    <div className="font-bold text-white">
                                        Subscription Leak Detection
                                    </div>
                                    <div className="text-xs text-[#8A93B5]">Scanning active recurring payments...</div>
                                </div>
                            </div>
                            <button
                                onClick={() => router.push("/subscriptions")}
                                className="text-xs font-bold text-white bg-[#0B1029] hover:bg-[#161F48] border border-white/10 hover:border-white/20 px-3.5 py-1.5 rounded-xl transition-all"
                            >
                                Inspect Leaks
                            </button>
                        </div>
                    </div>

                    {/* Prominent Health Score Gauge */}
                    <div className="lg:col-span-1">
                        <HealthScoreGauge score={summaryData?.healthScore ?? null} />
                    </div>
                </div>

                {/* Bottom Row Grid: Recent Transactions & Active Subscriptions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RecentTransactionsList
                        transactions={summaryData?.recentTransactions || []}
                    />
                    <ActiveSubscriptionsList
                        subscriptions={summaryData?.activeSubscriptions || []}
                    />
                </div>
            </div>
        </div>
    );
}

