import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/StockM.css';

const STATIC_LOGS = [
  { time: '11/21/2026, 09:15 AM', action: 'Stock Restocked', detail: 'Industrial Barcode Scanner (ELC-1001) restocked', delta: '+14' },
  { time: '11/20/2026, 04:40 PM', action: 'Order Fulfilled', detail: 'Heavy-Duty Corrugated Boxes (PKG-2011) dispatched', delta: '-12' },
  { time: '11/20/2026, 01:10 PM', action: 'Low Stock Warning', detail: 'Thermal Shipping Labels (PKG-2040) fell below threshold', delta: '8 left' },
  { time: '11/19/2026, 10:05 AM', action: 'Item Created', detail: 'Added USB-C Docking Station (ELC-1088) to Aisle A-04', delta: '+19' }
];

function StockM() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logs, setLogs] = useState(STATIC_LOGS);

  return (
    <div className="app-layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <span>NexusStock</span>
          </div>
          <button className="icon-btn mobile-only" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </NavLink>
          <NavLink to="/inventory" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" />
            </svg>
            Inventory
            <span className="nav-badge">3</span>
          </NavLink>
          <NavLink to="/stock-movements" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Stock Movements
          </NavLink>
          <NavLink to="/suppliers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Suppliers
          </NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn mobile-only" onClick={() => setSidebarOpen(true)}>☰</button>
            <div>
              <h1 className="page-title">Stock Movements</h1>
              <p className="page-subtitle">Audit trail of additions, edits, and stock adjustments</p>
            </div>
          </div>
          <div className="topbar-actions">
            <button className="btn btn-secondary" onClick={() => setLogs([])}>Clear Log</button>
          </div>
        </header>

        <section className="view-section active">
          <div className="card">
            <div className="card-header">
              <h2>Recent Stock Audit Log</h2>
              <span className="muted-text">{logs.length} entries</span>
            </div>
            <div className="activity-list">
              {logs.length === 0 ? (
                <p className="muted-text">No stock movements recorded.</p>
              ) : (
                logs.map((l, idx) => (
                  <div className="activity-row" key={idx}>
                    <div>
                      <strong>{l.action}</strong>
                      <div className="muted-text">{l.detail}</div>
                    </div>
                    <div className="activity-right">
                      <span className="chip">{l.delta}</span>
                      <span className="muted-text">{l.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default StockM;