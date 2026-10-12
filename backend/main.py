from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="DB Access Portal API",
    description="Mock API for the DB Access Portal UI demo. No real database is connected.",
    version="1.0.0",
)

# Local development only. Restrict origins before any shared/production deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)

CONNECTIONS = [
    {
        "id": "1", "name": "Customer DB", "engine": "PostgreSQL 16",
        "environment": "Development", "status": "Connected",
        "host": "pg-dev.internal", "database": "customers_dev", "latency": "18 ms",
    },
    {
        "id": "2", "name": "Analytics DB", "engine": "PostgreSQL 15",
        "environment": "Staging", "status": "Connected",
        "host": "pg-staging.internal", "database": "analytics_stage", "latency": "26 ms",
    },
    {
        "id": "3", "name": "Orders DB", "engine": "PostgreSQL 16",
        "environment": "Production", "status": "Attention",
        "host": "pg-prod.internal", "database": "orders_prod", "latency": "—",
    },
]

TABLES = [
    {"name": "customers", "schema": "public", "rows": "12,480", "updated": "2 min ago"},
    {"name": "orders", "schema": "public", "rows": "86,214", "updated": "5 min ago"},
    {"name": "products", "schema": "public", "rows": "1,204", "updated": "1 hour ago"},
    {"name": "audit_events", "schema": "audit", "rows": "249,801", "updated": "Just now"},
]

QUERY = """SELECT customer_id, full_name, email, status
FROM customers
ORDER BY created_at DESC
LIMIT 5;"""

RESULTS = [
    {"customer_id": "CUS-1048", "full_name": "Aarav Mehta", "email": "aarav@example.com", "status": "Active"},
    {"customer_id": "CUS-1047", "full_name": "Maya Shah", "email": "maya@example.com", "status": "Active"},
    {"customer_id": "CUS-1046", "full_name": "Rohan Iyer", "email": "rohan@example.com", "status": "Pending"},
    {"customer_id": "CUS-1045", "full_name": "Anaya Rao", "email": "anaya@example.com", "status": "Active"},
    {"customer_id": "CUS-1044", "full_name": "Kabir Joshi", "email": "kabir@example.com", "status": "Inactive"},
]

@app.get("/api/health")
def health():
    return {"status": "ok", "mode": "mock-data", "database_connected": False}

@app.get("/api/dashboard")
def dashboard():
    """Return fictional dashboard data for the React UI."""
    return {
        "connections": CONNECTIONS,
        "tables": TABLES,
        "query": QUERY,
        "results": RESULTS,
        "demo_mode": True,
    }

@app.get("/")
def root():
    return {
        "message": "DB Access Portal API",
        "docs": "/docs",
        "dashboard_endpoint": "/api/dashboard",
        "note": "Mock data only; no PostgreSQL connection is configured.",
    }
