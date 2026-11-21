import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Inventory.css';

const STATIC_ITEMS = [
  { id: '1', name: 'Industrial Barcode Scanner', sku: 'ELC-1001', category: 'Electronics', supplier: 'Apex Tech Supply', price: 129.00, qty: 34, minQty: 10, location: 'A-12' },
  { id: '2', name: 'Thermal Shipping Labels (500/Roll)', sku: 'PKG-2040', category: 'Packaging', supplier: 'SwiftPack Logistics', price: 14.50, qty: 8, minQty: 15, location: 'B-03' },
  { id: '3', name: 'Ergonomic Mesh Task Chair', sku: 'FRN-3012', category: 'Furniture', supplier: 'Nordic Office Co.', price: 245.00, qty: 12, minQty: 5, location: 'D-01' },
  { id: '4', name: 'Heavy-Duty Corrugated Boxes (25pk)', sku: 'PKG-2011', category: 'Packaging', supplier: 'SwiftPack Logistics', price: 32.00, qty: 0, minQty: 12, location: 'B-08' },
  { id: '5', name: 'USB-C Docking Station', sku: 'ELC-1088', category: 'Electronics', supplier: 'Apex Tech Supply', price: 89.99, qty: 19, minQty: 8, location: 'A-04' },
  { id: '6', name: 'Steel Shelving Bolt Kit', sku: 'HRD-4090', category: 'Hardware', supplier: 'Titan Industrial', price: 18.75, qty: 6, minQty: 10, location: 'C-15' }
];

const EMPTY_FORM = { name: '', sku: '', category: '', supplier: '', price: '', qty: '', minQty: '', location: '' };

function Inventory() {
  const [inventory, setInventory] = useState(STATIC_ITEMS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
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

  const categories = useMemo(() => [...new Set(inventory.map((i) => i.category))].sort(), [inventory]);
  const alertCount = useMemo(() => inventory.filter((i) => i.qty <= i.minQty).length, [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.supplier.toLowerCase().includes(q);
      const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || getStockStatus(item).key === statusFilter;
      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [inventory, searchQuery, categoryFilter, statusFilter]);

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

  const deleteItem = (item) => {
    if (!window.confirm(`Remove "${item.name}" from inventory?`)) return;
    setInventory((prev) => prev.filter((i) => i.id !== item.id));
    showToast('Product removed');
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      sku: item.sku,
      category: item.category,
      supplier: item.supplier,
      price: item.price,
      qty: item.qty,
      minQty: item.minQty,
      location: item.location || ''
    });
    setModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name.trim(),
      sku: formData.sku.trim().toUpperCase(),
      category: formData.category.trim(),
      supplier: formData.supplier.trim(),
      price: parseFloat(formData.price),
      qty: parseInt(formData.qty, 10),
      minQty: parseInt(formData.minQty, 10),
      location: formData.location.trim()
    };

    if (editingId) {
      setInventory((prev) => prev.map((i) => (i.id === editingId ? { ...i, ...payload } : i)));
      showToast('Product updated');
    } else {
      setInventory((prev) => [{ id: Date.now().toString(), ...payload }, ...prev]);
      showToast('New product added');
    }
    setModalOpen(false);
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
            <span className="nav-badge">{alertCount}</span>
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
              <h1 className="page-title">Inventory Catalog</h1>
              <p className="page-subtitle">Manage SKUs, adjust stock counts, and filter items</p>
            </div>
          </div>
          <div className="topbar-actions">
            <button className="btn btn-primary" onClick={openAddModal}>+ Add Item</button>
          </div>
        </header>

        <section className="view-section active">
          <div className="card">
            <div className="toolbar">
              <div className="search-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by product name, SKU, or supplier..."
                />
              </div>
              <div className="filters">
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All Statuses</option>
                  <option value="in">In Stock</option>
                  <option value="low">Low Stock</option>
                  <option value="out">Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product / SKU</th>
                    <th>Category</th>
                    <th>Supplier</th>
                    <th>Unit Price</th>
                    <th>Stock Level</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.length === 0 ? (
                    <tr><td colSpan="7" className="empty-cell">No matching products found.</td></tr>
                  ) : (
                    filteredInventory.map((item) => {
                      const st = getStockStatus(item);
                      return (
                        <tr key={item.id}>
                          <td>
                            <div className="item-title">{item.name}</div>
                            <div className="item-sub">{item.sku} {item.location ? `• Bin ${item.location}` : ''}</div>
                          </td>
                          <td><span className="chip">{item.category}</span></td>
                          <td>{item.supplier}</td>
                          <td>${item.price.toFixed(2)}</td>
                          <td>
                            <div className="qty-control">
                              <button className="qty-btn" onClick={() => adjustStock(item.id, -1)}>−</button>
                              <span className="qty-val">{item.qty}</span>
                              <button className="qty-btn" onClick={() => adjustStock(item.id, 1)}>+</button>
                            </div>
                          </td>
                          <td><span className={`badge ${st.badge}`}>{st.label}</span></td>
                          <td className="text-right">
                            <button className="btn-icon" onClick={() => openEditModal(item)} title="Edit">✎</button>
                            <button className="btn-icon danger" onClick={() => deleteItem(item)} title="Delete">🗑</button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {modalOpen && (
        <div className="modal-backdrop open">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="icon-btn" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleFormSubmit} className="modal-body">
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

export default Inventory;