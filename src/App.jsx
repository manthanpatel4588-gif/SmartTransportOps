import React, { useState, useEffect, useMemo } from 'react';
import { DEFAULT_DRIVERS } from './mockData';

export default function App() {
  // --- React State ---
  const [drivers, setDrivers] = useState(() => {
    const saved = localStorage.getItem('smartops_drivers');
    return saved ? JSON.parse(saved) : DEFAULT_DRIVERS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [showEligibleOnly, setShowEligibleOnly] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editDriverId, setEditDriverId] = useState(null);

  // Delete Prompt State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteDriverId, setDeleteDriverId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    licenseCategory: '',
    expiryDate: '',
    contactNumber: '',
    safetyScore: '',
    status: 'Available'
  });

  const [formErrors, setFormErrors] = useState({});
  const [toasts, setToasts] = useState([]);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('smartops_drivers', JSON.stringify(drivers));
  }, [drivers]);

  // --- Toast Manager ---
  const triggerToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // --- Metrics Aggregations ---
  const metrics = useMemo(() => {
    const total = drivers.length;
    const available = drivers.filter((d) => d.status === 'Available').length;
    const onTrip = drivers.filter((d) => d.status === 'On Trip').length;
    const safetyAvg = total > 0 
      ? Math.round((drivers.reduce((acc, curr) => acc + Number(curr.safetyScore), 0) / total) * 10) / 10
      : 0;

    return { total, available, onTrip, safetyAvg };
  }, [drivers]);

  // --- Query Filter & Sorting ---
  const filteredDrivers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    // Filter by eligibility if toggled
    const sourceDrivers = showEligibleOnly ? getEligibleDrivers(drivers) : drivers;
    
    let result = sourceDrivers.filter((driver) => {
      const matchesSearch = 
        driver.name.toLowerCase().includes(query) ||
        driver.licenseNumber.toLowerCase().includes(query) ||
        driver.licenseCategory.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'All' || driver.status === statusFilter;
      const matchesCategory = categoryFilter === 'All' || driver.licenseCategory === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'safety-desc') {
      result.sort((a, b) => b.safetyScore - a.safetyScore);
    } else if (sortBy === 'safety-asc') {
      result.sort((a, b) => a.safetyScore - b.safetyScore);
    } else if (sortBy === 'expiry-asc') {
      result.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    }

    return result;
  }, [drivers, searchQuery, statusFilter, categoryFilter, sortBy, showEligibleOnly]);

  // --- Utility Functions ---
  const getInitials = (name) => {
    if (!name) return 'DR';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getExpiryStatus = (dateString) => {
    if (!dateString) return { text: 'N/A', className: '' };
    const refDate = new Date('2026-07-12');
    const expiryDate = new Date(dateString);
    const diffTime = expiryDate - refDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formatted = expiryDate.toLocaleDateString(undefined, options);

    if (diffDays < 0) {
      return { text: `Expired (${formatted})`, className: 'expiry-alert' };
    } else if (diffDays <= 30) {
      return { text: `Expiring soon (${diffDays}d)`, className: 'expiry-alert' };
    }
    return { text: formatted, className: '' };
  };

  // --- Form & Modal Handlers ---
  const openModal = (driverId = null) => {
    setFormErrors({});
    if (driverId) {
      const driver = drivers.find((d) => d.id === driverId);
      if (driver) {
        setEditDriverId(driverId);
        setFormData({
          name: driver.name,
          licenseNumber: driver.licenseNumber,
          licenseCategory: driver.licenseCategory,
          expiryDate: driver.expiryDate,
          contactNumber: driver.contactNumber,
          safetyScore: driver.safetyScore,
          status: driver.status
        });
      }
    } else {
      setEditDriverId(null);
      setFormData({
        name: '',
        licenseNumber: '',
        licenseCategory: '',
        expiryDate: '',
        contactNumber: '',
        safetyScore: '',
        status: 'Available'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditDriverId(null);
  };

  const openDeleteModal = (driverId) => {
    setDeleteDriverId(driverId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteDriverId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when editing field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // --- Input Validation ---
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Driver name is required.';
    }
    if (!formData.licenseNumber.trim()) {
      errors.licenseNumber = 'License number is required.';
    }
    if (!formData.contactNumber.trim()) {
      errors.contactNumber = 'Contact number is required.';
    } else {
      const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;
      if (!phoneRegex.test(formData.contactNumber.trim())) {
        errors.contactNumber = 'Enter a valid contact format, e.g. +1 (555) 019-2834.';
      }
    }

    if (!formData.licenseCategory) {
      errors.licenseCategory = 'Please select a license category.';
    }
    if (!formData.expiryDate) {
      errors.expiryDate = 'Expiry date is required.';
    }
    
    const score = parseInt(formData.safetyScore, 10);
    if (isNaN(score) || score < 0 || score > 100) {
      errors.safetyScore = 'Safety score must be a number between 0 and 100.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      id: editDriverId || `drv_${Date.now()}`,
      name: formData.name.trim(),
      licenseNumber: formData.licenseNumber.trim(),
      licenseCategory: formData.licenseCategory,
      expiryDate: formData.expiryDate,
      contactNumber: formData.contactNumber.trim(),
      safetyScore: parseInt(formData.safetyScore, 10),
      status: formData.status
    };

    if (editDriverId) {
      // Update
      setDrivers((prev) =>
        prev.map((d) => (d.id === editDriverId ? payload : d))
      );
      triggerToast(`Driver "${payload.name}" profile updated successfully.`, 'success');
    } else {
      // Create
      setDrivers((prev) => [payload, ...prev]);
      triggerToast(`Driver "${payload.name}" has been registered successfully.`, 'success');
    }

    closeModal();
  };

  const confirmDelete = () => {
    const target = drivers.find((d) => d.id === deleteDriverId);
    if (target) {
      setDrivers((prev) => prev.filter((d) => d.id !== deleteDriverId));
      triggerToast(`Driver "${target.name}" was successfully deleted.`, 'danger');
    }
    closeDeleteModal();
  };

  const deleteTargetName = useMemo(() => {
    const target = drivers.find((d) => d.id === deleteDriverId);
    return target ? target.name : 'this driver';
  }, [drivers, deleteDriverId]);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">🚀</span>
          <span className="logo-text">SmartOps</span>
        </div>
        <nav className="sidebar-menu">
          <a href="#" className="menu-item active" id="nav-drivers">
            <span className="menu-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </span>
            Drivers
          </a>
          <a href="#" className="menu-item" id="nav-vehicles">
            <span className="menu-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </span>
            Vehicles (Mock)
          </a>
          <a href="#" className="menu-item" id="nav-trips">
            <span className="menu-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </span>
            Trips (Mock)
          </a>
        </nav>
        <div className="sidebar-footer">
          <span className="version-text">v1.3.0 (React)</span>
        </div>
      </aside>

      {/* Main Body */}
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-title-container">
            <h1 className="page-title">Driver Management</h1>
            <p class="page-subtitle">Track, edit, and optimize your transport fleet's operators.</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary" id="btn-add-driver" onClick={() => openModal()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Driver
            </button>
          </div>
        </header>

        {/* Metrics Cards Panel */}
        <section className="metrics-grid" id="metrics-panel" aria-label="Key Performance Indicators">
          {/* Card 1: Total */}
          <div className="metric-card bg-glow-blue">
            <div className="card-glow"></div>
            <div className="metric-header">
              <span className="metric-label">Total Operators</span>
              <div className="metric-icon-wrapper text-blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              </div>
            </div>
            <div className="metric-value" id="metric-total">{metrics.total}</div>
            <div className="metric-trend text-muted">Registered in database</div>
          </div>

          {/* Card 2: Available */}
          <div className="metric-card bg-glow-green">
            <div className="card-glow"></div>
            <div className="metric-header">
              <span className="metric-label">Active & Available</span>
              <div className="metric-icon-wrapper text-green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
            </div>
            <div className="metric-value" id="metric-available">{metrics.available}</div>
            <div className="metric-trend text-green">Ready for assignment</div>
          </div>

          {/* Card 3: On Trip */}
          <div className="metric-card bg-glow-yellow">
            <div className="card-glow"></div>
            <div className="metric-header">
              <span className="metric-label">On Trip</span>
              <div className="metric-icon-wrapper text-yellow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/></svg>
              </div>
            </div>
            <div className="metric-value" id="metric-ontrip">{metrics.onTrip}</div>
            <div className="metric-trend text-yellow">Currently on transit routes</div>
          </div>

          {/* Card 4: Avg Safety Score */}
          <div className="metric-card bg-glow-purple">
            <div className="card-glow"></div>
            <div className="metric-header">
              <span className="metric-label">Avg Safety Score</span>
              <div className="metric-icon-wrapper text-purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
            </div>
            <div className="metric-value" id="metric-safety">{metrics.safetyAvg}%</div>
            <div className="metric-trend text-purple">Target: &gt;90% fleet standard</div>
          </div>
        </section>

        {/* Table Filters & Control Header */}
        <section className="controls-panel">
          <div className="search-box">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              id="search-input"
              placeholder="Search by name, license number or category..."
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" id="btn-clear-search" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>
          <div className="filters-box">
            <label className="checkbox-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none', fontSize: '14px', color: 'var(--color-text-secondary)', padding: '0 8px' }}>
              <input
                type="checkbox"
                checked={showEligibleOnly}
                onChange={(e) => setShowEligibleOnly(e.target.checked)}
                style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px', cursor: 'pointer' }}
              />
              Assignable Only
            </label>
            <div className="select-wrapper">
              <select 
                id="filter-status" 
                aria-label="Filter by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Available">Available</option>
                <option value="On Trip">On Trip</option>
                <option value="Off Duty">Off Duty</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            <div className="select-wrapper">
              <select 
                id="filter-category" 
                aria-label="Filter by License Category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All License Categories</option>
                <option value="Class A">Class A</option>
                <option value="Class B">Class B</option>
                <option value="Class C">Class C</option>
                <option value="Heavy Rigid">Heavy Rigid</option>
              </select>
            </div>
            <div className="select-wrapper">
              <select 
                id="sort-by" 
                aria-label="Sort options"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Sort by: Default</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="safety-desc">Safety Score (High-Low)</option>
                <option value="safety-asc">Safety Score (Low-High)</option>
                <option value="expiry-asc">Expiry (Soonest First)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Responsive Table Container */}
        <section className="table-container">
          <table className="driver-table" id="driver-table" style={{ display: filteredDrivers.length === 0 ? 'none' : 'table' }}>
            <thead>
              <tr>
                <th>Driver Details</th>
                <th>License Info</th>
                <th>Contact</th>
                <th>Safety Score</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="driver-table-body">
              {filteredDrivers.map((driver) => {
                let scoreColor = 'var(--color-success)';
                if (driver.safetyScore < 75) scoreColor = 'var(--color-danger)';
                else if (driver.safetyScore < 90) scoreColor = 'var(--color-warning)';

                const expiryInfo = getExpiryStatus(driver.expiryDate);

                let statusClass = 'available';
                if (driver.status === 'On Trip') statusClass = 'ontrip';
                else if (driver.status === 'Off Duty') statusClass = 'offduty';
                else if (driver.status === 'Suspended') statusClass = 'suspended';

                return (
                  <tr key={driver.id}>
                    <td className="driver-details-cell" data-label="Driver Details">
                      <div className="driver-avatar">{getInitials(driver.name)}</div>
                      <div>
                        <div className="driver-name">{driver.name}</div>
                        <div className="driver-license-sub">{driver.licenseNumber}</div>
                      </div>
                    </td>
                    <td data-label="License Info">
                      <div>Category: <span className="license-category-badge">{driver.licenseCategory}</span></div>
                      <div className="driver-license-sub" style={{ marginTop: '4px' }}>
                        Expires: <span className={expiryInfo.className}>{expiryInfo.text}</span>
                      </div>
                    </td>
                    <td data-label="Contact">
                      <div style={{ fontWeight: '500' }}>{driver.contactNumber}</div>
                    </td>
                    <td data-label="Safety Score">
                      <div className="safety-score-container">
                        <span className="safety-score-number" style={{ color: scoreColor }}>{driver.safetyScore}%</span>
                        <div className="safety-score-track">
                          <div className="safety-score-bar" style={{ width: `${driver.safetyScore}%`, backgroundColor: scoreColor }}></div>
                        </div>
                      </div>
                    </td>
                    <td data-label="Status">
                      <span className={`status-pill ${statusClass}`}>
                        <span className="status-dot"></span>
                        {driver.status}
                      </span>
                      <div style={{ marginTop: '6px' }}>
                        {(() => {
                          const refDate = new Date('2026-07-12');
                          const isSuspended = driver.status === 'Suspended';
                          const isOnTrip = driver.status === 'On Trip';
                          const isExpired = new Date(driver.expiryDate) < refDate;
                          const isEligible = !isSuspended && !isOnTrip && !isExpired;

                          if (isEligible) {
                            return (
                              <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                ● Eligible
                              </span>
                            );
                          }
                          
                          let reason = 'Expired';
                          if (isSuspended) reason = 'Suspended';
                          else if (isOnTrip) reason = 'On Trip';

                          return (
                            <span 
                              style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'help' }} 
                              title={isSuspended ? 'Suspended operator' : isOnTrip ? 'Driver is currently on a trip' : 'License has expired'}
                            >
                              ● Ineligible ({reason})
                            </span>
                          );
                        })()}
                      </div>
                    </td>
                    <td className="actions-cell" data-label="Actions">
                      <button className="action-btn btn-edit" onClick={() => openModal(driver.id)} title="Edit Profile" aria-label="Edit Profile">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button className="action-btn btn-delete" onClick={() => openDeleteModal(driver.id)} title="Delete Profile" aria-label="Delete Profile">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Table Empty State */}
          <div className="table-empty-state" id="table-empty-state" style={{ display: filteredDrivers.length === 0 ? 'block' : 'none' }}>
            <div className="empty-icon">🔍</div>
            <h3 className="empty-title">No drivers match your search</h3>
            <p className="empty-subtitle">Try refining your search terms or adjustments to filters.</p>
          </div>
        </section>
      </main>

      {/* Modal Form (Add & Edit Driver) */}
      {isModalOpen && (
        <div className="modal-backdrop" id="driver-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-card">
            <header className="modal-header">
              <h2 className="modal-title" id="modal-title">{editDriverId ? 'Edit Driver Profile' : 'Add New Driver'}</h2>
              <button className="modal-close" onClick={closeModal} aria-label="Close modal">✕</button>
            </header>
            <form id="driver-form" onSubmit={handleFormSubmit} noValidate>
              <div className="form-grid">
                {/* Driver Name */}
                <div className={`form-group col-span-2 ${formErrors.name ? 'invalid' : ''}`}>
                  <label htmlFor="input-driver-name" className="required">Driver Name</label>
                  <input
                    type="text"
                    id="input-driver-name"
                    name="name"
                    placeholder="e.g. Alexander Pierce"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                </div>

                {/* License Number */}
                <div className={`form-group ${formErrors.licenseNumber ? 'invalid' : ''}`}>
                  <label htmlFor="input-license-number" class="required">License Number</label>
                  <input
                    type="text"
                    id="input-license-number"
                    name="licenseNumber"
                    placeholder="e.g. DL-4859203"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.licenseNumber && <span className="error-message">{formErrors.licenseNumber}</span>}
                </div>

                {/* License Category */}
                <div className={`form-group ${formErrors.licenseCategory ? 'invalid' : ''}`}>
                  <label htmlFor="input-license-category" class="required">License Category</label>
                  <div className="select-wrapper">
                    <select
                      id="input-license-category"
                      name="licenseCategory"
                      value={formData.licenseCategory}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled hidden>Select category</option>
                      <option value="Class A">Class A (Heavy Truck)</option>
                      <option value="Class B">Class B (Commercial bus)</option>
                      <option value="Class C">Class C (Light vehicles)</option>
                      <option value="Heavy Rigid">Heavy Rigid (HR Multi-axle)</option>
                    </select>
                  </div>
                  {formErrors.licenseCategory && <span className="error-message">{formErrors.licenseCategory}</span>}
                </div>

                {/* Expiry Date */}
                <div className={`form-group ${formErrors.expiryDate ? 'invalid' : ''}`}>
                  <label htmlFor="input-expiry-date" class="required">Expiry Date</label>
                  <input
                    type="date"
                    id="input-expiry-date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.expiryDate && <span className="error-message">{formErrors.expiryDate}</span>}
                </div>

                {/* Contact Number */}
                <div className={`form-group ${formErrors.contactNumber ? 'invalid' : ''}`}>
                  <label htmlFor="input-contact-number" class="required">Contact Number</label>
                  <input
                    type="tel"
                    id="input-contact-number"
                    name="contactNumber"
                    placeholder="e.g. +1 (555) 019-2834"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.contactNumber && <span className="error-message">{formErrors.contactNumber}</span>}
                </div>

                {/* Safety Score */}
                <div className={`form-group ${formErrors.safetyScore ? 'invalid' : ''}`}>
                  <label htmlFor="input-safety-score" class="required">Safety Score (0-100)</label>
                  <input
                    type="number"
                    id="input-safety-score"
                    name="safetyScore"
                    placeholder="95"
                    min="0"
                    max="100"
                    value={formData.safetyScore}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.safetyScore && <span className="error-message">{formErrors.safetyScore}</span>}
                </div>

                {/* Status */}
                <div className="form-group">
                  <label htmlFor="input-status" class="required">Status</label>
                  <div className="select-wrapper">
                    <select
                      id="input-status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Available">Available</option>
                      <option value="On Trip">On Trip</option>
                      <option value="Off Duty">Off Duty</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>

              <footer className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Driver</button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {isDeleteModalOpen && (
        <div className="modal-backdrop" id="delete-modal" role="dialog" aria-modal="true" aria-labelledby="delete-title">
          <div className="modal-card modal-confirm">
            <header className="modal-header">
              <h2 className="modal-title text-danger" id="delete-title">Delete Driver Profile?</h2>
              <button className="modal-close" onClick={closeDeleteModal} aria-label="Close modal">✕</button>
            </header>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{deleteTargetName}</strong>? This action is permanent and cannot be undone.</p>
            </div>
            <footer class="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>Cancel</button>
              <button type="button" className="btn btn-danger" onClick={confirmDelete}>Delete Profile</button>
            </footer>
          </div>
        </div>
      )}

      {/* Toast Notification System */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span className="toast-content">{toast.message}</span>
            <button className="toast-close" onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Eligibility Helper ---
export function getEligibleDrivers(driversList) {
  const refDate = new Date('2026-07-12');
  return driversList.filter((driver) => {
    const isSuspended = driver.status === 'Suspended';
    const isOnTrip = driver.status === 'On Trip';
    const isExpired = new Date(driver.expiryDate) < refDate;
    return !isSuspended && !isOnTrip && !isExpired;
  });
}
