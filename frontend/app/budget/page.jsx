'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { budgetApi } from '../../services/api/budget';
import BudgetOverview from '../../components/budget-goals/BudgetOverview';
import BudgetCard from '../../components/budget-goals/BudgetCard';
import BudgetFormModal from '../../components/budget-goals/BudgetFormModal';
import DeleteConfirmModal from '../../components/budget-goals/DeleteConfirmModal';
import BudgetSkeleton from '../../components/budget-goals/BudgetSkeleton';
import HealthScoreDashboard from '../../components/health-score/HealthScoreDashboard';
import HealthScoreSkeleton from '../../components/health-score/HealthScoreSkeleton';

export default function BudgetPage() {
  // Navigation Tabs: 'BUDGETS' | 'HEALTH_SCORE'
  const [activeTab, setActiveTab] = useState('BUDGETS');

  // Budget Data State
  const [budgetsData, setBudgetsData] = useState({ summary: {}, budgets: [] });
  const [loadingBudgets, setLoadingBudgets] = useState(true);
  const [budgetError, setBudgetError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Health Score State (Directly sourced from backend healthScoreEngine)
  const [healthScoreData, setHealthScoreData] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [healthError, setHealthError] = useState(null);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fallback data for seamless offline/standalone demo experience
  const fallbackBudgetsData = {
    summary: {
      totalLimit: 2850,
      totalSpent: 2275,
      totalRemaining: 575,
      overallPercentageUsed: 79.8,
      overallStatus: 'WARNING',
      categoryCount: 5
    },
    budgets: [
      { id: 'b-1', category: 'Housing & Rent', amountLimit: 1500, spent: 1200, remaining: 300, percentageUsed: 80, status: 'WARNING', period: 'monthly' },
      { id: 'b-2', category: 'Groceries & Food', amountLimit: 600, spent: 450, remaining: 150, percentageUsed: 75, status: 'WARNING', period: 'monthly' },
      { id: 'b-3', category: 'Entertainment & Dining', amountLimit: 300, spent: 285, remaining: 15, percentageUsed: 95, status: 'CRITICAL', period: 'monthly' },
      { id: 'b-4', category: 'Transportation', amountLimit: 200, spent: 230, remaining: 0, percentageUsed: 115, status: 'EXCEEDED', period: 'monthly' },
      { id: 'b-5', category: 'Shopping & Apparel', amountLimit: 250, spent: 110, remaining: 140, percentageUsed: 44, status: 'NORMAL', period: 'monthly' }
    ]
  };

  const fallbackHealthData = {
    score: 78,
    grade: 'Good',
    breakdown: {
      savings: 26,
      budget: 22,
      spending: 15,
      goals: 15
    },
    strengths: [
      "Healthy savings rate of 21.4%, meeting the 50/30/20 standard.",
      "Steady, predictable spending distribution across standard categories."
    ],
    warnings: [
      "1 category budget exceeded: Transportation.",
      "Entertainment & Dining is approaching limit (95% used)."
    ],
    recommendations: [
      "Pause discretionary spend in Transportation until next cycle.",
      "Review recurring dining expenditures to boost your monthly savings buffer."
    ]
  };

  // Fetch budgets from backend API
  const fetchBudgets = useCallback(async () => {
    setLoadingBudgets(true);
    setBudgetError(null);
    try {
      const response = await budgetApi.getBudgets();
      if (response && response.data) {
        setBudgetsData(response.data);
      } else {
        setBudgetsData(fallbackBudgetsData);
      }
    } catch (err) {
      console.warn('Budget API unavailable, using local fallback state:', err.message);
      setBudgetsData(fallbackBudgetsData);
    } finally {
      setLoadingBudgets(false);
    }
  }, []);

  // Fetch deterministic health score from backend API
  const fetchHealthScore = useCallback(async () => {
    setLoadingHealth(true);
    setHealthError(null);
    try {
      const response = await budgetApi.getHealthScore();
      if (response && response.data) {
        setHealthScoreData(response.data);
      } else {
        setHealthScoreData(fallbackHealthData);
      }
    } catch (err) {
      console.warn('Health Score API unavailable, using fallback state:', err.message);
      setHealthScoreData(fallbackHealthData);
    } finally {
      setLoadingHealth(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
    fetchHealthScore();
  }, [fetchBudgets, fetchHealthScore]);

  // Create or Update Budget Handler
  const handleSaveBudget = async (formData) => {
    try {
      if (editingBudget) {
        await budgetApi.updateBudget(editingBudget.id, formData);
      } else {
        await budgetApi.createBudget(formData);
      }
      await fetchBudgets();
      await fetchHealthScore();
    } catch (err) {
      if (editingBudget) {
        setBudgetsData(prev => {
          const updated = prev.budgets.map(b => b.id === editingBudget.id ? {
            ...b,
            ...formData,
            percentageUsed: Number(((formData.spent / formData.amountLimit) * 100).toFixed(1)),
            remaining: Math.max(0, formData.amountLimit - formData.spent),
            status: (formData.spent / formData.amountLimit) > 1 ? 'EXCEEDED' : (formData.spent / formData.amountLimit) >= 0.9 ? 'CRITICAL' : (formData.spent / formData.amountLimit) >= 0.7 ? 'WARNING' : 'NORMAL'
          } : b);
          return { ...prev, budgets: updated };
        });
      } else {
        const newBudget = {
          id: `b-${Date.now()}`,
          ...formData,
          percentageUsed: Number(((formData.spent / formData.amountLimit) * 100).toFixed(1)),
          remaining: Math.max(0, formData.amountLimit - formData.spent),
          status: (formData.spent / formData.amountLimit) > 1 ? 'EXCEEDED' : (formData.spent / formData.amountLimit) >= 0.9 ? 'CRITICAL' : (formData.spent / formData.amountLimit) >= 0.7 ? 'WARNING' : 'NORMAL',
          period: 'monthly'
        };
        setBudgetsData(prev => ({
          ...prev,
          budgets: [...prev.budgets, newBudget]
        }));
      }
    }
  };

  // Delete Budget Confirmation Flow
  const handleDeleteClick = (budget) => {
    setBudgetToDelete(budget);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!budgetToDelete) return;
    setIsDeleting(true);
    try {
      await budgetApi.deleteBudget(budgetToDelete.id);
      await fetchBudgets();
      await fetchHealthScore();
    } catch (err) {
      setBudgetsData(prev => ({
        ...prev,
        budgets: prev.budgets.filter(b => b.id !== budgetToDelete.id)
      }));
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setBudgetToDelete(null);
    }
  };

  // Filter category budgets by status
  const filteredBudgets = (budgetsData.budgets || []).filter(b => {
    if (filterStatus === 'ALL') return true;
    return b.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-[#0a0b10] text-slate-100 p-4 sm:p-8 space-y-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Top Control Bar: Title & Tab Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.06] pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Financial Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Deterministic health scoring & category budget tracking
            </p>
          </div>

          {/* Fintech View Toggle Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#12131b] border border-white/[0.08] text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('BUDGETS')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'BUDGETS'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_16px_rgba(37,99,235,0.4)] font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Category Budgets
            </button>

            <button
              onClick={() => setActiveTab('HEALTH_SCORE')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'HEALTH_SCORE'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_16px_rgba(37,99,235,0.4)] font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Health Score</span>
              {healthScoreData && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/[0.1] text-[10px] text-blue-300">
                  {healthScoreData.score}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: CATEGORY BUDGETS DASHBOARD                             */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'BUDGETS' && (
          <div className="space-y-8 animate-fadeIn">
            {/* 1. Budget Overview Section */}
            <BudgetOverview
              summary={budgetsData.summary || {}}
              onCreateBudget={() => {
                setEditingBudget(null);
                setIsFormModalOpen(true);
              }}
            />

            {/* Error State Banner */}
            {budgetError && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-rose-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{budgetError}</span>
                </div>
                <button
                  onClick={fetchBudgets}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* 2. Category Budgets Header & Filter Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Category Budgets</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live spending tracking across defined expense caps
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#12131b] border border-white/[0.06] text-xs font-medium self-start sm:self-auto overflow-x-auto max-w-full">
                {['ALL', 'NORMAL', 'WARNING', 'CRITICAL', 'EXCEEDED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-lg transition-all text-xs ${
                      filterStatus === st
                        ? 'bg-blue-600 text-white font-semibold shadow-[0_0_12px_rgba(37,99,235,0.4)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Category Budgets Grid / Loading / Empty State */}
            {loadingBudgets ? (
              <BudgetSkeleton />
            ) : filteredBudgets.length === 0 ? (
              <div className="py-16 px-6 text-center rounded-3xl bg-[#12131b] border border-white/[0.06] flex flex-col items-center justify-center max-w-lg mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {filterStatus === 'ALL' ? 'No budgets yet' : `No ${filterStatus.toLowerCase()} budgets`}
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
                  {filterStatus === 'ALL'
                    ? 'Create your first category budget to start tracking your spending.'
                    : `There are currently no categories matching the ${filterStatus} threshold.`}
                </p>
                {filterStatus === 'ALL' ? (
                  <button
                    onClick={() => {
                      setEditingBudget(null);
                      setIsFormModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-[0_0_18px_rgba(37,99,235,0.4)] transition"
                  >
                    + Create Budget
                  </button>
                ) : (
                  <button
                    onClick={() => setFilterStatus('ALL')}
                    className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-medium transition"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBudgets.map(budget => (
                  <BudgetCard
                    key={budget.id}
                    budget={budget}
                    onEdit={(b) => {
                      setEditingBudget(b);
                      setIsFormModalOpen(true);
                    }}
                    onDeleteClick={handleDeleteClick}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: FINANCIAL HEALTH SCORE DASHBOARD                       */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'HEALTH_SCORE' && (
          <div className="space-y-6 animate-fadeIn">
            {loadingHealth ? (
              <HealthScoreSkeleton />
            ) : (
              <HealthScoreDashboard
                healthData={healthScoreData}
                loading={loadingHealth}
                error={healthError}
                onRetry={fetchHealthScore}
              />
            )}
          </div>
        )}

      </div>

      {/* Create / Edit Budget Modal */}
      <BudgetFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingBudget(null);
        }}
        onSubmit={handleSaveBudget}
        initialData={editingBudget}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setBudgetToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        budgetCategory={budgetToDelete?.category}
        isDeleting={isDeleting}
      />
    </div>
  );
}
