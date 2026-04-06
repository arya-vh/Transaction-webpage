import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import s from './Chatbot.module.css';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! I am your AI assistant for the Transaction Site. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simple response logic
    setTimeout(() => {
      const response = getBotResponse(input.toLowerCase());
      const botMessage = { type: 'bot', text: response };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const getBotResponse = (message) => {
    if (message.includes('hello') || message.includes('hi')) {
      return 'Hello! How can I assist you with the Transaction Site today?';
    } else if (message.includes('add') && message.includes('transaction')) {
      return 'To add a transaction, click the "Add Transaction" button in the dashboard or transactions tab. Fill in the details and save!';
    } else if (message.includes('view') || message.includes('see')) {
      return 'You can view all transactions in the "Transactions" tab. Use the search bar and filters to find specific ones.';
    } else if (message.includes('chart') || message.includes('insight')) {
      return 'Check out the "Insights" tab for beautiful charts and analytics on your transactions!';
    } else if (message.includes('export')) {
      return 'You can export transactions to CSV by clicking the "⬇ Export CSV" button in the Transactions tab.';
    } else if (message.includes('dark mode')) {
      return 'Toggle dark mode using the moon/sun icon in the top right corner of the topbar.';
    } else {
      return 'I am here to help with questions about the Transaction Site. Try asking about adding transactions, viewing data, or features!';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className={s.chatbot}>
      {!open && (
        <button className={s.chatButton} onClick={() => setOpen(true)}>
          💬 Chat
        </button>
      )}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-window"
            className={s.chatWindow}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className={s.chatHeader}>
              <span>FinBot</span>
              <button className={s.closeButton} onClick={() => setOpen(false)}>×</button>
            </div>
            <div className={s.chatMessages}>
              {messages.map((msg, index) => (
                <div key={index} className={`${s.message} ${s[msg.type]}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div className={s.chatInput}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}