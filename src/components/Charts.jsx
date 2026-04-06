import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { CATEGORY_META, fmt } from '../data/mockData';
import s from './Charts.module.css';

/* ─── Custom Tooltip ─── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={s.tooltip}>
      <div className={s.tooltipLabel}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} className={s.tooltipRow}>
          <span style={{ color: p.color }}>{p.name}</span>
          <span style={{ color: 'var(--text)' }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.[0]) return null;
  const p = payload[0];
  return (
    <div className={s.tooltip}>
      <div className={s.tooltipLabel}>{p.name}</div>
      <div className={s.tooltipRow}>
        <span style={{ color: p.payload.color }}>{fmt(p.value)}</span>
        <span style={{ color: 'var(--text-2)' }}>{p.payload.pct?.toFixed(1)}%</span>
      </div>
    </div>
  );
}

/* ─── Balance Trend ─── */
export function BalanceTrend({ data }) {
  const last7 = data.slice(-7);

  return (
    <div className={s.chartCard}>
      <div className={s.chartHeader}>
        <div className={s.chartTitle}>Balance Trend</div>
        <div className={s.chartSub}>Monthly income vs expenses — last 7 months</div>
      </div>
      {last7.length === 0 ? (
        <EmptyChart />
      ) : (
        <>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={last7} margin={{ top: 10, right: 4, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#34c77b" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#34c77b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#e05470" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#e05470" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#d4a853" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#d4a853" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: 'var(--text-3)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => fmt(v)}
                tick={{ fill: 'var(--text-3)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                axisLine={false} tickLine={false} width={78}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="income"  name="Income"   stroke="#34c77b" strokeWidth={2} fill="url(#gradIncome)" dot={false} activeDot={{ r: 4, fill: '#34c77b' }} />
              <Area type="monotone" dataKey="expense" name="Expenses" stroke="#e05470" strokeWidth={2} fill="url(#gradExpense)" dot={false} activeDot={{ r: 4, fill: '#e05470' }} />
            </AreaChart>
          </ResponsiveContainer>
          <div className={s.legend}>
            {[['#34c77b','Income'],['#e05470','Expenses']].map(([c, l]) => (
              <div key={l} className={s.legendItem}>
                <div className={s.legendDot} style={{ background: c }} />
                {l}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Spending Breakdown ─── */
export function SpendingBreakdown({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const top6  = data.slice(0, 6).map((d) => ({
    ...d,
    color: CATEGORY_META[d.name]?.color || '#888',
    pct: total > 0 ? (d.value / total) * 100 : 0,
  }));

  return (
    <div className={s.chartCard}>
      <div className={s.chartHeader}>
        <div className={s.chartTitle}>Spending Breakdown</div>
        <div className={s.chartSub}>By category · top 6</div>
      </div>
      {top6.length === 0 ? (
        <EmptyChart />
      ) : (
        <>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={top6} dataKey="value" nameKey="name"
                cx="50%" cy="50%" innerRadius={55} outerRadius={82}
                paddingAngle={3} startAngle={90} endAngle={450}
              >
                {top6.map((e, i) => (
                  <Cell key={i} fill={e.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className={s.categoryList}>
            {top6.map((c) => (
              <motion.div key={c.name} className={s.categoryRow}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              >
                <div className={s.catInfo}>
                  <div className={s.catDot} style={{ background: c.color }} />
                  <span className={s.catName}>{c.name}</span>
                </div>
                <span className={s.catAmt}>{fmt(c.value)}</span>
                <div className={s.catBar}>
                  <motion.div
                    className={s.catBarFill}
                    style={{ background: c.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${c.pct}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function EmptyChart() {
  return (
    <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
      <div style={{ fontSize: 30, marginBottom: 10 }}>📭</div>
      No data available yet
    </div>
  );
}

export default function Charts({ transactions }) {
  if (!transactions.length) return <EmptyChart />;

  const byMonth = {};
  transactions.forEach((t) => {
    const m = t.date.slice(0, 7);
    if (!byMonth[m]) byMonth[m] = { income: 0, expense: 0 };
    byMonth[m][t.type] += t.amount;
  });
  const monthlyData = Object.entries(byMonth).map(([month, data]) => ({
    month,
    income: data.income,
    expense: data.expense,
  }));

  const byCategory = {};
  transactions.filter((t) => t.type === 'expense').forEach((t) => {
    byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
  });
  const categoryData = Object.entries(byCategory).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className={s.charts}>
      <BalanceTrend data={monthlyData} />
      <SpendingBreakdown data={categoryData} />
    </div>
  );
}
