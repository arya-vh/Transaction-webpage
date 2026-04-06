import { useState } from 'react';
import { useStore } from './store/useStore';
import { useToast } from './hooks';
import { useStats } from './hooks';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import SummaryCards from './components/SummaryCards';
import Charts from './components/Charts';
import TransactionTable from './components/TransactionTable';
import Insights from './components/Insights';
import Chatbot from './components/Chatbot';
import Toast from './components/Toast';
import Modal from './components/Modal';
import s from './App.module.css';

export default function App() {
  const { activeTab, transactions, search, setSearch, addTransaction, editTransaction, sidebarOpen, setSidebarOpen, darkMode } = useStore();
  const { toast, toasts, dismiss } = useToast();
  const stats = useStats(transactions);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentTx, setCurrentTx] = useState(null);

  const handleAdd = () => {
    setCurrentTx(null);
    setModalOpen(true);
  };

  const handleEdit = (tx) => {
    setCurrentTx(tx);
    setModalOpen(true);
  };

  const handleSave = (tx) => {
    if (currentTx) {
      editTransaction(tx);
      toast('Transaction updated', 'success');
    } else {
      addTransaction(tx);
      toast('Transaction added', 'success');
    }
    setModalOpen(false);
  };

  const handleClose = () => setModalOpen(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className={s.dashboard}>
            <SummaryCards stats={stats} />
            <Charts transactions={transactions} />
          </div>
        );
      case 'transactions':
        return (
          <TransactionTable
            transactions={transactions}
            onAdd={handleAdd}
            onEdit={handleEdit}
            toast={toast}
          />
        );
      case 'insights':
        return <Insights stats={stats} />;
      default:
        return <div>Unknown tab</div>;
    }
  };

  return (
    <div className={`${s.app} ${darkMode ? s.dark : ''}`}>
      <Sidebar toast={toast} />
      {sidebarOpen && (
        <div className={s.backdrop} onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`${s.main} ${sidebarOpen ? s.sidebarOpen : s.sidebarClosed}`}>
        <Topbar search={search} setSearch={setSearch} />
        <div className={s.content}>
          {renderContent()}
        </div>
      </div>
      <Toast toasts={toasts} dismiss={dismiss} />
      {modalOpen && (
        <Modal
          tx={currentTx}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
      <Chatbot />
    </div>
  );
}