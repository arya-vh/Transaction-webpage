// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import s from './Sidebar.module.css';

const NAV_ITEMS = [
  { id: 'dashboard',     label: 'Overview',      icon: '◫' },
  { id: 'transactions',  label: 'Transactions',   icon: '↔' },
  { id: 'insights',      label: 'Insights',       icon: '◑' },
];

export default function Sidebar({ toast }) {
  const { activeTab, setActiveTab, role, setRole, sidebarOpen, setSidebarOpen } = useStore();

  const handleNav = (id) => {
    setActiveTab(id);
    if (window.innerWidth < 860) setSidebarOpen(false);
  };

  const handleRole = (e) => {
    const r = e.target.value;
    setRole(r);
    toast(`Switched to ${r} mode`, r === 'admin' ? 'gold' : 'info');
  };

  return (
    <motion.div
      as="aside"
      className={`${s.sidebar} ${sidebarOpen ? '' : s.closed}`}
      initial={false}
      animate={{ x: sidebarOpen ? 0 : -260 }}
      transition={{ type: 'spring', stiffness: 300, damping: 32 }}
    >
      {/* Brand */}
      <div className={s.brand}>
        <motion.div
          className={s.brandMark}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          ƒ
        </motion.div>
        <div className={s.brandText}>
          <span className={s.brandName}>Finio</span>
          <span className={s.brandTagline}>Finance Intelligence</span>
        </div>
      </div>

      {/* Nav */}
      <nav className={s.nav}>
        <div className={s.navSection}>
          <div className={s.navSectionLabel}>Navigation</div>
          {NAV_ITEMS.map((item) => (
            <motion.div
              key={item.id}
              className={`${s.navItem} ${activeTab === item.id ? s.active : ''}`}
              onClick={() => handleNav(item.id)}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className={s.navIcon}>{item.icon}</span>
              <span className={s.navLabel}>{item.label}</span>
            </motion.div>
          ))}
        </div>
      </nav>

      {/* Role Switcher */}
      <div className={s.roleBox}>
        <div className={s.roleBoxLabel}>Access Role</div>
        <select
          className={s.roleSelect}
          value={role}
          onChange={handleRole}
        >
          <option value="admin">Administrator</option>
          <option value="viewer">Viewer (Read-only)</option>
        </select>
        <div className={`${s.roleBadge} ${s[role]}`}>
          <span className={s.roleDot} />
          {role === 'admin' ? '⚡ Full Access' : '👁 View Only'}
        </div>
      </div>

      <div className={s.sidebarFooter}>Finio v2.0 · © 2025</div>
    </motion.div>
  );
}
