'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { budgetApi } from '../../services/api/budget';
import BudgetOverview from '../../components/budget-goals/BudgetOverview';
import BudgetCard from '../../components/budget-goals/BudgetCard';
import BudgetFormModal from '../../components/budget-goals/BudgetFormModal';
import DeleteConfirmModal from '../../components/budget-goals/DeleteConfirmModal';
import BudgetSkeleton from '../../components/budget-goals/BudgetSkeleton';
import SavingsGoalCard from '../../components/budget-goals/SavingsGoalCard';
import SavingsGoalFormModal from '../../components/budget-goals/SavingsGoalFormModal';
import HealthScoreTab from '../../components/health-score/HealthScoreTab';
import { Card, BadgePill, PrimaryButton } from '../../components/budget-goals/ThemeCard';

/**
 * Budget & Financial Health Page (CryptoVault Fintech Theme)
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
  const [isSavingsGoalModalOpen, setIsSavingsGoalModalOpen] = useState(false);

  // Fetch budgets with real spend & summary from backend API
  const fetchBudgets = useCallback(async () => {
    setLoadingBudgets(true);
    setBudgetError(null);
    try {
      const [budgetsRes, summaryRes] = await Promise.all([
        budgetApi.getBudgetsWithSpend('monthly'),
        budgetApi.getBudgetSummary('monthly'),
      ]);

      const list = Array.isArray(budgetsRes) ? budgetsRes : (budgetsRes?.budgets || budgetsRes?.data || []);
      const summary = summaryRes || {};

      setBudgetsData({
        summary: {
          totalAllocated: Number(summary.totalAllocated || 0),
          currentOutflow: Number(summary.currentOutflow || 0),
          remainingReserve: Number(summary.remainingReserve || 0),
          capUtilization: Number(summary.capUtilization || 0),
          totalLimit: Number(summary.totalAllocated || 0),
          totalSpent: Number(summary.currentOutflow || 0),
          totalRemaining: Number(summary.remainingReserve || 0),
          overallPercentageUsed: Number(((summary.capUtilization || 0) * 100).toFixed(1)),
        },
        budgets: list.map((b) => {
          const amountLimit = Number(b.amount_limit ?? b.amountLimit ?? 0);
          const spent = Number(b.spent ?? 0);
          const remaining = b.remaining !== undefined ? Number(b.remaining) : Math.max(0, amountLimit - spent);
          const utilization = b.utilization !== undefined ? Number(b.utilization) : (amountLimit > 0 ? spent / amountLimit : 0);
          const percentageUsed = Number((utilization * 100).toFixed(1));
          const status = b.status || (spent > amountLimit ? 'exceeded' : utilization >= 0.9 ? 'critical' : utilization >= 0.7 ? 'warning' : 'safe');

          return {
            ...b,
            amountLimit,
            spent,
            remaining,
            utilization,
            percentageUsed,
            status,
            category: b.category,
            period: b.period || 'monthly',
          };
        }),
      });
    } catch (err) {
      console.warn('Budget API error:', err.message);
      setBudgetError(err.message || 'Failed to load budgets');
      setBudgetsData({ summary: { totalAllocated: 0, currentOutflow: 0, remainingReserve: 0, capUtilization: 0 }, budgets: [] });
    } finally {
      setLoadingBudgets(false);
    }
  }, []);

  // Fetch savings goals
  const fetchGoals = useCallback(async () => {
    setLoadingGoals(true);
    try {
      const response = await budgetApi.getSavingsGoals();
      const list = Array.isArray(response) ? response : (response?.goals || response?.data || []);

      setGoalsData(
        list.map((g) => {
          const targetAmount = Number(g.target_amount ?? g.targetAmount ?? 0);
          const currentAmount = Number(g.current_amount ?? g.currentAmount ?? 0);
          const remainingAmount = Math.max(0, targetAmount - currentAmount);
          const progressPercentage = targetAmount > 0 ? Math.round((currentAmount / targetAmount) * 100) : 0;

          return {
            ...g,
            targetAmount,
            currentAmount,
            remainingAmount,
            progressPercentage,
            targetDate: g.target_date ?? g.targetDate,
            title: g.title,
            category: g.category || 'General',
          };
        })
      );
    } catch (err) {
      console.warn('Goals API error:', err.message);
      setGoalsData([]);
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
      setHealthScoreData(response?.data || response || null);
    } catch (err) {
      console.warn('Health Score API error:', err.message);
      setHealthError(err.message);
      setHealthScoreData(null);
    } finally {
      setLoadingHealth(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
    fetchGoals();
    fetchHealthScore();
  }, [fetchBudgets, fetchGoals, fetchHealthScore]);

  useEffect(() => {
    if (activeTab === 'BUDGETS') {
      fetchBudgets();
    } else if (activeTab === 'GOALS') {
      fetchGoals();
    } else if (activeTab === 'HEALTH_SCORE') {
      fetchHealthScore();
    }
  }, [activeTab, fetchBudgets, fetchGoals, fetchHealthScore]);

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
      console.error('Failed to save budget:', err);
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
      console.error('Failed to delete budget:', err);
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
        if (goalModalMode === 'addFunds') {
          const addedAmount = Number(goalFormData.currentAmount || goalFormData.addedAmount || 0);
          await budgetApi.addSavingsProgress(editingGoal.id, addedAmount);
        } else {
          await budgetApi.updateGoal(editingGoal.id, goalFormData);
        }
      } else {
        await budgetApi.createGoal(goalFormData);
      }
      await fetchGoals();
      await fetchHealthScore();
    } catch (err) {
      console.error('Failed to save goal:', err);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await budgetApi.deleteGoal(goalId);
      await fetchGoals();
      await fetchHealthScore();
    } catch (err) {
      console.error('Failed to delete goal:', err);
    }
  };

  const handleAddFunds = (goal) => {
    setEditingGoal(goal);
    setGoalModalMode('addFunds');
    setIsGoalModalOpen(true);
  };

  // Filter category budgets by status
  const filteredBudgets = (budgetsData.budgets || []).filter((b) => {
    if (filterStatus === 'ALL') return true;
    const bStatus = (b.status || '').toLowerCase();
    const filter = filterStatus.toLowerCase();
    if (filter === 'safe' && (bStatus === 'safe' || bStatus === 'normal')) return true;
    return bStatus === filter;
  });

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white p-4 sm:p-8 space-y-10 antialiased">
      <div className="max-w-[1216px] mx-auto space-y-10">

        {/* TOP CONTROL BAR: TITLE & TAB SWITCHER */}
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

        {/* TAB 1: CATEGORY BUDGETS DASHBOARD */}
        {activeTab === 'BUDGETS' && (
          <div className="space-y-10 animate-fadeIn">
            <BudgetOverview
              summary={budgetsData.summary || {}}
              onCreateBudget={() => {
                setEditingBudget(null);
                setIsFormModalOpen(true);
              }}
            />

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

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-white/[0.06]">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Allocated Categories
                </h2>
                <p className="text-xs sm:text-sm text-[#8A93B5] mt-0.5">
                  Individual spending limits and live reserve thresholds
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1 rounded-[12px] bg-[#0F1633] border border-white/[0.06] text-xs font-medium self-start sm:self-auto overflow-x-auto max-w-full">
                {['ALL', 'SAFE', 'WARNING', 'CRITICAL', 'EXCEEDED'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-[10px] transition-all duration-150 text-xs ${filterStatus === st
                        ? 'bg-[#0A84FF] text-white font-semibold shadow-[0_0_12px_rgba(10,132,255,0.4)]'
                        : 'text-[#8A93B5] hover:text-white hover:bg-white/[0.04]'
                      }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

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
                {filteredBudgets.map((budget) => (
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

        {/* TAB 2: SAVINGS GOALS DASHBOARD */}
        {activeTab === 'GOALS' && (
          <div className="space-y-8 animate-fadeIn">
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

              <PrimaryButton onClick={() => setIsSavingsGoalModalOpen(true)}>
                + Create Goal
              </PrimaryButton>
            </div>

            {loadingGoals ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map((idx) => (
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
                  Set your first goal to begin tracking reserve accumulation.
                </p>
                <PrimaryButton onClick={() => setIsSavingsGoalModalOpen(true)}>
                  + Create First Goal
                </PrimaryButton>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goalsData.map((goal) => (
                  <SavingsGoalCard
                    key={goal.id}
                    goal={goal}
                    onUpdate={fetchGoals}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FINANCIAL HEALTH SCORE DASHBOARD */}
        {activeTab === 'HEALTH_SCORE' && (
          <div className="space-y-6 animate-fadeIn">
            <HealthScoreTab />
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

      {/* Savings Goal Creation Modal */}
      <SavingsGoalFormModal
        isOpen={isSavingsGoalModalOpen}
        onClose={() => setIsSavingsGoalModalOpen(false)}
        onSuccess={fetchGoals}
      />
    </div>
  );
}
