import { useState } from 'react';
import {
  Plus,
  Search,
  X,
  Truck,
  MapPin,
  Navigation,
  Weight,
  Trash2
} from 'lucide-react';

export interface Trip {
  id: string;
  source: string;
  destination: string;
  vehicle: string;
  driver: string;
  cargoWeight: number; // in kg
  plannedDistance: number; // in km
  status: 'Draft' | 'Dispatched' | 'Completed' | 'Cancelled';
}

const INITIAL_TRIPS: Trip[] = [
  {
    id: 'TRP-1001',
    source: 'Chicago Hub (ORD1)',
    destination: 'Houston Terminal (IAH2)',
    vehicle: 'TRK-1092 (Volvo FH16)',
    driver: 'Sarah Jenkins',
    cargoWeight: 24500,
    plannedDistance: 1080,
    status: 'Dispatched'
  },
  {
    id: 'TRP-1002',
    source: 'New York Port (JFK8)',
    destination: 'Boston Depot (BOS2)',
    vehicle: 'TRK-8843 (Freightliner Cascadia)',
    driver: 'Rajesh Patel',
    cargoWeight: 18200,
    plannedDistance: 350,
    status: 'Completed'
  },
  {
    id: 'TRP-1003',
    source: 'Los Angeles Depot (LAX4)',
    destination: 'Seattle Hub (SEA1)',
    vehicle: 'TRK-4421 (Peterbilt 579)',
    driver: 'Elena Rostova',
    cargoWeight: 22000,
    plannedDistance: 1820,
    status: 'Draft'
  },
  {
    id: 'TRP-1004',
    source: 'Miami Logistics (MIA3)',
    destination: 'Atlanta Depot (ATL1)',
    vehicle: 'TRK-3021 (Kenworth T680)',
    driver: 'Carlos Gomez',
    cargoWeight: 15800,
    plannedDistance: 1050,
    status: 'Dispatched'
  },
  {
    id: 'TRP-1005',
    source: 'Dallas Hub (DFW5)',
    destination: 'Denver Depot (DEN3)',
    vehicle: 'TRK-9801 (Mack Anthem)',
    driver: 'Marcus Vance',
    cargoWeight: 26400,
    plannedDistance: 1280,
    status: 'Cancelled'
  }
];

export default function TripManagement() {
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields State
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [driver, setDriver] = useState('');
  const [cargoWeight, setCargoWeight] = useState('');
  const [plannedDistance, setPlannedDistance] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Dispatched' | 'Completed' | 'Cancelled'>('Draft');
  
  // Validation State
  const [errors, setErrors] = useState<{
    source?: string;
    destination?: string;
    vehicle?: string;
    driver?: string;
    cargoWeight?: string;
    plannedDistance?: string;
  }>({});

  // Toast Notification State
  interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleDelete = (id: string) => {
    setTrips(trips.filter((t) => t.id !== id));
    addToast(`Trip record ${id} has been deleted.`, 'info');
  };

  const handleFieldChange = (field: string, val: string) => {
    if (field === 'source') setSource(val);
    if (field === 'destination') setDestination(val);
    if (field === 'vehicle') setVehicle(val);
    if (field === 'driver') setDriver(val);
    if (field === 'cargoWeight') setCargoWeight(val);
    if (field === 'plannedDistance') setPlannedDistance(val);

    // Validate real-time change
    let errMsg = '';
    const nameMap: Record<string, string> = {
      source: 'Source Route',
      destination: 'Destination',
      vehicle: 'Assigned Vehicle',
      driver: 'Assigned Driver',
      cargoWeight: 'Cargo Weight',
      plannedDistance: 'Planned Distance'
    };
    
    if (!val.trim()) {
      errMsg = `${nameMap[field]} is required.`;
    } else if (field === 'cargoWeight' || field === 'plannedDistance') {
      const num = parseFloat(val);
      if (isNaN(num) || num <= 0) {
        errMsg = `${nameMap[field]} must be a positive number.`;
      }
    }

    setErrors((prev) => ({
      ...prev,
      [field]: errMsg
    }));
  };

  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();

    // Perform final exhaustive check
    const finalErrors: typeof errors = {};
    if (!source.trim()) finalErrors.source = 'Source Route is required.';
    if (!destination.trim()) finalErrors.destination = 'Destination is required.';
    if (!vehicle.trim()) finalErrors.vehicle = 'Assigned Vehicle is required.';
    if (!driver.trim()) finalErrors.driver = 'Assigned Driver is required.';

    const weightNum = parseFloat(cargoWeight);
    if (!cargoWeight.trim()) {
      finalErrors.cargoWeight = 'Cargo Weight is required.';
    } else if (isNaN(weightNum) || weightNum <= 0) {
      finalErrors.cargoWeight = 'Cargo Weight must be a positive number.';
    }

    const distanceNum = parseFloat(plannedDistance);
    if (!plannedDistance.trim()) {
      finalErrors.plannedDistance = 'Planned Distance is required.';
    } else if (isNaN(distanceNum) || distanceNum <= 0) {
      finalErrors.plannedDistance = 'Planned Distance must be a positive number.';
    }

    if (Object.values(finalErrors).some((err) => !!err)) {
      setErrors(finalErrors);
      addToast('Please correct validation errors in form fields.', 'error');
      return;
    }

    // Generate new trip ID
    const maxId = trips.reduce((max, trip) => {
      const num = parseInt(trip.id.split('-')[1]);
      return num > max ? num : max;
    }, 1000);
    const newId = `TRP-${maxId + 1}`;

    const newTrip: Trip = {
      id: newId,
      source,
      destination,
      vehicle,
      driver,
      cargoWeight: weightNum,
      plannedDistance: distanceNum,
      status
    };

    setTrips([newTrip, ...trips]);
    setIsModalOpen(false);
    addToast(`New Trip ${newId} successfully scheduled!`, 'success');

    // Reset Form fields
    setSource('');
    setDestination('');
    setVehicle('');
    setDriver('');
    setCargoWeight('');
    setPlannedDistance('');
    setStatus('Draft');
    setErrors({});
  };

  const isFormInvalid =
    !source.trim() ||
    !destination.trim() ||
    !vehicle.trim() ||
    !driver.trim() ||
    !cargoWeight.trim() ||
    !plannedDistance.trim() ||
    Object.values(errors).some((err) => !!err);

  // Filtered trips list
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.id.toLowerCase().includes(search.toLowerCase()) ||
      trip.source.toLowerCase().includes(search.toLowerCase()) ||
      trip.destination.toLowerCase().includes(search.toLowerCase()) ||
      trip.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      trip.driver.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || trip.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Title & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">Trip Management</h2>
          <p className="text-xs text-brand-navy-400">Plan dispatch operations, manage payloads, and track routes</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-blue-600 to-brand-blue-500 hover:from-brand-blue-500 hover:to-brand-blue-400 active:scale-[0.98] transition-all duration-200 shadow-md shadow-brand-blue-600/10 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Create Trip</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between p-4 rounded-2xl bg-brand-navy-900/60 border border-brand-navy-800 backdrop-blur-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-brand-navy-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search trips by ID, route, vehicle, driver..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-navy-950 border border-brand-navy-850 text-sm text-white placeholder-brand-navy-500 focus:outline-none focus:border-brand-blue-500 transition-colors"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-brand-navy-950/80 border border-brand-navy-850 self-start lg:self-center">
          {['All', 'Draft', 'Dispatched', 'Completed', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === tab
                  ? 'bg-brand-blue-600 text-white shadow-sm'
                  : 'text-brand-navy-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Trips display grid/table */}
      {filteredTrips.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-brand-navy-900/40 border border-brand-navy-800 border-dashed text-center">
          <div className="p-3 rounded-full bg-brand-navy-900 border border-brand-navy-800 text-brand-navy-400 mb-4">
            <Truck className="w-8 h-8" />
          </div>
          <h3 className="font-display font-semibold text-lg">No trips found</h3>
          <p className="text-xs text-brand-navy-500 mt-1 max-w-sm">
            Try adjusting your search query or status filter, or create a new route dispatch.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-2xl bg-brand-navy-900/60 border border-brand-navy-800 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-navy-800 text-xs font-bold uppercase tracking-wider text-brand-navy-400 bg-brand-navy-950/40">
                    <th className="p-4 pl-6">Trip ID</th>
                    <th className="p-4">Source Route</th>
                    <th className="p-4">Destination</th>
                    <th className="p-4">Vehicle & Payload</th>
                    <th className="p-4">Assigned Driver</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-navy-900 text-sm">
                  {filteredTrips.map((trip) => (
                    <tr key={trip.id} className="group hover:bg-brand-navy-900/40 transition-colors">
                      <td className="p-4 pl-6 font-mono font-bold text-brand-blue-400">{trip.id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-brand-navy-400" />
                          <span className="text-white font-medium">{trip.source}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Navigation className="w-3.5 h-3.5 text-brand-navy-400 rotate-45" />
                          <span className="text-white font-medium">{trip.destination}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-xs text-white">
                            <Truck className="w-3.5 h-3.5 text-brand-navy-400" />
                            <span>{trip.vehicle}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-brand-navy-400">
                            <Weight className="w-3 h-3" />
                            <span>{(trip.cargoWeight).toLocaleString()} kg · {trip.plannedDistance} km</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-brand-navy-800 flex items-center justify-center font-bold text-[10px] text-brand-blue-400">
                            {trip.driver.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <span className="text-brand-navy-200">{trip.driver}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          trip.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          trip.status === 'Dispatched' ? 'bg-brand-blue-500/10 text-brand-blue-400 border border-brand-blue-500/20' :
                          trip.status === 'Cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          'bg-brand-navy-800 text-brand-navy-300 border border-brand-navy-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            trip.status === 'Completed' ? 'bg-emerald-400' :
                            trip.status === 'Dispatched' ? 'bg-brand-blue-400' :
                            trip.status === 'Cancelled' ? 'bg-red-400' :
                            'bg-brand-navy-400'
                          }`}></span>
                          {trip.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => handleDelete(trip.id)}
                          className="p-1.5 rounded-lg text-brand-navy-400 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Delete trip record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card list View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="p-5 rounded-2xl bg-brand-navy-900/60 border border-brand-navy-800 backdrop-blur-sm space-y-4"
              >
                {/* Header */}
                <div className="flex justify-between items-center">
                  <span className="font-mono text-brand-blue-400 font-bold">{trip.id}</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    trip.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    trip.status === 'Dispatched' ? 'bg-brand-blue-500/10 text-brand-blue-400 border border-brand-blue-500/20' :
                    trip.status === 'Cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    'bg-brand-navy-800 text-brand-navy-300 border border-brand-navy-700'
                  }`}>
                    {trip.status}
                  </span>
                </div>

                {/* Route */}
                <div className="space-y-2 border-y border-brand-navy-850 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-navy-500 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-brand-navy-500 uppercase tracking-wider">Source</p>
                      <p className="text-white font-medium">{trip.source}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-brand-navy-500 rotate-45 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-brand-navy-500 uppercase tracking-wider">Destination</p>
                      <p className="text-white font-medium">{trip.destination}</p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-brand-navy-500 uppercase tracking-wider text-[10px] mb-1">Vehicle</p>
                    <p className="text-white font-semibold truncate">{trip.vehicle.split(' ')[0]}</p>
                    <p className="text-[10px] text-brand-navy-400 truncate">{trip.vehicle.split(' ').slice(1).join(' ')}</p>
                  </div>
                  <div>
                    <p className="text-brand-navy-500 uppercase tracking-wider text-[10px] mb-1">Driver</p>
                    <p className="text-white font-semibold">{trip.driver}</p>
                  </div>
                  <div>
                    <p className="text-brand-navy-500 uppercase tracking-wider text-[10px] mb-1">Cargo Weight</p>
                    <p className="text-white font-semibold">{(trip.cargoWeight).toLocaleString()} kg</p>
                  </div>
                  <div>
                    <p className="text-brand-navy-500 uppercase tracking-wider text-[10px] mb-1">Distance</p>
                    <p className="text-white font-semibold">{trip.plannedDistance} km</p>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex justify-end pt-3 border-t border-brand-navy-850">
                  <button
                    onClick={() => handleDelete(trip.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20 active:scale-[0.98] transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Trip Record</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Interactive Creation Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-brand-navy-950/80 backdrop-blur-md z-50 animate-fadeIn">
          {/* Modal Container */}
          <div className="relative w-full max-w-lg rounded-2xl bg-brand-navy-900 border border-brand-navy-800 p-6 md:p-8 shadow-2xl shadow-black/50 overflow-y-auto max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-brand-navy-850 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-brand-blue-600/10 text-brand-blue-400 border border-brand-blue-500/20">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Create New Trip Dispatch</h3>
                  <p className="text-[10px] text-brand-navy-400">Initialize a new cargo transport route</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-brand-navy-400 hover:text-white hover:bg-brand-navy-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateTrip} className="space-y-5">
              {/* Source & Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="modal-source" className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy-300">
                    Source Route <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="modal-source"
                    type="text"
                    placeholder="e.g. Chicago Hub (ORD1)"
                    value={source}
                    onChange={(e) => handleFieldChange('source', e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl bg-brand-navy-950 border ${
                      errors.source ? 'border-red-500 focus:border-red-500' : 'border-brand-navy-850 focus:border-brand-blue-500'
                    } text-white placeholder-brand-navy-600 text-sm focus:outline-none focus:ring-1 ${
                      errors.source ? 'focus:ring-red-500/20' : 'focus:ring-brand-blue-500/20'
                    } transition-all`}
                  />
                  {errors.source && (
                    <p className="text-[10px] text-red-400 font-semibold">{errors.source}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="modal-destination" className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy-300">
                    Destination <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="modal-destination"
                    type="text"
                    placeholder="e.g. Houston Terminal (IAH2)"
                    value={destination}
                    onChange={(e) => handleFieldChange('destination', e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl bg-brand-navy-950 border ${
                      errors.destination ? 'border-red-500 focus:border-red-500' : 'border-brand-navy-850 focus:border-brand-blue-500'
                    } text-white placeholder-brand-navy-600 text-sm focus:outline-none focus:ring-1 ${
                      errors.destination ? 'focus:ring-red-500/20' : 'focus:ring-brand-blue-500/20'
                    } transition-all`}
                  />
                  {errors.destination && (
                    <p className="text-[10px] text-red-400 font-semibold">{errors.destination}</p>
                  )}
                </div>
              </div>

              {/* Vehicle & Driver */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="modal-vehicle" className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy-300">
                    Assigned Vehicle <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="modal-vehicle"
                    type="text"
                    placeholder="e.g. TRK-5524 (Scania R730)"
                    value={vehicle}
                    onChange={(e) => handleFieldChange('vehicle', e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl bg-brand-navy-950 border ${
                      errors.vehicle ? 'border-red-500 focus:border-red-500' : 'border-brand-navy-850 focus:border-brand-blue-500'
                    } text-white placeholder-brand-navy-600 text-sm focus:outline-none focus:ring-1 ${
                      errors.vehicle ? 'focus:ring-red-500/20' : 'focus:ring-brand-blue-500/20'
                    } transition-all`}
                  />
                  {errors.vehicle && (
                    <p className="text-[10px] text-red-400 font-semibold">{errors.vehicle}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="modal-driver" className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy-300">
                    Assigned Driver <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="modal-driver"
                    type="text"
                    placeholder="e.g. Samuel Jackson"
                    value={driver}
                    onChange={(e) => handleFieldChange('driver', e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl bg-brand-navy-950 border ${
                      errors.driver ? 'border-red-500 focus:border-red-500' : 'border-brand-navy-850 focus:border-brand-blue-500'
                    } text-white placeholder-brand-navy-600 text-sm focus:outline-none focus:ring-1 ${
                      errors.driver ? 'focus:ring-red-500/20' : 'focus:ring-brand-blue-500/20'
                    } transition-all`}
                  />
                  {errors.driver && (
                    <p className="text-[10px] text-red-400 font-semibold">{errors.driver}</p>
                  )}
                </div>
              </div>

              {/* Weight & Distance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="modal-weight" className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy-300">
                    Cargo Weight (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="modal-weight"
                    type="number"
                    placeholder="e.g. 21500"
                    value={cargoWeight}
                    onChange={(e) => handleFieldChange('cargoWeight', e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl bg-brand-navy-950 border ${
                      errors.cargoWeight ? 'border-red-500 focus:border-red-500' : 'border-brand-navy-850 focus:border-brand-blue-500'
                    } text-white placeholder-brand-navy-600 text-sm focus:outline-none focus:ring-1 ${
                      errors.cargoWeight ? 'focus:ring-red-500/20' : 'focus:ring-brand-blue-500/20'
                    } transition-all`}
                  />
                  {errors.cargoWeight && (
                    <p className="text-[10px] text-red-400 font-semibold">{errors.cargoWeight}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="modal-distance" className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy-300">
                    Planned Distance (km) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="modal-distance"
                    type="number"
                    placeholder="e.g. 850"
                    value={plannedDistance}
                    onChange={(e) => handleFieldChange('plannedDistance', e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl bg-brand-navy-950 border ${
                      errors.plannedDistance ? 'border-red-500 focus:border-red-500' : 'border-brand-navy-850 focus:border-brand-blue-500'
                    } text-white placeholder-brand-navy-600 text-sm focus:outline-none focus:ring-1 ${
                      errors.plannedDistance ? 'focus:ring-red-500/20' : 'focus:ring-brand-blue-500/20'
                    } transition-all`}
                  />
                  {errors.plannedDistance && (
                    <p className="text-[10px] text-red-400 font-semibold">{errors.plannedDistance}</p>
                  )}
                </div>
              </div>

              {/* Status Select */}
              <div className="space-y-1.5">
                <label htmlFor="modal-status" className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy-300">
                  Initial Trip Status
                </label>
                <select
                  id="modal-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-brand-navy-950 border border-brand-navy-850 text-white text-sm focus:outline-none focus:border-brand-blue-500 transition-all appearance-none"
                >
                  <option value="Draft">Draft</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Modal Actions Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-brand-navy-850 pt-5 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setErrors({});
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-navy-300 bg-brand-navy-850 border border-brand-navy-800 hover:text-white hover:border-brand-navy-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isFormInvalid}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-blue-600 to-brand-blue-500 hover:from-brand-blue-500 hover:to-brand-blue-400 active:scale-[0.98] transition-all shadow-md shadow-brand-blue-600/10 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-brand-blue-600 disabled:hover:to-brand-blue-500"
                >
                  Add Dispatch Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notifications Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-0 scale-100 ${
              toast.type === 'success' ? 'bg-emerald-950/95 border-emerald-500/30 text-emerald-400' :
              toast.type === 'error' ? 'bg-red-950/95 border-red-500/30 text-red-400' :
              'bg-brand-navy-900/95 border-brand-navy-800 text-brand-blue-400'
            }`}
          >
            {toast.type === 'success' && (
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {toast.type === 'info' && (
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="text-xs font-semibold">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
