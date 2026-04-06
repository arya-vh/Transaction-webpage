import { useStore } from '../store/useStore';
import s from './Topbar.module.css';

const TITLES = {
  dashboard:    'Overview',
  transactions: 'Transactions',
  insights:     'Insights',
};

export default function Topbar({ search, setSearch }) {
  const { toggleSidebar, activeTab, setActiveTab, darkMode, toggleDarkMode } = useStore();

  const now = new Date().toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });

  const handleSearch = (v) => {
    setSearch(v);
    if (activeTab !== 'transactions') setActiveTab('transactions');
  };

  return (
    <header className={s.topbar}>
      <button className={s.menuBtn} onClick={toggleSidebar} aria-label="Toggle menu">
        ☰
      </button>

      <div className={s.title}>
        {TITLES[activeTab]}
        <span className={s.titleSub}>Finance Dashboard</span>
      </div>

      <div className={s.searchWrap}>
        <span className={s.searchIcon}>⌕</span>
        <input
          className={s.searchInput}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search transactions…"
          aria-label="Search"
        />
      </div>

      <div className={s.datePill}>
        📅 {now}
      </div>

      <div className={s.actions}>
        <button className={s.iconBtn} title="Notifications">
          🔔 <span className={s.dot} />
        </button>
        <button className={s.iconBtn} onClick={toggleDarkMode} title="Toggle Dark Mode">
          {darkMode ? '☀' : '🌙'}
        </button>
        <button className={s.iconBtn} title="Settings">⚙</button>
      </div>
    </header>
  );
}
