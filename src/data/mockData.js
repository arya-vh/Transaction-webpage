export const CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Shopping',
  'Housing',
  'Healthcare',
  'Entertainment',
  'Utilities',
  'Investments',
  'Salary',
  'Freelance',
  'Education',
  'Travel',
];

export const CATEGORY_META = {
  'Food & Dining':  { color: '#e0963c', icon: '🍜', type: 'expense' },
  'Transport':      { color: '#4d9de0', icon: '🚇', type: 'expense' },
  'Shopping':       { color: '#9b72cf', icon: '🛍️', type: 'expense' },
  'Housing':        { color: '#34c77b', icon: '🏠', type: 'expense' },
  'Healthcare':     { color: '#e05470', icon: '💊', type: 'expense' },
  'Entertainment':  { color: '#d4a853', icon: '🎬', type: 'expense' },
  'Utilities':      { color: '#2bc4aa', icon: '⚡', type: 'expense' },
  'Investments':    { color: '#9b72cf', icon: '📈', type: 'income' },
  'Salary':         { color: '#34c77b', icon: '💼', type: 'income' },
  'Freelance':      { color: '#2bc4aa', icon: '💻', type: 'income' },
  'Education':      { color: '#4d9de0', icon: '📚', type: 'expense' },
  'Travel':         { color: '#d4a853', icon: '✈️', type: 'expense' },
};

const MERCHANTS = {
  'Food & Dining':  ['Zomato', 'Swiggy', 'Cafe Coffee Day', 'Haldiram\'s', 'Barbeque Nation', 'Burger King', 'McDonald\'s', 'Domino\'s'],
  'Transport':      ['Ola Cabs', 'Uber', 'Rapido', 'BMTC', 'Namma Metro', 'Indian Railways', 'RedBus'],
  'Shopping':       ['Amazon India', 'Flipkart', 'Myntra', 'Nykaa', 'Reliance Digital', 'Decathlon', 'IKEA'],
  'Housing':        ['Rent Payment', 'Society Maintenance', 'Home Décor', 'NoBroker', 'MagicBricks'],
  'Healthcare':     ['Apollo Pharmacy', 'MedPlus', 'Practo Consult', 'Lal Path Labs', 'Fortis Hospital'],
  'Entertainment':  ['Netflix', 'Prime Video', 'Hotstar', 'BookMyShow', 'Spotify', 'SonyLIV'],
  'Utilities':      ['Airtel Broadband', 'BSNL', 'BESCOM Power', 'Gas Agency', 'JioFiber'],
  'Investments':    ['Zerodha Groww', 'SBI Mutual Fund', 'HDFC Equity', 'FD Interest', 'Dividend Income'],
  'Salary':         ['Company Salary', 'TCS Payroll', 'Infosys CTC', 'Wipro Pay', 'Accenture Inc'],
  'Freelance':      ['Upwork Client', 'Fiverr Order', 'Direct Client', 'Toptal Project', 'Razorpay Receipt'],
  'Education':      ['Coursera', 'Udemy', 'BYJU\'S', 'Unacademy', 'College Fees'],
  'Travel':         ['MakeMyTrip', 'Goibibo', 'Airbnb', 'OYO Rooms', 'IndiGo Airlines'],
};

function rnd(a, b) { return +(Math.random() * (b - a) + a).toFixed(2); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

export function generateTransactions(count = 90) {
  const txs = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 180);
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);

    const isIncome = Math.random() < 0.2;
    const incomeCats = ['Salary', 'Freelance', 'Investments'];
    const expenseCats = CATEGORIES.filter((c) => !incomeCats.includes(c));

    const category = isIncome ? pick(incomeCats) : pick(expenseCats);
    const merchant = pick(MERCHANTS[category]);
    const amount = isIncome
      ? rnd(8000, 95000)
      : category === 'Housing'
        ? rnd(5000, 30000)
        : category === 'Travel'
          ? rnd(2000, 25000)
          : rnd(80, 5000);

    const note = isIncome ? 'Credited to account' : '';

    txs.push({
      id: uid(),
      date: d.toISOString().split('T')[0],
      merchant,
      category,
      type: isIncome ? 'income' : 'expense',
      amount,
      note,
    });
  }

  return txs.sort((a, b) => b.date.localeCompare(a.date));
}

export function fmt(n) {
  return '₹' + Math.abs(+n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

export function fmtSigned(n, type) {
  return (type === 'income' ? '+' : '−') + fmt(n);
}

export function getMonth(dateStr) {
  return dateStr.slice(0, 7);
}

export function monthLabel(m) {
  return new Date(m + '-01').toLocaleString('default', { month: 'short', year: '2-digit' });
}
