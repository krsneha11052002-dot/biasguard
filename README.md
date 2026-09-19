# biasguard

BiasGuard AI – AI Bias Detection & Fairness Audit Platform.

## Overview
This repository contains a full‑stack prototype built with React + Vite, Tailwind CSS, Recharts, and a Node + Express backend. The app lets users upload a CSV (or load a built‑in demo), configure target and protected columns, run fairness calculations, view visualisations, generate findings, and simulate mitigation.

## Local Development
```bash
# Install dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Run backend (default port 5000)
node backend/src/server.js

# Run frontend (Vite dev server, default http://localhost:5173)
npm run dev --prefix frontend
```

## Features
- Landing page, dashboard, findings, bounty submission, mitigation lab, report generation.
- Fairness metrics: positive outcome rate, statistical parity, disparate impact, FPR/FNR, accuracy per group.
- Recharts visualisations.
- Synthetic demo dataset with intentional bias.
- Fully client‑server API (`/api/audit`).

## License
MIT – Feel free to use, modify, and extend for hackathon projects.
