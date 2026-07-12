/**
 * Reusable Operational Cost Calculation Utilities
 */

/**
 * Calculates total fuel cost for a given vehicle.
 * @param {string} vehicleId 
 * @param {Array} fuelLogs 
 * @returns {number}
 */
export function calculateFuelCost(vehicleId, fuelLogs) {
    if (!Array.isArray(fuelLogs)) return 0;
    const vehicleLogs = fuelLogs.filter(log => log.vehicleId === vehicleId);
    const sum = vehicleLogs.reduce((acc, log) => {
        const qty = Number(log.fuelQuantity) || 0;
        const price = Number(log.costPerLiter) || 0;
        return acc + (qty * price);
    }, 0);
    return Math.round(sum * 100) / 100;
}

/**
 * Calculates total maintenance cost for a given vehicle.
 * @param {string} vehicleId 
 * @param {Array} maintenanceLogs 
 * @returns {number}
 */
export function calculateMaintenanceCost(vehicleId, maintenanceLogs) {
    if (!Array.isArray(maintenanceLogs)) return 0;
    const vehicleLogs = maintenanceLogs.filter(log => log.vehicleId === vehicleId);
    const sum = vehicleLogs.reduce((acc, log) => {
        const cost = Number(log.cost) || 0;
        return acc + cost;
    }, 0);
    return Math.round(sum * 100) / 100;
}

/**
 * Calculates total other miscellaneous expenses for a given vehicle.
 * @param {string} vehicleId 
 * @param {Array} otherExpenses 
 * @returns {number}
 */
export function calculateOtherExpensesCost(vehicleId, otherExpenses) {
    if (!Array.isArray(otherExpenses)) return 0;
    const vehicleExpenses = otherExpenses.filter(exp => exp.vehicleId === vehicleId);
    const sum = vehicleExpenses.reduce((acc, exp) => {
        const amount = Number(exp.amount) || 0;
        return acc + amount;
    }, 0);
    return Math.round(sum * 100) / 100;
}

/**
 * Calculates total operational cost for a given vehicle.
 * Total Cost = Fuel Cost + Maintenance Cost + Other Expenses
 * @param {string} vehicleId 
 * @param {Array} fuelLogs 
 * @param {Array} maintenanceLogs 
 * @param {Array} otherExpenses 
 * @returns {Object} Cost breakdown: { fuelCost, maintenanceCost, otherExpensesCost, totalCost }
 */
export function calculateOperationalCost(vehicleId, fuelLogs, maintenanceLogs, otherExpenses) {
    const fuelCost = calculateFuelCost(vehicleId, fuelLogs);
    const maintenanceCost = calculateMaintenanceCost(vehicleId, maintenanceLogs);
    const otherExpensesCost = calculateOtherExpensesCost(vehicleId, otherExpenses);
    const totalCost = Math.round((fuelCost + maintenanceCost + otherExpensesCost) * 100) / 100;

    return {
        fuelCost,
        maintenanceCost,
        otherExpensesCost,
        totalCost
    };
}

/**
 * Generates a summary list of all vehicle expenses.
 * @param {Array} vehiclesList 
 * @param {Array} fuelLogs 
 * @param {Array} maintenanceLogs 
 * @param {Array} otherExpenses 
 * @returns {Array} Vehicle summaries: [{ vehicleId, vehicleName, plateNumber, fuelCost, maintenanceCost, otherExpensesCost, totalCost }]
 */
export function getVehicleCostSummary(vehiclesList, fuelLogs, maintenanceLogs, otherExpenses) {
    if (!Array.isArray(vehiclesList)) return [];

    return vehiclesList.map(vehicle => {
        const costs = calculateOperationalCost(vehicle.id, fuelLogs, maintenanceLogs, otherExpenses);
        return {
            vehicleId: vehicle.id,
            vehicleName: vehicle.name,
            plateNumber: vehicle.plateNumber,
            ...costs
        };
    });
}
