import { useState } from 'react';
import {
  Plus,
  Search,
  X,
  Truck,
  MapPin,
  Navigation,
  Weight,
  Trash2,
  CheckCircle,
  AlertTriangle
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
    addToast(`Trip ${newId} has been successfully created!`, 'success');
    
    // Clear and close
    setIsModalOpen(false);
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
    <div className="space-y-8 animate-fadeIn">
      {/* Title & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#111827]">Trip Management</h2>
          <p className="text-sm text-[#6B7280] font-semibold mt-1">Plan dispatch operations, manage payloads, and track routes</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#2563EB] hover:bg-blue-700 active:scale-[0.98] transition-all self-start sm:self-center shadow-md shadow-blue-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>Create Trip</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search trips by ID, route, vehicle, driver..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-sm text-[#111827] placeholder-slate-400 focus:outline-none focus:border-[#2563EB] transition-colors"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-slate-100 border border-[#E5E7EB] self-start lg:self-center font-semibold">
          {['All', 'Draft', 'Dispatched', 'Completed', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-lg text-xs transition-all ${
                statusFilter === tab
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-slate-500 hover:text-[#111827]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Trips display grid/table */}
      {filteredTrips.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 rounded-[20px] bg-white border border-[#E5E7EB] border-dashed text-center">
          <div className="p-4 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] text-slate-400 mb-4">
            <Truck className="w-8 h-8" />
          </div>
          <h3 className="font-display font-semibold text-lg text-slate-800">No trips found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm font-semibold">
            Try adjusting your search query or status filter, or create a new route dispatch.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-[20px] bg-white border border-[#E5E7EB] shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] text-xs font-bold uppercase tracking-wider text-[#6B7280] bg-[#F9FAFB]">
                    <th className="p-5 pl-6">Trip ID</th>
                    <th className="p-5">Source Route</th>
                    <th className="p-5">Destination</th>
                    <th className="p-5">Vehicle & Payload</th>
                    <th className="p-5">Assigned Driver</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-850">
                  {filteredTrips.map((trip) => (
                    <tr key={trip.id} className="group hover:bg-[#F9FAFB] transition-colors">
                      <td className="p-5 pl-6 font-mono font-bold text-[#2563EB]">{trip.id}</td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-800">{trip.source}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 font-semibold">
                          <Navigation className="w-3.5 h-3.5 text-slate-400 rotate-45" />
                          <span className="text-slate-800">{trip.destination}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-xs text-[#111827] font-bold">
                            <Truck className="w-3.5 h-3.5 text-slate-450" />
                            <span>{trip.vehicle}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
                            <Weight className="w-3.5 h-3.5" />
                            <span>{(trip.cargoWeight).toLocaleString()} kg · {trip.plannedDistance} km</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 font-semibold">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(trip.driver)}&background=f0f7ff&color=2563eb&bold=true&rounded=true&size=28`}
                            alt={trip.driver}
                            className="w-6.5 h-6.5 rounded-full object-cover shadow-xs"
                          />
                          <span className="text-slate-700">{trip.driver}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          trip.status === 'Completed' ? 'bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]' :
                          trip.status === 'Dispatched' ? 'bg-[#E8F0FE] text-[#1A73E8] border border-[#D2E3FC]' :
                          trip.status === 'Cancelled' ? 'bg-[#FCE8E6] text-[#C5221F] border border-[#FAD2CF]' :
                          'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            trip.status === 'Completed' ? 'bg-[#137333]' :
                            trip.status === 'Dispatched' ? 'bg-[#1A73E8]' :
                            trip.status === 'Cancelled' ? 'bg-[#C5221F]' :
                            'bg-slate-400'
                          }`}></span>
                          {trip.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => handleDelete(trip.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
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
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4"
              >
                {/* Header */}
                <div className="flex justify-between items-center">
                  <span className="font-mono text-brand-blue-600 font-bold">{trip.id}</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    trip.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    trip.status === 'Dispatched' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                    trip.status === 'Cancelled' ? 'bg-red-50 text-red-600 border border-red-100' :
                    'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    {trip.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 border-y border-slate-100 py-3 text-xs text-slate-650">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>From: <strong>{trip.source}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="w-3.5 h-3.5 text-slate-400 rotate-45" />
                    <span>To: <strong>{trip.destination}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Vehicle: <strong>{trip.vehicle}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[9px]">
                      {trip.driver.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <span>Driver: <strong>{trip.driver}</strong></span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-450 block">Cargo Payload</span>
                    <strong className="text-slate-800">{(trip.cargoWeight).toLocaleString()} kg</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-450 block">Planned Route</span>
                    <strong className="text-slate-800">{trip.plannedDistance} km</strong>
                  </div>
                  <button
                    onClick={() => handleDelete(trip.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md z-50 animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h3 className="font-display font-bold text-lg text-slate-800">Create Logistical Dispatch</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setErrors({});
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Source Dispatch Terminal *</label>
                <input
                  type="text"
                  placeholder="e.g. Chicago Hub (ORD1)"
                  value={source}
                  onChange={(e) => handleFieldChange('source', e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl bg-slate-50 border ${
                    errors.source ? 'border-red-500' : 'border-slate-200 focus:border-brand-blue-500'
                  } text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue-500/20`}
                />
                {errors.source && <p className="text-[10px] text-red-500 font-semibold">{errors.source}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Destination Route Depot *</label>
                <input
                  type="text"
                  placeholder="e.g. Houston Terminal (IAH2)"
                  value={destination}
                  onChange={(e) => handleFieldChange('destination', e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl bg-slate-50 border ${
                    errors.destination ? 'border-red-500' : 'border-slate-200 focus:border-brand-blue-500'
                  } text-slate-800 text-sm focus:outline-none`}
                />
                {errors.destination && <p className="text-[10px] text-red-500 font-semibold">{errors.destination}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Fleet Vehicle *</label>
                  <input
                    type="text"
                    placeholder="e.g. TRK-1092 (Volvo FH16)"
                    value={vehicle}
                    onChange={(e) => handleFieldChange('vehicle', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none"
                  />
                  {errors.vehicle && <p className="text-[10px] text-red-500 font-semibold">{errors.vehicle}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Driver Operator *</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    value={driver}
                    onChange={(e) => handleFieldChange('driver', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none"
                  />
                  {errors.driver && <p className="text-[10px] text-red-500 font-semibold">{errors.driver}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Cargo Payload Weight (kg) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 24000"
                    value={cargoWeight}
                    onChange={(e) => handleFieldChange('cargoWeight', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none"
                  />
                  {errors.cargoWeight && <p className="text-[10px] text-red-500 font-semibold">{errors.cargoWeight}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Planned Route Distance (km) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 1050"
                    value={plannedDistance}
                    onChange={(e) => handleFieldChange('plannedDistance', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none"
                  />
                  {errors.plannedDistance && <p className="text-[10px] text-red-500 font-semibold">{errors.plannedDistance}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Dispatch Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none appearance-none"
                >
                  <option value="Draft">Draft</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setErrors({});
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 bg-slate-50 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isFormInvalid}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-blue-600 to-brand-blue-500 hover:from-brand-blue-500 hover:to-brand-blue-400 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Create Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toasts List */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl border shadow-lg transition-all ${
              t.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
              t.type === 'error' ? 'bg-red-50 border-red-200 text-red-600' :
              'bg-blue-50 border-blue-200 text-blue-600'
            }`}
          >
            {t.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {t.type === 'error' && <AlertTriangle className="w-5 h-5" />}
            {t.type === 'info' && <Truck className="w-5 h-5" />}
            <span className="text-xs font-semibold">{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
