/**
 * Trip Dispatch Workflow Logic Helper Functions
 * (Frontend-only state transition rules)
 */

/**
 * Dispatches a pending trip.
 * Sets Trip status to "Dispatched", assigned Driver to "On Trip", and assigned Vehicle to "On Trip".
 */
export function dispatchTrip(tripId, tripsList, driversList, vehiclesList) {
    const trip = tripsList.find(t => t.id === tripId);
    if (!trip) return { trips: tripsList, drivers: driversList, vehicles: vehiclesList };

    const updatedTrips = tripsList.map(t => 
        t.id === tripId ? { ...t, status: 'Dispatched' } : t
    );

    const updatedDrivers = driversList.map(d => 
        d.id === trip.driverId ? { ...d, status: 'On Trip' } : d
    );

    const updatedVehicles = vehiclesList.map(v => 
        v.id === trip.vehicleId ? { ...v, status: 'On Trip' } : v
    );

    return {
        trips: updatedTrips,
        drivers: updatedDrivers,
        vehicles: updatedVehicles
    };
}

/**
 * Completes an active trip.
 * Sets Trip status to "Completed", assigned Driver to "Available", and assigned Vehicle to "Available".
 */
export function completeTrip(tripId, tripsList, driversList, vehiclesList) {
    const trip = tripsList.find(t => t.id === tripId);
    if (!trip) return { trips: tripsList, drivers: driversList, vehicles: vehiclesList };

    const updatedTrips = tripsList.map(t => 
        t.id === tripId ? { ...t, status: 'Completed' } : t
    );

    const updatedDrivers = driversList.map(d => 
        d.id === trip.driverId ? { ...d, status: 'Available' } : d
    );

    const updatedVehicles = vehiclesList.map(v => 
        v.id === trip.vehicleId ? { ...v, status: 'Available' } : v
    );

    return {
        trips: updatedTrips,
        drivers: updatedDrivers,
        vehicles: updatedVehicles
    };
}

/**
 * Cancels an active or pending trip.
 * Sets Trip status to "Cancelled", assigned Driver to "Available", and assigned Vehicle to "Available".
 */
export function cancelTrip(tripId, tripsList, driversList, vehiclesList) {
    const trip = tripsList.find(t => t.id === tripId);
    if (!trip) return { trips: tripsList, drivers: driversList, vehicles: vehiclesList };

    const updatedTrips = tripsList.map(t => 
        t.id === tripId ? { ...t, status: 'Cancelled' } : t
    );

    const updatedDrivers = driversList.map(d => 
        d.id === trip.driverId ? { ...d, status: 'Available' } : d
    );

    const updatedVehicles = vehiclesList.map(v => 
        v.id === trip.vehicleId ? { ...v, status: 'Available' } : v
    );

    return {
        trips: updatedTrips,
        drivers: updatedDrivers,
        vehicles: updatedVehicles
    };
}
