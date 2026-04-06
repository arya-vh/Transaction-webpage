import { useState, useEffect, useCallback } from 'react';

/* ─── Toast hook ─── */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((p) => p.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now().toString(36);
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  return { toasts, toast, dismiss };
}

/* ─── Window size hook ─── */
export function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return size;
}

/* ─── Derived stats ─── */
export function useStats(transactions) {
  const income   = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance  = income - expenses;
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

  const byCategory = {};
  transactions.filter((t) => t.type === 'expense').forEach((t) => {
    byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
  });
  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];

  const byMonth = {};
  transactions.forEach((t) => {
    const m = t.date.slice(0, 7);
    if (!byMonth[m]) byMonth[m] = { income: 0, expense: 0 };
    byMonth[m][t.type] += t.amount;
  });
  const monthlyData = Object.entries(byMonth)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, v]) => ({
      month,
      label: new Date(month + '-01').toLocaleString('default', { month: 'short', year: '2-digit' }),
      income: Math.round(v.income),
      expense: Math.round(v.expense),
      net: Math.round(v.income - v.expense),
    }));

  const spendByCategory = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  return { income, expenses, balance, savingsRate, topCategory, monthlyData, spendByCategory };
}
