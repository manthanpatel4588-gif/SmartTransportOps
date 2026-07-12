// =============================================================
// React Vehicle Registry Component for SmartTransportOps
// Handled via Babel Standalone CDN in index.html
// =============================================================

const { useState, useEffect, useMemo } = React;

// Reusable global helper function to fetch only available vehicles for trips
window.getAvailableVehicles = function() {
    const stored = localStorage.getItem("smartops_vehicles");
    if (!stored) return [];
    try {
        const list = JSON.parse(stored);
        return Array.isArray(list) ? list.filter(v => v.status === "Available") : [];
    } catch (e) {
        console.error("Error parsing vehicles:", e);
        return [];
    }
};

// Reusable global helper function to validate cargo weight against vehicle capacity
window.validateCargoCapacity = function(vehicleCapacity, cargoWeight) {
    const capacity = parseFloat(vehicleCapacity);
    const weight = parseFloat(cargoWeight);

    if (isNaN(capacity) || isNaN(weight)) {
        return {
            valid: false,
            message: "Invalid capacity or weight value"
        };
    }

    if (weight > capacity) {
        return {
            valid: false,
            message: "Cargo exceeds vehicle capacity"
        };
    }

    return {
        valid: true,
        message: ""
    };
};

// Reusable helper to update a vehicle's status in storage and trigger a sync event
function updateVehicleStatusInStorage(vehicle, newStatus) {
    const stored = localStorage.getItem("smartops_vehicles");
    if (!stored) return;
    try {
        let list = JSON.parse(stored);
        let updated = false;
        
        list = list.map(v => {
            const targetMatch = (typeof vehicle === 'object' && vehicle !== null) 
                ? (v.id === vehicle.id || v.registration === vehicle.registration)
                : (v.id === vehicle || v.registration === vehicle);
                
            if (targetMatch) {
                updated = true;
                return { ...v, status: newStatus };
            }
            return v;
        });

        if (updated) {
            localStorage.setItem("smartops_vehicles", JSON.stringify(list));
            // Alert React components to synchronize state
            window.dispatchEvent(new Event('vehicles-updated'));
        }
    } catch (e) {
        console.error("Failed to update vehicle status in maintenance workflow:", e);
    }
}

window.activateMaintenance = function(vehicle) {
    updateVehicleStatusInStorage(vehicle, "In Shop");
};

window.completeMaintenance = function(vehicle) {
    updateVehicleStatusInStorage(vehicle, "Available");
};

const DEFAULT_VEHICLES = [
    {
        id: "veh_1",
        registration: "TX-9842-AB",
        name: "Stellar Hauler",
        type: "Semi-Truck",
        capacity: 18000,
        odometer: 124500,
        cost: 145000,
        status: "On Trip"
    },
    {
        id: "veh_2",
        registration: "CA-1150-XY",
        name: "Metro Sprint",
        type: "Sprinter Van",
        capacity: 3500,
        odometer: 48200,
        cost: 54000,
        status: "Available"
    },
    {
        id: "veh_3",
        registration: "NY-4482-CD",
        name: "Titan Loader",
        type: "Flatbed Truck",
        capacity: 12000,
        odometer: 89600,
        cost: 95000,
        status: "In Shop"
    },
    {
        id: "veh_4",
        registration: "FL-8931-ZZ",
        name: "Eco Express",
        type: "Cargo Van",
        capacity: 2800,
        odometer: 15400,
        cost: 38500,
        status: "Available"
    },
    {
        id: "veh_5",
        registration: "TX-7731-MN",
        name: "Goliath Prime",
        type: "Semi-Truck",
        capacity: 22000,
        odometer: 245000,
        cost: 165000,
        status: "Retired"
    },
    {
        id: "veh_6",
        registration: "NV-5091-KL",
        name: "Apex Cargo",
        type: "Box Truck",
        capacity: 8500,
        odometer: 112000,
        cost: 78000,
        status: "On Trip"
    }
];

// Helper: Custom Toast trigger inside global scope
function triggerToast(message, type = "success") {
    // Rely on the existing global showToast function from app.js
    if (typeof window.showToast === "function") {
        window.showToast(message, type);
    } else {
        console.log(`[Toast ${type}]: ${message}`);
    }
}

// -------------------------------------------------------------
// Component: Stats Grid
// -------------------------------------------------------------
function VehicleStatsGrid({ vehicles }) {
    const stats = useMemo(() => {
        const total = vehicles.length;
        const available = vehicles.filter(v => v.status === "Available").length;
        const onTrip = vehicles.filter(v => v.status === "On Trip").length;
        const inShop = vehicles.filter(v => v.status === "In Shop").length;
        return { total, available, onTrip, inShop };
    }, [vehicles]);

    return (
        <section className="metrics-grid" id="vehicle-metrics-panel" aria-label="Vehicle KPIs">
            <div className="metric-card bg-glow-blue">
                <div className="card-glow"></div>
                <div className="metric-header">
                    <span className="metric-label">Total Fleet</span>
                    <div className="metric-icon-wrapper text-blue">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="3" width="15" height="13" />
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                            <circle cx="5.5" cy="18.5" r="2.5" />
                            <circle cx="18.5" cy="18.5" r="2.5" />
                        </svg>
                    </div>
                </div>
                <div className="metric-value">{stats.total}</div>
                <div className="metric-trend text-muted">Registered in database</div>
            </div>

            <div className="metric-card bg-glow-green">
                <div className="card-glow"></div>
                <div className="metric-header">
                    <span className="metric-label">Available</span>
                    <div className="metric-icon-wrapper text-green">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="m9 12 2 2 4-4" />
                        </svg>
                    </div>
                </div>
                <div className="metric-value">{stats.available}</div>
                <div className="metric-trend text-green">Ready for assignment</div>
            </div>

            <div className="metric-card bg-glow-yellow">
                <div className="card-glow"></div>
                <div className="metric-header">
                    <span className="metric-label">On Trip</span>
                    <div className="metric-icon-wrapper text-yellow">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="1" y="3" width="15" height="13" />
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                            <circle cx="5.5" cy="18.5" r="2.5" />
                            <circle cx="18.5" cy="18.5" r="2.5" />
                        </svg>
                    </div>
                </div>
                <div className="metric-value">{stats.onTrip}</div>
                <div className="metric-trend text-yellow">Active on transit routes</div>
            </div>

            <div className="metric-card bg-glow-red">
                <div className="card-glow"></div>
                <div className="metric-header">
                    <span className="metric-label">In Shop</span>
                    <div className="metric-icon-wrapper text-red">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="m15 9-6 6M9 9l6 6" />
                        </svg>
                    </div>
                </div>
                <div className="metric-value">{stats.inShop}</div>
                <div className="metric-trend text-red">Undergoing maintenance</div>
            </div>
        </section>
    );
}

// -------------------------------------------------------------
// Component: Filter Controls
// -------------------------------------------------------------
function VehicleFilterControls({
    searchQuery, setSearchQuery,
    statusFilter, setStatusFilter,
    typeFilter, setTypeFilter,
    sortBy, setSortBy
}) {
    return (
        <section className="controls-panel">
            <div className="search-box">
                <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    placeholder="Search by name, reg number or type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoComplete="off"
                />
                {searchQuery && (
                    <button className="clear-search-btn" onClick={() => setSearchQuery('')} aria-label="Clear search">✕</button>
                )}
            </div>
            <div className="filters-box">
                <div className="select-wrapper">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by Status">
                        <option value="All">All Statuses</option>
                        <option value="Available">Available</option>
                        <option value="On Trip">On Trip</option>
                        <option value="In Shop">In Shop</option>
                        <option value="Retired">Retired</option>
                    </select>
                </div>
                <div className="select-wrapper">
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} aria-label="Filter by Type">
                        <option value="All">All Vehicle Types</option>
                        <option value="Semi-Truck">Semi-Truck</option>
                        <option value="Box Truck">Box Truck</option>
                        <option value="Cargo Van">Cargo Van</option>
                        <option value="Sprinter Van">Sprinter Van</option>
                        <option value="Flatbed Truck">Flatbed Truck</option>
                    </select>
                </div>
                <div className="select-wrapper">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort options">
                        <option value="default">Sort by: Default</option>
                        <option value="reg-asc">Reg No. (A-Z)</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="capacity-desc">Capacity (High-Low)</option>
                        <option value="odometer-asc">Odometer (Low-High)</option>
                        <option value="cost-desc">Cost (High-Low)</option>
                    </select>
                </div>
            </div>
        </section>
    );
}

// -------------------------------------------------------------
// Component: Vehicle Table Rows & Header
// -------------------------------------------------------------
function VehicleTable({ vehicles, onEdit, onDelete }) {
    const formattedCost = (val) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(val);

    const formattedCapacity = (val) => new Intl.NumberFormat('en-US').format(val) + " kg";
    const formattedOdometer = (val) => new Intl.NumberFormat('en-US').format(val) + " km";

    if (vehicles.length === 0) {
        return (
            <section className="table-container">
                <div className="table-empty-state">
                    <div className="empty-icon">🔍</div>
                    <h3 className="empty-title">No vehicles match your search</h3>
                    <p className="empty-subtitle">Try refining your search terms or adjustments to filters.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="table-container">
            <table className="driver-table">
                <thead>
                    <tr>
                        <th>Registration</th>
                        <th>Vehicle Name</th>
                        <th>Type</th>
                        <th>Capacity</th>
                        <th>Odometer (km)</th>
                        <th>Acquisition Cost</th>
                        <th>Status</th>
                        <th className="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicles.map(v => {
                        let statusClass = "available";
                        if (v.status === "On Trip") statusClass = "ontrip";
                        else if (v.status === "In Shop") statusClass = "inshop";
                        else if (v.status === "Retired") statusClass = "retired";

                        return (
                            <tr key={v.id}>
                                <td data-label="Registration">
                                    <span style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: "700", color: "var(--color-primary)" }}>
                                        {v.registration}
                                    </span>
                                </td>
                                <td data-label="Vehicle Name" style={{ fontWeight: 600 }}>{v.name}</td>
                                <td data-label="Type">{v.type}</td>
                                <td data-label="Capacity">{formattedCapacity(v.capacity)}</td>
                                <td data-label="Odometer">{formattedOdometer(v.odometer)}</td>
                                <td data-label="Acquisition Cost">{formattedCost(v.cost)}</td>
                                <td data-label="Status">
                                    <span className={`status-pill ${statusClass}`}>
                                        <span className="status-dot"></span>
                                        {v.status}
                                    </span>
                                </td>
                                <td className="actions-cell" data-label="Actions">
                                    <button className="action-btn btn-edit" onClick={() => onEdit(v)} title="Edit Vehicle" aria-label="Edit Vehicle">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                    </button>
                                    <button className="action-btn btn-delete" onClick={() => onDelete(v)} title="Delete Vehicle" aria-label="Delete Vehicle">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            <line x1="10" y1="11" x2="10" y2="17" />
                                            <line x1="14" y1="11" x2="14" y2="17" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </section>
    );
}

// -------------------------------------------------------------
// Component: Add & Edit Modal Form
// -------------------------------------------------------------
function VehicleFormModal({ isOpen, onClose, onSave, vehicle, vehiclesList }) {
    const [regNumber, setRegNumber] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [capacity, setCapacity] = useState('');
    const [odometer, setOdometer] = useState('');
    const [cost, setCost] = useState('');
    const [status, setStatus] = useState('Available');
    const [errors, setErrors] = useState({});

    // Sync form values on modal open/edit
    useEffect(() => {
        if (isOpen) {
            setErrors({});
            if (vehicle) {
                setRegNumber(vehicle.registration);
                setName(vehicle.name);
                setType(vehicle.type);
                setCapacity(vehicle.capacity);
                setOdometer(vehicle.odometer);
                setCost(vehicle.cost);
                setStatus(vehicle.status);
            } else {
                setRegNumber('');
                setName('');
                setType('');
                setCapacity('');
                setOdometer('');
                setCost('');
                setStatus('Available');
            }
        }
    }, [isOpen, vehicle]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        // Validation: Registration Number cannot be empty
        if (!regNumber.trim()) {
            newErrors.registration = "Registration number is required.";
        } else if (!vehicle) {
            // Check uniqueness only when adding a new vehicle
            const isDuplicate = vehiclesList.some(
                v => v.registration.toUpperCase() === regNumber.trim().toUpperCase()
            );
            if (isDuplicate) {
                newErrors.registration = "Registration number already exists in fleet.";
            }
        }

        // Validation: Vehicle Name cannot be empty
        if (!name.trim()) {
            newErrors.name = "Vehicle name is required.";
        }

        if (!type) {
            newErrors.type = "Please select a vehicle type.";
        }

        const capacityNum = parseInt(capacity, 10);
        if (isNaN(capacityNum) || capacityNum <= 0) {
            newErrors.capacity = "Capacity must be a positive number.";
        }

        const odometerNum = parseInt(odometer, 10);
        if (isNaN(odometerNum) || odometerNum < 0) {
            newErrors.odometer = "Odometer must be 0 or greater.";
        }

        const costNum = parseInt(cost, 10);
        if (isNaN(costNum) || costNum < 0) {
            newErrors.cost = "Acquisition cost must be 0 or greater.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            triggerToast("Please fill in the required fields correctly.", "error");
            return;
        }

        onSave({
            id: vehicle ? vehicle.id : `veh_${Date.now()}`,
            registration: regNumber.trim().toUpperCase(),
            name: name.trim(),
            type,
            capacity: capacityNum,
            odometer: odometerNum,
            cost: costNum,
            status
        });
    };

    return (
        <div className="modal-backdrop" role="dialog" aria-modal="true" style={{ display: "flex" }}>
            <div className="modal-card">
                <header className="modal-header">
                    <h2 className="modal-title">{vehicle ? "Edit Vehicle Details" : "Add New Vehicle"}</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>
                </header>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-grid">
                        {/* Registration */}
                        <div className={`form-group col-span-2 ${errors.registration ? 'invalid' : ''}`}>
                            <label className="required">Registration Number</label>
                            <input
                                type="text"
                                value={regNumber}
                                onChange={(e) => {
                                    setRegNumber(e.target.value);
                                    setErrors(prev => ({ ...prev, registration: null }));
                                }}
                                placeholder="e.g. TX-9842-AB"
                                disabled={!!vehicle} // Disable changing registration for existing vehicles
                                required
                            />
                            {errors.registration && <span className="error-message">{errors.registration}</span>}
                        </div>

                        {/* Name */}
                        <div className={`form-group ${errors.name ? 'invalid' : ''}`}>
                            <label className="required">Vehicle Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setErrors(prev => ({ ...prev, name: null }));
                                }}
                                placeholder="e.g. Stellar Hauler"
                                required
                            />
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>

                        {/* Type */}
                        <div className={`form-group ${errors.type ? 'invalid' : ''}`}>
                            <label className="required">Vehicle Type</label>
                            <div className="select-wrapper">
                                <select
                                    value={type}
                                    onChange={(e) => {
                                        setType(e.target.value);
                                        setErrors(prev => ({ ...prev, type: null }));
                                    }}
                                    required
                                >
                                    <option value="" disabled selected hidden>Select type</option>
                                    <option value="Semi-Truck">Semi-Truck</option>
                                    <option value="Box Truck">Box Truck</option>
                                    <option value="Cargo Van">Cargo Van</option>
                                    <option value="Sprinter Van">Sprinter Van</option>
                                    <option value="Flatbed Truck">Flatbed Truck</option>
                                </select>
                            </div>
                            {errors.type && <span className="error-message">{errors.type}</span>}
                        </div>

                        {/* Capacity */}
                        <div className={`form-group ${errors.capacity ? 'invalid' : ''}`}>
                            <label className="required">Maximum Capacity (kg)</label>
                            <input
                                type="number"
                                value={capacity}
                                onChange={(e) => {
                                    setCapacity(e.target.value);
                                    setErrors(prev => ({ ...prev, capacity: null }));
                                }}
                                placeholder="e.g. 15000"
                                required
                            />
                            {errors.capacity && <span className="error-message">{errors.capacity}</span>}
                        </div>

                        {/* Odometer */}
                        <div className={`form-group ${errors.odometer ? 'invalid' : ''}`}>
                            <label className="required">Odometer Reading (km)</label>
                            <input
                                type="number"
                                value={odometer}
                                onChange={(e) => {
                                    setOdometer(e.target.value);
                                    setErrors(prev => ({ ...prev, odometer: null }));
                                }}
                                placeholder="e.g. 84210"
                                required
                            />
                            {errors.odometer && <span className="error-message">{errors.odometer}</span>}
                        </div>

                        {/* Cost */}
                        <div className={`form-group ${errors.cost ? 'invalid' : ''}`}>
                            <label className="required">Acquisition Cost ($)</label>
                            <input
                                type="number"
                                value={cost}
                                onChange={(e) => {
                                    setCost(e.target.value);
                                    setErrors(prev => ({ ...prev, cost: null }));
                                }}
                                placeholder="e.g. 65000"
                                required
                            />
                            {errors.cost && <span className="error-message">{errors.cost}</span>}
                        </div>

                        {/* Status */}
                        <div className="form-group">
                            <label className="required">Status</label>
                            <div className="select-wrapper">
                                <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                                    <option value="Available">Available</option>
                                    <option value="On Trip">On Trip</option>
                                    <option value="In Shop">In Shop</option>
                                    <option value="Retired">Retired</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <footer className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Vehicle</button>
                    </footer>
                </form>
            </div>
        </div>
    );
}

// -------------------------------------------------------------
// Component: Delete Confirmation Modal
// -------------------------------------------------------------
function ConfirmDeleteModal({ isOpen, onClose, onConfirm, vehicle }) {
    if (!isOpen || !vehicle) return null;

    return (
        <div className="modal-backdrop" role="dialog" aria-modal="true" style={{ display: "flex" }}>
            <div className="modal-card modal-confirm">
                <header className="modal-header">
                    <h2 className="modal-title text-danger">Delete Vehicle?</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>
                </header>
                <div className="modal-body">
                    <p>Are you sure you want to delete vehicle <strong>{vehicle.name} ({vehicle.registration})</strong>? This action is permanent and cannot be undone.</p>
                </div>
                <footer class="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="button" className="btn btn-danger" onClick={onConfirm}>Delete Vehicle</button>
                </footer>
            </div>
        </div>
    );
}

// -------------------------------------------------------------
// Container Component: Main App Manager
// -------------------------------------------------------------
function VehicleRegistryApp() {
    const [vehicles, setVehicles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');
    const [sortBy, setSortBy] = useState('default');

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [activeVehicle, setActiveVehicle] = useState(null);

    // Initial load from localStorage & Sync Event Listener
    useEffect(() => {
        const loadVehicles = () => {
            const stored = localStorage.getItem("smartops_vehicles");
            if (stored) {
                setVehicles(JSON.parse(stored));
            } else {
                setVehicles(DEFAULT_VEHICLES);
                localStorage.setItem("smartops_vehicles", JSON.stringify(DEFAULT_VEHICLES));
            }
        };

        loadVehicles();

        window.addEventListener("vehicles-updated", loadVehicles);
        return () => {
            window.removeEventListener("vehicles-updated", loadVehicles);
        };
    }, []);

    // Save changes helper
    const updateVehiclesState = (newList) => {
        setVehicles(newList);
        localStorage.setItem("smartops_vehicles", JSON.stringify(newList));
    };

    // Form handlers
    const handleSave = (vehicle) => {
        let updatedList;
        if (activeVehicle) {
            // Edit Mode
            updatedList = vehicles.map(v => v.id === vehicle.id ? vehicle : v);
            triggerToast(`Vehicle "${vehicle.name}" information updated successfully.`, "success");
        } else {
            // Add Mode
            updatedList = [vehicle, ...vehicles];
            triggerToast(`Vehicle "${vehicle.name}" has been registered.`, "success");
        }
        updateVehiclesState(updatedList);
        setIsFormModalOpen(false);
        setActiveVehicle(null);
    };

    const handleDelete = () => {
        if (!activeVehicle) return;
        const updatedList = vehicles.filter(v => v.id !== activeVehicle.id);
        updateVehiclesState(updatedList);
        triggerToast(`Vehicle "${activeVehicle.name}" was successfully deleted from registry.`, "danger");
        setIsDeleteModalOpen(false);
        setActiveVehicle(null);
    };

    // Filter and Sort Computing
    const processedVehicles = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        let list = vehicles.filter(v => {
            const matchesSearch =
                v.registration.toLowerCase().includes(query) ||
                v.name.toLowerCase().includes(query) ||
                v.type.toLowerCase().includes(query);

            const matchesStatus = statusFilter === "All" || v.status === statusFilter;
            const matchesType = typeFilter === "All" || v.type === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });

        // Sorting
        if (sortBy === "reg-asc") {
            list.sort((a, b) => a.registration.localeCompare(b.registration));
        } else if (sortBy === "name-asc") {
            list.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "capacity-desc") {
            list.sort((a, b) => b.capacity - a.capacity);
        } else if (sortBy === "odometer-asc") {
            list.sort((a, b) => a.odometer - b.odometer);
        } else if (sortBy === "cost-desc") {
            list.sort((a, b) => b.cost - a.cost);
        }

        return list;
    }, [vehicles, searchQuery, statusFilter, typeFilter, sortBy]);

    // Bind "Add Vehicle" click internally using communication logic
    useEffect(() => {
        const handleAddBtnClick = () => {
            setActiveVehicle(null);
            setIsFormModalOpen(true);
        };

        const btn = document.getElementById("btn-add-vehicle");
        if (btn) {
            btn.addEventListener("click", handleAddBtnClick);
        }
        return () => {
            if (btn) {
                btn.removeEventListener("click", handleAddBtnClick);
            }
        };
    }, []);

    return (
        <React.Fragment>
            {/* KPI metrics */}
            <VehicleStatsGrid vehicles={vehicles} />

            {/* Filter and sorting control bar */}
            <VehicleFilterControls
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />

            {/* Responsive Table */}
            <VehicleTable
                vehicles={processedVehicles}
                onEdit={(v) => {
                    setActiveVehicle(v);
                    setIsFormModalOpen(true);
                }}
                onDelete={(v) => {
                    setActiveVehicle(v);
                    setIsDeleteModalOpen(true);
                }}
            />

            {/* Modals */}
            <VehicleFormModal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setActiveVehicle(null);
                }}
                onSave={handleSave}
                vehicle={activeVehicle}
                vehiclesList={vehicles}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setActiveVehicle(null);
                }}
                onConfirm={handleDelete}
                vehicle={activeVehicle}
            />
        </React.Fragment>
    );
}

// Render app into root container
const container = document.getElementById('section-vehicles');
const root = ReactDOM.createRoot(container);
root.render(<VehicleRegistryApp />);
