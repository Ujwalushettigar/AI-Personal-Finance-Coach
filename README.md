# FinPilot 🚀 
> **AI-Powered Personal Finance Coach & Health Dashboard**

FinPilot is an intelligent personal finance platform designed to help users track transactions, manage budgets, discover hidden subscription leaks, monitor financial health scores, and receive actionable AI coaching insights.

---

## 🌟 Key Features

- 📊 **Financial Dashboard**: High-level overview of income, expenses, cash flow, and financial health metrics.
- 💳 **Transaction Tracking & Auto-Categorization**: Intelligent rule-based and AI categorisation of daily expenditures.
- 🔄 **Subscription & Leak Detection**: Identify recurring charges, unused subscriptions, and wasteful spending leaks.
- 🎯 **Budgeting & Goals**: Set category-specific budget limits, track progress, and stay on top of financial goals.
- 📈 **Financial Health Score Engine**: Dynamic scoring system evaluating savings rate, debt ratio, and spending behavior.
- 🤖 **AI Financial Coach**: Personalized financial advice, smart insights, and interactive recommendations.
- 🌌 **Unified Dark Theme & 3D Vanta Background**: Immersive dark fintech aesthetic powered by 3D Vanta WAVES (`vanta` + `three.js`) canvas and glassmorphic UI elements.

---

## 🎨 UI & Design System Architecture

The frontend follows a strictly unified, glassmorphic design system built for visual consistency across every route (`/`, `/login`, `/signup`, `/dashboard`, `/transactions`, `/subscriptions`, `/budget`, `/coach`):

- **Typography**: Global Google Font integration using **Share Tech** (`Share_Tech`), loaded via Next.js Font optimization (`--font-share-tech`).
- **Color Palette Tokens**:
  - `bg`: `#0A0E1A` (Deep Navy / Background)
  - `surface`: `rgba(255, 255, 255, 0.05)` (Translucent Dark Surface)
  - `border`: `rgba(255, 255, 255, 0.1)` (Subtle Glass Border)
  - `accent` / `positive`: `#39FF88` (Neon Green Accent & Positive Metrics)
  - `accent-2`: `#22D3EE` (Cyan Secondary Accent)
  - `negative`: `#FF5C7A` (Coral Red Warning / Expense Token)
- **GlassCard Component**: Every widget, stat card, modal, and list container uses `frontend/components/common/GlassCard.jsx` (`bg-[#0D1424]/70`, `backdrop-blur-md`, `border-border`).
- **Global Navigation Bar**: Single sticky `<Navbar />` rendered at `RootLayout` level, handling session state and navigation links across all pages seamlessly.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/), [Vanta.js](https://www.vantajs.com/) (WAVES 3D), [Three.js](https://threejs.org/), [Lucide React](https://lucide.dev/), Supabase Auth (`@supabase/supabase-js`)
- **Backend**: [Node.js](https://nodejs.org/), Express.js, Google Generative AI SDK (`@google/generative-ai`)
- **Database**: Relational Database Schema (`database/schema.sql`)
- **Documentation**: Comprehensive API Specs and Guides in `docs/`

---

## 📁 Repository Structure

```
FinPilot/
├── frontend/                     # Next.js App Router Frontend
│   ├── app/                      # Page Routes (Landing, Login, Signup, Dashboard, Budget, Subscriptions, Coach, Transactions)
│   │   ├── budget/
│   │   ├── coach/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── subscriptions/
│   │   ├── transactions/
│   │   ├── layout.jsx            # Root Layout (renders global VantaWavesBackground & Navbar)
│   │   ├── globals.css           # Global Theme CSS & Typography Variables
│   │   └── page.jsx              # Landing Page Route
│   ├── components/               # Modular UI Components
│   │   ├── common/               # Shared Global Components (GlassCard, Navbar, VantaWavesBackground)
│   │   ├── budget-goals/
│   │   ├── dashboard/
│   │   ├── health-score/
│   │   ├── landing/
│   │   ├── subscriptions/
│   │   └── transactions/
│   ├── context/                  # React Context & Global State (AuthContext)
│   ├── services/api/             # Frontend API Integration Services
│   ├── tailwind.config.js        # Theme Color Tokens & Font Stack
│   ├── next.config.js
│   └── package.json
│
├── backend/                      # Node.js API Backend
│   ├── src/
│   │   ├── routes/               # Express API Routes (Transactions, Subscriptions, Budget, Coach, Health Score)
│   │   ├── controllers/          # Request Controllers
│   │   ├── services/             # Core Business Logic (Categorization, Leaks, Health Engine, Gemini AI Coach)
│   │   ├── models/               # Data Models & Schemas
│   │   ├── middleware/           # Auth & Validation Middlewares
│   │   ├── config/               # App & DB Configurations
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