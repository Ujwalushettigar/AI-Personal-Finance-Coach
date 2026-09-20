'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TransactionForm from '../../components/transactions/TransactionForm';
import TransactionList from '../../components/transactions/TransactionList';
import TransactionFilters from '../../components/transactions/TransactionFilters';
import { BadgePill, Card } from '../../components/budget-goals/ThemeCard';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
} from '../../services/api/transactions';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showForm, setShowForm] = useState(true);

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: ''
  });

  // Animated count-up hook for KPI numbers
  const useAnimatedNumber = (targetValue, duration = 600) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const end = Math.round(targetValue) || 0;

      if (start === end) {
        setCount(end);
        return;
      }

      const startTime = performance.now();

      const updateNumber = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
        const current = Math.floor(
          start + (end - start) * easeOutQuad
        );

        setCount(current);

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        }
      };

      requestAnimationFrame(updateNumber);
    }, [targetValue, duration]);

    return count;
  };

  // Fetch real transactions from API only
  const loadTransactions = useCallback(
    async (appliedFilters = filters) => {
      setLoading(true);
      setError(null);

      try {
        const res = await getTransactions(appliedFilters);
        const list = Array.isArray(res) ? res : res?.data || [];
        setTransactions(list);
      } catch (err) {
        setError(
          err.message ||
          'Unable to connect to transactions API. Please verify the backend server is running.'
        );
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    loadTransactions(filters);
  }, [filters, loadTransactions]);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Financial aggregates calculation from real transaction data
  const stats = useMemo(() => {
    let income = 0;
    let expenses = 0;

    transactions.forEach((tx) => {
      const val = parseFloat(tx.amount) || 0;

      if (tx.type === 'income') {
        income += val;
      } else {
        expenses += val;
      }
    });

    const balance = income - expenses;
    const savings = balance > 0 ? balance : 0;
    const savingsRate =
      income > 0 ? Math.round((savings / income) * 100) : 0;

    return {
      balance,
      income,
      expenses,
      savings,
      savingsRate
    };
  }, [transactions]);

  const animBalance = useAnimatedNumber(stats.balance);
  const animIncome = useAnimatedNumber(stats.income);
  const animExpenses = useAnimatedNumber(stats.expenses);
  const animSavings = useAnimatedNumber(stats.savings);

  // Category breakdown calculation
  const categoryBreakdown = useMemo(() => {
    const counts = {};
    let totalExpense = 0;

    transactions.forEach((tx) => {
      if (tx.type === 'expense') {
        const val = parseFloat(tx.amount) || 0;
        const cat = tx.category || 'General';

        counts[cat] = (counts[cat] || 0) + val;
        totalExpense += val;
      }
    });

    if (totalExpense === 0) {
      return [];
    }

    return Object.entries(counts)
      .map(([cat, amount]) => ({
        category: cat,
        amount,
        percentage: Math.round((amount / totalExpense) * 100)
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [transactions]);

  // Dynamic weekly cashflow
  const weeklyCashflow = useMemo(() => {
    const weeks = [
      { label: 'Week 1', income: 0, expense: 0 },
      { label: 'Week 2', income: 0, expense: 0 },
      { label: 'Week 3', income: 0, expense: 0 },
      { label: 'Week 4', income: 0, expense: 0 }
    ];

    transactions.forEach((tx) => {
      const d = new Date(tx.date);
      const day = isNaN(d.getDate()) ? 1 : d.getDate();

      const weekIdx = Math.min(
        Math.floor((day - 1) / 7),
        3
      );

      const val = parseFloat(tx.amount) || 0;

      if (tx.type === 'income') {
        weeks[weekIdx].income += val;
      } else {
        weeks[weekIdx].expense += val;
      }
    });

    const maxVal = Math.max(
      ...weeks.map((w) =>
        Math.max(w.income, w.expense)
      ),
      1000
    );

    return {
      weeks,
      maxVal
    };
  }, [transactions]);

  // Form Submit Handler
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      if (editingTransaction) {
        await updateTransaction(
          editingTransaction.id,
          formData
        );

        showToast('Transaction updated successfully!');
      } else {
        await createTransaction(formData);

        showToast('Transaction recorded successfully!');
      }

      setEditingTransaction(null);

      await loadTransactions();
    } catch (err) {
      showToast(
        err.message || 'Failed to save transaction',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (tx) => {
    setEditingTransaction(tx);
    setShowForm(true);

    window.scrollTo({
      top: 120,
      behavior: 'smooth'
    });
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this transaction?'
      )
    ) {
      return;
    }

    try {
      await deleteTransaction(id);

      showToast('Transaction removed.');

      await loadTransactions();
    } catch (err) {
      showToast(
        err.message || 'Error deleting transaction',
        'error'
      );
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white p-4 sm:p-8 pb-20 space-y-8 antialiased">
      <div className="max-w-[1240px] mx-auto space-y-8">

        {/* HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-white/[0.06] pb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-[12px] bg-gradient-to-br from-[#0A84FF] to-[#1FB5A5] flex items-center justify-center shadow-[0_8px_20px_-4px_rgba(10,132,255,0.5)]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Transaction{' '}
                  <span className="bg-gradient-to-r from-[#0A84FF] via-[#22D36A] to-[#39FF14] bg-clip-text text-transparent">
                    Ledger
                  </span>
                </h1>
                <BadgePill text="TRANSACTIONS" className="hidden sm:inline-flex" />
              </div>
              <p className="text-xs sm:text-sm text-[#8A93B5]">
                Track → Understand → Act with AI-driven categorization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* API Status Badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${error
                ? 'bg-[#FF4D6A]/[0.12] border-[#FF4D6A]/30 text-[#FF4D6A]'
                : 'bg-[#22D36A]/[0.12] border-[#22D36A]/30 text-[#22D36A]'
              }`}>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${error
                  ? 'bg-[#FF4D6A] shadow-[0_0_8px_#FF4D6A]'
                  : 'bg-[#22D36A] shadow-[0_0_8px_#22D36A]'
                }`} />
              {error ? 'API Error' : 'Live Ledger Active'}
            </div>

            {/* Toggle Form Button */}
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className={`px-4 py-2.5 rounded-[12px] text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[#0A84FF] ${showForm
                  ? 'bg-white/[0.06] border-white/[0.08] text-white hover:bg-white/[0.1]'
                  : 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-[0_6px_18px_rgba(10,132,255,0.35)] hover:bg-[#0975e0]'
                }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                {showForm ? (
                  <line x1="5" y1="12" x2="19" y2="12" />
                ) : (
                  <>
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </>
                )}
              </svg>
              {showForm ? 'Hide Form' : 'New Transaction'}
            </button>
          </div>
        </header>

        {/* TOAST NOTIFICATION */}
        {notification && (
          <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-[12px] text-white font-semibold text-sm flex items-center gap-2.5 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.5)] animate-[fadeIn_0.3s_ease-out] ${notification.type === 'success'
              ? 'bg-[#22D36A]/95'
              : 'bg-[#FF4D6A]/95'
            }`}>
            <span>{notification.type === 'success' ? '✓' : '✕'}</span>
            <span>{notification.message}</span>
          </div>
        )}

        {/* STATS PANEL */}
        <div className="bg-[#0F1633] border border-white/[0.06] rounded-[16px] p-6 sm:p-8 hover:border-[#0A84FF]/25 transition-all duration-200">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06]">

            {/* Total Balance */}
            <div className="pt-4 lg:pt-0 lg:pr-6 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase tracking-wider text-[#8A93B5] font-semibold">
                  Total Balance
                </span>
                <div className="w-8 h-8 rounded-[8px] bg-[#0A84FF]/[0.12] flex items-center justify-center text-[#0A84FF]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#1FB5A5] to-[#22D36A] bg-clip-text text-transparent tracking-tight">
                {formatCurrency(animBalance)}
              </div>
              <div className={`text-xs font-semibold mt-1 ${stats.balance >= 0 ? 'text-[#22D36A]' : 'text-[#FF4D6A]'
                }`}>
                {stats.balance >= 0 ? '↗ Positive Net Inflow' : '↘ Deficit Net Outflow'}
              </div>
            </div>

            {/* Total Income */}
            <div className="pt-4 lg:pt-0 lg:px-6 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase tracking-wider text-[#8A93B5] font-semibold">
                  Total Income
                </span>
                <div className="w-8 h-8 rounded-[8px] bg-[#22D36A]/[0.12] flex items-center justify-center text-[#22D36A]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#22D36A] tracking-tight">
                {formatCurrency(animIncome)}
              </div>
              <div className="text-xs text-[#8A93B5] mt-1">
                {transactions.filter((t) => t.type === 'income').length} income records
              </div>
            </div>

            {/* Total Expenses */}
            <div className="pt-4 lg:pt-0 lg:px-6 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase tracking-wider text-[#8A93B5] font-semibold">
                  Total Expenses
                </span>
                <div className="w-8 h-8 rounded-[8px] bg-[#FF4D6A]/[0.12] flex items-center justify-center text-[#FF4D6A]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></svg>
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#FF4D6A] tracking-tight">
                {formatCurrency(animExpenses)}
              </div>
              <div className="text-xs text-[#8A93B5] mt-1">
                {transactions.filter((t) => t.type === 'expense').length} expense records
              </div>
            </div>

            {/* Net Savings */}
            <div className="pt-4 lg:pt-0 lg:pl-6 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase tracking-wider text-[#8A93B5] font-semibold">
                  Net Savings
                </span>
                <div className="w-8 h-8 rounded-[8px] bg-[#1FB5A5]/[0.12] flex items-center justify-center text-[#1FB5A5]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#1FB5A5] to-[#22D36A] bg-clip-text text-transparent tracking-tight">
                {formatCurrency(animSavings)}
              </div>
              <div className="text-xs mt-1">
                <span className="text-[#1FB5A5] font-semibold">{stats.savingsRate}%</span>{' '}
                <span className="text-[#8A93B5]">savings rate</span>
              </div>
            </div>

          </div>
        </div>

        {/* ANALYTICS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Spending Breakdown */}
          <Card hover={false}>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Spending Breakdown
                </h3>
                <p className="text-xs text-[#8A93B5] mt-0.5">
                  Categorical distribution from logged expenses
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-[8px] bg-[#0A84FF]/[0.12] border border-[#0A84FF]/30 text-[#0A84FF] text-xs font-bold">
                {categoryBreakdown.length} Categories
              </span>
            </div>

            {categoryBreakdown.length === 0 ? (
              <div className="py-9 text-center text-[#8A93B5] text-sm">
                No expense transactions logged yet to generate category breakdown.
              </div>
            ) : (
              <div className="space-y-3.5">
                {categoryBreakdown.map((item, i) => {
                  const barColors = ['#F5A524', '#FF4D6A', '#0A84FF', '#1FB5A5', '#22D36A'];
                  const color = barColors[i % barColors.length];

                  return (
                    <div key={item.category}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-white font-medium">{item.category}</span>
                        <span className="text-[#8A93B5] font-semibold">
                          {formatCurrency(item.amount)} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-[width] duration-700 ease-out"
                          style={{
                            width: `${item.percentage}%`,
                            background: color,
                            boxShadow: `0 0 10px ${color}`
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Weekly Cashflow Chart */}
          <Card hover={false} className="flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Weekly Cashflow Velocity
                </h3>
                <p className="text-xs text-[#8A93B5] mt-0.5">
                  Dynamic inflow vs outflow by calendar period
                </p>
              </div>
              <div className="flex gap-3 text-[11px] font-semibold">
                <span className="flex items-center gap-1 text-[#22D36A]">
                  <span className="w-2 h-2 rounded-full bg-[#22D36A]" />
                  Inflow
                </span>
                <span className="flex items-center gap-1 text-[#FF4D6A]">
                  <span className="w-2 h-2 rounded-full bg-[#FF4D6A]" />
                  Outflow
                </span>
              </div>
            </div>

            <div className="w-full h-[140px] relative">
              <svg viewBox="0 0 360 140" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="flowIncomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22D36A" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#22D36A" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="flowExpenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF4D6A" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#FF4D6A" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <line x1="0" y1="30" x2="360" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <line x1="0" y1="70" x2="360" y2="70" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <line x1="0" y1="110" x2="360" y2="110" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

                {(() => {
                  const maxH = 100;

                  const ptsIncome = weeklyCashflow.weeks.map((w, idx) => {
                    const x = idx * 120;
                    const y = 120 - (w.income / weeklyCashflow.maxVal) * maxH;
                    return `${x},${y}`;
                  });

                  const ptsExpense = weeklyCashflow.weeks.map((w, idx) => {
                    const x = idx * 120;
                    const y = 120 - (w.expense / weeklyCashflow.maxVal) * maxH;
                    return `${x},${y}`;
                  });

                  return (
                    <>
                      <polygon
                        points={`0,120 ${ptsIncome.join(' ')} 360,120`}
                        fill="url(#flowIncomeGrad)"
                      />
                      <polyline
                        points={ptsIncome.join(' ')}
                        fill="none"
                        stroke="#22D36A"
                        strokeWidth="2.5"
                      />
                      <polygon
                        points={`0,120 ${ptsExpense.join(' ')} 360,120`}
                        fill="url(#flowExpenseGrad)"
                      />
                      <polyline
                        points={ptsExpense.join(' ')}
                        fill="none"
                        stroke="#FF4D6A"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                    </>
                  );
                })()}
              </svg>
            </div>

            <div className="flex justify-between text-[11px] text-[#8A93B5] mt-2.5">
              {weeklyCashflow.weeks.map((w) => (
                <span key={w.label}>{w.label}</span>
              ))}
            </div>
          </Card>
        </div>

        {/* TRANSACTION FORM */}
        {showForm && (
          <TransactionForm
            onSubmit={handleFormSubmit}
            initialData={editingTransaction}
            onCancel={
              editingTransaction
                ? () => setEditingTransaction(null)
                : null
            }
            isSubmitting={isSubmitting}
          />
        )}

        {/* FILTERS */}
        <TransactionFilters
          filters={filters}
          onFilterChange={setFilters}
          onReset={() =>
            setFilters({
              search: '',
              type: '',
              category: ''
            })
          }
        />

        {/* ERROR STATE */}
        {error && (
          <Card hover={false} className="text-center py-8 px-6">
            <div className="text-3xl mb-3">⚠️</div>
            <p className="text-sm text-[#FF4D6A] font-semibold mb-4">{error}</p>
            <button
              type="button"
              onClick={() => loadTransactions(filters)}
              className="px-5 py-2 rounded-[12px] bg-[#FF4D6A]/20 hover:bg-[#FF4D6A]/30 text-[#FF4D6A] text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF4D6A]"
            >
              Retry Connection
            </button>
          </Card>
        )}

        {/* LOADING STATE */}
        {loading && !error && (
          <Card hover={false} className="text-center py-14 px-6">
            <div className="w-9 h-9 rounded-full border-[3px] border-[#0A84FF]/20 border-t-[#0A84FF] mx-auto mb-4 animate-spin" />
            <p className="text-sm text-[#8A93B5]">
              Syncing ledger with API...
            </p>
          </Card>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && transactions.length === 0 && (
          <Card hover={false} className="text-center py-14 px-6 flex flex-col items-center justify-center">
            <div className="text-5xl mb-3.5">💳</div>
            <h3 className="text-lg font-bold text-white mb-2">
              No Transactions Recorded
            </h3>
            <p className="text-sm text-[#8A93B5] max-w-md mx-auto mb-5">
              {filters.search || filters.type || filters.category
                ? 'No transactions matched your active search filters. Try clearing your filters to view all records.'
                : 'No transactions recorded yet. Use the record transaction form above to add your first income or expense.'}
            </p>
            {(filters.search || filters.type || filters.category) && (
              <button
                type="button"
                onClick={() => setFilters({ search: '', type: '', category: '' })}
                className="px-4 py-2.5 rounded-[12px] bg-white/[0.06] border border-white/[0.08] text-white text-sm font-semibold hover:bg-white/[0.1] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              >
                Clear Search Filters
              </button>
            )}
          </Card>
        )}

        {/* TRANSACTION LIST */}
        {!loading && !error && transactions.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4 px-1">
              <span className="text-sm font-bold text-white">
                Recent Transactions ({transactions.length})
              </span>
              <span className="text-xs text-[#8A93B5]">
                Ordered chronologically
              </span>
            </div>

            <TransactionList
              transactions={transactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}

      </div>
    </div>
  );
}
