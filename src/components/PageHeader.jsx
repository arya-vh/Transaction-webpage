import { motion } from 'framer-motion';
import s from './PageHeader.module.css';

export default function PageHeader({ title, subtitle, action }) {
  return (
    <motion.div
      className={s.header}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h1 className={s.title}>{title}</h1>
        {subtitle && <p className={s.sub}>{subtitle}</p>}
      </div>
      {action && <div className={s.action}>{action}</div>}
    </motion.div>
  );
}
