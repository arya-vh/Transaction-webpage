import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { CATEGORY_META, fmt, fmtSigned } from '../data/mockData';
import s from './TransactionTable.module.css';

const PAGE_SIZE = 12;
const TYPE_FILTERS = ['All', 'Income', 'Expense'];
const CATS = Object.keys(CATEGORY_META);

export default function TransactionTable({ transactions, onAdd, onEdit, toast }) {
  const { role, sortField, sortDir, setSort, search, setSearch } = useStore();
  const [typeFilter, setType]     = useState('All');
  const [catFilter, setCat]       = useState('All');
  const [page, setPage]           = useState(1);

  /* Derived list */
  const filtered = useMemo(() => {
    let r = transactions;
    if (typeFilter === 'Income')  r = r.filter((t) => t.type === 'income');
    if (typeFilter === 'Expense') r = r.filter((t) => t.type === 'expense');
    if (catFilter !== 'All')      r = r.filter((t) => t.category === catFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((t) =>
        t.merchant.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        String(t.amount).includes(q)
      );
    }
    return [...r].sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (sortField === 'amount') { va = +va; vb = +vb; }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ?  1 : -1;
      return 0;
    });
  }, [transactions, typeFilter, catFilter, search, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current    = Math.min(page, totalPages);
  const paginated  = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const { deleteTransaction } = useStore();
  const handleDelete = (id) => { deleteTransaction(id); toast('Transaction deleted', 'info'); };

  /* Export CSV */
  const exportCSV = () => {
    const header = 'Date,Merchant,Category,Type,Amount';
    const rows = filtered.map((t) => `${t.date},${t.merchant},${t.category},${t.type},${t.amount}`);
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'finio-transactions.csv'; a.click();
    URL.revokeObjectURL(url);
    toast('CSV exported ✓', 'success');
  };

  const col = (field, label) => (
    <th
      className={sortField === field ? s.sorted : ''}
      onClick={() => setSort(field)}
    >
      {label}
      <span className={s.sortArr}>{sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
    </th>
  );

  const pageNums = () => {
    const nums = [];
    let start = Math.max(1, current - 2);
    let end   = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  };

  return (
    <div className={s.wrap}>
      {/* Toolbar */}
      <div className={s.toolbar}>
        <div className={s.toolbarTitle}>
          Transactions
          <span className={s.toolbarCount}>({filtered.length})</span>
        </div>

        <div className={s.searchBox}>
          <span style={{ color: 'var(--text-3)', fontSize: 14 }}>⌕</span>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search…"
          />
        </div>

        <select
          className={s.sortSelect}
          value={`${sortField}-${sortDir}`}
          onChange={(e) => {
            const [f, d] = e.target.value.split('-');
            useStore.getState().setSort(f);
            if (d !== sortDir) useStore.getState().setSort(f); // toggle
          }}
        >
          <option value="date-desc">Date · Newest</option>
          <option value="date-asc">Date · Oldest</option>
          <option value="amount-desc">Amount · High</option>
          <option value="amount-asc">Amount · Low</option>
        </select>

        <button className={s.exportBtn} onClick={exportCSV}>⬇ Export CSV</button>
        {role === 'admin' && (
          <motion.button
            className={s.addBtn}
            onClick={onAdd}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            + Add Transaction
          </motion.button>
        )}
      </div>

      {/* Filters */}
      <div className={s.filters}>
        {TYPE_FILTERS.map((f) => (
          <button
            key={f}
            className={`${s.chip} ${typeFilter === f && catFilter === 'All' ? s.active : ''}`}
            onClick={() => { setType(f); setCat('All'); setPage(1); }}
          >
            {f}
          </button>
        ))}
        <span style={{ width: 1, height: 20, background: 'var(--border)', alignSelf: 'center' }} />
        {CATS.map((c) => (
          <button
            key={c}
            className={`${s.chip} ${catFilter === c ? s.active : ''}`}
            onClick={() => { setCat(c); setType('All'); setPage(1); }}
          >
            {CATEGORY_META[c].icon} {c}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={s.tableWrap}>
        {paginated.length === 0 ? (
          <div className={s.empty}>
            <div className={s.emptyIcon}>📭</div>
            <div className={s.emptyText}>No transactions match your filters.</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                {col('date', 'Date')}
                <th>Merchant</th>
                <th>Category</th>
                {col('type', 'Type')}
                {col('amount', 'Amount')}
                {role === 'admin' && <th style={{ textAlign: 'center' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {paginated.map((tx) => {
                  const meta = CATEGORY_META[tx.category] || {};
                  return (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.18 }}
                    >
                      <td className={s.txDate}>{tx.date}</td>
                      <td className={s.merchant}>{tx.merchant}</td>
                      <td>
                        <span
                          className={s.catBadge}
                          style={{
                            background: `${meta.color}18`,
                            color: meta.color,
                          }}
                        >
                          {meta.icon} {tx.category}
                        </span>
                      </td>
                      <td>
                        <span className={`${s.txType} ${s[tx.type]}`}>
                          {tx.type === 'income' ? '↑ Income' : '↓ Expense'}
                        </span>
                      </td>
                      <td className={`${s.amount} ${s[tx.type]}`}>
                        {fmtSigned(tx.amount, tx.type)}
                      </td>
                      {role === 'admin' && (
                        <td>
                          <div className={s.actions}>
                            <button className={s.iconBtn} title="Edit" onClick={() => onEdit(tx)}>✎</button>
                            <button className={`${s.iconBtn} ${s.danger}`} title="Delete" onClick={() => handleDelete(tx.id)}>✕</button>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className={s.pagination}>
        <span className={s.pagInfo}>
          {filtered.length === 0 ? 'No results' : `${(current - 1) * PAGE_SIZE + 1}–${Math.min(current * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
        </span>
        <div className={s.pagBtns}>
          <button className={s.pagBtn} disabled={current <= 1} onClick={() => setPage((p) => p - 1)}>‹</button>
          {pageNums().map((n) => (
            <button key={n} className={`${s.pagBtn} ${current === n ? s.active : ''}`} onClick={() => setPage(n)}>{n}</button>
          ))}
          <button className={s.pagBtn} disabled={current >= totalPages} onClick={() => setPage((p) => p + 1)}>›</button>
        </div>
      </div>
    </div>
  );
}
