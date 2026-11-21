import React, { useState, useMemo } from 'react';
import { NavLink, Link } from 'react-router-dom';
import '../styles/Home.css';

const STATIC_ITEMS = [
  { id: '1', name: 'Industrial Barcode Scanner', sku: 'ELC-1001', category: 'Electronics', supplier: 'Apex Tech Supply', price: 129.00, qty: 34, minQty: 10, location: 'A-12' },
  { id: '2', name: 'Thermal Shipping Labels (500/Roll)', sku: 'PKG-2040', category: 'Packaging', supplier: 'SwiftPack Logistics', price: 14.50, qty: 8, minQty: 15, location: 'B-03' },
  { id: '3', name: 'Ergonomic Mesh Task Chair', sku: 'FRN-3012', category: 'Furniture', supplier: 'Nordic Office Co.', price: 245.00, qty: 12, minQty: 5, location: 'D-01' },
  { id: '4', name: 'Heavy-Duty Corrugated Boxes (25pk)', sku: 'PKG-2011', category: 'Packaging', supplier: 'SwiftPack Logistics', price: 32.00, qty: 0, minQty: 12, location: 'B-08' },
  { id: '5', name: 'USB-C Docking Station', sku: 'ELC-1088', category: 'Electronics', supplier: 'Apex Tech Supply', price: 89.99, qty: 19, minQty: 8, location: 'A-04' },
  { id: '6', name: 'Steel Shelving Bolt Kit', sku: 'HRD-4090', category: 'Hardware', supplier: 'Titan Industrial', price: 18.75, qty: 6, minQty: 10, location: 'C-15' }
];

const EMPTY_FORM = { name: '', sku: '', category: '', supplier: '', price: '', qty: '', minQty: '', location: '' };

function Home() {
  const [inventory, setInventory] = useState(STATIC_ITEMS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2800);
  };

  const getStockStatus = (item) => {
    if (item.qty === 0) return { key: 'out', label: 'Out of Stock', badge: 'badge-danger' };
    if (item.qty <= item.minQty) return { key: 'low', label: 'Low Stock', badge: 'badge-warning' };
    return { key: 'in', label: 'In Stock', badge: 'badge-success' };
  };

  const metrics = useMemo(() => {
    const totalValue = inventory.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalUnits = inventory.reduce((sum, item) => sum + item.qty, 0);
    const categories = [...new Set(inventory.map((i) => i.category))].sort();
    const lowItems = inventory.filter((i) => i.qty > 0 && i.qty <= i.minQty);
    const outItems = inventory.filter((i) => i.qty === 0);

    const categoryTotals = categories
      .map((cat) => ({
        cat,
        val: inventory.filter((i) => i.category === cat).reduce((s, i) => s + i.price * i.qty, 0)
      }))
      .sort((a, b) => b.val - a.val);

    return {
      totalValue,
      totalUnits,
      categories,
      lowItems,
      outItems,
      alertCount: lowItems.length + outItems.length,
      priorityItems: [...outItems, ...lowItems].slice(0, 5),
      categoryTotals
    };
  }, [inventory]);

  const adjustStock = (id, delta) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newQty = Math.max(0, item.qty + delta);
        showToast(`Updated ${item.sku} stock to ${newQty}`);
        return { ...item, qty: newQty };
      })
    );
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      sku: formData.sku.trim().toUpperCase(),
      category: formData.category.trim(),
      supplier: formData.supplier.trim(),
      price: parseFloat(formData.price),
      qty: parseInt(formData.qty, 10),
      minQty: parseInt(formData.minQty, 10),
      location: formData.location.trim()
    };
    setInventory((prev) => [payload, ...prev]);
    showToast('New product added');
    setFormData(EMPTY_FORM);
    setModalOpen(false);
  };

  const resetDemoData = () => {
    setInventory(STATIC_ITEMS);
    showToast('Default values restored');
  };

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
            <span className="nav-badge">{metrics.alertCount}</span>
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

        <div className="sidebar-footer">
          <button className="btn btn-ghost btn-sm full-width" onClick={resetDemoData}>Reset Demo Data</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn mobile-only" onClick={() => setSidebarOpen(true)}>☰</button>
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p className="page-subtitle">Overview of stock levels, valuation, and alerts</p>
            </div>
          </div>
          <div className="topbar-actions">
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}>+ Add Item</button>
          </div>
        </header>

        <section className="view-section active">
          <div className="kpi-grid">
            <div className="kpi-card">
              <span className="kpi-label">Total Inventory Value</span>
              <strong className="kpi-value">${metrics.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              <span className="kpi-meta">{metrics.totalUnits.toLocaleString()} total units in warehouse</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Active SKUs</span>
              <strong className="kpi-value">{inventory.length}</strong>
              <span className="kpi-meta">Across {metrics.categories.length} categories</span>
            </div>
            <div className="kpi-card warning">
              <span className="kpi-label">Low Stock Alerts</span>
              <strong className="kpi-value">{metrics.lowItems.length}</strong>
              <span className="kpi-meta">Items at or below reorder point</span>
            </div>
            <div className="kpi-card danger">
              <span className="kpi-label">Out of Stock</span>
              <strong className="kpi-value">{metrics.outItems.length}</strong>
              <span className="kpi-meta">Immediate restock required</span>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="card">
              <div className="card-header">
                <h2>Valuation by Category</h2>
              </div>
              <div className="category-bars">
                {metrics.categoryTotals.map(({ cat, val }) => {
                  const pct = metrics.totalValue > 0 ? Math.round((val / metrics.totalValue) * 100) : 0;
                  return (
                    <div className="cat-bar-item" key={cat}>
                      <div className="cat-bar-top">
                        <span>{cat}</span>
                        <span>${val.toLocaleString('en-US', { minimumFractionDigits: 2 })} ({pct}%)</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2>Restock Priority</h2>
                <Link to="/inventory" className="link-btn">View All</Link>
              </div>
              <div className="priority-list">
                {metrics.priorityItems.length === 0 ? (
                  <p className="muted-text">All items are adequately stocked.</p>
                ) : (
                  metrics.priorityItems.map((item) => {
                    const st = getStockStatus(item);
                    return (
                      <div className="priority-item" key={item.id}>
                        <div>
                          <strong>{item.name}</strong>
                          <div className="muted-text">{item.sku} • Reorder min: {item.minQty}</div>
                        </div>
                        <div className="priority-actions">
                          <span className={`badge ${st.badge}`}>{item.qty} left</span>
                          <button className="btn btn-sm btn-secondary" onClick={() => adjustStock(item.id, 10)}>+10</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {modalOpen && (
        <div className="modal-backdrop open">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Product</h2>
              <button className="icon-btn" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAddSubmit} className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>SKU Code *</label>
                  <input type="text" required value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <input type="text" required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Supplier *</label>
                  <input type="text" required value={formData.supplier} onChange={(e) => setFormData({ ...formData, supplier: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Unit Price ($) *</label>
                  <input type="number" step="0.01" min="0" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Current Quantity *</label>
                  <input type="number" min="0" required value={formData.qty} onChange={(e) => setFormData({ ...formData, qty: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Reorder Threshold *</label>
                  <input type="number" min="0" required value={formData.minQty} onChange={(e) => setFormData({ ...formData, minQty: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Bin Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={`toast ${toastMsg ? 'show' : ''}`}>{toastMsg}</div>
    </div>
  );
}

export default Home;