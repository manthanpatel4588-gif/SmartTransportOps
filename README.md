# SmartTransportOps 🚀

**SmartTransportOps** is a premium, real-time fleet dispatch control and operational expense tracking single-page web application. It is designed to optimize logistical transport management by organizing drivers, tracking vehicle inventory, orchestrating transit routes, and analyzing operational expenditures—all inside a highly responsive, modern dark-themed dashboard.

---

## 1. Project Overview

Logistical dispatchers frequently struggle with fragmented data, leading to expired driver licenses going unnoticed, vehicle over-allocation, and untracked trip costs. 

**SmartTransportOps** resolves these issues by consolidating all core fleet entities (Drivers, Vehicles, and Trips) into an integrated state machine. It prevents invalid assignments in real time and automatically aggregates operational expenses to deliver instant vehicle-wise cost breakdowns.

---

## 2. Core Features

### 📋 Driver Administration
* **Operator Ledger**: Create, read, update, and delete (CRUD) driver records.
* **Safety Tracker**: Visual progress rings highlight operator safety scores.
* **Alert Alerts**: Automatic visual flags highlight expired or soon-to-expire licenses.

### 🚚 Fleet Inventory
* **Inventory Panel**: Track vehicle model specs, license plates, and capacities.
* **Status Badges**: Monitors whether trucks are `Available`, `On Trip`, or in `Maintenance`.

### 🗺️ Trip Dispatch Control
* **Active Routing**: Manage active routes from creation to completion or cancellation.
* **Validation Engine**: Prevents double-allocation or scheduling of suspended/unlicensed operators.
* **Interactive Dispatches**: Actions for dispatchers to dynamically change route statuses.

### 📊 Operational Expense Analytics
* **Total Cost Calculations**: Aggregates fuel fills, maintenance repairs, and miscellaneous road expenses.
* **Vehicle summaries**: Instant grids breaking down expenses for every truck in the fleet.
* **Ledger logs**: Categorized list of individual transaction receipts.

### 📥 CSV Export Engine
* **Spreadsheet Downloads**: One-click custom CSV downloads for current **Drivers**, **Vehicles**, and **Trips** lists.

### 🔄 Pristine Demo Reset
* **Judge Utility**: A button in the sidebar footer instantly resets `localStorage` to the pristine demo dataset.

---

## 3. Business Rules

### Rule A: Operator Eligibility Validation
An operator (driver) is eligible for a new trip assignment **if and only if** they meet all three conditions:
1. Status is **not** `Suspended`.
2. Status is **not** `On Trip` (currently active).
3. The license expiry date is **not** in the past (using the simulated current date: `July 12, 2026`).

### Rule B: Dispatch Lifecycle Transitions
When a trip's status changes, it propagates status modifications across driver and vehicle profiles:
* **Pending ➡️ Dispatched**: Assigned Driver status set to `On Trip`, assigned Vehicle status set to `On Trip`.
* **Dispatched ➡️ Completed**: Assigned Driver status set to `Available`, assigned Vehicle status set to `Available`.
* **Dispatched ➡️ Cancelled**: Assigned Driver status set to `Available`, assigned Vehicle status set to `Available`.

### Rule C: Operational Cost Equation
The total cost of operating a vehicle is calculated dynamically:
$$\text{Total Cost} = \text{Fuel Cost} + \text{Maintenance Cost} + \text{Other Expenses}$$
$$\text{Fuel Cost} = \text{Liters Logged} \times \text{Cost Per Liter}$$

---

## 4. Technology Stack

* **Frontend Framework**: [React](https://react.dev/) (Hooks: `useState`, `useMemo`, `useEffect`)
* **Build System**: [Vite](https://vite.dev/) (optimized ESBuild compiling)
* **Styling System**: Vanilla CSS (CSS Custom Variables, Dark Mode theme, Glassmorphism backdrop-filters, custom grid alignments, CSS keyframe micro-animations)
* **Storage**: Browser `localStorage` for complete offline state persistence.

---

## 5. Demo Evaluation Workflow

Follow these steps to evaluate the application:

1. **Scaffold & Run**:
   ```bash
   npm install
   npm run dev
   ```
2. **Reset Demo State**:
   Click **Reset Demo Data** in the bottom-left sidebar. This sets the database to exactly 5 drivers, 5 vehicles, 5 trips, 6 fuel logs, and 5 maintenance logs.
3. **Verify Dashboard Widgets**:
   Observe the metrics cards: **Total Operators (5)**, **Active & Available (2)**, **On Trip (2)**, and **Avg Safety Score (91.8%)**.
4. **Create a Route Assignment**:
   * Navigate to the **Trips** tab, click **Create Trip**.
   * Enter route: `Chicago to Los Angeles`.
   * Open the **Operator** dropdown: Verify that *Elena Rostova* (Suspended) and *Marcus/Sarah* (On Trip) do **not** appear. Only eligible drivers are shown.
   * Save the trip. The status is initialized to **Pending**.
5. **Execute Dispatch Workflow**:
   * Click **Dispatch** on your new trip.
   * Switch to the **Drivers** tab: Verify your assigned driver's status has updated to `On Trip` and they are now marked `Ineligible`.
   * Switch to the **Vehicles** tab: Verify the assigned truck is now `On Trip`.
6. **Log and Calculate Costs**:
   * Switch to the **Expenses** tab: Check the current Volvo FH16 total cost ($620).
   * Click **Log Expense**, choose *Volvo FH16*, select *Fuel Logs*, input `100` Liters at `$1.50` per liter, and save.
   * Verify the **Total Fleet Cost** KPI updates, and the Volvo FH16 total cost increases to $770 ($620 + $150).
7. **Export Data**:
   * Click **Export CSV** on any tab (Drivers, Vehicles, Trips) to download spreadsheet backups.
