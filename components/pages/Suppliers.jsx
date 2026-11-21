import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Suppliers.css';

const STORAGE_KEY = 'nexus_stock_inventory_v1';

function Suppliers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const inventory = useMemo(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }, []);

  const alertCount = useMemo(() => inventory.filter((i) => i.qty <= i.minQty).length, [inventory]);

  const suppliers = useMemo(() => {
    const supplierMap = {};
    inventory.forEach((item) => {
      if (!supplierMap[item.supplier]) {
        supplierMap[item.supplier] = { skus: 0, units: 0, value: 0 };
      }
      supplierMap[item.supplier].skus += 1;
      supplierMap[item.supplier].units += item.qty;
      supplierMap[item.supplier].value += item.price * item.qty;
    });
    return Object.entries(supplierMap);
  }, [inventory]);

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
          <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </NavLink>
          <NavLink to="/inventory" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" />
            </svg>
            Inventory
            <span className="nav-badge">{alertCount}</span>
          </NavLink>
          <NavLink to="/stock-movements" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Stock Movements
          </NavLink>
          <NavLink to="/suppliers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
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
            {suppliers.length === 0 ? (
              <p className="muted-text">No suppliers found.</p>
            ) : (
              suppliers.map(([name, stats]) => (
                <div className="card supplier-card" key={name}>
                  <h3>{name}</h3>
                  <div className="supplier-stats">
                    <div><span className="muted-text">SKUs</span><strong>{stats.skus}</strong></div>
                    <div><span className="muted-text">Units</span><strong>{stats.units}</strong></div>
                    <div><span className="muted-text">Value</span><strong>${stats.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Suppliers;