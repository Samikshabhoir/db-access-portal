# DB Access Portal — React + FastAPI Demo

A UI-focused database access portal mockup using the intended stack:

- **Frontend:** React, TypeScript, Vite, Lucide icons
- **Backend:** Python, FastAPI, Uvicorn
- **Database concept:** PostgreSQL (fictional demo records only)

> **Demo safety:** The backend returns mock data. It does not connect to PostgreSQL, store credentials, or execute SQL. The query editor is illustrative only.

## Project structure

```text
db-access-portal/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       └── styles.css
├── backend/
│   ├── main.py
│   └── requirements.txt
└── README.md
```

## Prerequisites

- Python 3.10+
- Node.js 20+ and npm

## Run the backend

Open terminal 1 from the repository root:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Backend API: http://127.0.0.1:8000  
Swagger API docs: http://127.0.0.1:8000/docs  
Health check: http://127.0.0.1:8000/api/health  
Dashboard data: http://127.0.0.1:8000/api/dashboard

Keep this terminal running.

## Run the frontend

Open terminal 2 from the repository root:

```bash
cd frontend
npm install
npm run dev
```

Open **http://127.0.0.1:5173** in your browser. Vite proxies `/api` requests to the local FastAPI server on port `8000`.

If the API isn't running, the UI will still show its local sample preview. Start both servers for the API-connected demo indicator.

## Add these files to your existing GitHub repository

If you already cloned your `db-access-portal` repository, copy the `frontend/` and `backend/` folders plus this README into that repository. Preserve other files you need. Remove the old Flask demo files only if you no longer want them.

Review and commit:

```bash
git status
git add frontend/ backend/ README.md
git commit -m "Use React TypeScript Vite frontend and FastAPI backend"
git push
```

## Notes

- The Vite development server uses port `5173`; FastAPI uses port `8000`. This avoids macOS AirPlay/AirTunes conflicts commonly seen on port `5000`.
- `127.0.0.1` means the same machine running the browser. For a remote EC2 host, use SSH port forwarding or a properly configured deployment rather than exposing development servers directly.
- Do not commit `.venv`, `node_modules`, passwords, access keys, or `.env` files.
- For production, add authentication, authorization, audit logs, managed secrets, safe query controls, TLS, and a production ASGI server configuration before connecting to real databases.

## Tech stack

React · TypeScript · Vite · Python · FastAPI · Uvicorn · PostgreSQL (mock data)
