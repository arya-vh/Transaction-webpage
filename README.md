# 💰 Transaction Site - Finance Intelligence Dashboard

A modern, responsive React application for managing and analyzing financial transactions with an AI-powered chatbot assistant.

![Transaction Site Preview](https://via.placeholder.com/800x400/007bff/ffffff?text=Transaction+Site+Preview)

## ✨ Features

### 🎯 Core Functionality
- **Transaction Management**: Add, edit, view, and delete transactions
- **Advanced Filtering**: Filter by type (Income/Expense), category, and search
- **Data Export**: Export transactions to CSV format
- **Real-time Statistics**: Live calculation of totals, averages, and insights

### 🤖 AI Chatbot Assistant
- **Intelligent Responses**: Context-aware answers about app features
- **App Guidance**: Helps users navigate and understand functionality
- **Smooth Animations**: Beautiful chat interface with motion effects

### 🎨 User Experience
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Powered by Framer Motion for fluid interactions
- **Role-based Access**: Admin and Viewer modes with different permissions

### 📊 Analytics & Insights
- **Interactive Charts**: Visualize spending patterns and trends
- **Category Breakdown**: Detailed analysis by transaction categories
- **Summary Cards**: Quick overview of key financial metrics

## 🛠️ Tech Stack

- **Frontend**: React 19.2.4 with Vite
- **State Management**: Zustand
- **Styling**: CSS Modules with custom properties
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Unicode emojis and custom SVGs
- **Build Tool**: Vite
- **Linting**: ESLint

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/arya-vh/Transaction-webpage.git
   cd Transaction-webpage
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm run preview
```

## 📱 Usage

### Navigation
- **Dashboard**: Overview with summary cards and recent transactions
- **Transactions**: Full transaction management with filtering and search
- **Insights**: Charts and analytics for spending patterns

### Key Features
- Click the 💬 icon for AI chatbot assistance
- Use the moon/sun icon to toggle dark mode
- Filter transactions by type, category, or search terms
- Export data using the CSV export button

### Chatbot Commands
Try asking the chatbot:
- "How do I add a transaction?"
- "Show me insights"
- "How to export data?"
- "What is dark mode?"

## 🏗️ Project Structure

```
Transaction-webpage/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   ├── Topbar.jsx           # Top navigation bar
│   │   ├── SummaryCards.jsx     # Dashboard statistics
│   │   ├── TransactionTable.jsx # Transaction management
│   │   ├── Charts.jsx           # Data visualization
│   │   ├── Insights.jsx         # Analytics page
│   │   ├── Chatbot.jsx          # AI assistant
│   │   ├── Modal.jsx            # Transaction forms
│   │   └── Toast.jsx            # Notifications
│   ├── data/
│   │   └── mockData.js          # Sample transaction data
│   ├── hooks/
│   │   └── index.js             # Custom React hooks
│   ├── store/
│   │   └── useStore.js          # Zustand state management
│   ├── styles/
│   │   └── global.css           # Global styles and variables
│   ├── App.jsx                  # Main application component
│   └── main.jsx                 # Application entry point
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary**: #007bff (Blue)
- **Secondary**: #6c757d (Gray)
- **Success**: #28a745 (Green)
- **Warning**: #ffc107 (Yellow)
- **Danger**: #dc3545 (Red)
- **Gold**: #d4a853 (Accent)

### Typography
- **Display**: Playfair Display
- **Body**: Cabinet Grotesk
- **Mono**: JetBrains Mono

### Animations
- **Spring Physics**: Smooth, natural motion
- **Hover Effects**: Subtle scale and color transitions
- **Page Transitions**: Fade and slide animations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices
- Use CSS Modules for component styling
- Maintain consistent code formatting
- Add proper TypeScript types (future enhancement)
- Test components thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React**: For the amazing frontend framework
- **Vite**: For lightning-fast development experience
- **Framer Motion**: For beautiful animations
- **Recharts**: For data visualization
- **Zustand**: For simple state management

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

**Made with ❤️ by Arya**
