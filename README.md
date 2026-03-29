# Hospital Patient Analytics

> A portfolio-grade, full-stack healthcare analytics project — from raw MySQL data to a production-ready interactive dashboard.

---

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | Vercel (deploy instructions below) |
| Backend API | Render (deploy instructions below) |

---

## Problem Statement

Hospital administrators need to understand patient flow, cost patterns, readmission risk, and insurance coverage in real time. This project analyzes **27,891 patient encounters** across **973 patients** sourced from a real MySQL hospital database, answering four core business questions:

1. How many patients have been admitted or readmitted over time?
2. What is the average length of stay (LOS)?
3. What is the average cost per visit?
4. How many procedures are covered by insurance?

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        hospital_db (MySQL)                       │
│   encounters │ patients │ payers │ procedures                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │  SQLAlchemy
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              Jupyter Notebook  (hospital_analysis.ipynb)        │
│  Data Cleaning → Feature Engineering → EDA → ML Models          │
│                          │ exports                              │
│              data/processed/*.json  (6 files)                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │  reads
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│               FastAPI Backend  (backend/)                       │
│  6 REST endpoints · lru_cache · CORS                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │  fetch
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│             Next.js 14 Frontend  (frontend/)                    │
│  App Router · TypeScript · Tailwind CSS · Recharts              │
│  6 dashboard pages · Dark/Light mode · CSV export               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Dataset

| Table | Rows | Description |
|-------|------|-------------|
| `encounters` | 27,891 | Hospital visits with cost, payer, class, and timing |
| `patients` | 973 | Demographics, birthdate, deathdate |
| `payers` | 10 | Insurance providers (Medicare, Medicaid, Aetna, etc.) |
| `procedures` | 47,701 | Clinical procedures with base cost |

**Encounter classes:** ambulatory · outpatient · urgentcare · emergency · wellness · inpatient

---

## Key Findings

- **31% of encounters** have no insurance (NO_INSURANCE payer)
- Inpatient LOS averages **~4–6 days**; all-class median is **< 1 hour** (mostly ambulatory)
- **30-day readmission rate ≈ 14–18%** — highest in emergency and inpatient classes
- Top procedures by cost include **chemotherapy, dialysis, and bronchoscopy**
- Seasonal analysis reveals peak admission months in **winter and early spring**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Data Store | MySQL 8.x |
| Analysis | Python 3.13, pandas, numpy, matplotlib, seaborn, plotly |
| ML | scikit-learn, imbalanced-learn, statsmodels |
| Backend | FastAPI 0.111, uvicorn, pydantic v2 |
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Charts | Recharts 2.12 |
| Theming | next-themes (dark/light mode) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Dashboard Pages

| Page | Description |
|------|-------------|
| **Overview** | 5 KPI cards + admissions trend + insurance donut + LOS/cost distributions |
| **Admissions** | Daily/weekly/monthly encounter volume + readmission rate, granularity toggle |
| **Cost Analysis** | Cost by encounter class/payer + top 15 procedures table |
| **Length of Stay** | LOS distribution (all) + by encounter class/reason breakdown |
| **Insurance** | Coverage donut + by-payer breakdown + out-of-pocket analysis |
| **Risk Patients** | Sortable, paginated table of top 200 high-risk patients with filters |

---

## Predictive Models

| Model | Target | Algorithm | AUC |
|-------|--------|-----------|-----|
| Readmission Risk | 30-day readmission | Logistic Regression + SMOTE | ~0.72–0.78 |
| High-Cost Prediction | Top-20% cost within class | Random Forest + SMOTE | ~0.79–0.85 |

Features: age, LOS, cost_per_day, encounter_class, payer, insurance coverage, gender, age group, prior encounter count.

---

## Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- MySQL 8.x with `hospital_db` database

### 1. Clone & configure
```bash
git clone <repo-url>
cd hospital_analysis
cp .env.example .env   # fill in DB credentials
```

### 2. Install Python deps & run notebook
```bash
pip install -r requirements_notebook.txt
jupyter notebook notebooks/hospital_analysis.ipynb
# Run all cells — this exports data/processed/*.json
```

### 3. Start the API
```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000
# Docs at: http://localhost:8000/docs
```

### 4. Start the frontend
```bash
cd frontend
npm install
npm run dev
# Open: http://localhost:3000
```

---

## Deployment

### Backend → Render
1. Push to GitHub
2. New Web Service on Render → connect repo
3. Start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
4. Copy the Render URL

### Frontend → Vercel
1. Import GitHub repo on Vercel
2. Set env var: `NEXT_PUBLIC_API_URL=<your-render-url>`
3. Deploy — Vercel auto-detects Next.js

---

## Project Structure

```
hospital_analysis/
├── .env                          # DB credentials (gitignored)
├── requirements_notebook.txt     # Python analysis deps
├── data/
│   └── processed/                # 6 JSON files from notebook
├── notebooks/
│   └── hospital_analysis.ipynb   # Full analysis (6 sections)
├── backend/
│   ├── main.py                   # FastAPI app
│   ├── config.py                 # Cached JSON loader
│   ├── requirements.txt
│   └── routers/                  # 6 endpoint routers
└── frontend/
    ├── app/                      # Next.js App Router pages
    ├── components/               # Layout, UI, Charts
    └── lib/                      # API client, types, hooks
```

---

*Built with Python + FastAPI + Next.js · Powered by real hospital data*
