export const DEFAULT_DRIVERS = [
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
        expiryDate: "2026-07-28", // Expiring very soon (July 2026)
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
    }
];

export const DEFAULT_VEHICLES = [
    { id: "vh_1", name: "Volvo FH16 Heavy", plateNumber: "TX-9842", capacity: "25 Tons", status: "Available" },
    { id: "vh_2", name: "Mercedes Actros Fleet", plateNumber: "CA-4859", capacity: "20 Tons", status: "On Trip" },
    { id: "vh_3", name: "Scania R500 Multi-axle", plateNumber: "NY-2849", capacity: "22 Tons", status: "On Trip" },
    { id: "vh_4", name: "Isuzu Giga Compact", plateNumber: "FL-1029", capacity: "15 Tons", status: "Available" },
    { id: "vh_5", name: "Kenworth T680 Cruiser", plateNumber: "WA-7381", capacity: "24 Tons", status: "Available" }
];

export const DEFAULT_TRIPS = [
    { id: "tr_1", route: "Chicago to New York", driverId: "drv_2", vehicleId: "vh_2", status: "Dispatched" },
    { id: "tr_2", route: "Houston to Dallas", driverId: "drv_1", vehicleId: "vh_1", status: "Pending" },
    { id: "tr_3", route: "Seattle to Portland", driverId: "drv_3", vehicleId: "vh_3", status: "Dispatched" },
    { id: "tr_4", route: "Miami to Orlando", driverId: "drv_4", vehicleId: "vh_4", status: "Completed" },
    { id: "tr_5", route: "Denver to Salt Lake City", driverId: "drv_5", vehicleId: "vh_5", status: "Cancelled" }
];

export const DEFAULT_FUEL_LOGS = [
    { id: "fl_1", vehicleId: "vh_1", fuelQuantity: 150, costPerLiter: 1.20, date: "2026-07-01" },
    { id: "fl_2", vehicleId: "vh_2", fuelQuantity: 200, costPerLiter: 1.15, date: "2026-07-03" },
    { id: "fl_3", vehicleId: "vh_1", fuelQuantity: 180, costPerLiter: 1.22, date: "2026-07-06" },
    { id: "fl_4", vehicleId: "vh_3", fuelQuantity: 220, costPerLiter: 1.20, date: "2026-07-08" },
    { id: "fl_5", vehicleId: "vh_4", fuelQuantity: 90,  costPerLiter: 1.25, date: "2026-07-10" },
    { id: "fl_6", vehicleId: "vh_5", fuelQuantity: 160, costPerLiter: 1.18, date: "2026-07-11" }
];

export const DEFAULT_MAINTENANCE_LOGS = [
    { id: "ml_1", vehicleId: "vh_1", serviceType: "Oil & Filter Change", cost: 250, date: "2026-06-25" },
    { id: "ml_2", vehicleId: "vh_2", serviceType: "Brake Pad Replacement", cost: 450, date: "2026-06-28" },
    { id: "ml_3", vehicleId: "vh_3", serviceType: "Tire Rotation & Balance", cost: 180, date: "2026-07-02" },
    { id: "ml_4", vehicleId: "vh_4", serviceType: "Headlight Fuse Assembly", cost: 85,  date: "2026-07-05" },
    { id: "ml_5", vehicleId: "vh_5", serviceType: "Radiator Flush & Service", cost: 320, date: "2026-07-09" }
];

export const DEFAULT_EXPENSES = [
    { id: "ex_1", vehicleId: "vh_1", expenseType: "Highway Toll Charges", amount: 120, date: "2026-07-02" },
    { id: "ex_2", vehicleId: "vh_2", expenseType: "Fleet Insurance Renewal", amount: 600, date: "2026-07-01" },
    { id: "ex_3", vehicleId: "vh_3", expenseType: "State Transit Tolls", amount: 140, date: "2026-07-05" },
    { id: "ex_4", vehicleId: "vh_4", expenseType: "Road Permit Fees", amount: 150, date: "2026-07-07" },
    { id: "ex_5", vehicleId: "vh_5", expenseType: "Weight Station Toll Fee", amount: 90,  date: "2026-07-11" }
];
