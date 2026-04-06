import { AnimatePresence, motion } from 'framer-motion';
import s from './Toast.module.css';

const ICONS = { success: '✓', error: '✕', info: 'ℹ', gold: '⚡' };

export default function ToastContainer({ toasts, dismiss }) {
  return (
    <div className={s.container}>
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            className={`${s.toast} ${s[t.type]}`}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0,  scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            onClick={() => dismiss(t.id)}
          >
            <span className={s.icon}>{ICONS[t.type] || 'ℹ'}</span>
            <span className={s.msg}>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
