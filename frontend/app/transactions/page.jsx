'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TransactionForm from '../../components/transactions/TransactionForm';
import TransactionList from '../../components/transactions/TransactionList';
import TransactionFilters from '../../components/transactions/TransactionFilters';
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
        const current = Math.floor(start + (end - start) * easeOutQuad);
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
  const loadTransactions = useCallback(async (appliedFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTransactions(appliedFilters);
      setTransactions(res.data || []);
    } catch (err) {
      setError(err.message || 'Unable to connect to transactions API. Please verify the backend server is running.');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTransactions(filters);
  }, [filters, loadTransactions]);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Financial aggregates calculation from real transaction data only
  const stats = useMemo(() => {
    let income = 0;
    let expenses = 0;
    transactions.forEach((tx) => {
      const val = parseFloat(tx.amount) || 0;
      if (tx.type === 'income') income += val;
      else expenses += val;
    });
    const balance = income - expenses;
    const savings = balance > 0 ? balance : 0;
    const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;
    return { balance, income, expenses, savings, savingsRate };
  }, [transactions]);

  const animBalance = useAnimatedNumber(stats.balance);
  const animIncome = useAnimatedNumber(stats.income);
  const animExpenses = useAnimatedNumber(stats.expenses);
  const animSavings = useAnimatedNumber(stats.savings);

  // Category breakdown calculation from real transaction data
  const categoryBreakdown = useMemo(() => {
    const counts = {};
    let totalExpense = 0;
    transactions.forEach((tx) => {
      if (tx.type === 'expense') {
        const val = parseFloat(tx.amount) || 0;
        counts[tx.category] = (counts[tx.category] || 0) + val;
        totalExpense += val;
      }
    });
    if (totalExpense === 0) return [];
    return Object.entries(counts)
      .map(([cat, amount]) => ({
        category: cat,
        amount,
        percentage: Math.round((amount / totalExpense) * 100)
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [transactions]);

  // Dynamic weekly cashflow computed from real transaction dates
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
      const weekIdx = Math.min(Math.floor((day - 1) / 7), 3);
      const val = parseFloat(tx.amount) || 0;
      if (tx.type === 'income') weeks[weekIdx].income += val;
      else weeks[weekIdx].expense += val;
    });

    const maxVal = Math.max(
      ...weeks.map((w) => Math.max(w.income, w.expense)),
      1000
    );

    return { weeks, maxVal };
  }, [transactions]);

  // Form Submit Handler (Real API calls only)
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, formData);
        showToast('Transaction updated successfully!');
      } else {
        await createTransaction(formData);
        showToast('Transaction recorded successfully!');
      }
      setEditingTransaction(null);
      await loadTransactions();
    } catch (err) {
      showToast(err.message || 'Failed to save transaction', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (tx) => {
    setEditingTransaction(tx);
    setShowForm(true);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await deleteTransaction(id);
      showToast('Transaction removed.');
      await loadTransactions();
    } catch (err) {
      showToast(err.message || 'Error deleting transaction', 'error');
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#07080d',
        backgroundImage: `
          radial-gradient(at 10% 10%, rgba(99, 102, 241, 0.12) 0px, transparent 50%),
          radial-gradient(at 90% 15%, rgba(168, 85, 247, 0.10) 0px, transparent 50%),
          radial-gradient(at 50% 90%, rgba(16, 185, 129, 0.08) 0px, transparent 50%)
        `,
        padding: '36px 20px 80px 20px',
        color: '#f8fafc',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Top Header */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px -4px rgba(99, 102, 241, 0.5)'
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', letterSpacing: '-0.03em', color: '#ffffff' }}>
                  FinPilot
                </h1>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'rgba(99, 102, 241, 0.2)',
                    color: '#a5b4fc',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    letterSpacing: '0.04em'
                  }}
                >
                  MEMBER A • TRANSACTIONS
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                Track → Understand → Act with AI-driven categorization
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '20px',
                background: error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                border: error ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(16, 185, 129, 0.25)',
                fontSize: '12px',
                color: error ? '#f87171' : '#34d399',
                fontWeight: '600'
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: error ? '#ef4444' : '#10b981',
                  boxShadow: error ? '0 0 8px #ef4444' : '0 0 8px #10b981'
                }}
              />
              {error ? 'API Disconnected' : 'Live Ledger Active'}
            </div>

            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: '9px 18px',
                borderRadius: '10px',
                background: showForm ? 'rgba(255, 255, 255, 0.08)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                boxShadow: showForm ? 'none' : '0 6px 18px rgba(99, 102, 241, 0.35)'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                {showForm ? <line x1="5" y1="12" x2="19" y2="12" /> : <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>}
              </svg>
              {showForm ? 'Hide Form' : 'New Transaction'}
            </button>
          </div>
        </header>

        {/* Toast Notification */}
        {notification && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 100,
              background: notification.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
              color: '#ffffff',
              padding: '14px 20px',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <span>{notification.message}</span>
          </div>
        )}

        {/* 1. HERO / SUMMARY AREA (Calculated From Real Dataset) */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}
        >
          {/* Total Balance Card */}
          <div
            style={{
              background: 'rgba(17, 24, 39, 0.65)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Total Balance
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
              </div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.03em', marginBottom: '8px' }}>
              {formatCurrency(animBalance)}
            </div>
            <div style={{ fontSize: '12px', color: stats.balance >= 0 ? '#34d399' : '#f87171', fontWeight: '600' }}>
              {stats.balance >= 0 ? '↗ Positive Net Inflow' : '↘ Deficit Net Outflow'}
            </div>
          </div>

          {/* Total Income Card */}
          <div
            style={{
              background: 'rgba(17, 24, 39, 0.65)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 15px 35px -10px rgba(16, 185, 129, 0.15)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Total Income
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
              </div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#34d399', letterSpacing: '-0.03em', marginBottom: '8px' }}>
              {formatCurrency(animIncome)}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              {transactions.filter(t => t.type === 'income').length} income records
            </div>
          </div>

          {/* Total Expenses Card */}
          <div
            style={{
              background: 'rgba(17, 24, 39, 0.65)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 15px 35px -10px rgba(239, 68, 68, 0.12)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Total Expenses
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></svg>
              </div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#f87171', letterSpacing: '-0.03em', marginBottom: '8px' }}>
              {formatCurrency(animExpenses)}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              {transactions.filter(t => t.type === 'expense').length} expense records
            </div>
          </div>

          {/* Net Savings Card */}
          <div
            style={{
              background: 'rgba(17, 24, 39, 0.65)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 15px 35px -10px rgba(168, 85, 247, 0.15)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Net Savings
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
              </div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#c084fc', letterSpacing: '-0.03em', marginBottom: '8px' }}>
              {formatCurrency(animSavings)}
            </div>
            <div style={{ fontSize: '12px', color: '#c084fc', fontWeight: '600' }}>
              {stats.savingsRate}% <span style={{ color: '#64748b', fontWeight: '400' }}>savings rate</span>
            </div>
          </div>
        </section>

        {/* 2. DYNAMIC ANALYTICS ROW (Category Breakdown & Weekly Velocity) */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}
        >
          {/* Spending Breakdown by Category */}
          <div
            style={{
              background: 'rgba(17, 24, 39, 0.65)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.35)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>
                  Spending Breakdown
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Categorical distribution from logged expenses</p>
              </div>
              <span style={{ fontSize: '12px', color: '#818cf8', fontWeight: '600' }}>
                {categoryBreakdown.length} Categories
              </span>
            </div>

            {categoryBreakdown.length === 0 ? (
              <div style={{ padding: '36px 0', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                No expense transactions logged yet to generate category breakdown.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {categoryBreakdown.map((item, i) => {
                  const colors = ['#f97316', '#ec4899', '#38bdf8', '#eab308', '#a855f7'];
                  const color = colors[i % colors.length];
                  return (
                    <div key={item.category}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                        <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{item.category}</span>
                        <span style={{ color: '#94a3b8', fontWeight: '600' }}>
                          {formatCurrency(item.amount)} ({item.percentage}%)
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${item.percentage}%`,
                            height: '100%',
                            borderRadius: '4px',
                            background: color,
                            boxShadow: `0 0 10px ${color}`,
                            transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Weekly Cashflow Velocity Chart */}
          <div
            style={{
              background: 'rgba(17, 24, 39, 0.65)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>
                  Weekly Cashflow Velocity
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Dynamic inflow vs outflow by calendar period</p>
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '11px', fontWeight: '600' }}>
                <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }} /> Inflow
                </span>
                <span style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f87171' }} /> Outflow
                </span>
              </div>
            </div>

            {/* Dynamic Visual SVG Area/Line Chart */}
            <div style={{ width: '100%', height: '140px', position: 'relative' }}>
              <svg viewBox="0 0 360 140" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="flowIncomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="flowExpenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1="0" y1="30" x2="360" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <line x1="0" y1="70" x2="360" y2="70" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <line x1="0" y1="110" x2="360" y2="110" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

                {/* Dynamic Plot Points computed from weekly dataset */}
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
                        stroke="#34d399"
                        strokeWidth="2.5"
                      />
                      <polygon
                        points={`0,120 ${ptsExpense.join(' ')} 360,120`}
                        fill="url(#flowExpenseGrad)"
                      />
                      <polyline
                        points={ptsExpense.join(' ')}
                        fill="none"
                        stroke="#f87171"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                    </>
                  );
                })()}
              </svg>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '10px' }}>
              {weeklyCashflow.weeks.map((w) => (
                <span key={w.label}>{w.label}</span>
              ))}
            </div>
          </div>
        </section>

        {/* 3. TRANSACTION FORM */}
        {showForm && (
          <TransactionForm
            onSubmit={handleFormSubmit}
            initialData={editingTransaction}
            onCancel={editingTransaction ? () => setEditingTransaction(null) : null}
            isSubmitting={isSubmitting}
          />
        )}

        {/* 4. FILTERS & SEARCH BAR */}
        <TransactionFilters
          filters={filters}
          onFilterChange={setFilters}
          onReset={() => setFilters({ search: '', type: '', category: '' })}
        />

        {/* 5. ERROR / LOADING / EMPTY / DATA LEDGER STATES */}
        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '24px',
              color: '#fca5a5'
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚠️</div>
            <p style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: '600' }}>
              {error}
            </p>
            <button
              type="button"
              onClick={() => loadTransactions(filters)}
              style={{
                padding: '8px 20px',
                borderRadius: '10px',
                border: 'none',
                background: 'rgba(239, 68, 68, 0.3)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Retry Connection
            </button>
          </div>
        )}

        {loading && !error && (
          <div
            style={{
              background: 'rgba(17, 24, 39, 0.65)',
              borderRadius: '20px',
              padding: '60px 20px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '3px solid rgba(99, 102, 241, 0.2)',
                borderTopColor: '#6366f1',
                margin: '0 auto 16px auto',
                animation: 'spin 0.9s linear infinite'
              }}
            />
            <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>Syncing ledger with API...</p>
          </div>
        )}

        {!loading && !error && transactions.length === 0 && (
          <div
            style={{
              background: 'rgba(17, 24, 39, 0.65)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '60px 24px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '44px', marginBottom: '14px' }}>💳</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
              No Transactions Recorded
            </h3>
            <p style={{ margin: '0 auto 20px auto', fontSize: '14px', color: '#94a3b8', maxWidth: '440px' }}>
              {filters.search || filters.type || filters.category
                ? 'No transactions matched your active search filters. Try clearing your filters to view all records.'
                : 'No transactions recorded yet. Use the record transaction card above to add your first income or expense.'}
            </p>
            {(filters.search || filters.type || filters.category) && (
              <button
                type="button"
                onClick={() => setFilters({ search: '', type: '', category: '' })}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#f8fafc',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Clear Search Filters
              </button>
            )}
          </div>
        )}

        {!loading && !error && transactions.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', padding: '0 4px' }}>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc' }}>
                Recent Transactions ({transactions.length})
              </span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
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
    </main>
  );
}
