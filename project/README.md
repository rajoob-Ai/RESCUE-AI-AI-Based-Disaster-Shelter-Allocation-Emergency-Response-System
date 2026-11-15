# 🚀 Project Directory — RESCUE AI Overview

> **Capstone Dissertation Project (CSE-276)**  
> **Author:** Kovuru Rajoob (Reg: 12506537, Roll: 53, B.Tech CSE - AIML)  
> **Supervisor:** Ayushi Bhakuni (Assistant Professor, Dept. of CSE)  
> **Institution:** Lovely Professional University, Phagwara  

---

## 📌 Project Summary

**RESCUE AI** is an intelligent disaster-shelter allocation platform engineered for emergency management commanders. It coordinates the safe, optimal, and explainable allocation of displaced populations into emergency shelters while adhering to strict safety, capacity, medical, and accessibility constraints.

### Key Highlights:
1. **Multi-Criteria Mathematical Solver**: CP-SAT Constraint Satisfaction (OR-Tools) + Backtracking Search.
2. **Dual-Engine Geospatial System**: OpenStreetMap (Leaflet) + Google Maps JavaScript API with satellite/terrain overlays.
3. **Multi-Agent Coordination Pipeline**: 6 specialized agents exchanging structured JSON telemetry.
4. **Trained RescueBot AI Assistant**: RAG-grounded emergency chatbot answering disaster queries, triage instructions, and shelter telemetry.
5. **What-If Simulation Engine**: Dynamic recalculation during shelter isolation or flood surge exacerbation.

---

## 🔗 Official Repository Link
- **GitHub:** [https://github.com/rajoob-Ai/RESCUE-AI-AI-Based-Disaster-Shelter-Allocation-Emergency-Response-System](https://github.com/rajoob-Ai/RESCUE-AI-AI-Based-Disaster-Shelter-Allocation-Emergency-Response-System)

---

## 🛠️ Execution Quickstart

### Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
