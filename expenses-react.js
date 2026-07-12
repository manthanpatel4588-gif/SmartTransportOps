// =============================================================
// React Expense Management Component for SmartTransportOps
// Handled via Babel Standalone CDN in index.html
// =============================================================

const { useState, useEffect, useMemo } = React;

const DEFAULT_EXPENSES = [
    {
        id: "exp_1",
        vehicleId: "veh_1",
        vehicleReg: "TX-9842-AB",
        vehicleName: "Stellar Hauler",
        type: "Maintenance",
        amount: 1450,
        date: "2026-07-08",
        notes: "Replaced front brake pads and rotated tires."
    },
    {
        id: "exp_2",
        vehicleId: "veh_2",
        vehicleReg: "CA-1150-XY",
        vehicleName: "Metro Sprint",
        type: "Toll",
        amount: 45,
        date: "2026-07-10",
        notes: "Express highway toll charges."
    },
    {
        id: "exp_3",
        vehicleId: "veh_4",
        vehicleReg: "FL-8931-ZZ",
        vehicleName: "Eco Express",
        type: "Parking",
        amount: 25,
        date: "2026-07-11",
        notes: "Overnight parking fee at distribution center."
    },
    {
        id: "exp_4",
        vehicleId: "veh_3",
        vehicleReg: "NY-4482-CD",
        vehicleName: "Titan Loader",
        type: "Miscellaneous",
        amount: 120,
        date: "2026-07-09",
        notes: "Purchased heavy-duty ratchet straps."
    }
];

// Helper: Custom Toast trigger inside global scope
function triggerToast(message, type = "success") {
    if (typeof window.showToast === "function") {
        window.showToast(message, type);
    } else {
        console.log(`[Toast ${type}]: ${message}`);
    }
}

// -------------------------------------------------------------
// Component: Stats Grid
// -------------------------------------------------------------
function ExpenseStatsGrid({ expenses }) {
    const stats = useMemo(() => {
        let total = 0;
        let toll = 0;
        let maintenance = 0;
        let parking = 0;

        expenses.forEach(e => {
            total += e.amount;
            if (e.type === "Toll") toll += e.amount;
            else if (e.type === "Maintenance") maintenance += e.amount;
            else if (e.type === "Parking") parking += e.amount;
        });

        return { total, toll, maintenance, parking };
    }, [expenses]);

    const formattedCost = (val) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(val);

    return (
        <section className="metrics-grid" aria-label="Expense KPIs">
            <div className="metric-card bg-glow-blue">
                <div className="card-glow"></div>
                <div className="metric-header">
                    <span className="metric-label">Total Expenses</span>
                    <div className="metric-icon-wrapper text-blue">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <line x1="12" y1="1" x2="12" y2="23" />
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </div>
                </div>
                <div className="metric-value">{formattedCost(stats.total)}</div>
                <div className="metric-trend text-muted">Accumulated operational cost</div>
            </div>

            <div className="metric-card bg-glow-green">
                <div className="card-glow"></div>
                <div className="metric-header">
                    <span className="metric-label">Maintenance</span>
                    <div className="metric-icon-wrapper text-green">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                    </div>
                </div>
                <div className="metric-value">{formattedCost(stats.maintenance)}</div>
                <div className="metric-trend text-green">Shop & repair costs</div>
            </div>

            <div className="metric-card bg-glow-yellow">
                <div className="card-glow"></div>
                <div className="metric-header">
                    <span className="metric-label">Tolls</span>
                    <div className="metric-icon-wrapper text-yellow">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="10" rx="2" />
                            <path d="M12 2v9M8 5h8" />
                        </svg>
                    </div>
                </div>
                <div className="metric-value">{formattedCost(stats.toll)}</div>
                <div className="metric-trend text-yellow">Transit highway fees</div>
            </div>

            <div className="metric-card bg-glow-red">
                <div className="card-glow"></div>
                <div className="metric-header">
                    <span className="metric-label">Parking</span>
                    <div className="metric-icon-wrapper text-red">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
                        </svg>
                    </div>
                </div>
                <div className="metric-value">{formattedCost(stats.parking)}</div>
                <div className="metric-trend text-red">Terminal & layover fees</div>
            </div>
        </section>
    );
}

// -------------------------------------------------------------
// Component: Filter Controls
// -------------------------------------------------------------
function ExpenseFilterControls({
    searchQuery, setSearchQuery,
    typeFilter, setTypeFilter,
    vehicleFilter, setVehicleFilter,
    vehiclesList
}) {
    return (
        <section className="controls-panel">
            <div className="search-box">
                <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    placeholder="Search by notes, type or vehicle..."
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
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} aria-label="Filter by Expense Type">
                        <option value="All">All Expense Types</option>
                        <option value="Toll">Toll</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Parking">Parking</option>
                        <option value="Miscellaneous">Miscellaneous</option>
                    </select>
                </div>
                <div className="select-wrapper">
                    <select value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)} aria-label="Filter by Vehicle">
                        <option value="All">All Vehicles</option>
                        {vehiclesList.map(v => (
                            <option key={v.id} value={v.id}>{v.name} ({v.registration})</option>
                        ))}
                    </select>
                </div>
            </div>
        </section>
    );
}

// -------------------------------------------------------------
// Component: Expense Table Rows & Header
// -------------------------------------------------------------
function ExpenseTable({ expenses, onEdit, onDelete }) {
    const formattedCost = (val) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(val);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (expenses.length === 0) {
        return (
            <section className="table-container">
                <div className="table-empty-state">
                    <div className="empty-icon">💸</div>
                    <h3 className="empty-title">No expenses logged</h3>
                    <p className="empty-subtitle">Try refining your search terms or log a new operational expense.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="table-container">
            <table className="driver-table">
                <thead>
                    <tr>
                        <th>Vehicle</th>
                        <th>Expense Type</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Notes</th>
                        <th className="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map(e => (
                        <tr key={e.id}>
                            <td data-label="Vehicle">
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span style={{ fontWeight: 600 }}>{e.vehicleName}</span>
                                    <span style={{ fontFamily: "monospace", fontSize: "11px", color: "var(--color-primary)" }}>{e.vehicleReg}</span>
                                </div>
                            </td>
                            <td data-label="Expense Type">
                                <span className={`status-pill ${e.type.toLowerCase() === 'maintenance' ? 'inshop' : e.type.toLowerCase() === 'toll' ? 'ontrip' : e.type.toLowerCase() === 'parking' ? 'available' : 'retired'}`}>
                                    <span className="status-dot"></span>
                                    {e.type}
                                </span>
                            </td>
                            <td data-label="Amount" style={{ fontWeight: 700, color: "var(--color-primary)" }}>{formattedCost(e.amount)}</td>
                            <td data-label="Date">{formatDate(e.date)}</td>
                            <td data-label="Notes" style={{ maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={e.notes}>
                                {e.notes || <span className="text-muted">No notes provided.</span>}
                            </td>
                            <td className="actions-cell" data-label="Actions">
                                <button className="action-btn btn-edit" onClick={() => onEdit(e)} title="Edit Expense" aria-label="Edit Expense">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                </button>
                                <button className="action-btn btn-delete" onClick={() => onDelete(e)} title="Delete Expense" aria-label="Delete Expense">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        <line x1="10" y1="11" x2="10" y2="17" />
                                        <line x1="14" y1="11" x2="14" y2="17" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

// -------------------------------------------------------------
// Component: Add & Edit Modal Form
// -------------------------------------------------------------
function ExpenseFormModal({ isOpen, onClose, onSave, expense, vehiclesList }) {
    const [vehicleId, setVehicleId] = useState('');
    const [type, setType] = useState('Toll');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState({});

    // Sync form values on modal open/edit
    useEffect(() => {
        if (isOpen) {
            setErrors({});
            if (expense) {
                setVehicleId(expense.vehicleId);
                setType(expense.type);
                setAmount(expense.amount);
                setDate(expense.date);
                setNotes(expense.notes);
            } else {
                setVehicleId(vehiclesList.length > 0 ? vehiclesList[0].id : '');
                setType('Toll');
                setAmount('');
                // Set default today's date in YYYY-MM-DD
                const today = new Date().toISOString().split('T')[0];
                setDate(today);
                setNotes('');
            }
        }
    }, [isOpen, expense, vehiclesList]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!vehicleId) {
            newErrors.vehicleId = "Please select a vehicle.";
        }

        if (!type) {
            newErrors.type = "Please select an expense type.";
        }

        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            newErrors.amount = "Amount must be a positive number.";
        }

        if (!date) {
            newErrors.date = "Please select a valid date.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            triggerToast("Please fill in the required fields correctly.", "error");
            return;
        }

        const matchingVehicle = vehiclesList.find(v => v.id === vehicleId);

        onSave({
            id: expense ? expense.id : `exp_${Date.now()}`,
            vehicleId,
            vehicleReg: matchingVehicle ? matchingVehicle.registration : "N/A",
            vehicleName: matchingVehicle ? matchingVehicle.name : "Unknown",
            type,
            amount: amountNum,
            date,
            notes: notes.trim()
        });
    };

    return (
        <div className="modal-backdrop" role="dialog" aria-modal="true" style={{ display: "flex" }}>
            <div className="modal-card">
                <header className="modal-header">
                    <h2 className="modal-title">{expense ? "Edit Expense Entry" : "Log Operational Expense"}</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>
                </header>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-grid">
                        {/* Vehicle Selection */}
                        <div className={`form-group col-span-2 ${errors.vehicleId ? 'invalid' : ''}`}>
                            <label className="required">Vehicle Asset</label>
                            <div className="select-wrapper">
                                <select
                                    value={vehicleId}
                                    onChange={(e) => {
                                        setVehicleId(e.target.value);
                                        setErrors(prev => ({ ...prev, vehicleId: null }));
                                    }}
                                    required
                                >
                                    <option value="" disabled hidden>Select active fleet vehicle</option>
                                    {vehiclesList.map(v => (
                                        <option key={v.id} value={v.id}>{v.name} ({v.registration})</option>
                                    ))}
                                </select>
                            </div>
                            {errors.vehicleId && <span className="error-message">{errors.vehicleId}</span>}
                            {vehiclesList.length === 0 && (
                                <span className="error-message" style={{ color: "var(--color-warning)" }}>
                                    Warning: No vehicles registered. Add a vehicle in Fleet Registry first.
                                </span>
                            )}
                        </div>

                        {/* Expense Type */}
                        <div className={`form-group ${errors.type ? 'invalid' : ''}`}>
                            <label className="required">Expense Category</label>
                            <div className="select-wrapper">
                                <select
                                    value={type}
                                    onChange={(e) => {
                                        setType(e.target.value);
                                        setErrors(prev => ({ ...prev, type: null }));
                                    }}
                                    required
                                >
                                    <option value="Toll">Toll</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Parking">Parking</option>
                                    <option value="Miscellaneous">Miscellaneous</option>
                                </select>
                            </div>
                            {errors.type && <span className="error-message">{errors.type}</span>}
                        </div>

                        {/* Amount */}
                        <div className={`form-group ${errors.amount ? 'invalid' : ''}`}>
                            <label className="required">Amount ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => {
                                    setAmount(e.target.value);
                                    setErrors(prev => ({ ...prev, amount: null }));
                                }}
                                placeholder="e.g. 120.50"
                                required
                            />
                            {errors.amount && <span className="error-message">{errors.amount}</span>}
                        </div>

                        {/* Date */}
                        <div className={`form-group col-span-2 ${errors.date ? 'invalid' : ''}`}>
                            <label className="required">Billing Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => {
                                    setDate(e.target.value);
                                    setErrors(prev => ({ ...prev, date: null }));
                                }}
                                required
                            />
                            {errors.date && <span className="error-message">{errors.date}</span>}
                        </div>

                        {/* Notes */}
                        <div className="form-group col-span-2">
                            <label>Expense Notes & Reference</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add invoice number, vendor, or context..."
                                rows="3"
                            ></textarea>
                        </div>
                    </div>

                    <footer className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Expense</button>
                    </footer>
                </form>
            </div>
        </div>
    );
}

// -------------------------------------------------------------
// Component: Delete Confirmation Modal
// -------------------------------------------------------------
function ConfirmDeleteExpenseModal({ isOpen, onClose, onConfirm, expense }) {
    if (!isOpen || !expense) return null;

    return (
        <div className="modal-backdrop" role="dialog" aria-modal="true" style={{ display: "flex" }}>
            <div className="modal-card modal-confirm">
                <header className="modal-header">
                    <h2 className="modal-title text-danger">Delete Expense Record?</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>
                </header>
                <div className="modal-body">
                    <p>Are you sure you want to delete this expense record for <strong>{expense.vehicleName}</strong> worth <strong>${expense.amount}</strong>? This action is permanent.</p>
                </div>
                <footer className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="button" className="btn btn-danger" onClick={onConfirm}>Delete Expense</button>
                </footer>
            </div>
        </div>
    );
}

// -------------------------------------------------------------
// Container Component: Main App Manager
// -------------------------------------------------------------
function ExpenseRegistryApp() {
    const [expenses, setExpenses] = useState([]);
    const [vehiclesList, setVehiclesList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [vehicleFilter, setVehicleFilter] = useState('All');

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [activeExpense, setActiveExpense] = useState(null);

    // Initial load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("smartops_expenses");
        if (stored) {
            setExpenses(JSON.parse(stored));
        } else {
            setExpenses(DEFAULT_EXPENSES);
            localStorage.setItem("smartops_expenses", JSON.stringify(DEFAULT_EXPENSES));
        }

        // Fetch active vehicles list
        const storedVehs = localStorage.getItem("smartops_vehicles");
        if (storedVehs) {
            setVehiclesList(JSON.parse(storedVehs));
        }
    }, []);

    // Set up sync listener for vehicles update
    useEffect(() => {
        const syncVehicles = () => {
            const storedVehs = localStorage.getItem("smartops_vehicles");
            if (storedVehs) {
                setVehiclesList(JSON.parse(storedVehs));
            }
        };
        window.addEventListener("vehicles-updated", syncVehicles);
        return () => window.removeEventListener("vehicles-updated", syncVehicles);
    }, []);

    const updateExpensesState = (newList) => {
        setExpenses(newList);
        localStorage.setItem("smartops_expenses", JSON.stringify(newList));
    };

    // Form Handlers
    const handleSave = (expense) => {
        let updatedList;
        if (activeExpense) {
            // Edit
            updatedList = expenses.map(e => e.id === expense.id ? expense : e);
            triggerToast(`Expense record updated successfully.`, "success");
        } else {
            // Add
            updatedList = [expense, ...expenses];
            triggerToast(`Expense record logged successfully.`, "success");
        }
        updateExpensesState(updatedList);
        setIsFormModalOpen(false);
        setActiveExpense(null);
    };

    const handleDelete = () => {
        if (!activeExpense) return;
        const updatedList = expenses.filter(e => e.id !== activeExpense.id);
        updateExpensesState(updatedList);
        triggerToast(`Expense record deleted.`, "danger");
        setIsDeleteModalOpen(false);
        setActiveExpense(null);
    };

    // Computes search & filter criteria
    const processedExpenses = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return expenses.filter(e => {
            const matchesSearch =
                e.notes.toLowerCase().includes(query) ||
                e.type.toLowerCase().includes(query) ||
                e.vehicleName.toLowerCase().includes(query) ||
                e.vehicleReg.toLowerCase().includes(query);

            const matchesType = typeFilter === "All" || e.type === typeFilter;
            const matchesVehicle = vehicleFilter === "All" || e.vehicleId === vehicleFilter;

            return matchesSearch && matchesType && matchesVehicle;
        });
    }, [expenses, searchQuery, typeFilter, vehicleFilter]);

    return (
        <React.Fragment>
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-title-container">
                    <h1 class="page-title">Expense Management</h1>
                    <p class="page-subtitle">Track, audit, and log operational vehicle expenses.</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={() => {
                        setActiveExpense(null);
                        setIsFormModalOpen(true);
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Expense
                    </button>
                </div>
            </header>

            {/* Metrics cards */}
            <ExpenseStatsGrid expenses={expenses} />

            {/* Filter Panel */}
            <ExpenseFilterControls
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                vehicleFilter={vehicleFilter}
                setVehicleFilter={setVehicleFilter}
                vehiclesList={vehiclesList}
            />

            {/* Table */}
            <ExpenseTable
                expenses={processedExpenses}
                onEdit={(e) => {
                    setActiveExpense(e);
                    setIsFormModalOpen(true);
                }}
                onDelete={(e) => {
                    setActiveExpense(e);
                    setIsDeleteModalOpen(true);
                }}
            />

            {/* Modals */}
            <ExpenseFormModal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setActiveExpense(null);
                }}
                onSave={handleSave}
                expense={activeExpense}
                vehiclesList={vehiclesList}
            />

            <ConfirmDeleteExpenseModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setActiveExpense(null);
                }}
                onConfirm={handleDelete}
                expense={activeExpense}
            />
        </React.Fragment>
    );
}

// Render app into Expenses root container
const expensesContainer = document.getElementById('section-expenses');
const expensesRoot = ReactDOM.createRoot(expensesContainer);
expensesRoot.render(<ExpenseRegistryApp />);
