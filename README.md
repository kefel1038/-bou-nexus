# BoU Nexus — Uganda Financial Inclusion & Intelligence Platform

> **One Platform. Every Ugandan. Every Financial Service.**

A national financial operating system for Uganda, unifying Mobile Money, SACCOs, Commercial Banks, SMEs, Treasury Investments, Forex Monitoring, Financial Inclusion Analytics, Consumer Protection, Fraud Detection, and Bank of Uganda Regulatory Oversight into one integrated ecosystem.

---

## System Architecture

```
Citizen Layer
  ├── USSD
  ├── WhatsApp
  ├── Mobile App
  └── Web Portal
         ↓
Unified API Layer (Express.js :4000)
         ↓
Shared Financial Database (In-Memory Mock Data)
         ↓
AI Intelligence Layer (FastAPI :8000)
  ├── Credit Scoring Engine
  ├── Fraud Detection Engine
  └── Loan Prediction Engine
         ↓
Bank of Uganda Command Center (Next.js :3000)
  ├── Financial Inclusion Dashboard
  ├── Fraud Monitoring
  ├── Consumer Protection
  ├── Economic Intelligence
  ├── Capital Markets
  └── Financial Inclusion Map
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS, Recharts, Leaflet.js, Lucide Icons |
| **Backend** | Express.js, TypeScript, JWT Authentication |
| **AI Engine** | FastAPI, Python, Scikit-Learn, Pandas, NumPy |
| **Maps** | OpenStreetMap, Leaflet.js, react-leaflet |
| **Auth** | JWT, Role-Based Access Control |

---

## Modules

1. **Digital Savings & Treasury Investments** — Save money, buy T-Bills (12%) and T-Bonds (14%) from UGX 5,000
2. **Alternative Credit Scoring** — AI-powered scoring for farmers & SMEs using mobile money, crop yield, and utility data
3. **Fraud Sentinel AI** — Real-time fraud detection with risk scoring, velocity checks, and geographic anomaly detection
4. **Consumer Protection Center** — Multi-language complaint submission (English, Luganda, Luo, Runyankole, Ateso, Swahili)
5. **Financial Inclusion Map** — GIS dashboard with district-level access scores, banks, SACCOs, agents, and ATMs
6. **FX & Currency Intelligence** — Forex monitoring, currency conversion, and counterfeit reporting
7. **SME Digitalization** — Inventory management, cashflow tracking, business health scoring, tax estimation
8. **Regional Payments** — EAC cross-border payments with currency conversion and cost comparison
9. **School Fees Escrow** — Parent deposit → School request → Parent approval → Funds released

---

## Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- npm or yarn

### 1. Start the Backend API (Express.js)
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:4000
```

### 2. Start the AI Engine (FastAPI)
```bash
cd ai-engine
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# Runs on http://localhost:8000
```

### 3. Start the Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### 4. Open the Application
- **Landing Page**: http://localhost:3000
- **BOU Command Center**: http://localhost:3000/bou-command-center
- **Admin Login**: http://localhost:3000/admin

### Demo Credentials
All accounts use PIN: `1234`

| Account | Phone | Role |
|---------|-------|------|
| BOU Admin | +256700000001 | admin |
| Citizen | +256700000002 | citizen |
| Farmer | +256700000003 | farmer |
| SME Owner | +256700000004 | sme |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with phone + PIN |
| GET | `/api/health` | Health check |
| **Savings** | | |
| GET | `/api/savings` | List all savings |
| POST | `/api/savings` | Create savings account |
| **Investments** | | |
| GET | `/api/investments` | List investments |
| POST | `/api/investments` | Create investment (tbill/tbond) |
| **Credit Scoring** | | |
| POST | `/api/credit-score` | Generate credit score |
| GET | `/api/credit-scores` | List credit scores |
| **Complaints** | | |
| GET | `/api/complaints` | List complaints |
| POST | `/api/complaints` | Submit complaint |
| GET | `/api/complaints/stats` | Complaint statistics |
| **Fraud** | | |
| GET | `/api/fraud-alerts` | List fraud alerts |
| GET | `/api/fraud-alerts/stats` | Fraud statistics |
| POST | `/api/fraud-alerts/analyze` | Analyze transaction for fraud |
| **Analytics** | | |
| GET | `/api/analytics/overview` | Platform overview |
| GET | `/api/analytics/financial-inclusion` | Inclusion data |
| GET | `/api/analytics/consumer-protection` | Consumer stats |
| GET | `/api/analytics/fraud-monitoring` | Fraud stats |
| GET | `/api/analytics/economic` | Economic stats |
| GET | `/api/analytics/capital-markets` | Capital markets |
| **SME** | | |
| GET | `/api/sme` | List SMEs |
| POST | `/api/sme` | Register SME |
| **FX** | | |
| GET | `/api/fx/rates` | Current FX rates |
| GET | `/api/fx/history` | FX history |
| **Escrow** | | |
| GET | `/api/escrow` | List escrow transactions |
| POST | `/api/escrow` | Create escrow deposit |
| **Inclusion Map** | | |
| GET | `/api/inclusion-map` | All districts |
| GET | `/api/inclusion-map/:district` | Specific district |

### AI Engine Endpoints (FastAPI :8000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/credit-score` | ML-powered credit scoring |
| POST | `/api/fraud/analyze` | ML fraud analysis |
| POST | `/api/loan/predict` | Loan approval prediction |
| POST | `/api/savings/predict` | Savings projection |
| GET | `/api/health` | AI engine health |

---

## Mock Data

The system generates realistic mock Ugandan data:
- **10,000+ citizens** across 23 districts
- **500+ SMEs** across 10 sectors
- **300+ SACCOs**
- **2,000+ complaints**
- **50+ fraud alerts**
- **1,000+ treasury investments**

---

## Deployment

### Frontend (Vercel)
```bash
cd frontend
npx vercel --prod
```

### Backend (Render)
1. Push to GitHub
2. Create new Web Service on Render
3. Set root directory: `backend`
4. Build command: `npm install && npm run build`
5. Start command: `npm start`

### AI Engine (Render)
1. Create new Web Service
2. Set root directory: `ai-engine`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port 8000`

### Docker
```bash
docker-compose up --build
```

---

## Project Structure

```
bou-nexus/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── index.ts         # Server entry point
│   │   ├── middleware/       # Auth middleware
│   │   ├── routes/           # API routes (all modules)
│   │   └── data/             # Mock data generator
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # Next.js 15 App
│   ├── src/
│   │   ├── app/              # Pages (10 routes)
│   │   ├── components/       # UI & module components
│   │   └── lib/              # API client & types
│   ├── package.json
│   └── next.config.js
├── ai-engine/               # FastAPI AI Engine
│   ├── main.py
│   ├── models/               # ML models & schemas
│   ├── routes/               # API routes
│   └── requirements.txt
├── docker-compose.yml
└── README.md
```

---

## Security

- JWT-based authentication
- Role-based access control (citizen, farmer, sme, sacco, bank, bou_analyst, admin)
- PIN-based login simulation
- Fraud event logging
- Encrypted communication simulation

---

## User Roles

| Role | Permissions |
|------|-------------|
| Citizen | Save, invest, check credit, submit complaints |
| Farmer | Agricultural credit scoring, farm savings |
| SME Owner | Business registration, inventory, cashflow |
| SACCO Officer | SACCO management |
| Bank Officer | Banking operations |
| BOU Analyst | Full analytics access, command center |
| Admin | System administration, all access |

---

## License

This project is a prototype demonstration for the Bank of Uganda Financial Inclusion & Intelligence Platform.
