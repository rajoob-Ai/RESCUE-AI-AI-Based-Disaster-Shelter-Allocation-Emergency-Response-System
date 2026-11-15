# RESCUE AI – AI-Based Disaster Shelter Allocation & Emergency Response System

[![System Status](https://img.shields.io/badge/System-Operational-emerald.svg)](https://github.com)
[![Architecture](https://img.shields.io/badge/Architecture-Multi--Agent%20%2B%20CSP%20%2B%20RAG-blue.svg)](https://github.com)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2014%20%7C%20TypeScript%20%7C%20Tailwind-blueviolet.svg)](https://github.com)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%20%7C%20SQLAlchemy-009688.svg)](https://github.com)


> **Academic Capstone Project | Department of Computer Science & Engineering**  
> **Student Author:** **Kovuru Rajoob** (Reg. No: 12506537, Roll: 53, B.Tech CSE - AIML)  
> **Project Supervisor:** **Ayushi Bhakuni** (Assistant Professor, Dept. of CSE)  
> **Institution:** Lovely Professional University, Phagwara  
> **Course Code:** CSE-276 Capstone Project  
> **Repository:** [rajoob-Ai/RESCUE-AI-AI-Based-Disaster-Shelter-Allocation-Emergency-Response-System](https://github.com/rajoob-Ai/RESCUE-AI-AI-Based-Disaster-Shelter-Allocation-Emergency-Response-System)

**RESCUE AI** is an intelligent disaster-shelter allocation platform engineered for emergency management commanders. It coordinates the safe, optimal, and explainable allocation of displaced populations into emergency shelters while adhering to strict safety, capacity, medical, and accessibility constraints.

---

## 🏛️ System Architecture

```
                                  ┌─────────────────────────────┐
                                  │      RescueBot AI (RAG)     │
                                  │   Gemini API + DB Grounding │
                                  └──────────────┬──────────────┘
                                                 │
┌────────────────────────────────────────────────▼─────────────────────────────────────────────────┐
│                                   RESCUE AI Command Interface                                    │
│       Overview · Disaster Map · Victim Registry · Shelter Mgmt · Multi-Agent · Model Comparison  │
└────────────────────────────────────────────────┬─────────────────────────────────────────────────┘
                                                 │ REST API (JSON)
┌────────────────────────────────────────────────▼─────────────────────────────────────────────────┐
│                                     FastAPI Backend Engine                                       │
├─────────────────────────┬─────────────────────────────┬──────────────────────────┬───────────────┤
│    CSP & Backtracking   │     Bayesian Reasoning      │    6-Agent Coordinator   │  Auth & RBAC  │
│  - Capacity & Safety    │  - P(Safe|Evidence)         │  - Location, Safety,     │  - JWT Auth   │
│  - Medical Match        │  - Likelihood factors       │    Shelter, Medical,     │  - Roles      │
│  - Weighted Objectives  │  - Confidence bounds        │    Alloc & Coordinator   │  - Auditing   │
└─────────────────────────┴──────────────┬──────────────┴──────────────────────────┴───────────────┘
                                         │ SQLAlchemy ORM
                                         ▼
                     ┌────────────────────────────────────────┐
                     │ PostgreSQL / SQLite Hybrid Data Store  │
                     │  - Victims & Vulnerability Traces      │
                     │  - Shelter Operational State           │
                     │  - Hazard Telemetry & Disaster Zones   │
                     └────────────────────────────────────────┘
```

---

## 🚀 Key Modules & Capabilities

1. **Overview Dashboard**: Command-center KPIs, shelter capacity utilization, priority distribution, live activity feed, and instant alerts.
2. **Disaster Monitoring Map (Dual Engine)**:
   - **OpenStreetMap / Leaflet**: Zero-configuration interactive map with disaster zones, evacuation corridors, and shelter risk pins.
   - **Google Maps API**: Satellite, terrain, and custom disaster polygons with geocoded proximity calculations.
3. **Victim Registration Module**: Complete CRUD, auto-priority classification (Critical, High, Medium, Low), family preservation, and CSV export.
4. **Shelter Management Module**: Real-time capacity monitoring, medical compatibility checks, wheelchair accessibility flags, and structural safety verification.
5. **AI Allocation Engine**:
   - **Constraint Satisfaction (CSP)**: Eliminates illegal assignments, enforces capacity caps, and optimizes distance + safety.
   - **Backtracking Search**: Explores state spaces with branch pruning; records explored states.
   - **Bayesian Networks**: Calculates $P(\text{Safe} \mid \text{Evidence})$ with confidence intervals.
   - **What-If Simulations**: Test shelter closures, capacity reductions, and elevated disaster severity on the fly.
6. **RescueBot AI Assistant**:
   - Conversational assistant embedded across the dashboard.
   - Grounded RAG with strict adherence to database facts.
   - Does not invent capacities; requires admin confirmation before committing allocation decisions.
7. **Multi-Agent AI Coordination**:
   - 6 specialized agents: *Location Agent*, *Safety Agent*, *Shelter Agent*, *Medical Agent*, *Allocation Agent*, *Coordinator Agent*.
   - Exchanging structured data and resolving competing evacuation objectives.
8. **AI Model Comparison**: Side-by-side benchmark of 7 paradigms (Rule-based, CSP, Backtracking, Bayesian, RL, LLM RAG, Multi-Agent).
9. **Analytics & Reports**: Visual demographic breakdown, algorithm benchmarks, CSV data exports, and printable emergency briefs.
10. **Admin Settings**: Strict safety invariants, RBAC verification, Google Maps & Gemini API credentials, and cache clearing.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, Recharts, Leaflet, Google Maps JS API |
| **Backend** | Python 3.10+, FastAPI, Pydantic v2, SQLAlchemy, Uvicorn |
| **AI / Logic** | CSP with Heuristic Scoring, Backtracking Solver, Bayesian Probability Network, Multi-Agent Orchestrator, Google Gemini API (RAG) |
| **Database** | PostgreSQL / SQLite (self-seeding demo mode) |

---

## ⚙️ Quick Start Installation

### Prerequisites
- Node.js 18+ & npm
- Python 3.10+

### 1. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server (Seeds demo data automatically into SQLite on startup)
python -m uvicorn main:app --reload --port 8000
```
Backend API will be live at: `http://localhost:8000`  
Swagger documentation: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```
Open your browser at: `http://localhost:3000`

---

## 🔑 Demo Login Credentials

| Role | Username | Password | Access Level |
|---|---|---|---|
| **Administrator** | `admin` | `admin123` | Full control (Overrides, What-If, Configuration) |
| **Field Operator** | `operator1` | `operator123` | Registrations, Shelter updates, Map view |
| **Viewer** | `viewer` | `viewer123` | Read-only analytics and reports |

---

## 🌍 Environment Variables (`.env`)

Copy `.env.example` to `.env` in both frontend and backend directories:

```env
# Optional: Add keys to unlock real-time Gemini AI & Google Maps
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_key_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
NEXT_PUBLIC_API_URL=http://localhost:8000
```
*(If keys are not provided, RESCUE AI runs seamlessly in built-in **Demo Mode** using its rule-grounded fallback engines).*

---

## 🛡️ Security & Reliability Invariants

- **Default Deny**: All unauthenticated routes are protected via JWT tokens.
- **Safety Over 100% Allocation**: The engine never assigns victims to a damaged or unsafe shelter simply to reach full assignment quotas.
- **Explainability**: Every allocation recommendation includes a traceable score breakdown (Safety %, Distance in km, Medical Facility Match).
- **Human Approval**: The system functions strictly as a decision-support platform requiring officer confirmation for emergency dispatch changes.

---

## 📦 Academic Deliverables & Repository Structure (Whiteboard Specification)

In accordance with academic capstone submission guidelines, this repository provides:

1. **Project**: Production disaster management & shelter allocation platform.
2. **Code**: 
   - `frontend/`: Next.js 14 App Router, TypeScript, Tailwind CSS, Leaflet.js (15 routes).
   - `backend/`: FastAPI, SQLAlchemy, Google OR-Tools CP-SAT, Multi-Agent Orchestrator.
3. **README.md**: Complete technical documentation, setup instructions, and architecture guide.
4. **requirements.txt**: Root-level and backend dependencies specification.
5. **PPT (Presentation)**:
   - RESCUE_AI_PRESENTATION.pptx: Native 16:9 widescreen PowerPoint presentation (15 slides).
   - RESCUE_AI_PRESENTATION.pdf: PDF presentation deck.
   - RESCUE_AI_PRESENTATION.html: Interactive web presentation.
6. **Report (Dissertation)**:
   - RESCUE_AI_PROJECT_REPORT.pdf: University-standard formatted PDF report (Times New Roman 16/14/12pt).
   - LPU_FINAL_PROJECT_REPORT.html: Formatted HTML report with print-optimized CSS.
   - FINAL_PROJECT_REPORT.md: Master markdown dissertation.
   - IEEE_FINAL_REPORT.html: IEEE two-column publication report.
7. **Folder Structure**: Clean, modular structure without build artifacts or temporary files.

---

## 👥 Authorship & Academic Credits

- **Candidate:** **Kovuru Rajoob** (Registration No: 12506537, Roll: 23)
- **Faculty Guide:** **Ayushi Bhakuni** (Assistant Professor, Department of Computer Science & Engineering)
- **Institution:** Lovely Professional University, Phagwara, Punjab
- **Session:** 2024–2025
