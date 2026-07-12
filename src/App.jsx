import React, { useState, useEffect, useMemo } from 'react';
import { 
  DEFAULT_DRIVERS, 
  DEFAULT_VEHICLES, 
  DEFAULT_TRIPS,
  DEFAULT_FUEL_LOGS,
  DEFAULT_MAINTENANCE_LOGS,
  DEFAULT_EXPENSES
} from './mockData';
import { dispatchTrip, completeTrip, cancelTrip } from './dispatchWorkflow';
import { getVehicleCostSummary } from './costCalculations';

export default function App() {
  // --- Active Tab State ---
  const [activeTab, setActiveTab] = useState('drivers'); // 'drivers', 'vehicles', 'trips', 'expenses'

  // --- Core States (localStorage backed) ---
  const [drivers, setDrivers] = useState(() => {
    const saved = localStorage.getItem('smartops_drivers');
    return saved ? JSON.parse(saved) : DEFAULT_DRIVERS;
  });

  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('smartops_vehicles');
    return saved ? JSON.parse(saved) : DEFAULT_VEHICLES;
  });

  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('smartops_trips');
    return saved ? JSON.parse(saved) : DEFAULT_TRIPS;
  });

  // Expense Log States
  const [fuelLogs, setFuelLogs] = useState(() => {
    const saved = localStorage.getItem('smartops_fuel_logs');
    return saved ? JSON.parse(saved) : DEFAULT_FUEL_LOGS;
  });

  const [maintenanceLogs, setMaintenanceLogs] = useState(() => {
    const saved = localStorage.getItem('smartops_maintenance_logs');
    return saved ? JSON.parse(saved) : DEFAULT_MAINTENANCE_LOGS;
  });

  const [otherExpenses, setOtherExpenses] = useState(() => {
    const saved = localStorage.getItem('smartops_expenses');
    return saved ? JSON.parse(saved) : DEFAULT_EXPENSES;
  });

  // --- Search & Filters State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [showEligibleOnly, setShowEligibleOnly] = useState(false);

  // --- Modals State ---
  // Driver Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editDriverId, setEditDriverId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteDriverId, setDeleteDriverId] = useState(null);

  // Trip Modal
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);

  // Expense Modal
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // --- Form States ---
  // Driver Form
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

  // Trip Form
  const [tripFormData, setTripFormData] = useState({
    route: '',
    driverId: '',
    vehicleId: ''
  });
  const [tripFormErrors, setTripFormErrors] = useState({});

  // Expense Form
  const [expenseFormData, setExpenseFormData] = useState({
    vehicleId: '',
    expenseType: 'fuel',
    date: '',
    fuelQuantity: '',
    costPerLiter: '',
    serviceType: '',
    maintenanceCost: '',
    otherType: '',
    otherAmount: ''
  });
  const [expenseFormErrors, setExpenseFormErrors] = useState({});

  // Toasts State
  const [toasts, setToasts] = useState([]);

  // --- Effects for Local Storage syncing ---
  useEffect(() => {
    localStorage.setItem('smartops_drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('smartops_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('smartops_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('smartops_fuel_logs', JSON.stringify(fuelLogs));
  }, [fuelLogs]);

  useEffect(() => {
    localStorage.setItem('smartops_maintenance_logs', JSON.stringify(maintenanceLogs));
  }, [maintenanceLogs]);

  useEffect(() => {
    localStorage.setItem('smartops_expenses', JSON.stringify(otherExpenses));
  }, [otherExpenses]);

  // Reset filter criteria when switching tabs
  useEffect(() => {
    setSearchQuery('');
    setStatusFilter('All');
    setCategoryFilter('All');
    setSortBy('default');
    setShowEligibleOnly(false);
  }, [activeTab]);

  // --- Toast Manager ---
  const triggerToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // --- Reset Demo Datasets ---
  const handleResetDemoData = () => {
    localStorage.clear();
    setDrivers([...DEFAULT_DRIVERS]);
    setVehicles([...DEFAULT_VEHICLES]);
    setTrips([...DEFAULT_TRIPS]);
    setFuelLogs([...DEFAULT_FUEL_LOGS]);
    setMaintenanceLogs([...DEFAULT_MAINTENANCE_LOGS]);
    setOtherExpenses([...DEFAULT_EXPENSES]);
    triggerToast('All database values reset to pristine Demo Dataset.', 'warning');
  };

  // --- CSV Export Helper ---
  const downloadCSV = (headers, rows, filename) => {
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => {
        const cleanVal = String(val).replace(/"/g, '""');
        return cleanVal.includes(',') || cleanVal.includes('"') || cleanVal.includes('\n')
          ? `"${cleanVal}"`
          : cleanVal;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportDrivers = () => {
    const headers = ['Driver Name', 'License Number', 'Category', 'Expiry Date', 'Contact Number', 'Safety Score', 'Status'];
    const rows = filteredDrivers.map(d => [d.name, d.licenseNumber, d.licenseCategory, d.expiryDate, d.contactNumber, d.safetyScore, d.status]);
    downloadCSV(headers, rows, 'smartops_drivers.csv');
    triggerToast('Drivers database exported successfully to CSV.', 'success');
  };

  const handleExportVehicles = () => {
    const headers = ['Vehicle Model', 'Plate Number', 'Capacity', 'Status'];
    const rows = filteredVehicles.map(v => [v.name, v.plateNumber, v.capacity, v.status]);
    downloadCSV(headers, rows, 'smartops_vehicles.csv');
    triggerToast('Vehicles fleet exported successfully to CSV.', 'success');
  };

  const handleExportTrips = () => {
    const headers = ['Trip ID', 'Transit Route', 'Assigned Operator', 'Assigned Vehicle', 'Trip Status'];
    const rows = filteredTrips.map(t => {
      const dName = drivers.find(d => d.id === t.driverId)?.name || 'Unassigned';
      const vName = vehicles.find(v => v.id === t.vehicleId)?.name || 'Unassigned';
      return [t.id, t.route, dName, vName, t.status];
    });
    downloadCSV(headers, rows, 'smartops_trips.csv');
    triggerToast('Trips ledger exported successfully to CSV.', 'success');
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

  // --- Dynamic Expense Metrics ---
  const expenseMetrics = useMemo(() => {
    const totalFuel = fuelLogs.reduce((sum, l) => sum + (Number(l.fuelQuantity) * Number(l.costPerLiter)), 0);
    const totalMaintenance = maintenanceLogs.reduce((sum, l) => sum + Number(l.cost), 0);
    const totalOther = otherExpenses.reduce((sum, l) => sum + Number(l.amount), 0);
    const totalOperational = totalFuel + totalMaintenance + totalOther;

    return {
      totalFuel: Math.round(totalFuel * 100) / 100,
      totalMaintenance: Math.round(totalMaintenance * 100) / 100,
      totalOther: Math.round(totalOther * 100) / 100,
      totalOperational: Math.round(totalOperational * 100) / 100
    };
  }, [fuelLogs, maintenanceLogs, otherExpenses]);

  // --- Query Filters & Sorting (Drivers) ---
  const filteredDrivers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
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

  // --- Filter Options (Vehicles) ---
  const filteredVehicles = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return vehicles.filter((v) => 
      v.name.toLowerCase().includes(query) || 
      v.plateNumber.toLowerCase().includes(query)
    );
  }, [vehicles, searchQuery]);

  // --- Filter Options (Trips) ---
  const filteredTrips = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return trips.filter((t) => 
      t.route.toLowerCase().includes(query)
    );
  }, [trips, searchQuery]);

  // --- Vehicle Cost Summary ---
  const vehicleCostSummary = useMemo(() => {
    return getVehicleCostSummary(vehicles, fuelLogs, maintenanceLogs, otherExpenses);
  }, [vehicles, fuelLogs, maintenanceLogs, otherExpenses]);

  // --- Driver CRUD Handlers ---
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateDriverForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Driver name is required.';
    if (!formData.licenseNumber.trim()) errors.licenseNumber = 'License number is required.';
    if (!formData.contactNumber.trim()) {
      errors.contactNumber = 'Contact number is required.';
    } else {
      const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;
      if (!phoneRegex.test(formData.contactNumber.trim())) {
        errors.contactNumber = 'Enter a valid contact format, e.g. +1 (555) 019-2834.';
      }
    }
    if (!formData.licenseCategory) errors.licenseCategory = 'Please select a license category.';
    if (!formData.expiryDate) errors.expiryDate = 'Expiry date is required.';
    
    const score = parseInt(formData.safetyScore, 10);
    if (isNaN(score) || score < 0 || score > 100) {
      errors.safetyScore = 'Safety score must be a number between 0 and 100.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDriverSubmit = (e) => {
    e.preventDefault();
    if (!validateDriverForm()) return;

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
      setDrivers((prev) => prev.map((d) => (d.id === editDriverId ? payload : d)));
      triggerToast(`Driver "${payload.name}" profile updated successfully.`, 'success');
    } else {
      setDrivers((prev) => [payload, ...prev]);
      triggerToast(`Driver "${payload.name}" has been registered successfully.`, 'success');
    }
    closeModal();
  };

  const openDeleteModal = (driverId) => {
    setDeleteDriverId(driverId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteDriverId(null);
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

  // --- Trip Dispatch Operations & State Synchronization ---
  const handleDispatchTrip = (tripId) => {
    const result = dispatchTrip(tripId, trips, drivers, vehicles);
    setTrips(result.trips);
    setDrivers(result.drivers);
    setVehicles(result.vehicles);
    triggerToast('Trip dispatched successfully. Vehicle and Driver statuses updated to "On Trip".', 'success');
  };

  const handleCompleteTrip = (tripId) => {
    const result = completeTrip(tripId, trips, drivers, vehicles);
    setTrips(result.trips);
    setDrivers(result.drivers);
    setVehicles(result.vehicles);
    triggerToast('Trip completed. Vehicle and Driver are now "Available" again.', 'success');
  };

  const handleCancelTrip = (tripId) => {
    const result = cancelTrip(tripId, trips, drivers, vehicles);
    setTrips(result.trips);
    setDrivers(result.drivers);
    setVehicles(result.vehicles);
    triggerToast('Trip cancelled. Assigned Vehicle and Driver statuses set back to "Available".', 'warning');
  };

  // --- Trip Creation Modals & Handlers ---
  const openTripModal = () => {
    setTripFormErrors({});
    setTripFormData({
      route: '',
      driverId: '',
      vehicleId: ''
    });
    setIsTripModalOpen(true);
  };

  const closeTripModal = () => {
    setIsTripModalOpen(false);
  };

  const handleTripInputChange = (e) => {
    const { name, value } = e.target;
    setTripFormData((prev) => ({ ...prev, [name]: value }));
    if (tripFormErrors[name]) {
      setTripFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateTripForm = () => {
    const errors = {};
    if (!tripFormData.route.trim()) errors.route = 'Trip route description is required.';
    if (!tripFormData.driverId) errors.driverId = 'Please select a driver.';
    if (!tripFormData.vehicleId) errors.vehicleId = 'Please select a vehicle.';
    setTripFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleTripSubmit = (e) => {
    e.preventDefault();
    if (!validateTripForm()) return;

    const newTrip = {
      id: `tr_${Date.now()}`,
      route: tripFormData.route.trim(),
      driverId: tripFormData.driverId,
      vehicleId: tripFormData.vehicleId,
      status: 'Pending'
    };

    setTrips((prev) => [newTrip, ...prev]);
    triggerToast(`Trip route "${newTrip.route}" created. Status is set to Pending.`, 'success');
    closeTripModal();
  };

  // --- Expense Log Handlers ---
  const openExpenseModal = () => {
    setExpenseFormErrors({});
    setExpenseFormData({
      vehicleId: '',
      expenseType: 'fuel',
      date: '',
      fuelQuantity: '',
      costPerLiter: '',
      serviceType: '',
      maintenanceCost: '',
      otherType: '',
      otherAmount: ''
    });
    setIsExpenseModalOpen(true);
  };

  const closeExpenseModal = () => {
    setIsExpenseModalOpen(false);
  };

  const handleExpenseInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseFormData((prev) => ({ ...prev, [name]: value }));
    if (expenseFormErrors[name]) {
      setExpenseFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateExpenseForm = () => {
    const errors = {};
    if (!expenseFormData.vehicleId) errors.vehicleId = 'Please select a vehicle.';
    if (!expenseFormData.date) errors.date = 'Date of transaction is required.';

    if (expenseFormData.expenseType === 'fuel') {
      const qty = parseFloat(expenseFormData.fuelQuantity);
      const price = parseFloat(expenseFormData.costPerLiter);
      if (isNaN(qty) || qty <= 0) errors.fuelQuantity = 'Enter a valid fuel quantity (liters).';
      if (isNaN(price) || price <= 0) errors.costPerLiter = 'Enter a valid cost per liter.';
    } else if (expenseFormData.expenseType === 'maintenance') {
      const cost = parseFloat(expenseFormData.maintenanceCost);
      if (!expenseFormData.serviceType.trim()) errors.serviceType = 'Specify service event description.';
      if (isNaN(cost) || cost <= 0) errors.maintenanceCost = 'Enter a valid maintenance cost.';
    } else if (expenseFormData.expenseType === 'other') {
      const amt = parseFloat(expenseFormData.otherAmount);
      if (!expenseFormData.otherType.trim()) errors.otherType = 'Specify expense type description.';
      if (isNaN(amt) || amt <= 0) errors.otherAmount = 'Enter a valid expense amount.';
    }

    setExpenseFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!validateExpenseForm()) return;

    const vName = vehicles.find(v => v.id === expenseFormData.vehicleId)?.name || 'Vehicle';

    if (expenseFormData.expenseType === 'fuel') {
      const log = {
        id: `fl_${Date.now()}`,
        vehicleId: expenseFormData.vehicleId,
        fuelQuantity: parseFloat(expenseFormData.fuelQuantity),
        costPerLiter: parseFloat(expenseFormData.costPerLiter),
        date: expenseFormData.date
      };
      setFuelLogs((prev) => [log, ...prev]);
      triggerToast(`Fuel transaction logged for "${vName}".`, 'success');
    } else if (expenseFormData.expenseType === 'maintenance') {
      const log = {
        id: `ml_${Date.now()}`,
        vehicleId: expenseFormData.vehicleId,
        serviceType: expenseFormData.serviceType.trim(),
        cost: parseFloat(expenseFormData.maintenanceCost),
        date: expenseFormData.date
      };
      setMaintenanceLogs((prev) => [log, ...prev]);
      triggerToast(`Maintenance record logged for "${vName}".`, 'success');
    } else if (expenseFormData.expenseType === 'other') {
      const log = {
        id: `ex_${Date.now()}`,
        vehicleId: expenseFormData.vehicleId,
        expenseType: expenseFormData.otherType.trim(),
        amount: parseFloat(expenseFormData.otherAmount),
        date: expenseFormData.date
      };
      setOtherExpenses((prev) => [log, ...prev]);
      triggerToast(`Miscellaneous expense logged for "${vName}".`, 'success');
    }

    closeExpenseModal();
  };

  // Get dynamic listings for selection dropdowns
  const eligibleDrivers = useMemo(() => getEligibleDrivers(drivers), [drivers]);
  const availableVehicles = useMemo(() => vehicles.filter(v => v.status === 'Available'), [vehicles]);

  // Headers dynamic details based on selected tab
  const tabDetails = useMemo(() => {
    if (activeTab === 'vehicles') {
      return {
        title: 'Vehicle Fleet',
        subtitle: 'Track capacities, license plates, and operational statuses of your trucks.',
        buttonText: null
      };
    } else if (activeTab === 'trips') {
      return {
        title: 'Trip Dispatch Control',
        subtitle: 'Create route assignments, dispatch drivers, and manage active deliveries.',
        buttonText: 'Create Trip'
      };
    } else if (activeTab === 'expenses') {
      return {
        title: 'Operational Cost Analytics',
        subtitle: 'Review total operational costs, fuel bills, and maintenance costs breakdown by vehicle.',
        buttonText: 'Log Expense'
      };
    }
    return {
      title: 'Driver Management',
      subtitle: "Track, edit, and optimize your transport fleet's operators.",
      buttonText: 'Add Driver'
    };
  }, [activeTab]);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">🚀</span>
          <span className="logo-text">SmartOps</span>
        </div>
        <nav className="sidebar-menu">
          <button 
            className={`menu-item ${activeTab === 'drivers' ? 'active' : ''}`} 
            onClick={() => setActiveTab('drivers')}
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}
          >
            <span className="menu-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </span>
            Drivers
          </button>
          <button 
            className={`menu-item ${activeTab === 'vehicles' ? 'active' : ''}`} 
            onClick={() => setActiveTab('vehicles')}
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}
          >
            <span className="menu-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </span>
            Vehicles
          </button>
          <button 
            className={`menu-item ${activeTab === 'trips' ? 'active' : ''}`} 
            onClick={() => setActiveTab('trips')}
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}
          >
            <span className="menu-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </span>
            Trips
          </button>
          <button 
            className={`menu-item ${activeTab === 'expenses' ? 'active' : ''}`} 
            onClick={() => setActiveTab('expenses')}
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}
          >
            <span className="menu-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </span>
            Expenses
          </button>
        </nav>
        <div className="sidebar-footer" style={{ gap: '10px', flexDirection: 'column', padding: '16px 8px' }}>
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', padding: '6px 10px', fontSize: '11px', borderColor: 'rgba(239,68,68,0.2)' }}
            onClick={handleResetDemoData}
          >
            Reset Demo Data
          </button>
          <span className="version-text">v1.6.0 (Hackathon Ready)</span>
        </div>
      </aside>

      {/* Main Body */}
      <main className="main-content">
        {/* Dynamic Metrics Cards Panel */}
        {activeTab !== 'expenses' ? (
          <section className="metrics-grid" id="metrics-panel" aria-label="Key Performance Indicators">
            <div className="metric-card bg-glow-blue">
              <div className="card-glow"></div>
              <div className="metric-header">
                <span className="metric-label">Total Operators</span>
                <div className="metric-icon-wrapper text-blue">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                </div>
              </div>
              <div className="metric-value">{metrics.total}</div>
              <div className="metric-trend text-muted">Registered in database</div>
            </div>

            <div className="metric-card bg-glow-green">
              <div className="card-glow"></div>
              <div className="metric-header">
                <span className="metric-label">Active & Available</span>
                <div className="metric-icon-wrapper text-green">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
              </div>
              <div className="metric-value">{metrics.available}</div>
              <div className="metric-trend text-green">Ready for assignment</div>
            </div>

            <div className="metric-card bg-glow-yellow">
              <div className="card-glow"></div>
              <div className="metric-header">
                <span className="metric-label">On Trip</span>
                <div className="metric-icon-wrapper text-yellow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/></svg>
                </div>
              </div>
              <div className="metric-value">{metrics.onTrip}</div>
              <div className="metric-trend text-yellow">Currently on transit routes</div>
            </div>

            <div className="metric-card bg-glow-purple">
              <div className="card-glow"></div>
              <div className="metric-header">
                <span className="metric-label">Avg Safety Score</span>
                <div className="metric-icon-wrapper text-purple">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
              </div>
              <div className="metric-value">{metrics.safetyAvg}%</div>
              <div className="metric-trend text-purple">Target: &gt;90% fleet standard</div>
            </div>
          </section>
        ) : (
          <section className="metrics-grid" id="expense-metrics-panel" aria-label="Operational Cost Indicators">
            <div className="metric-card bg-glow-blue">
              <div className="card-glow"></div>
              <div className="metric-header">
                <span className="metric-label">Total Fleet Cost</span>
                <div className="metric-icon-wrapper text-blue">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
              </div>
              <div className="metric-value">${expenseMetrics.totalOperational}</div>
              <div className="metric-trend text-muted">Total operational spend</div>
            </div>

            <div className="metric-card bg-glow-green">
              <div className="card-glow"></div>
              <div className="metric-header">
                <span className="metric-label">Fuel Spent</span>
                <div className="metric-icon-wrapper text-green">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
              </div>
              <div className="metric-value">${expenseMetrics.totalFuel}</div>
              <div className="metric-trend text-green">Total fuel logs cost</div>
            </div>

            <div className="metric-card bg-glow-yellow">
              <div className="card-glow"></div>
              <div className="metric-header">
                <span className="metric-label">Maintenance Spent</span>
                <div className="metric-icon-wrapper text-yellow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                </div>
              </div>
              <div className="metric-value">${expenseMetrics.totalMaintenance}</div>
              <div className="metric-trend text-yellow">Total service tickets cost</div>
            </div>

            <div className="metric-card bg-glow-purple">
              <div className="card-glow"></div>
              <div className="metric-header">
                <span className="metric-label">Other Expenses</span>
                <div className="metric-icon-wrapper text-purple">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="12" y1="4" x2="12" y2="20"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
                </div>
              </div>
              <div className="metric-value">${expenseMetrics.totalOther}</div>
              <div className="metric-trend text-purple">Tolls, insurance & permits</div>
            </div>
          </section>
        )}

        {/* Dynamic Panel Content switcher */}
        {activeTab === 'drivers' && (
          <>
            {/* Table Filters & Control Header (Drivers) */}
            <section className="controls-panel">
              <div className="search-box">
                <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text"
                  placeholder="Search by name, license number or category..."
                  autoComplete="off"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
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
                  <select id="filter-status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="All">All Statuses</option>
                    <option value="Available">Available</option>
                    <option value="On Trip">On Trip</option>
                    <option value="Off Duty">Off Duty</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
                <div className="select-wrapper">
                  <select id="filter-category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="All">All Categories</option>
                    <option value="Class A">Class A</option>
                    <option value="Class B">Class B</option>
                    <option value="Class C">Class C</option>
                    <option value="Heavy Rigid">Heavy Rigid</option>
                  </select>
                </div>
                <div className="select-wrapper">
                  <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="default">Sort by: Default</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="safety-desc">Safety Score (High-Low)</option>
                    <option value="safety-asc">Safety Score (Low-High)</option>
                    <option value="expiry-asc">Expiry (Soonest First)</option>
                  </select>
                </div>
                <button className="btn btn-secondary" onClick={handleExportDrivers}>Export CSV</button>
              </div>
            </section>

            {/* Drivers Table */}
            <section className="table-container">
              <table className="driver-table" style={{ display: filteredDrivers.length === 0 ? 'none' : 'table' }}>
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
                <tbody>
                  {filteredDrivers.map((driver) => {
                    let scoreColor = 'var(--color-success)';
                    if (driver.safetyScore < 75) scoreColor = 'var(--color-danger)';
                    else if (driver.safetyScore < 90) scoreColor = 'var(--color-warning)';

                    const expiryInfo = getExpiryStatus(driver.expiryDate);

                    let statusClass = 'available';
                    if (driver.status === 'On Trip') statusClass = 'ontrip';
                    else if (driver.status === 'Off Duty') statusClass = 'offduty';
                    else if (driver.status === 'Suspended') statusClass = 'suspended';

                    const refDate = new Date('2026-07-12');
                    const isSuspended = driver.status === 'Suspended';
                    const isOnTrip = driver.status === 'On Trip';
                    const isExpired = new Date(driver.expiryDate) < refDate;
                    const isEligible = !isSuspended && !isOnTrip && !isExpired;

                    let ineligibilityReason = 'Expired';
                    if (isSuspended) ineligibilityReason = 'Suspended';
                    else if (isOnTrip) ineligibilityReason = 'On Trip';

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
                            {isEligible ? (
                              <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                ● Eligible
                              </span>
                            ) : (
                              <span 
                                style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'help' }}
                                title={isSuspended ? 'Suspended operator' : isOnTrip ? 'Driver is currently on a trip' : 'License has expired'}
                              >
                                ● Ineligible ({ineligibilityReason})
                              </span>
                            )}
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
              <div className="table-empty-state" style={{ display: filteredDrivers.length === 0 ? 'block' : 'none' }}>
                <div className="empty-icon">🔍</div>
                <h3 className="empty-title">No drivers match your search</h3>
                <p className="empty-subtitle">Try refining your search terms or adjustments to filters.</p>
              </div>
            </section>
          </>
        )}

        {activeTab === 'vehicles' && (
          <>
            {/* Filter Panel (Vehicles) */}
            <section className="controls-panel">
              <div className="search-box" style={{ maxWidth: '400px' }}>
                <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text"
                  placeholder="Search vehicles by model or plate..."
                  autoComplete="off"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
                )}
              </div>
              <button className="btn btn-secondary" onClick={handleExportVehicles}>Export CSV</button>
            </section>

            {/* Vehicles Table */}
            <section className="table-container">
              <table className="driver-table" style={{ display: filteredVehicles.length === 0 ? 'none' : 'table' }}>
                <thead>
                  <tr>
                    <th>Vehicle Model</th>
                    <th>Plate Number</th>
                    <th>Max Capacity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.map((vehicle) => {
                    let statusClass = 'available';
                    if (vehicle.status === 'On Trip') statusClass = 'ontrip';
                    else if (vehicle.status === 'Maintenance') statusClass = 'suspended';

                    return (
                      <tr key={vehicle.id}>
                        <td className="driver-details-cell" data-label="Vehicle Model">
                          <div className="driver-avatar" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)', color: 'var(--color-info)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                            🚚
                          </div>
                          <div className="driver-name">{vehicle.name}</div>
                        </td>
                        <td data-label="Plate Number">
                          <span className="license-category-badge" style={{ textTransform: 'uppercase' }}>{vehicle.plateNumber}</span>
                        </td>
                        <td data-label="Max Capacity">
                          <span style={{ fontWeight: '500' }}>{vehicle.capacity}</span>
                        </td>
                        <td data-label="Status">
                          <span className={`status-pill ${statusClass}`}>
                            <span className="status-dot"></span>
                            {vehicle.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Table Empty State */}
              <div className="table-empty-state" style={{ display: filteredVehicles.length === 0 ? 'block' : 'none' }}>
                <div className="empty-icon">🔍</div>
                <h3 className="empty-title">No vehicles found</h3>
                <p className="empty-subtitle">Try refining your search model query.</p>
              </div>
            </section>
          </>
        )}

        {activeTab === 'trips' && (
          <>
            {/* Filter Panel (Trips) */}
            <section className="controls-panel">
              <div className="search-box" style={{ maxWidth: '400px' }}>
                <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text"
                  placeholder="Search routes (e.g. New York)..."
                  autoComplete="off"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
                )}
              </div>
              <button className="btn btn-secondary" onClick={handleExportTrips}>Export CSV</button>
            </section>

            {/* Trips Dispatch Table */}
            <section className="table-container">
              <table className="driver-table" style={{ display: filteredTrips.length === 0 ? 'none' : 'table' }}>
                <thead>
                  <tr>
                    <th>Transit Route</th>
                    <th>Assigned Operator</th>
                    <th>Assigned Vehicle</th>
                    <th>Trip Status</th>
                    <th className="text-right">Dispatch Control Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrips.map((trip) => {
                    const assignedDriver = drivers.find((d) => d.id === trip.driverId);
                    const assignedVehicle = vehicles.find((v) => v.id === trip.vehicleId);

                    let statusClass = 'offduty'; // Pending
                    if (trip.status === 'Dispatched') statusClass = 'ontrip';
                    else if (trip.status === 'Completed') statusClass = 'available';
                    else if (trip.status === 'Cancelled') statusClass = 'suspended';

                    return (
                      <tr key={trip.id}>
                        <td data-label="Transit Route">
                          <div className="driver-name" style={{ fontSize: '15px' }}>{trip.route}</div>
                          <div className="driver-license-sub">Trip ID: {trip.id}</div>
                        </td>
                        <td data-label="Assigned Operator">
                          {assignedDriver ? (
                            <div>
                              <div style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>{assignedDriver.name}</div>
                              <div className="driver-license-sub">Score: {assignedDriver.safetyScore}%</div>
                            </div>
                          ) : (
                            <span className="text-danger">Unassigned</span>
                          )}
                        </td>
                        <td data-label="Assigned Vehicle">
                          {assignedVehicle ? (
                            <div>
                              <div style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>{assignedVehicle.name}</div>
                              <div className="driver-license-sub">Plate: {assignedVehicle.plateNumber}</div>
                            </div>
                          ) : (
                            <span className="text-danger">Unassigned</span>
                          )}
                        </td>
                        <td data-label="Trip Status">
                          <span className={`status-pill ${statusClass}`}>
                            <span className="status-dot"></span>
                            {trip.status}
                          </span>
                        </td>
                        <td className="actions-cell" data-label="Dispatch Control Actions">
                          {trip.status === 'Pending' && (
                            <button 
                              className="btn btn-primary" 
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                              onClick={() => handleDispatchTrip(trip.id)}
                            >
                              Dispatch
                            </button>
                          )}
                          {trip.status === 'Dispatched' && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button 
                                className="btn btn-primary" 
                                style={{ padding: '6px 12px', fontSize: '12px', background: 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)', boxShadow: 'none' }}
                                onClick={() => handleCompleteTrip(trip.id)}
                              >
                                Complete
                              </button>
                              <button 
                                className="btn btn-secondary" 
                                style={{ padding: '6px 12px', fontSize: '12px', borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}
                                onClick={() => handleCancelTrip(trip.id)}
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                          {(trip.status === 'Completed' || trip.status === 'Cancelled') && (
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: '500', paddingRight: '8px' }}>
                              Archive
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Table Empty State */}
              <div className="table-empty-state" style={{ display: filteredTrips.length === 0 ? 'block' : 'none' }}>
                <div className="empty-icon">🔍</div>
                <h3 className="empty-title">No trips found</h3>
                <p className="empty-subtitle">Try creating a trip or adjusting your route search.</p>
              </div>
            </section>
          </>
        )}

        {activeTab === 'expenses' && (
          <>
            {/* Summary Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '18px' }}>Vehicle-wise Cost Breakdown</h3>
            </div>

            {/* Vehicle Summary Table */}
            <section className="table-container" style={{ marginBottom: '40px' }}>
              <table className="driver-table">
                <thead>
                  <tr>
                    <th>Vehicle Model</th>
                    <th>Plate Number</th>
                    <th>Fuel Cost</th>
                    <th>Maintenance Cost</th>
                    <th>Other Expenses</th>
                    <th className="text-right">Total Operational Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicleCostSummary.map((sum) => (
                    <tr key={sum.vehicleId}>
                      <td className="driver-details-cell" data-label="Vehicle Model">
                        <div className="driver-avatar" style={{ background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)', color: 'var(--color-primary)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                          🚚
                        </div>
                        <div className="driver-name">{sum.vehicleName}</div>
                      </td>
                      <td data-label="Plate Number">
                        <span className="license-category-badge" style={{ textTransform: 'uppercase' }}>{sum.plateNumber}</span>
                      </td>
                      <td data-label="Fuel Cost">
                        <span style={{ fontWeight: '500' }}>${sum.fuelCost}</span>
                      </td>
                      <td data-label="Maintenance Cost">
                        <span style={{ fontWeight: '500' }}>${sum.maintenanceCost}</span>
                      </td>
                      <td data-label="Other Expenses">
                        <span style={{ fontWeight: '500' }}>${sum.otherExpensesCost}</span>
                      </td>
                      <td className="text-right" data-label="Total Cost">
                        <span style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '15px' }}>${sum.totalCost}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Combined Expense Ledger */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '18px' }}>Expenses Logs Ledger</h3>
            </div>
            
            <section className="table-container">
              <table className="driver-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Vehicle</th>
                    <th>Expense Type</th>
                    <th>Description</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {fuelLogs.map((log) => {
                    const vName = vehicles.find((v) => v.id === log.vehicleId)?.name || 'Unknown';
                    const amount = Math.round((log.fuelQuantity * log.costPerLiter) * 100) / 100;
                    return (
                      <tr key={log.id}>
                        <td data-label="Date">{formatDate(log.date)}</td>
                        <td data-label="Vehicle">{vName}</td>
                        <td data-label="Expense Type"><span className="status-pill available" style={{ fontSize: '11px' }}>Fuel</span></td>
                        <td data-label="Description">Filled {log.fuelQuantity} Liters @ ${log.costPerLiter}/L</td>
                        <td className="text-right" data-label="Amount" style={{ fontWeight: '600', color: 'var(--color-success)' }}>${amount}</td>
                      </tr>
                    );
                  })}
                  {maintenanceLogs.map((log) => {
                    const vName = vehicles.find((v) => v.id === log.vehicleId)?.name || 'Unknown';
                    return (
                      <tr key={log.id}>
                        <td data-label="Date">{formatDate(log.date)}</td>
                        <td data-label="Vehicle">{vName}</td>
                        <td data-label="Expense Type"><span className="status-pill suspended" style={{ fontSize: '11px' }}>Maintenance</span></td>
                        <td data-label="Description">{log.serviceType}</td>
                        <td className="text-right" data-label="Amount" style={{ fontWeight: '600', color: 'var(--color-danger)' }}>${log.cost}</td>
                      </tr>
                    );
                  })}
                  {otherExpenses.map((log) => {
                    const vName = vehicles.find((v) => v.id === log.vehicleId)?.name || 'Unknown';
                    return (
                      <tr key={log.id}>
                        <td data-label="Date">{formatDate(log.date)}</td>
                        <td data-label="Vehicle">{vName}</td>
                        <td data-label="Expense Type"><span className="status-pill offduty" style={{ fontSize: '11px' }}>Other</span></td>
                        <td data-label="Description">{log.expenseType}</td>
                        <td className="text-right" data-label="Amount" style={{ fontWeight: '600', color: 'var(--color-info)' }}>${log.amount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          </>
        )}
      </main>

      {/* Modal Form (Add & Edit Driver) */}
      {isModalOpen && (
        <div className="modal-backdrop" id="driver-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-card">
            <header className="modal-header">
              <h2 className="modal-title" id="modal-title">{editDriverId ? 'Edit Driver Profile' : 'Add New Driver'}</h2>
              <button className="modal-close" onClick={closeModal} aria-label="Close modal">✕</button>
            </header>
            <form id="driver-form" onSubmit={handleDriverSubmit} noValidate>
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
                  <label htmlFor="input-license-number" className="required">License Number</label>
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
                  <label htmlFor="input-license-category" className="required">License Category</label>
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
                  <label htmlFor="input-expiry-date" className="required">Expiry Date</label>
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
                  <label htmlFor="input-contact-number" className="required">Contact Number</label>
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
                  <label htmlFor="input-safety-score" className="required">Safety Score (0-100)</label>
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
                  <label htmlFor="input-status" className="required">Status</label>
                  <div className="select-wrapper">
                    <select id="input-status" name="status" value={formData.status} onChange={handleInputChange} required>
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

      {/* Trip Creation Modal */}
      {isTripModalOpen && (
        <div className="modal-backdrop" id="trip-modal" role="dialog" aria-modal="true" aria-labelledby="trip-modal-title">
          <div className="modal-card">
            <header className="modal-header">
              <h2 className="modal-title" id="trip-modal-title">Create New Trip Assignment</h2>
              <button className="modal-close" onClick={closeTripModal} aria-label="Close modal">✕</button>
            </header>
            <form id="trip-form" onSubmit={handleTripSubmit} noValidate>
              <div className="form-grid">
                {/* Transit Route Description */}
                <div className={`form-group col-span-2 ${tripFormErrors.route ? 'invalid' : ''}`}>
                  <label htmlFor="input-trip-route" className="required">Transit Route / Destination</label>
                  <input
                    type="text"
                    id="input-trip-route"
                    name="route"
                    placeholder="e.g. Chicago to New York"
                    value={tripFormData.route}
                    onChange={handleTripInputChange}
                    required
                  />
                  {tripFormErrors.route && <span className="error-message">{tripFormErrors.route}</span>}
                </div>

                {/* Driver Selector dropdown (Assignable Drivers Only!) */}
                <div className={`form-group ${tripFormErrors.driverId ? 'invalid' : ''}`}>
                  <label htmlFor="select-trip-driver" className="required">Assign Operator (Eligible Only)</label>
                  <div className="select-wrapper">
                    <select
                      id="select-trip-driver"
                      name="driverId"
                      value={tripFormData.driverId}
                      onChange={handleTripInputChange}
                      required
                    >
                      <option value="" disabled hidden>Select driver</option>
                      {eligibleDrivers.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.name} (Score: {d.safetyScore}%)
                        </option>
                      ))}
                    </select>
                  </div>
                  {tripFormErrors.driverId && <span className="error-message">{tripFormErrors.driverId}</span>}
                  {eligibleDrivers.length === 0 && (
                    <span style={{ fontSize: '11px', color: 'var(--color-danger)', marginTop: '4px' }}>
                      ⚠️ No assignable drivers available!
                    </span>
                  )}
                </div>

                {/* Vehicle Selector dropdown (Available Vehicles Only!) */}
                <div className={`form-group ${tripFormErrors.vehicleId ? 'invalid' : ''}`}>
                  <label htmlFor="select-trip-vehicle" className="required">Assign Vehicle (Available Only)</label>
                  <div className="select-wrapper">
                    <select
                      id="select-trip-vehicle"
                      name="vehicleId"
                      value={tripFormData.vehicleId}
                      onChange={handleTripInputChange}
                      required
                    >
                      <option value="" disabled hidden>Select vehicle</option>
                      {availableVehicles.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.plateNumber})
                        </option>
                      ))}
                    </select>
                  </div>
                  {tripFormErrors.vehicleId && <span className="error-message">{tripFormErrors.vehicleId}</span>}
                  {availableVehicles.length === 0 && (
                    <span style={{ fontSize: '11px', color: 'var(--color-danger)', marginTop: '4px' }}>
                      ⚠️ No available vehicles left!
                    </span>
                  )}
                </div>
              </div>

              <footer className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeTripModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={eligibleDrivers.length === 0 || availableVehicles.length === 0}>
                  Create Trip
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* Log Expense Modal */}
      {isExpenseModalOpen && (
        <div className="modal-backdrop" id="expense-modal" role="dialog" aria-modal="true" aria-labelledby="expense-modal-title">
          <div className="modal-card">
            <header className="modal-header">
              <h2 className="modal-title" id="expense-modal-title">Log Fleet Expense</h2>
              <button className="modal-close" onClick={closeExpenseModal} aria-label="Close modal">✕</button>
            </header>
            <form id="expense-form" onSubmit={handleExpenseSubmit} noValidate>
              <div className="form-grid">
                {/* Vehicle Target Selector */}
                <div className={`form-group ${expenseFormErrors.vehicleId ? 'invalid' : ''}`}>
                  <label htmlFor="select-expense-vehicle" className="required">Vehicle Target</label>
                  <div className="select-wrapper">
                    <select
                      id="select-expense-vehicle"
                      name="vehicleId"
                      value={expenseFormData.vehicleId}
                      onChange={handleExpenseInputChange}
                      required
                    >
                      <option value="" disabled hidden>Select vehicle</option>
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.plateNumber})
                        </option>
                      ))}
                    </select>
                  </div>
                  {expenseFormErrors.vehicleId && <span className="error-message">{expenseFormErrors.vehicleId}</span>}
                </div>

                {/* Expense Type Categorizer */}
                <div className="form-group">
                  <label htmlFor="select-expense-type" className="required">Expense Category</label>
                  <div className="select-wrapper">
                    <select
                      id="select-expense-type"
                      name="expenseType"
                      value={expenseFormData.expenseType}
                      onChange={handleExpenseInputChange}
                      required
                    >
                      <option value="fuel">Fuel Logs</option>
                      <option value="maintenance">Maintenance Service</option>
                      <option value="other">Other Expenses (Tolls, Permits, etc.)</option>
                    </select>
                  </div>
                </div>

                {/* Transaction Date */}
                <div className={`form-group col-span-2 ${expenseFormErrors.date ? 'invalid' : ''}`}>
                  <label htmlFor="input-expense-date" className="required">Transaction Date</label>
                  <input
                    type="date"
                    id="input-expense-date"
                    name="date"
                    value={expenseFormData.date}
                    onChange={handleExpenseInputChange}
                    required
                  />
                  {expenseFormErrors.date && <span className="error-message">{expenseFormErrors.date}</span>}
                </div>

                {/* Conditional Fields based on Category */}
                {expenseFormData.expenseType === 'fuel' && (
                  <>
                    <div className={`form-group ${expenseFormErrors.fuelQuantity ? 'invalid' : ''}`}>
                      <label htmlFor="input-fuel-quantity" className="required">Fuel Quantity (Liters)</label>
                      <input
                        type="number"
                        id="input-fuel-quantity"
                        name="fuelQuantity"
                        placeholder="120"
                        step="0.01"
                        value={expenseFormData.fuelQuantity}
                        onChange={handleExpenseInputChange}
                        required
                      />
                      {expenseFormErrors.fuelQuantity && <span className="error-message">{expenseFormErrors.fuelQuantity}</span>}
                    </div>
                    <div className={`form-group ${expenseFormErrors.costPerLiter ? 'invalid' : ''}`}>
                      <label htmlFor="input-cost-liter" className="required">Cost per Liter ($)</label>
                      <input
                        type="number"
                        id="input-cost-liter"
                        name="costPerLiter"
                        placeholder="1.25"
                        step="0.01"
                        value={expenseFormData.costPerLiter}
                        onChange={handleExpenseInputChange}
                        required
                      />
                      {expenseFormErrors.costPerLiter && <span className="error-message">{expenseFormErrors.costPerLiter}</span>}
                    </div>
                  </>
                )}

                {expenseFormData.expenseType === 'maintenance' && (
                  <>
                    <div className={`form-group ${expenseFormErrors.serviceType ? 'invalid' : ''}`}>
                      <label htmlFor="input-service-type" className="required">Service Activity</label>
                      <input
                        type="text"
                        id="input-service-type"
                        name="serviceType"
                        placeholder="e.g. Engine Oil Change"
                        value={expenseFormData.serviceType}
                        onChange={handleExpenseInputChange}
                        required
                      />
                      {expenseFormErrors.serviceType && <span className="error-message">{expenseFormErrors.serviceType}</span>}
                    </div>
                    <div className={`form-group ${expenseFormErrors.maintenanceCost ? 'invalid' : ''}`}>
                      <label htmlFor="input-maint-cost" className="required">Cost ($)</label>
                      <input
                        type="number"
                        id="input-maint-cost"
                        name="maintenanceCost"
                        placeholder="350"
                        step="0.01"
                        value={expenseFormData.maintenanceCost}
                        onChange={handleExpenseInputChange}
                        required
                      />
                      {expenseFormErrors.maintenanceCost && <span className="error-message">{expenseFormErrors.maintenanceCost}</span>}
                    </div>
                  </>
                )}

                {expenseFormData.expenseType === 'other' && (
                  <>
                    <div className={`form-group ${expenseFormErrors.otherType ? 'invalid' : ''}`}>
                      <label htmlFor="input-other-type" className="required">Expense Description</label>
                      <input
                        type="text"
                        id="input-other-type"
                        name="otherType"
                        placeholder="e.g. Highway Toll Charges"
                        value={expenseFormData.otherType}
                        onChange={handleExpenseInputChange}
                        required
                      />
                      {expenseFormErrors.otherType && <span className="error-message">{expenseFormErrors.otherType}</span>}
                    </div>
                    <div className={`form-group ${expenseFormErrors.otherAmount ? 'invalid' : ''}`}>
                      <label htmlFor="input-other-amt" className="required">Amount ($)</label>
                      <input
                        type="number"
                        id="input-other-amt"
                        name="otherAmount"
                        placeholder="75"
                        step="0.01"
                        value={expenseFormData.otherAmount}
                        onChange={handleExpenseInputChange}
                        required
                      />
                      {expenseFormErrors.otherAmount && <span className="error-message">{expenseFormErrors.otherAmount}</span>}
                    </div>
                  </>
                )}
              </div>

              <footer className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeExpenseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Log</button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Driver Modal */}
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
            <footer className="modal-footer">
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

// Helper: Formats Dates nicely
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Helper: Evaluates assignment eligibility
export function getEligibleDrivers(driversList) {
  const refDate = new Date('2026-07-12');
  return driversList.filter((driver) => {
    const isSuspended = driver.status === 'Suspended';
    const isOnTrip = driver.status === 'On Trip';
    const isExpired = new Date(driver.expiryDate) < refDate;
    return !isSuspended && !isOnTrip && !isExpired;
  });
}
