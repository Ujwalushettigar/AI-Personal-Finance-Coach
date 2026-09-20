# FinPilot 🚀 
> **AI-Powered Personal Finance Coach, Health Telemetry & Asset Dashboard**

FinPilot is a comprehensive, AI-driven personal finance platform engineered to track transactions, manage category budgets, detect subscription leaks, compute real-time deterministic financial health scores, and deliver personalized AI financial coaching.

---

## 🌟 Features & Module Architecture

### 💳 1. Transaction Ledger & Flexible CSV Import Engine
- **Full CRUD Management**: Record, view, filter, edit, and delete income and expense transactions.
- **Categorical & Velocity Telemetry**: Live category spending distribution bars and weekly cashflow velocity charts.
- **Two-Step CSV Import Flow**:
  - **Step 1: Upload & Preview**: Upload `.csv` files up to 5MB and view a live 5-row sample preview table.
  - **Step 2: Auto-Detection & Manual Mapping**:
    - `csvMappingService` automatically normalizes headers and matches column aliases with typo tolerance (`withdrawls`, `deposits`, `cr`/`dr`, `txn_date`, etc.).
    - Confidence scoring (`isConfident`) flags ambiguous files for user verification via interactive dropdown selectors.
    - Multi-format date parsing (`dayjs`) supports `DD/MM/YYYY`, `MM/DD/YYYY`, `YYYY-MM-DD`, `DD-MM-YYYY`, `YYYY/MM/DD`, `DD.MM.YYYY`.
    - Sanitizes numeric input by stripping thousands separators (`,`), currency symbols (`$`, `₹`, `€`, `£`), and whitespace.
    - Duplicate-safe bulk database upserts based on unique `(user_id, external_ref)` index.
    - Detailed import summary report returning imported counts, duplicate counts, and invalid row error breakdown.

---

### 🔄 2. Subscriptions & Wasteful Leak Detection
- **Recurring Charge Telemetry**: Track active monthly subscriptions, total recurring cost, and renewal timelines.
- **Automated Leak Detection**: Identifies unused, duplicate, or high-cost subscriptions and computes annual waste potential.
- **Interactive Action Checklist**: Easily flag and audit rarely used subscriptions to reclaim capital.

---

### 🛡️ 3. Category Budgets & Milestone Savings Goals
- **Real-Time Category Spend Calculation**: Automatically computes actual category outflows derived directly from settled expense transactions within the selected billing period (`monthly`, `weekly`, `yearly`).
- **Dynamic Utilization Statusing**:
  - `Safe`: Utilization < 70% (Accent Green)
  - `Warning`: Utilization 70% – 89% (Amber/Yellow)
  - `Critical`: Utilization 90% – 100% (Orange)
  - `Exceeded`: Outflow > Budget Ceiling (Red)
- **Macro Telemetry Panel**: Live calculation of `totalAllocated`, `currentOutflow`, `remainingReserve`, and `capUtilization`.
- **Milestone Savings Goals**:
  - Target capital milestones with target dates and category tags.
  - Inline progress additions (`+ Add funds`) with live progress bars and milestone completion badges.

---

### 📈 4. Deterministic Financial Health Score Engine
- **100% Deterministic & Explainable**: Computes composite financial health without relying on non-deterministic LLM scoring.
- **Transparent 4-Component Weighted Architecture**:
  1. **Savings Rate (35% Weight)**: Ratio of net income retained after settled monthly expenses.
  2. **Budget Adherence (30% Weight)**: Fraction of active category budgets maintained within ceiling limits.
  3. **Subscription Load / Recurring Ratio (20% Weight)**: Proportion of monthly outflow tied up in recurring subscriptions.
  4. **Spending Consistency (15% Weight)**: Month-over-month expenditure volatility comparison.
- **Dynamic Weight Re-normalization**: Intelligently re-balances component weights when data points are absent, and returns an explicit `insufficientData` onboarding state for new accounts.
- **Standardized Letter Grades**: Maps composite scores (0–100) to letter grades (`A` >= 85, `B` >= 70, `C` >= 55, `D` < 55).

---

### 🤖 5. AI Financial Coach & Insight Engine
- **Generative AI Guidance**: AI coaching engine (Google Gemini / Mistral SDK) analyzing user spending patterns to provide tailored advice.
- **Actionable Advice Cards**: Specific recommendations for trimming subscription leaks, re-balancing category allocations, and building reserve buffers.

---

## 🎨 UI & Design System Architecture

FinPilot features a custom-crafted CryptoVault Fintech dark aesthetic designed for visual excellence and high performance across all routes (`/`, `/login`, `/signup`, `/dashboard`, `/transactions`, `/subscriptions`, `/budget`, `/coach`):

- **Typography**: Global Google Font integration using **Share Tech** (`Share_Tech`), loaded via Next.js Font optimization (`--font-share-tech`).
- **Color Palette Tokens**:
  - `Background`: `#0A0E1A` (Deep Space Navy)
  - `Card Surface`: `#0F1633` (Translucent Dark Surface)
  - `Glass Border`: `rgba(255, 255, 255, 0.08)` (Subtle Glassmorphic Line)
  - `Neon Accent`: `#39FF14` / `#22D36A` (Signature Neon Green Accent & Positive Metrics)
  - `Cyan Secondary`: `#0A84FF` / `#22D3EE` (Primary Action & Highlight Token)
  - `Warning`: `#F5A524` (Amber Warning Token)
  - `Negative / Alert`: `#FF4D6A` (Coral Red Warning / Expense Token)
- **GlassCard Component**: Standardized card container (`frontend/components/common/GlassCard.jsx`) utilizing `backdrop-blur-md` and glassmorphic borders.
- **Interactive 3D Vanta Background**: Dynamic 3D canvas animation (`vanta` + `three.js`) rendering soft background waves.

---

## 🔌 API Endpoint Specifications Matrix

### 💳 Transactions (`/api/transactions`)
- `GET /api/transactions` — List transactions for user with category, type, and date filtering
- `GET /api/transactions/:id` — Retrieve transaction by ID
- `POST /api/transactions` — Create a new transaction record
- `POST /api/transactions/preview-import` — Upload CSV and receive column headers, sample preview, auto-mapping, and confidence score
- `POST /api/transactions/import` — Upload CSV with confirmed column mapping for duplicate-safe bulk database ingestion
- `PUT /api/transactions/:id` — Update existing transaction
- `DELETE /api/transactions/:id` — Delete transaction record

### 🛡️ Budgets & Savings Goals (`/api/budget`)
- `GET /api/budget/with-spend?period=monthly` — Retrieve category budgets with real-time actual transaction spend and status
- `GET /api/budget/summary?period=monthly` — Retrieve aggregate budget summary metrics (`totalAllocated`, `currentOutflow`, `remainingReserve`, `capUtilization`)
- `GET /api/budget/health-score` — Compute and return real-time deterministic financial health score & breakdown
- `GET /api/budget` — List raw user budget allocations
- `POST /api/budget` — Create a new category budget ceiling
- `PUT /api/budget/:id` — Update budget allocation
- `DELETE /api/budget/:id` — Delete budget category
- `GET /api/budget/goals` — List savings goals
- `POST /api/budget/goals` — Create a new savings goal milestone
- `PUT /api/budget/goals/:id` — Update savings goal details
- `PATCH /api/budget/goals/:id/progress` — Add funds toward a savings goal milestone
- `DELETE /api/budget/goals/:id` — Delete savings goal

### 🔄 Subscriptions (`/api/subscriptions`)
- `GET /api/subscriptions` — List active subscriptions and detected wasteful leaks

### 📊 Dashboard (`/api/dashboard`)
- `GET /api/dashboard/summary` — Combined endpoint returning total income, total expense, 5 recent transactions, active subscriptions, and live health score

### 🤖 Coach (`/api/coach`)
- `POST /api/coach/chat` — Interact with AI Financial Coach for personalized insights

---

## 🛠️ Tech Stack & Dependencies

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), Custom Vanilla CSS Design System
- **Animation & Visuals**: [Vanta.js WAVES 3D](https://www.vantajs.com/), [Three.js](https://threejs.org/)
- **Icons & UI**: [Lucide React](https://lucide.dev/)
- **Authentication & API**: `@supabase/supabase-js`

### Backend
- **Runtime**: [Node.js](https://nodejs.org/), Express.js
- **File & CSV Processing**: `multer`, `csv-parse`, `dayjs`
- **Database & RLS**: Supabase PostgreSQL with Row Level Security (RLS)
- **AI Integrations**: `@google/generative-ai`, `@mistralai/mistralai`

---

## 📁 Repository Structure

```
FinPilot/
├── frontend/                     # Next.js App Router Frontend
│   ├── app/                      # Page Routes
│   │   ├── budget/               # Budget & Savings Goals dashboard page
│   │   ├── coach/                # AI Coach chat interface page
│   │   ├── dashboard/            # Overview telemetry dashboard page
│   │   ├── login/                # Authentication login page
│   │   ├── signup/               # Authentication signup page
│   │   ├── subscriptions/        # Subscription leaks & tracking page
│   │   ├── transactions/         # Transaction ledger & CSV import page
│   │   ├── layout.jsx            # Root layout with Vanta 3D background & sticky Navbar
│   │   ├── globals.css           # Global theme tokens & typography CSS
│   │   └── page.jsx              # Landing page
│   ├── components/               # UI Components
│   │   ├── common/               # Shared GlassCard, Navbar, Vanta background
│   │   ├── budget-goals/         # BudgetOverview, BudgetCard, SavingsGoalCard, SavingsGoalFormModal
│   │   ├── dashboard/            # Overview widgets, StatCard, HealthScoreGauge
│   │   ├── health-score/         # HealthScoreTab, HealthScoreDashboard, HealthScoreSkeleton
│   │   ├── landing/              # Landing page feature blocks
│   │   ├── subscriptions/        # Subscription cards & leak detection checklist
│   │   └── transactions/         # TransactionForm, TransactionList, TransactionFilters, CsvImportModal
│   ├── context/                  # React AuthContext & session management
│   ├── services/api/             # Frontend API integration services (budget, transactions, subscriptions, dashboard)
│   ├── tailwind.config.js        # Theme color tokens & Share Tech font configuration
│   └── package.json
│
├── backend/                      # Node.js Express API Backend
│   ├── src/
│   │   ├── routes/               # API routes (transactions, budget, subscriptions, dashboard, coach)
│   │   ├── controllers/          # Controllers (transactionController, budgetController, subscriptionController, dashboardController, coachController)
│   │   ├── services/             # Services (budgetService, csvMappingService, healthScoreEngine, insightEngine, coachService)
│   │   ├── models/               # Schemas & Models (Transaction, Budget, SavingsGoal, Subscription, User)
│   │   ├── middleware/           # verifyAuth middleware
│   │   ├── config/               # Supabase db client configuration
│   │   └── app.js                # Express app entrypoint
│   └── package.json
│
├── database/                     # Database Schema & Migrations
│   ├── schema.sql                # Core PostgreSQL table schemas & RLS policies
│   └── migrations/               # Database migration scripts
│
└── docs/                         # Project Documentation
    ├── README.md                 # System Overview & Manual
    └── api-spec.md               # API Specifications
```

---

## ⚙️ Getting Started & Installation

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will start at `http://localhost:3000`.

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
The backend API server will start at `http://localhost:5000`.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for details.