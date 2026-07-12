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
        expiryDate: "2026-03-15", // Expired relative to July 12, 2026
        contactNumber: "+1 (555) 011-8293",
        safetyScore: 65,
        status: "Suspended"
    }
];

export const DEFAULT_VEHICLES = [
    { id: "vh_1", name: "Volvo FH16", plateNumber: "TX-9842", capacity: "25 Tons", status: "Available" },
    { id: "vh_2", name: "Mercedes Actros", plateNumber: "CA-4859", capacity: "20 Tons", status: "On Trip" },
    { id: "vh_3", name: "Scania R500", plateNumber: "NY-2849", capacity: "22 Tons", status: "Available" },
    { id: "vh_4", name: "Isuzu Giga", plateNumber: "FL-1029", capacity: "15 Tons", status: "Available" }
];

export const DEFAULT_TRIPS = [
    { id: "tr_1", route: "Chicago to New York", driverId: "drv_2", vehicleId: "vh_2", status: "Dispatched" },
    { id: "tr_2", route: "Houston to Dallas", driverId: "drv_1", vehicleId: "vh_1", status: "Pending" }
];

