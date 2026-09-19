# FinPilot 🚀 
> **AI-Powered Personal Finance Coach & Health Dashboard**

FinPilot is an intelligent personal finance platform designed to help users track transactions, manage budgets, discover hidden subscription leaks, monitor financial health scores, and receive actionable AI coaching insights.

---

## 🌟 Key Features

- 📊 **Financial Dashboard**: High-level overview of income, expenses, cash flow, and health metrics.
- 💳 **Transaction Tracking & Auto-Categorization**: Intelligent rule-based and AI categorisation of daily expenditures.
- 🔄 **Subscription & Leak Detection**: Identify recurring charges, unused subscriptions, and wasteful spending leaks.
- 🎯 **Budgeting & Goals**: Set category-specific budget limits, track progress, and stay on top of financial goals.
- 📈 **Financial Health Score Engine**: Dynamic scoring system evaluating savings rate, debt ratio, and spending behavior.
- 🤖 **AI Financial Coach**: Personalized financial advice, smart insights, and interactive recommendations.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/), Modern JavaScript (JSX)
- **Backend**: [Node.js](https://nodejs.org/), Express.js (Plain JavaScript)
- **Database**: Relational Database Schema (`database/schema.sql`)
- **Documentation**: Comprehensive API Specs and Guides in `docs/`

---

## 📁 Repository Structure

```
FinPilot/
├── frontend/                     # Next.js App Router Frontend
│   ├── app/                      # Page Routes (Dashboard, Budget, Subscriptions, Coach, Transactions)
│   │   ├── transactions/
│   │   ├── subscriptions/
│   │   ├── budget/
│   │   ├── coach/
│   │   ├── dashboard/
│   │   ├── layout.jsx
│   │   └── globals.css
│   ├── components/               # Modular UI Components
│   │   ├── transactions/
│   │   ├── subscriptions/
│   │   ├── budget-goals/
│   │   ├── health-score/
│   │   ├── ai-coach/
│   │   ├── dashboard/
│   │   └── common/
│   ├── services/api/             # Frontend API Integration Services
│   ├── context/                  # React Context & Global State
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── package.json
│
├── backend/                      # Node.js API Backend
│   ├── src/
│   │   ├── routes/               # API Express Routes
│   │   ├── controllers/          # Request Handlers
│   │   ├── services/             # Core Logic (Categorization, Leaks, Health Score, AI Coach)
│   │   ├── models/               # Data Models (User, Transaction, Subscription, Budget)
│   │   ├── middleware/           # Express Middlewares
│   │   ├── config/               # App Configuration
│   │   └── app.js                # Express Application Entrypoint
│   └── package.json
│
├── database/                     # Database Scripts & Migrations
│   ├── schema.sql                # Core SQL Schema Definitions
│   └── migrations/               # Database Migration Files
│
└── docs/                         # Project Documentation
    ├── README.md                 # Technical Setup & Overview
    └── api-spec.md               # REST API Endpoint Specifications
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
npm start
```

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.