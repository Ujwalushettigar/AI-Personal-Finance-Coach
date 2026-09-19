'use client';

import React from 'react';

/**
 * Health Score Card Component
 * Displays deterministic Financial Health Score (0-100), grade badge, sub-factors breakdown, and explainable recommendations
 */
export default function HealthScoreCard({ healthData }) {
  if (!healthData) return null;

  const { score = 0, grade = 'N/A', factors = {}, recommendations = [] } = healthData;

  const getScoreColor = (val) => {
    if (val >= 85) return { stroke: '#10b981', text: 'text-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' };
    if (val >= 70) return { stroke: '#22c55e', text: 'text-green-400', badge: 'bg-green-500/10 border-green-500/30 text-green-400' };
    if (val >= 50) return { stroke: '#f59e0b', text: 'text-amber-400', badge: 'bg-amber-500/10 border-amber-500/30 text-amber-400' };
    return { stroke: '#f43f5e', text: 'text-rose-400', badge: 'bg-rose-500/10 border-rose-500/30 text-rose-400' };
  };

  const theme = getScoreColor(score);
  const strokeDashoffset = 283 - (283 * score) / 100;

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl text-slate-100">
      <div className="flex flex-col md:flex-row items-center gap-8">
        
        {/* Score Gauge Circle */}
        <div className="relative flex items-center justify-center flex-shrink-0">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="45"
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-800"
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r="45"
              stroke={theme.stroke}
              strokeWidth="10"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className={`text-3xl font-extrabold tracking-tight ${theme.text}`}>{score}</span>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Out of 100</span>
          </div>
        </div>

        {/* Score Information & Factors Breakdown */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Financial Health Score</h2>
              <p className="text-xs text-slate-400">Deterministic metric calculated from budget adherence & savings progress</p>
            </div>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${theme.badge}`}>
              {grade}
            </span>
          </div>

          {/* Factors Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[11px] text-slate-400">Budget Adherence</div>
              <div className="text-base font-bold text-white mt-0.5">
                {factors.budgetAdherence?.points || 0}<span className="text-xs text-slate-500">/35</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[11px] text-slate-400">Savings Progress</div>
              <div className="text-base font-bold text-white mt-0.5">
                {factors.savingsProgress?.points || 0}<span className="text-xs text-slate-500">/35</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[11px] text-slate-400">Spending Ratio</div>
              <div className="text-base font-bold text-white mt-0.5">
                {factors.spendingRatio?.points || 0}<span className="text-xs text-slate-500">/20</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[11px] text-slate-400">Discipline</div>
              <div className="text-base font-bold text-white mt-0.5">
                {factors.discipline?.points || 0}<span className="text-xs text-slate-500">/10</span>
              </div>
            </div>
          </div>

          {/* Actionable Recommendations */}
          {recommendations.length > 0 && (
            <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-xs space-y-1">
              <div className="font-semibold text-indigo-300">💡 Smart Takeaway & Action Plan:</div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                {recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
