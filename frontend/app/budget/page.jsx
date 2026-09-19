'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { budgetApi } from '../../services/api/budget';
import BudgetOverview from '../../components/budget-goals/BudgetOverview';
import BudgetCard from '../../components/budget-goals/BudgetCard';
import BudgetFormModal from '../../components/budget-goals/BudgetFormModal';
import DeleteConfirmModal from '../../components/budget-goals/DeleteConfirmModal';
import BudgetSkeleton from '../../components/budget-goals/BudgetSkeleton';
import GoalCard from '../../components/budget-goals/GoalCard';
import GoalFormModal from '../../components/budget-goals/GoalFormModal';
import HealthScoreDashboard from '../../components/health-score/HealthScoreDashboard';
import HealthScoreSkeleton from '../../components/health-score/HealthScoreSkeleton';
import { Card, BadgePill, PrimaryButton } from '../../components/budget-goals/ThemeCard';

/**
 * Budget & Financial Health Page (CryptoVault Fintech Theme)
 * --bg-base: #0A0E27 (Very dark navy background)
 * --bg-card: #0F1633
 * --border-subtle: rgba(255,255,255,0.06)
 * --text-primary: #FFFFFF
 * --text-muted: #8A93B5
 * --blue: #0A84FF
 * --green-neon: #39FF14
 */
export default function BudgetPage() {
  // Navigation Tabs: 'BUDGETS' | 'GOALS' | 'HEALTH_SCORE'
  const [activeTab, setActiveTab] = useState('BUDGETS');

  // Budget Data State
  const [budgetsData, setBudgetsData] = useState({ summary: {}, budgets: [] });
  const [loadingBudgets, setLoadingBudgets] = useState(true);
  const [budgetError, setBudgetError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Savings Goals Data State
  const [goalsData, setGoalsData] = useState([]);
  const [loadingGoals, setLoadingGoals] = useState(true);

  // Health Score State (Directly sourced from backend healthScoreEngine)
  const [healthScoreData, setHealthScoreData] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [healthError, setHealthError] = useState(null);

  // Budget Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Goal Modals state
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalModalMode, setGoalModalMode] = useState('create');

  // Fallback budget data for seamless offline/standalone demo experience
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

  // Fallback savings goals
  const fallbackGoalsData = [
    { id: 'g-1', title: 'Emergency Reserve', targetAmount: 10000, currentAmount: 6800, remainingAmount: 3200, progressPercentage: 68, targetDate: '2026-12-31', requiredMonthlyContribution: 800, category: 'Safety' },
    { id: 'g-2', title: 'Cold Storage Vault', targetAmount: 500, currentAmount: 500, remainingAmount: 0, progressPercentage: 100, targetDate: '2026-08-15', requiredMonthlyContribution: 0, category: 'Security' },
    { id: 'g-3', title: 'Tax Reserve 2027', targetAmount: 4000, currentAmount: 2200, remainingAmount: 1800, progressPercentage: 55, targetDate: '2027-03-31', requiredMonthlyContribution: 300, category: 'Tax' }
  ];

  // Fallback health evaluation
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
      "Healthy savings rate of 21.4%, exceeding baseline reserve requirements.",
      "Predictable, low-volatility spending distribution across standard categories."
    ],
    warnings: [
      "1 category allocation exceeded: Transportation.",
      "Entertainment & Dining is approaching ceiling (95% used)."
    ],
    recommendations: [
      "Pause discretionary spend in Transportation until next cycle.",
      "Audit recurring dining debits to expand your monthly reserve buffer."
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

  // Fetch savings goals
  const fetchGoals = useCallback(async () => {
    setLoadingGoals(true);
    try {
      const response = await budgetApi.getGoals();
      if (response && response.data) {
        setGoalsData(response.data);
      } else {
        setGoalsData(fallbackGoalsData);
      }
    } catch (err) {
      setGoalsData(fallbackGoalsData);
    } finally {
      setLoadingGoals(false);
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
    fetchGoals();
    fetchHealthScore();
  }, [fetchBudgets, fetchGoals, fetchHealthScore]);

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

  // Savings Goal Handlers
  const handleSaveGoal = async (goalFormData) => {
    try {
      if (editingGoal) {
        await budgetApi.updateGoal(editingGoal.id, goalFormData);
      } else {
        await budgetApi.createGoal(goalFormData);
      }
      await fetchGoals();
      await fetchHealthScore();
    } catch (err) {
      if (editingGoal) {
        setGoalsData(prev => prev.map(g => g.id === editingGoal.id ? {
          ...g,
          ...goalFormData,
          remainingAmount: Math.max(0, goalFormData.targetAmount - goalFormData.currentAmount),
          progressPercentage: Math.round((goalFormData.currentAmount / goalFormData.targetAmount) * 100)
        } : g));
      } else {
        const newGoal = {
          id: `g-${Date.now()}`,
          ...goalFormData,
          remainingAmount: Math.max(0, goalFormData.targetAmount - goalFormData.currentAmount),
          progressPercentage: Math.round((goalFormData.currentAmount / goalFormData.targetAmount) * 100),
          requiredMonthlyContribution: Math.round(goalFormData.targetAmount / 6)
        };
        setGoalsData(prev => [...prev, newGoal]);
      }
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await budgetApi.deleteGoal(goalId);
      await fetchGoals();
      await fetchHealthScore();
    } catch (err) {
      setGoalsData(prev => prev.filter(g => g.id !== goalId));
    }
  };

  const handleAddFunds = (goal) => {
    setEditingGoal(goal);
    setGoalModalMode('addFunds');
    setIsGoalModalOpen(true);
  };

  // Filter category budgets by status
  const filteredBudgets = (budgetsData.budgets || []).filter(b => {
    if (filterStatus === 'ALL') return true;
    return b.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white p-4 sm:p-8 space-y-10 antialiased">
      <div className="max-w-[1216px] mx-auto space-y-10">

        {/* ------------------------------------------------------------- */}
        {/* TOP CONTROL BAR: TITLE & TAB SWITCHER                         */}
        {/* ------------------------------------------------------------- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div>
            <BadgePill icon="⚡" text="Asset Telemetry & Reserve Management" className="mb-2" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Financial Control Center
            </h1>
            <p className="text-xs sm:text-sm text-[#8A93B5] mt-1 font-normal">
              Live budget allocations, milestone reserves, and deterministic scoring.
            </p>
          </div>

          {/* CryptoVault Styled Tab Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-[12px] bg-[#0F1633] border border-white/[0.08] text-xs font-semibold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('BUDGETS')}
              className={`px-4 py-2 rounded-[10px] transition-all duration-150 ${activeTab === 'BUDGETS'
                  ? 'bg-[#0A84FF] text-white shadow-[0_0_16px_rgba(10,132,255,0.4)] font-bold'
                  : 'text-[#8A93B5] hover:text-white'
                }`}
            >
              Category Budgets
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('GOALS')}
              className={`px-4 py-2 rounded-[10px] transition-all duration-150 flex items-center gap-1.5 ${activeTab === 'GOALS'
                  ? 'bg-[#0A84FF] text-white shadow-[0_0_16px_rgba(10,132,255,0.4)] font-bold'
                  : 'text-[#8A93B5] hover:text-white'
                }`}
            >
              <span>Savings Goals</span>
              {goalsData.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/[0.1] text-[10px] text-white">
                  {goalsData.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('HEALTH_SCORE')}
              className={`px-4 py-2 rounded-[10px] transition-all duration-150 flex items-center gap-1.5 ${activeTab === 'HEALTH_SCORE'
                  ? 'bg-[#0A84FF] text-white shadow-[0_0_16px_rgba(10,132,255,0.4)] font-bold'
                  : 'text-[#8A93B5] hover:text-white'
                }`}
            >
              <span>Health Score</span>
              {healthScoreData && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#39FF14]/[0.15] text-[10px] text-[#39FF14] font-bold">
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
          <div className="space-y-10 animate-fadeIn">
            {/* 1. Stats Panel & Overview Header */}
            <BudgetOverview
              summary={budgetsData.summary || {}}
              onCreateBudget={() => {
                setEditingBudget(null);
                setIsFormModalOpen(true);
              }}
            />

            {/* Error State Banner */}
            {budgetError && (
              <div className="p-4 rounded-[12px] bg-[#FF4D6A]/[0.10] border border-[#FF4D6A]/30 text-[#FF4D6A] flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{budgetError}</span>
                </div>
                <button
                  type="button"
                  onClick={fetchBudgets}
                  className="px-3.5 py-1.5 rounded-[10px] bg-[#FF4D6A] text-white text-xs font-semibold transition hover:brightness-110"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* 2. Category Budgets Header & Filter Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-white/[0.06]">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Allocated Categories
                </h2>
                <p className="text-xs sm:text-sm text-[#8A93B5] mt-0.5">
                  Individual spending limits and live reserve thresholds
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-[12px] bg-[#0F1633] border border-white/[0.06] text-xs font-medium self-start sm:self-auto overflow-x-auto max-w-full">
                {['ALL', 'NORMAL', 'WARNING', 'CRITICAL', 'EXCEEDED'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-[10px] transition-all duration-150 text-xs ${filterStatus === st
                        ? 'bg-[#0A84FF] text-white font-semibold shadow-[0_0_12px_rgba(10,132,255,0.4)]'
                        : 'text-[#8A93B5] hover:text-white hover:bg-white/[0.04]'
                      }`}
                  >
                    {st === 'NORMAL' ? 'SAFE' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Category Budgets Grid / Loading / Empty State */}
            {loadingBudgets ? (
              <BudgetSkeleton />
            ) : filteredBudgets.length === 0 ? (
              <Card hover={false} className="py-16 px-6 text-center flex flex-col items-center justify-center max-w-md mx-auto">
                <div className="w-14 h-14 rounded-[12px] bg-[#0A84FF]/[0.12] border border-[#0A84FF]/30 text-[#0A84FF] flex items-center justify-center mb-4">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {filterStatus === 'ALL' ? 'No Budgets Configured' : `No ${filterStatus.toLowerCase()} budgets`}
                </h3>
                <p className="text-xs text-[#8A93B5] max-w-sm mb-6 leading-relaxed">
                  {filterStatus === 'ALL'
                    ? 'Define your first category ceiling to establish spending guardrails.'
                    : `Zero categories currently match the ${filterStatus} threshold.`}
                </p>
                {filterStatus === 'ALL' ? (
                  <PrimaryButton
                    onClick={() => {
                      setEditingBudget(null);
                      setIsFormModalOpen(true);
                    }}
                  >
                    + Create Budget
                  </PrimaryButton>
                ) : (
                  <button
                    type="button"
                    onClick={() => setFilterStatus('ALL')}
                    className="px-4 py-2 rounded-[12px] bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-medium transition"
                  >
                    Reset Filter
                  </button>
                )}
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        {/* TAB 2: SAVINGS GOALS DASHBOARD                                */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'GOALS' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <BadgePill icon="🎯" text="Reserve Target Milestones" className="mb-2" />
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Savings <span className="bg-gradient-to-r from-[#0A84FF] via-[#22D36A] to-[#39FF14] bg-clip-text text-transparent">Goals</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#8A93B5] mt-1">
                  Track progress towards dedicated capital milestones and long-term targets.
                </p>
              </div>

              <PrimaryButton
                onClick={() => {
                  setEditingGoal(null);
                  setGoalModalMode('create');
                  setIsGoalModalOpen(true);
                }}
              >
                + New Goal
              </PrimaryButton>
            </div>

            {/* Goals Grid */}
            {loadingGoals ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map(idx => (
                  <div key={idx} className="p-6 rounded-[16px] bg-[#0F1633] border border-white/[0.06] h-60" />
                ))}
              </div>
            ) : goalsData.length === 0 ? (
              <Card hover={false} className="py-16 px-6 text-center flex flex-col items-center justify-center max-w-md mx-auto">
                <div className="w-14 h-14 rounded-[12px] bg-[#0A84FF]/[0.12] border border-[#0A84FF]/30 text-[#0A84FF] flex items-center justify-center mb-4">
                  🎯
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  No Savings Goals Yet
                </h3>
                <p className="text-xs text-[#8A93B5] mb-6">
                  Create your first milestone target to begin tracking reserve accumulation.
                </p>
                <PrimaryButton
                  onClick={() => {
                    setEditingGoal(null);
                    setGoalModalMode('create');
                    setIsGoalModalOpen(true);
                  }}
                >
                  + Create First Goal
                </PrimaryButton>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goalsData.map(goal => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onEdit={(g) => {
                      setEditingGoal(g);
                      setGoalModalMode('edit');
                      setIsGoalModalOpen(true);
                    }}
                    onDelete={handleDeleteGoal}
                    onAddFunds={handleAddFunds}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: FINANCIAL HEALTH SCORE DASHBOARD                       */}
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

      {/* Savings Goal Modal (Create / Edit / Add Funds) */}
      <GoalFormModal
        isOpen={isGoalModalOpen}
        onClose={() => {
          setIsGoalModalOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={handleSaveGoal}
        initialData={editingGoal}
        mode={goalModalMode}
      />
    </div>
  );
}

