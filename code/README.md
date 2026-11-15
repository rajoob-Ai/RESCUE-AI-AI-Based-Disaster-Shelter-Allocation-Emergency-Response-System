# 💻 Code Directory — RESCUE AI System Architecture

This directory provides direct links and structural documentation for the full-stack codebase of **RESCUE AI – AI-Based Disaster Shelter Allocation & Emergency Response System**.

---

## 🗂️ Code Organization

The complete operational codebase is divided into two primary sub-systems:

```
rescue-ai/
├── backend/                  # Python FastAPI Backend & Optimization Engines
│   ├── app/
│   │   ├── agents/          # Multi-Agent Coordination (Location, Safety, Shelter, Medical, Allocation, Coordinator)
│   │   ├── ai/              # Constraint Satisfaction (CSP), Backtracking Solver & RAG Chatbot
│   │   ├── api/             # RESTful API Endpoints (victims, shelters, maps, chat, analytics)
│   │   ├── core/            # Configuration, Database Engine & Security/RBAC
│   │   ├── models/          # SQLAlchemy Relational Models (Victims, Shelters, DisasterZones, Allocations)
│   │   └── schemas/         # Pydantic v2 Request/Response Validation Schemas
│   ├── main.py              # Application Entrypoint & OpenAPI Lifecycle
│   └── requirements.txt     # Python Dependencies
│
└── frontend/                 # Next.js 14 Web Application & Command Center
    ├── src/
    │   ├── app/             # Next.js App Router (10 Operational Modules)
    │   │   ├── (dashboard)/ # Overview, Map, Victims, Shelters, Allocation, Agents, Chatbot, Comparison, Analytics, Settings
    │   │   └── layout.tsx   # Command Center Layout & Hybrid Dark Navy Theme
    │   ├── components/      # Reusable UI & Geospatial Components
    │   │   ├── map/         # Leaflet (OSM) & Google Maps API Engine
    │   │   ├── chatbot/     # RescueBot Floating Assistant & Incident Map Cards
    │   │   └── charts/      # Recharts Analytical Visualizations
    │   └── lib/             # API Client & Trained RescueBot Intelligence Engine
    ├── package.json         # Node.js Dependencies
    └── tailwind.config.ts   # Design System Configuration
```

---

## 🔗 Direct Access to Code Modules

1. **[Backend Application Code](../backend/)**
   - Core API: [`backend/main.py`](../backend/main.py)
   - AI Allocation Engine: [`backend/app/ai/allocation_engine.py`](../backend/app/ai/allocation_engine.py)
   - Multi-Agent Orchestrator: [`backend/app/agents/multi_agent.py`](../backend/app/agents/multi_agent.py)
   - Chatbot Knowledge Engine: [`backend/app/ai/chatbot.py`](../backend/app/ai/chatbot.py)

2. **[Frontend Application Code](../frontend/)**
   - Command Dashboard: [`frontend/src/app/(dashboard)/dashboard/page.tsx`](../frontend/src/app/(dashboard)/dashboard/page.tsx)
   - Geospatial Operations Map: [`frontend/src/app/(dashboard)/map/page.tsx`](../frontend/src/app/(dashboard)/map/page.tsx)
   - Google Maps Engine Component: [`frontend/src/components/map/GoogleDisasterMap.tsx`](../frontend/src/components/map/GoogleDisasterMap.tsx)
   - RescueBot AI Engine: [`frontend/src/lib/rescueBotEngine.ts`](../frontend/src/lib/rescueBotEngine.ts)

---

## 🌐 Official GitHub Repository
- **Link:** [https://github.com/rajoob-Ai/RESCUE-AI-AI-Based-Disaster-Shelter-Allocation-Emergency-Response-System](https://github.com/rajoob-Ai/RESCUE-AI-AI-Based-Disaster-Shelter-Allocation-Emergency-Response-System)
