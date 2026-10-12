import { useEffect, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, ChevronDown, CircleHelp,
  Clock3, Database, Ellipsis, FileCode2, LayoutDashboard, Plus, RefreshCw,
  Search, Settings2, ShieldCheck, Table2, Terminal, Wifi, X
} from "lucide-react";

type Connection = {
  id: string; name: string; engine: string; environment: string;
  status: "Connected" | "Attention"; host: string; database: string;
  latency: string;
};
type TableInfo = { name: string; schema: string; rows: string; updated: string };
type ApiData = {
  connections: Connection[];
  tables: TableInfo[];
  query: string;
  results: { customer_id: string; full_name: string; email: string; status: string }[];
};

const fallback: ApiData = {
  connections: [
    { id: "1", name: "Customer DB", engine: "PostgreSQL 16", environment: "Development", status: "Connected", host: "pg-dev.internal", database: "customers_dev", latency: "18 ms" },
    { id: "2", name: "Analytics DB", engine: "PostgreSQL 15", environment: "Staging", status: "Connected", host: "pg-staging.internal", database: "analytics_stage", latency: "26 ms" },
    { id: "3", name: "Orders DB", engine: "PostgreSQL 16", environment: "Production", status: "Attention", host: "pg-prod.internal", database: "orders_prod", latency: "—" }
  ],
  tables: [
    { name: "customers", schema: "public", rows: "12,480", updated: "2 min ago" },
    { name: "orders", schema: "public", rows: "86,214", updated: "5 min ago" },
    { name: "products", schema: "public", rows: "1,204", updated: "1 hour ago" },
    { name: "audit_events", schema: "audit", rows: "249,801", updated: "Just now" }
  ],
  query: "SELECT customer_id, full_name, email, status\nFROM customers\nORDER BY created_at DESC\nLIMIT 5;",
  results: [
    { customer_id: "CUS-1048", full_name: "Aarav Mehta", email: "aarav@example.com", status: "Active" },
    { customer_id: "CUS-1047", full_name: "Maya Shah", email: "maya@example.com", status: "Active" },
    { customer_id: "CUS-1046", full_name: "Rohan Iyer", email: "rohan@example.com", status: "Pending" },
    { customer_id: "CUS-1045", full_name: "Anaya Rao", email: "anaya@example.com", status: "Active" },
    { customer_id: "CUS-1044", full_name: "Kabir Joshi", email: "kabir@example.com", status: "Inactive" }
  ]
};

export default function App() {
  const [data, setData] = useState<ApiData>(fallback);
  const [apiState, setApiState] = useState<"loading" | "connected" | "offline">("loading");
  const [toast, setToast] = useState("");
  const [filter, setFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => {
        if (!r.ok) throw new Error("API request failed");
        return r.json();
      })
      .then((json: ApiData) => { setData(json); setApiState("connected"); })
      .catch(() => setApiState("offline"));
  }, []);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  }

  const visibleConnections = data.connections.filter((c) =>
    `${c.name} ${c.environment} ${c.database}`.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Database size={19} /></span><span>DB Access Portal<small>DEMO WORKSPACE</small></span></div>
        <div className="nav-label">WORKSPACE</div>
        <a className="nav active" href="#overview"><LayoutDashboard size={17}/> Overview</a>
        <a className="nav" href="#connections"><Database size={17}/> Connections <b>{data.connections.length}</b></a>
        <a className="nav" href="#tables"><Table2 size={17}/> Tables</a>
        <a className="nav" href="#query"><Terminal size={17}/> Query editor</a>
        <div className="sidebar-bottom">
          <div className="demo-tag"><span className="pulse" /> Mock data mode enabled</div>
          <div className="profile"><div className="avatar">SB</div><div><strong>Demo administrator</strong><small>Portfolio workspace</small></div><Ellipsis size={18} className="muted-icon"/></div>
        </div>
      </aside>

      <main className="main" id="overview">
        <header className="topbar">
          <div className="breadcrumbs">Workspace <span>/</span> <strong>Overview</strong></div>
          <div className="top-actions">
            <span className={`api-pill ${apiState}`}><i /> {apiState === "connected" ? "API CONNECTED" : apiState === "offline" ? "SAMPLE PREVIEW" : "CONNECTING API"}</span>
            <button className="icon-button" aria-label="Notifications" onClick={() => notify("No new demo notifications.")}><Bell size={18}/></button>
            <div className="avatar small">SB</div>
          </div>
        </header>

        <section className="welcome">
          <div><p className="eyebrow">DATABASE OPERATIONS</p><h1>Database overview</h1><p className="subtitle">Monitor environments and review access activity from one place.</p></div>
          <button className="primary" onClick={() => setShowAdd(true)}><Plus size={16}/> Add connection</button>
        </section>

        <section className="stats">
          <article className="stat-card"><div className="stat-top"><span>Total connections</span><span className="stat-icon blue"><Database size={17}/></span></div><div className="stat-value">0{data.connections.length} <span className="trend"><ArrowUpRight size={12}/> +1 this month</span></div><div className="stat-foot">Across all environments</div></article>
          <article className="stat-card"><div className="stat-top"><span>Healthy connections</span><span className="stat-icon green"><ShieldCheck size={17}/></span></div><div className="stat-value">0{data.connections.filter(c => c.status === "Connected").length} <span className="green-text">67% healthy</span></div><div className="mini-progress"><span /></div></article>
          <article className="stat-card"><div className="stat-top"><span>Queries today</span><span className="stat-icon purple"><FileCode2 size={17}/></span></div><div className="stat-value">1,284 <span className="trend"><ArrowUpRight size={12}/> 12.8%</span></div><div className="stat-foot">Illustrative demo metric</div></article>
          <article className="stat-card"><div className="stat-top"><span>Avg. response time</span><span className="stat-icon amber"><Clock3 size={17}/></span></div><div className="stat-value">22 <small>ms</small></div><div className="stat-foot">Across healthy connections</div></article>
        </section>

        <section className="panel" id="connections">
          <div className="panel-heading"><div><h2>Database connections</h2><p>Connection status across your environments</p></div><div className="heading-actions"><label className="search"><Search size={14}/><input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter connections"/></label><button className="text-btn" onClick={() => notify("Connection list refreshed from demo API.")}><RefreshCw size={13}/> Refresh</button></div></div>
          <div className="table-wrap"><table><thead><tr><th>DATABASE</th><th>ENGINE</th><th>ENVIRONMENT</th><th>STATUS</th><th>LATENCY</th><th /></tr></thead><tbody>
            {visibleConnections.map((db) => <tr key={db.id}><td><div className="db-cell"><span className="db-icon"><Database size={16}/></span><div><strong>{db.name}</strong><small>{db.database}</small></div></div></td><td>{db.engine}</td><td><span className={`env ${db.environment.toLowerCase()}`}>{db.environment}</span></td><td><span className={`status ${db.status === "Connected" ? "good" : "warn"}`}><i/>{db.status}</span></td><td className="latency">{db.latency}</td><td><button className="more" aria-label={`Details for ${db.name}`} onClick={() => notify(`${db.name} · ${db.host} · ${db.database}`)}><Ellipsis size={18}/></button></td></tr>)}
            {visibleConnections.length === 0 && <tr><td colSpan={6} className="empty">No connections match your search.</td></tr>}
          </tbody></table></div>
          <div className="panel-footer"><span>Showing <strong>{visibleConnections.length}</strong> connections</span><span>Demo values <span className="footer-dot">•</span> Last refreshed just now</span></div>
        </section>

        <div className="lower-grid">
          <section className="panel" id="tables">
            <div className="panel-heading"><div><h2>Recently accessed tables</h2><p>Sample objects from your databases</p></div><button className="more" aria-label="Table options" onClick={() => notify("Showing sample table metadata.")}><Ellipsis size={18}/></button></div>
            <div className="table-list">{data.tables.map(t => <div className="table-row" key={t.name}><span className="table-icon"><Table2 size={16}/></span><div className="table-name"><strong>{t.name}</strong><small>{t.schema} schema</small></div><div className="row-count"><strong>{t.rows}</strong><small>rows</small></div><div className="updated">{t.updated}</div></div>)}</div>
            <div className="panel-footer"><span>{data.tables.length} sample tables</span><a href="#query">Explore query editor →</a></div>
          </section>

          <section className="panel query-panel" id="query">
            <div className="panel-heading"><div><h2>Query preview</h2><p>Example SQL — not executed</p></div><span className="language">SQL</span></div>
            <div className="editor"><div className="editor-gutter">1<br/>2<br/>3<br/>4</div><pre><span className="kw">SELECT</span> customer_id, full_name, email, status{"\n"}<span className="kw">FROM</span> customers{"\n"}<span className="kw">ORDER BY</span> created_at <span className="kw">DESC</span>{"\n"}<span className="kw">LIMIT</span> 5;</pre></div>
            <div className="query-controls"><span><Wifi size={12}/> PostgreSQL · customers_dev</span><button className="run-btn" onClick={() => notify("Query execution is disabled in this UI demo.")}><Terminal size={12}/> Run query</button></div>
            <div className="results-head"><strong>Sample results</strong><span>{data.results.length} rows · mock data</span></div>
            <div className="result-table"><table><thead><tr><th>ID</th><th>NAME</th><th>STATUS</th></tr></thead><tbody>{data.results.slice(0, 3).map(r => <tr key={r.customer_id}><td>{r.customer_id}</td><td>{r.full_name}</td><td><span className={`result-status ${r.status.toLowerCase()}`}>{r.status}</span></td></tr>)}</tbody></table></div>
          </section>
        </div>
        <footer>DB Access Portal <span>•</span> React + TypeScript + Vite · FastAPI backend · fictional demo data</footer>
      </main>

      {showAdd && <div className="modal-backdrop" onClick={() => setShowAdd(false)}><section className="modal" onClick={e => e.stopPropagation()}><div className="modal-title"><div><h2>Add database connection</h2><p>UI demonstration only — no connection will be created.</p></div><button className="icon-button" onClick={() => setShowAdd(false)} aria-label="Close"><X size={18}/></button></div><label>Connection name<input value="New PostgreSQL connection" readOnly /></label><label>Database engine<select defaultValue="PostgreSQL"><option>PostgreSQL</option></select></label><label>Environment<select defaultValue="Development"><option>Development</option><option>Staging</option><option>Production</option></select></label><div className="modal-note"><CircleHelp size={15}/> Credentials and live connections are intentionally not supported in this mockup.</div><button className="primary full" onClick={() => { setShowAdd(false); notify("Demo mode: no connection was created."); }}>Close demo form</button></section></div>}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
