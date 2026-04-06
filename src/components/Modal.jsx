import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from '../data/mockData';
import s from './Modal.module.css';

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

const DEFAULT = {
  merchant: '', category: 'Food & Dining', type: 'expense',
  amount: '', date: new Date().toISOString().split('T')[0], note: '',
};

export default function Modal({ tx, onSave, onClose }) {
  const [form, setForm] = useState(tx ? { ...tx } : { ...DEFAULT });
  const [err, setErr]   = useState('');

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    if (!form.merchant.trim()) return 'Merchant name is required';
    if (!form.amount || isNaN(+form.amount) || +form.amount <= 0) return 'Enter a valid positive amount';
    if (!form.date) return 'Date is required';
    return '';
  };

  const handleSave = () => {
    const e = validate();
    if (e) { setErr(e); return; }
    onSave({ ...form, id: form.id || uid(), amount: +form.amount });
  };

  return (
    <AnimatePresence>
      <motion.div
        className={s.overlay}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className={s.modal}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0,  scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        >
          <div className={s.header}>
            <h2 className={s.title}>{tx ? 'Edit Transaction' : 'New Transaction'}</h2>
            <button className={s.closeBtn} onClick={onClose}>×</button>
          </div>

          {/* Type Toggle */}
          <div className={s.group}>
            <label className={s.label}>Type</label>
            <div className={s.typeToggle}>
              {['expense', 'income'].map((t) => (
                <button
                  key={t}
                  className={`${s.typeBtn} ${form.type === t ? `${s.active} ${s[t]}` : ''}`}
                  onClick={() => set('type', t)}
                >
                  {t === 'expense' ? '↓ Expense' : '↑ Income'}
                </button>
              ))}
            </div>
          </div>

          <div className={s.group}>
            <label className={s.label}>Merchant / Description</label>
            <input
              className={s.input}
              value={form.merchant}
              onChange={(e) => { set('merchant', e.target.value); setErr(''); }}
              placeholder="e.g. Amazon, Salary"
              autoFocus
            />
          </div>

          <div className={s.row}>
            <div className={s.group}>
              <label className={s.label}>Category</label>
              <select className={s.select} value={form.category} onChange={(e) => set('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className={s.group}>
              <label className={s.label}>Amount (₹)</label>
              <input
                className={s.input}
                type="number"
                min="0"
                value={form.amount}
                onChange={(e) => { set('amount', e.target.value); setErr(''); }}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className={s.group}>
            <label className={s.label}>Date</label>
            <input
              className={s.input}
              type="date"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
            />
          </div>

          {err && (
            <p style={{ color: 'var(--crimson)', fontSize: 12, marginBottom: 12, marginTop: -8 }}>
              ⚠ {err}
            </p>
          )}

          <div className={s.footer}>
            <button className={s.cancelBtn} onClick={onClose}>Cancel</button>
            <motion.button
              className={s.saveBtn}
              onClick={handleSave}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              {tx ? 'Save Changes' : 'Add Transaction'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
