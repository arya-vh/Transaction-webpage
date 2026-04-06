import { motion } from 'framer-motion';
import { fmt } from '../data/mockData';
import s from './SummaryCards.module.css';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } },
};

export default function SummaryCards({ stats }) {
  const { income, expenses, balance, savingsRate } = stats;

  const cards = [
    {
      label:   'Net Balance',
      value:   fmt(balance),
      icon:    '💰',
      iconBg:  'rgba(212,168,83,0.12)',
      accent:  'var(--gold)',
      badge:   balance >= 0 ? '▲ Healthy' : '▼ Deficit',
      bClass:  balance >= 0 ? s.up : s.down,
      sub:     'Across all accounts',
      deco:    '◈',
    },
    {
      label:   'Total Income',
      value:   fmt(income),
      icon:    '📈',
      iconBg:  'rgba(52,199,123,0.1)',
      accent:  'var(--emerald)',
      badge:   '↑ Credited',
      bClass:  s.up,
      sub:     'All income streams',
      deco:    '◉',
    },
    {
      label:   'Total Expenses',
      value:   fmt(expenses),
      icon:    '📉',
      iconBg:  'rgba(224,84,112,0.1)',
      accent:  'var(--crimson)',
      badge:   '↓ Debited',
      bClass:  s.down,
      sub:     'All spending categories',
      deco:    '◎',
    },
    {
      label:   'Savings Rate',
      value:   `${savingsRate.toFixed(1)}%`,
      icon:    '🎯',
      iconBg:  'rgba(77,157,224,0.1)',
      accent:  savingsRate >= 20 ? 'var(--emerald)' : 'var(--amber)',
      badge:   savingsRate >= 20 ? '✓ On Track' : '! Improve',
      bClass:  savingsRate >= 20 ? s.up : s.warn,
      sub:     'Target: 20% or higher',
      deco:    '◐',
    },
  ];

  return (
    <motion.div className={s.grid} variants={container} initial="hidden" animate="show">
      {cards.map((c) => (
        <motion.div
          key={c.label}
          className={s.card}
          style={{ '--accent': c.accent }}
          variants={item}
          whileHover={{ y: -3 }}
        >
          <div className={s.cardHeader}>
            <div className={s.iconWrap} style={{ background: c.iconBg }}>{c.icon}</div>
            <span className={`${s.badge} ${c.bClass}`}>{c.badge}</span>
          </div>
          <div className={s.label}>{c.label}</div>
          <div className={s.value} style={{ color: c.accent }}>{c.value}</div>
          <div className={s.sub}>{c.sub}</div>
          <div className={s.corner} style={{ background: c.accent }} />
          <div className={s.sparkline}>{c.deco}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}
