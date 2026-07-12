// Mock Data Initialization
const DEFAULT_DRIVERS = [
    {
        id: "drv_1",
        name: "Alexander Pierce",
        licenseNumber: "DL-3849502",
        licenseCategory: "Class A",
        expiryDate: "2027-11-15",
        contactNumber: "+1 (555) 019-2834",
        safetyScore: 94,
        status: "Available"
    },
    {
        id: "drv_2",
        name: "Marcus Vance",
        licenseNumber: "DL-4820194",
        licenseCategory: "Class B",
        expiryDate: "2026-08-30",
        contactNumber: "+1 (555) 014-9482",
        safetyScore: 88,
        status: "On Trip"
    },
    {
        id: "drv_3",
        name: "Sarah Connor",
        licenseNumber: "DL-9081234",
        licenseCategory: "Class C",
        expiryDate: "2028-03-12",
        contactNumber: "+1 (555) 017-3829",
        safetyScore: 97,
        status: "Available"
    },
    {
        id: "drv_4",
        name: "Derrick Rose",
        licenseNumber: "DL-1102938",
        licenseCategory: "Heavy Rigid",
        expiryDate: "2026-07-28", // Expiring very soon relative to July 12, 2026
        contactNumber: "+1 (555) 012-3849",
        safetyScore: 78,
        status: "Off Duty"
    },
    {
        id: "drv_5",
        name: "Elena Rostova",
        licenseNumber: "DL-5520938",
        licenseCategory: "Class A",
        expiryDate: "2027-05-20",
        contactNumber: "+1 (555) 015-8930",
        safetyScore: 92,
        status: "Suspended"
    },
    {
        id: "drv_6",
        name: "James Carter",
        licenseNumber: "DL-8839201",
        licenseCategory: "Heavy Rigid",
        expiryDate: "2026-03-15", // Already expired relative to July 12, 2026
        contactNumber: "+1 (555) 011-8293",
        safetyScore: 65,
        status: "Suspended"
    }
];

// App State
let drivers = [];
let currentEditId = null;
let currentDeleteId = null;

// DOM Elements
const driverTableBody = document.getElementById("driver-table-body");
const tableEmptyState = document.getElementById("table-empty-state");
const driverTable = document.getElementById("driver-table");

// Metrics
const metricTotal = document.getElementById("metric-total");
const metricAvailable = document.getElementById("metric-available");
const metricOnTrip = document.getElementById("metric-ontrip");
const metricSafety = document.getElementById("metric-safety");

// Search & Filters
const searchInput = document.getElementById("search-input");
const btnClearSearch = document.getElementById("btn-clear-search");
const filterStatus = document.getElementById("filter-status");
const filterCategory = document.getElementById("filter-category");
const sortBy = document.getElementById("sort-by");

// Modals
const driverModal = document.getElementById("driver-modal");
const deleteModal = document.getElementById("delete-modal");
const btnAddDriver = document.getElementById("btn-add-driver");
const btnCloseModal = document.getElementById("btn-close-modal");
const btnCancelModal = document.getElementById("btn-cancel-modal");
const btnCloseDeleteModal = document.getElementById("btn-close-delete-modal");
const btnCancelDelete = document.getElementById("btn-cancel-delete");
const btnConfirmDelete = document.getElementById("btn-confirm-delete");
const deleteDriverName = document.getElementById("delete-driver-name");

// Form
const driverForm = document.getElementById("driver-form");
const modalTitle = document.getElementById("modal-title");
const inputDriverId = document.getElementById("form-driver-id");
const inputDriverName = document.getElementById("input-driver-name");
const inputLicenseNumber = document.getElementById("input-license-number");
const inputLicenseCategory = document.getElementById("input-license-category");
const inputExpiryDate = document.getElementById("input-expiry-date");
const inputContactNumber = document.getElementById("input-contact-number");
const inputSafetyScore = document.getElementById("input-safety-score");
const inputStatus = document.getElementById("input-status");

// Toast container
const toastContainer = document.getElementById("toast-container");

// Initialize Application State
function initApp() {
    // Drivers load
    const storedDrivers = localStorage.getItem("smartops_drivers");
    if (storedDrivers) {
        drivers = JSON.parse(storedDrivers);
    } else {
        drivers = [...DEFAULT_DRIVERS];
        saveToLocalStorage();
    }
    
    bindEvents();
    renderApp();
}

// Save to LocalStorage
function saveToLocalStorage() {
    localStorage.setItem("smartops_drivers", JSON.stringify(drivers));
}

// Tab switcher
function switchTab(tab) {
    const sectionDrivers = document.getElementById("section-drivers");
    const sectionVehicles = document.getElementById("section-vehicles");
    const navDrivers = document.getElementById("nav-drivers");
    const navVehicles = document.getElementById("nav-vehicles");

    if (tab === 'drivers') {
        navDrivers.classList.add('active');
        navVehicles.classList.remove('active');
        sectionDrivers.style.display = 'block';
        sectionVehicles.style.display = 'none';
        renderApp();
    } else if (tab === 'vehicles') {
        navDrivers.classList.remove('active');
        navVehicles.classList.add('active');
        sectionDrivers.style.display = 'none';
        sectionVehicles.style.display = 'block';
        // Rendering handled automatically by React!
    }
}

// Bind Page Event Listeners
function bindEvents() {
    const navDrivers = document.getElementById("nav-drivers");
    const navVehicles = document.getElementById("nav-vehicles");

    // Tab switching triggers
    navDrivers.addEventListener("click", (e) => {
        e.preventDefault();
        switchTab('drivers');
    });
    navVehicles.addEventListener("click", (e) => {
        e.preventDefault();
        switchTab('vehicles');
    });

    // Drivers Search & Filter change triggers
    searchInput.addEventListener("input", handleSearchInput);
    btnClearSearch.addEventListener("click", clearSearch);
    filterStatus.addEventListener("change", renderApp);
    filterCategory.addEventListener("change", renderApp);
    sortBy.addEventListener("change", renderApp);

    // Drivers Modal Triggers
    btnAddDriver.addEventListener("click", () => openDriverModal());
    btnCloseModal.addEventListener("click", closeDriverModal);
    btnCancelModal.addEventListener("click", closeDriverModal);
    driverForm.addEventListener("submit", handleFormSubmit);

    // Drivers Delete Modal Triggers
    btnCloseDeleteModal.addEventListener("click", closeDeleteModal);
    btnCancelDelete.addEventListener("click", closeDeleteModal);
    btnConfirmDelete.addEventListener("click", confirmDeleteDriver);

    // Close Modals on Outer Overlay Clicks
    window.addEventListener("click", (e) => {
        if (e.target === driverModal) closeDriverModal();
        if (e.target === deleteModal) closeDeleteModal();
    });
}

// Generate initials from name (e.g. John Doe -> JD)
function getInitials(name) {
    if (!name) return "DR";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Format Date nicely
function formatDate(dateString) {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Helper: Check Expiry Date against dynamic today vs simulated user reference date (July 12, 2026)
function getExpiryStatus(dateString) {
    if (!dateString) return { text: "Normal", class: "" };
    
    // We base calculations relative to user's simulated date: July 12, 2026
    const refDate = new Date("2026-07-12");
    const expiryDate = new Date(dateString);
    const diffTime = expiryDate - refDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { text: "Expired", class: "expiry-alert" };
    } else if (diffDays <= 30) {
        return { text: `Expiring soon (${diffDays}d)`, class: "expiry-alert" };
    }
    return { text: formatDate(dateString), class: "" };
}

// Calculate Fleet stats and render widgets
function updateMetrics() {
    const totalCount = drivers.length;
    const availableCount = drivers.filter(d => d.status === "Available").length;
    const onTripCount = drivers.filter(d => d.status === "On Trip").length;
    
    let avgSafety = 0;
    if (totalCount > 0) {
        const sum = drivers.reduce((acc, curr) => acc + Number(curr.safetyScore), 0);
        avgSafety = Math.round((sum / totalCount) * 10) / 10;
    }

    metricTotal.textContent = totalCount;
    metricAvailable.textContent = availableCount;
    metricOnTrip.textContent = onTripCount;
    metricSafety.textContent = `${avgSafety}%`;
}

// Render dynamic elements
function renderApp() {
    updateMetrics();

    const query = searchInput.value.toLowerCase().trim();
    const statusVal = filterStatus.value;
    const categoryVal = filterCategory.value;
    const sortVal = sortBy.value;

    // Filter Drivers list
    let filtered = drivers.filter(driver => {
        const matchesSearch = 
            driver.name.toLowerCase().includes(query) ||
            driver.licenseNumber.toLowerCase().includes(query) ||
            driver.licenseCategory.toLowerCase().includes(query);
            
        const matchesStatus = statusVal === "All" || driver.status === statusVal;
        const matchesCategory = categoryVal === "All" || driver.licenseCategory === categoryVal;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sort Drivers list
    if (sortVal === "name-asc") {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortVal === "name-desc") {
        filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortVal === "safety-desc") {
        filtered.sort((a, b) => b.safetyScore - a.safetyScore);
    } else if (sortVal === "safety-asc") {
        filtered.sort((a, b) => a.safetyScore - b.safetyScore);
    } else if (sortVal === "expiry-asc") {
        filtered.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    }

    // Toggle Empty state indicators
    if (filtered.length === 0) {
        driverTable.style.display = "none";
        tableEmptyState.style.display = "block";
    } else {
        driverTable.style.display = "table";
        tableEmptyState.style.display = "none";
    }

    // Render Table rows
    driverTableBody.innerHTML = "";
    filtered.forEach(driver => {
        const tr = document.createElement("tr");
        
        // Safety score theme color
        let scoreClass = "bg-glow-green";
        let barColor = "var(--color-success)";
        if (driver.safetyScore < 75) {
            scoreClass = "bg-glow-red";
            barColor = "var(--color-danger)";
        } else if (driver.safetyScore < 90) {
            scoreClass = "bg-glow-yellow";
            barColor = "var(--color-warning)";
        }

        // Expiry layout status
        const expiryInfo = getExpiryStatus(driver.expiryDate);

        // Map status style classes
        let statusClass = "available";
        if (driver.status === "On Trip") statusClass = "ontrip";
        else if (driver.status === "Off Duty") statusClass = "offduty";
        else if (driver.status === "Suspended") statusClass = "suspended";

        // HTML Row
        tr.innerHTML = `
            <td class="driver-details-cell" data-label="Driver Details">
                <div class="driver-avatar">${getInitials(driver.name)}</div>
                <div>
                    <div class="driver-name">${escapeHTML(driver.name)}</div>
                    <div class="driver-license-sub">${escapeHTML(driver.licenseNumber)}</div>
                </div>
            </td>
            <td data-label="License Info">
                <div>Category: <span class="license-category-badge">${escapeHTML(driver.licenseCategory)}</span></div>
                <div class="driver-license-sub mt-2">Expires: <span class="${expiryInfo.class}">${expiryInfo.text}</span></div>
            </td>
            <td data-label="Contact">
                <div style="font-weight: 500;">${escapeHTML(driver.contactNumber)}</div>
            </td>
            <td data-label="Safety Score">
                <div class="safety-score-container">
                    <span class="safety-score-number" style="color: ${barColor}">${driver.safetyScore}%</span>
                    <div class="safety-score-track">
                        <div class="safety-score-bar" style="width: ${driver.safetyScore}%; background-color: ${barColor}"></div>
                    </div>
                </div>
            </td>
            <td data-label="Status">
                <span class="status-pill ${statusClass}">
                    <span class="status-dot"></span>
                    ${driver.status}
                </span>
            </td>
            <td class="actions-cell" data-label="Actions">
                <button class="action-btn btn-edit" data-id="${driver.id}" title="Edit Profile" aria-label="Edit Profile">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="action-btn btn-delete" data-id="${driver.id}" title="Delete Profile" aria-label="Delete Profile">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
            </td>
        `;

        driverTableBody.appendChild(tr);
    });

    // Rebind action buttons
    document.querySelectorAll(".btn-edit").forEach(btn => {
        btn.addEventListener("click", () => openDriverModal(btn.getAttribute("data-id")));
    });
    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", () => openDeleteModal(btn.getAttribute("data-id")));
    });
}

// Handling Search Inputs with Clear Icon Toggle
function handleSearchInput() {
    if (searchInput.value.trim().length > 0) {
        btnClearSearch.style.display = "block";
    } else {
        btnClearSearch.style.display = "none";
    }
    renderApp();
}

function clearSearch() {
    searchInput.value = "";
    btnClearSearch.style.display = "none";
    renderApp();
}

// Modal open controller
function openDriverModal(driverId = null) {
    resetFormErrors();
    
    if (driverId) {
        // Edit Mode
        currentEditId = driverId;
        const driver = drivers.find(d => d.id === driverId);
        if (!driver) return;

        modalTitle.textContent = "Edit Driver Profile";
        inputDriverId.value = driver.id;
        inputDriverName.value = driver.name;
        inputLicenseNumber.value = driver.licenseNumber;
        inputLicenseCategory.value = driver.licenseCategory;
        inputExpiryDate.value = driver.expiryDate;
        inputContactNumber.value = driver.contactNumber;
        inputSafetyScore.value = driver.safetyScore;
        inputStatus.value = driver.status;
    } else {
        // Add Mode
        currentEditId = null;
        modalTitle.textContent = "Add New Driver";
        driverForm.reset();
        inputDriverId.value = "";
        inputStatus.value = "Available"; // default selection
    }

    driverModal.style.display = "flex";
    inputDriverName.focus();
}

function closeDriverModal() {
    driverModal.style.display = "none";
    currentEditId = null;
}

// Delete Confirm modal controllers
function openDeleteModal(driverId) {
    const driver = drivers.find(d => d.id === driverId);
    if (!driver) return;

    currentDeleteId = driverId;
    deleteDriverName.textContent = driver.name;
    deleteModal.style.display = "flex";
}

function closeDeleteModal() {
    deleteModal.style.display = "none";
    currentDeleteId = null;
}

function confirmDeleteDriver() {
    if (!currentDeleteId) return;

    const driverIndex = drivers.findIndex(d => d.id === currentDeleteId);
    if (driverIndex !== -1) {
        const deletedName = drivers[driverIndex].name;
        drivers.splice(driverIndex, 1);
        saveToLocalStorage();
        renderApp();
        showToast(`Driver profile for "${deletedName}" was successfully deleted.`, "danger");
    }

    closeDeleteModal();
}

// Validation & submission of form details
function handleFormSubmit(e) {
    e.preventDefault();
    resetFormErrors();

    const isFormValid = validateForm();
    if (!isFormValid) return;

    const driverData = {
        id: currentEditId || `drv_${Date.now()}`,
        name: inputDriverName.value.trim(),
        licenseNumber: inputLicenseNumber.value.trim(),
        licenseCategory: inputLicenseCategory.value,
        expiryDate: inputExpiryDate.value,
        contactNumber: inputContactNumber.value.trim(),
        safetyScore: parseInt(inputSafetyScore.value, 10),
        status: inputStatus.value
    };

    if (currentEditId) {
        // Update profile
        const index = drivers.findIndex(d => d.id === currentEditId);
        if (index !== -1) {
            drivers[index] = driverData;
            showToast(`Driver "${driverData.name}" profile updated successfully.`, "success");
        }
    } else {
        // Add profile
        drivers.unshift(driverData); // Add to the top of list
        showToast(`Driver "${driverData.name}" has been registered.`, "success");
    }

    saveToLocalStorage();
    renderApp();
    closeDriverModal();
}

// Custom Validators
function validateForm() {
    let isValid = true;

    // Driver Name
    if (!inputDriverName.value.trim()) {
        showError("driver-name");
        isValid = false;
    }

    // License Number
    if (!inputLicenseNumber.value.trim()) {
        showError("license-number");
        isValid = false;
    }

    // License Category
    if (!inputLicenseCategory.value) {
        showError("license-category");
        isValid = false;
    }

    // Expiry Date
    if (!inputExpiryDate.value) {
        showError("expiry-date");
        isValid = false;
    }

    // Contact (Quick phone check)
    const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;
    if (!phoneRegex.test(inputContactNumber.value.trim())) {
        showError("contact-number");
        isValid = false;
    }

    // Safety Score limits
    const scoreVal = parseInt(inputSafetyScore.value, 10);
    if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 100) {
        showError("safety-score");
        isValid = false;
    }

    // Status
    if (!inputStatus.value) {
        showError("status");
        isValid = false;
    }

    return isValid;
}

function showError(fieldId) {
    const input = document.getElementById(`input-${fieldId}`);
    if (input) {
        input.closest(".form-group").classList.add("invalid");
    }
}

function resetFormErrors() {
    document.querySelectorAll(".form-group").forEach(group => {
        group.classList.remove("invalid");
    });
}

// Dynamic Toast Notifications
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    toast.innerHTML = `
        <span class="toast-content">${escapeHTML(message)}</span>
        <button class="toast-close" aria-label="Close notification">✕</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Bind Close toast click
    toast.querySelector(".toast-close").addEventListener("click", () => {
        toast.remove();
    });

    // Auto dismiss after 4s
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = "fadeIn 0.3s reverse forwards";
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);
}

// Safe escape utilities for XSS prevention
function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Start app
window.addEventListener("DOMContentLoaded", initApp);
