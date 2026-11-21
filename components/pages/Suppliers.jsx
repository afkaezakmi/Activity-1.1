import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Suppliers.css';

const STATIC_SUPPLIERS = [
  { name: 'Apex Tech Supply', skus: 2, units: 53, value: 6095.81 },
  { name: 'SwiftPack Logistics', skus: 2, units: 8, value: 116.00 },
  { name: 'Nordic Office Co.', skus: 1, units: 12, value: 2940.00 },
  { name: 'Titan Industrial', skus: 1, units: 6, value: 112.50 }
];

function Suppliers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
              <h1 className="page-title">Suppliers Directory</h1>
              <p className="page-subtitle">Vendor breakdown by active SKUs and total stock value</p>
            </div>
          </div>
        </header>

        <section className="view-section active">
          <div className="suppliers-grid">
            {STATIC_SUPPLIERS.map((sup) => (
              <div className="card supplier-card" key={sup.name}>
                <h3>{sup.name}</h3>
                <div className="supplier-stats">
                  <div><span className="muted-text">SKUs</span><strong>{sup.skus}</strong></div>
                  <div><span className="muted-text">Units</span><strong>{sup.units}</strong></div>
                  <div><span className="muted-text">Value</span><strong>${sup.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Suppliers;