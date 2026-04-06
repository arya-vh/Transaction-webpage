import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, ReferenceLine,
} from 'recharts';
import { CATEGORY_META, fmt } from '../data/mockData';
import s from './Insights.module.css';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const card = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } },
};

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={s.tooltip}>
      <div className={s.ttLabel}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} className={s.ttRow}>
          <span style={{ color: p.color || p.fill }}>{p.name}</span>
          <span>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function Insights({ stats }) {
  const { income, expenses, balance, savingsRate, topCategory, monthlyData, spendByCategory } = stats;

  const last2 = monthlyData.slice(-2);
  const expChange = last2.length === 2 && last2[0].expense > 0
    ? ((last2[1].expense - last2[0].expense) / last2[0].expense) * 100
    : 0;
  const incChange = last2.length === 2 && last2[0].income > 0
    ? ((last2[1].income - last2[0].income) / last2[0].income) * 100
    : 0;

  const avgMonthlyIncome  = monthlyData.length ? income  / monthlyData.length : 0;
  const avgMonthlyExpense = monthlyData.length ? expenses / monthlyData.length : 0;

  const topCat   = topCategory ? topCategory[0] : 'N/A';
  const topCatAmt = topCategory ? topCategory[1] : 0;
  const topMeta  = CATEGORY_META[topCat] || {};

  const netData = monthlyData.slice(-7).map((d) => ({
    ...d,
    net: d.income - d.expense,
  }));

  const kpis = [
    {
      tag: '🔥 Top Spend',
      tagColor: 'var(--crimson)',
      tagBg: 'var(--crimson-dim)',
      value: topCat,
      sub: `${fmt(topCatAmt)} total`,
      desc: 'Your highest-spend category this period.',
      icon: topMeta.icon || '📦',
    },
    {
      tag: '📊 Expense Trend',
      tagColor: expChange > 0 ? 'var(--crimson)' : 'var(--emerald)',
      tagBg: expChange > 0 ? 'var(--crimson-dim)' : 'var(--emerald-dim)',
      value: `${expChange > 0 ? '+' : ''}${expChange.toFixed(1)}%`,
      sub: 'vs previous month',
      desc: expChange > 0
        ? 'Spending is rising. Consider reviewing discretionary costs.'
        : 'Great — you spent less than last month.',
      icon: expChange > 0 ? '📈' : '📉',
    },
    {
      tag: '💸 Savings Rate',
      tagColor: savingsRate >= 20 ? 'var(--emerald)' : 'var(--amber)',
      tagBg: savingsRate >= 20 ? 'var(--emerald-dim)' : 'var(--amber-dim)',
      value: `${savingsRate.toFixed(1)}%`,
      sub: savingsRate >= 20 ? 'Excellent' : 'Needs improvement',
      desc: savingsRate >= 20
        ? 'You\'re saving above the recommended 20% threshold.'
        : 'Aim to save at least 20% of your income.',
      icon: '🎯',
    },
    {
      tag: '📅 Avg Monthly',
      tagColor: 'var(--sapphire)',
      tagBg: 'var(--sapphire-dim)',
      value: fmt(avgMonthlyIncome),
      sub: `Spend: ${fmt(avgMonthlyExpense)}`,
      desc: 'Your average monthly income and expenditure.',
      icon: '📅',
    },
    {
      tag: '⚖️ Net Balance',
      tagColor: balance >= 0 ? 'var(--gold)' : 'var(--crimson)',
      tagBg: balance >= 0 ? 'var(--gold-dim)' : 'var(--crimson-dim)',
      value: fmt(balance),
      sub: balance >= 0 ? 'Surplus' : 'Deficit',
      desc: balance >= 0
        ? 'You\'re in the green. Keep building your reserve.'
        : 'Expenses exceed income. Review your budget.',
      icon: balance >= 0 ? '✅' : '⚠️',
    },
    {
      tag: '↑ Income Trend',
      tagColor: incChange >= 0 ? 'var(--emerald)' : 'var(--crimson)',
      tagBg: incChange >= 0 ? 'var(--emerald-dim)' : 'var(--crimson-dim)',
      value: `${incChange >= 0 ? '+' : ''}${incChange.toFixed(1)}%`,
      sub: 'vs previous month',
      desc: incChange >= 0
        ? 'Income is growing — great momentum.'
        : 'Income dipped compared to last month.',
      icon: '💼',
    },
  ];

  return (
    <div className={s.page}>
      {/* KPI Grid */}
      <motion.div className={s.kpiGrid} variants={container} initial="hidden" animate="show">
        {kpis.map((k, i) => (
          <motion.div key={i} className={s.kpiCard} variants={card}>
            <div className={s.kpiTop}>
              <span
                className={s.kpiTag}
                style={{ background: k.tagBg, color: k.tagColor }}
              >
                {k.tag}
              </span>
              <span className={s.kpiEmoji}>{k.icon}</span>
            </div>
            <div className={s.kpiValue} style={{ color: k.tagColor }}>{k.value}</div>
            <div className={s.kpiSub}>{k.sub}</div>
            <p className={s.kpiDesc}>{k.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className={s.chartsRow}>
        {/* Monthly Comparison Bar */}
        <motion.div
          className={s.chartCard}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className={s.chartTitle}>Monthly Comparison</div>
          <div className={s.chartSub}>Income vs Expenses — last 6 months</div>
          {monthlyData.length === 0 ? (
            <div className={s.empty}>No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData.slice(-6)} margin={{ top: 8, right: 4, left: 4, bottom: 0 }} barGap={4} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'var(--text-3)', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => fmt(v)} tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} width={76} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="income"  name="Income"   fill="#34c77b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expenses" fill="#e05470" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Net Savings Line */}
        <motion.div
          className={s.chartCard}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className={s.chartTitle}>Net Savings</div>
          <div className={s.chartSub}>Monthly surplus or deficit</div>
          {netData.length === 0 ? (
            <div className={s.empty}>No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={netData} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#d4a853" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#d4a853" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'var(--text-3)', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => fmt(v)} tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} width={76} />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
                <Line
                  type="monotone" dataKey="net" name="Net Savings"
                  stroke="#d4a853" strokeWidth={2.5}
                  dot={{ fill: '#d4a853', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#d4a853' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* Category Table */}
      <motion.div
        className={s.catTable}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className={s.catTableHeader}>
          <div className={s.chartTitle}>Category Breakdown</div>
          <div className={s.chartSub}>Full spending breakdown by category</div>
        </div>
        <div className={s.catTableBody}>
          {spendByCategory.length === 0 ? (
            <div className={s.empty}>No expense data</div>
          ) : (
            spendByCategory.map((c, i) => {
              const meta  = CATEGORY_META[c.name] || {};
              const total = spendByCategory.reduce((acc, x) => acc + x.value, 0);
              const pct   = total > 0 ? (c.value / total) * 100 : 0;
              return (
                <div key={c.name} className={s.catRow}>
                  <div className={s.catRank}>#{i + 1}</div>
                  <div className={s.catIcon} style={{ background: `${meta.color}18`, color: meta.color }}>
                    {meta.icon}
                  </div>
                  <div className={s.catName}>{c.name}</div>
                  <div className={s.catBarWrap}>
                    <motion.div
                      className={s.catBarFill}
                      style={{ background: meta.color || '#888' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.9, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <div className={s.catPct} style={{ color: meta.color }}>{pct.toFixed(1)}%</div>
                  <div className={s.catAmt}>{fmt(c.value)}</div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}
