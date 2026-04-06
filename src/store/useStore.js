import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateTransactions } from '../data/mockData';

const SEED_TXS = generateTransactions(90);

export const useStore = create(
  persist(
    (set, get) => ({
      /* ─── Core Data ─── */
      transactions: SEED_TXS,

      /* ─── Role ─── */
      role: 'admin', // 'admin' | 'viewer'
      setRole: (role) => set({ role }),

      /* ─── Navigation ─── */
      activeTab: 'dashboard',
      setActiveTab: (tab) => set({ activeTab: tab }),

      /* ─── Theme ─── */
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      /* ─── Filters ─── */
      search: '',
      setSearch: (s) => set({ search: s }),
      filterType: 'all',
      setFilterType: (f) => set({ filterType: f }),
      filterCategory: 'all',
      setFilterCategory: (c) => set({ filterCategory: c }),
      sortField: 'date',
      sortDir: 'desc',
      setSort: (field) => set((state) => ({
        sortField: field,
        sortDir: state.sortField === field && state.sortDir === 'desc' ? 'asc' : 'desc',
      })),
      currentPage: 1,
      setPage: (p) => set({ currentPage: p }),

      /* ─── CRUD ─── */
      addTransaction: (tx) => set((state) => ({
        transactions: [tx, ...state.transactions],
      })),
      editTransaction: (tx) => set((state) => ({
        transactions: state.transactions.map((t) => (t.id === tx.id ? tx : t)),
      })),
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      })),

      /* ─── Sidebar ─── */
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (v) => set({ sidebarOpen: v }),
    }),
    {
      name: 'finio-storage',
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
      }),
    }
  )
);
