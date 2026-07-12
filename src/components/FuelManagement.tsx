import { useState } from 'react';
import {
  Plus,
  Search,
  X,
  Truck,
  Droplet,
  DollarSign,
  Calendar,
  Trash2,
  ArrowUpDown
} from 'lucide-react';

export interface FuelLog {
  id: string;
  vehicle: string;
  liters: number;
  cost: number;
  date: string;
}

const INITIAL_LOGS: FuelLog[] = [
  {
    id: 'FL-101',
    vehicle: 'TRK-1092 (Volvo FH16)',
    liters: 450,
    cost: 900,
    date: '2026-07-05'
  },
  {
    id: 'FL-102',
    vehicle: 'TRK-9801 (Mack Anthem)',
    liters: 600,
    cost: 1200,
    date: '2026-07-10'
  },
  {
    id: 'FL-103',
    vehicle: 'TRK-4421 (Peterbilt 579)',
    liters: 380,
    cost: 760,
    date: '2026-07-02'
  },
  {
    id: 'FL-104',
    vehicle: 'TRK-8843 (Freightliner Cascadia)',
    liters: 550,
    cost: 1100,
    date: '2026-07-08'
  }
];

export default function FuelManagement() {
  const [logs, setLogs] = useState<FuelLog[]>(INITIAL_LOGS);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields State
  const [vehicle, setVehicle] = useState('');
  const [liters, setLiters] = useState('');
  const [cost, setCost] = useState('');
  const [date, setDate] = useState('');

  // Validation State
  const [errors, setErrors] = useState<{
    vehicle?: string;
    liters?: string;
    cost?: string;
    date?: string;
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
    setLogs(logs.filter((l) => l.id !== id));
    addToast(`Fuel log record ${id} has been deleted.`, 'info');
  };

  const handleFieldChange = (field: string, val: string) => {
    if (field === 'vehicle') setVehicle(val);
    if (field === 'liters') setLiters(val);
    if (field === 'cost') setCost(val);
    if (field === 'date') setDate(val);

    // Validate real-time change
    let errMsg = '';
    const nameMap: Record<string, string> = {
      vehicle: 'Vehicle',
      liters: 'Fuel Quantity',
      cost: 'Fuel Cost',
      date: 'Date'
    };

    if (!val.trim()) {
      errMsg = `${nameMap[field]} is required.`;
    } else if (field === 'liters' || field === 'cost') {
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

  const handleLogFuel = (e: React.FormEvent) => {
    e.preventDefault();

    // Final check
    const finalErrors: typeof errors = {};
    if (!vehicle.trim()) finalErrors.vehicle = 'Vehicle is required.';
    if (!date.trim()) finalErrors.date = 'Date is required.';

    const litersNum = parseFloat(liters);
    if (!liters.trim()) {
      finalErrors.liters = 'Fuel Quantity is required.';
    } else if (isNaN(litersNum) || litersNum <= 0) {
      finalErrors.liters = 'Fuel Quantity must be a positive number.';
    }

    const costNum = parseFloat(cost);
    if (!cost.trim()) {
      finalErrors.cost = 'Fuel Cost is required.';
    } else if (isNaN(costNum) || costNum <= 0) {
      finalErrors.cost = 'Fuel Cost must be a positive number.';
    }

    if (Object.values(finalErrors).some((err) => !!err)) {
      setErrors(finalErrors);
      addToast('Please correct validation errors in form fields.', 'error');
      return;
    }

    // Generate ID
    const maxId = logs.reduce((max, log) => {
      const num = parseInt(log.id.split('-')[1]);
      return num > max ? num : max;
    }, 100);
    const newId = `FL-${maxId + 1}`;

    const newLog: FuelLog = {
      id: newId,
      vehicle,
      liters: litersNum,
      cost: costNum,
      date
    };

    setLogs([newLog, ...logs]);
    setIsModalOpen(false);
    addToast(`New Fuel Log ${newId} logged successfully!`, 'success');

    // Reset Form Fields
    setVehicle('');
    setLiters('');
    setCost('');
    setDate('');
    setErrors({});
  };

  const isFormInvalid =
    !vehicle.trim() ||
    !liters.trim() ||
    !cost.trim() ||
    !date.trim() ||
    Object.values(errors).some((err) => !!err);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    addToast(`Sorted logs by date in ${sortOrder === 'desc' ? 'ascending' : 'descending'} order.`, 'info');
  };

  // Filtered and sorted logs list
  const filteredAndSortedLogs = logs
    .filter((log) => {
      return (
        log.id.toLowerCase().includes(search.toLowerCase()) ||
        log.vehicle.toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">Fuel Management</h2>
          <p className="text-xs text-brand-navy-400">Track fuel log fills, cost analysis, and consumption rates</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-blue-600 to-brand-blue-500 hover:from-brand-blue-500 hover:to-brand-blue-400 active:scale-[0.98] transition-all duration-200 shadow-md shadow-brand-blue-600/10 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Log Fuel</span>
        </button>
      </div>

      {/* Filters & Sorting Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between p-4 rounded-2xl bg-brand-navy-900/60 border border-brand-navy-800 backdrop-blur-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-brand-navy-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search logs by ID, vehicle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-navy-950 border border-brand-navy-850 text-sm text-white placeholder-brand-navy-500 focus:outline-none focus:border-brand-blue-500 transition-colors"
          />
        </div>

        {/* Sorting Button */}
        <button
          onClick={toggleSortOrder}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-navy-950 border border-brand-navy-850 text-xs font-semibold text-brand-navy-300 hover:text-white hover:border-brand-navy-700 transition-all self-start lg:self-center"
        >
          <ArrowUpDown className="w-4 h-4 text-brand-blue-400" />
          <span>Sort Date: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
        </button>
      </div>

      {/* Logs Table / Cards */}
      {filteredAndSortedLogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-brand-navy-900/40 border border-brand-navy-800 border-dashed text-center">
          <div className="p-3 rounded-full bg-brand-navy-900 border border-brand-navy-800 text-brand-navy-400 mb-4">
            <Droplet className="w-8 h-8" />
          </div>
          <h3 className="font-display font-semibold text-lg">No fuel logs found</h3>
          <p className="text-xs text-brand-navy-500 mt-1 max-w-sm">
            Try adjusting your search query or log a new fuel filling log record.
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
                    <th className="p-4 pl-6">ID & Vehicle</th>
                    <th className="p-4">Fuel Quantity</th>
                    <th className="p-4">Refueling Cost</th>
                    <th className="p-4">Filling Date</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-navy-900 text-sm">
                  {filteredAndSortedLogs.map((log) => (
                    <tr key={log.id} className="group hover:bg-brand-navy-900/40 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="space-y-0.5">
                          <div className="font-mono text-[10px] text-brand-navy-400">{log.id}</div>
                          <div className="flex items-center gap-1.5 text-white font-semibold">
                            <Truck className="w-3.5 h-3.5 text-brand-blue-400" />
                            <span>{log.vehicle}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-white font-medium">
                        <div className="flex items-center gap-1">
                          <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{log.liters.toLocaleString()} Liters</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center text-emerald-400 font-semibold font-mono">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>{log.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-brand-navy-300">
                          <Calendar className="w-3.5 h-3.5 text-brand-navy-400" />
                          <span>{log.date}</span>
                        </div>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => handleDelete(log.id)}
                          className="p-1.5 rounded-lg text-brand-navy-400 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Delete record"
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
            {filteredAndSortedLogs.map((log) => (
              <div
                key={log.id}
                className="p-5 rounded-2xl bg-brand-navy-900/60 border border-brand-navy-800 backdrop-blur-sm space-y-4"
              >
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div className="font-mono text-xs text-brand-navy-400">{log.id}</div>
                  <div className="flex items-center gap-2 text-brand-navy-300 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-brand-navy-400" />
                    <span>{log.date}</span>
                  </div>
                </div>

                {/* Vehicle */}
                <div className="flex items-center gap-2 text-white font-bold border-y border-brand-navy-850 py-3">
                  <Truck className="w-4 h-4 text-brand-blue-400 flex-shrink-0" />
                  <span>{log.vehicle}</span>
                </div>

                {/* Details Footer */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-brand-navy-500 uppercase tracking-wider text-[10px] mb-1">Fuel Quantity</p>
                    <p className="text-white font-bold flex items-center gap-1">
                      <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                      {log.liters.toLocaleString()} Liters
                    </p>
                  </div>
                  <div>
                    <p className="text-brand-navy-500 uppercase tracking-wider text-[10px] mb-1">Total Cost</p>
                    <p className="text-emerald-400 font-bold font-mono text-sm">
                      ${log.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex justify-end pt-3 border-t border-brand-navy-850">
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20 active:scale-[0.98] transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Record</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Interactive Form Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-brand-navy-950/80 backdrop-blur-md z-50 animate-fadeIn">
          {/* Modal Container */}
          <div className="relative w-full max-w-lg rounded-2xl bg-brand-navy-900 border border-brand-navy-800 p-6 md:p-8 shadow-2xl shadow-black/50 overflow-y-auto max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-brand-navy-850 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-brand-blue-600/10 text-brand-blue-400 border border-brand-blue-500/20">
                  <Droplet className="w-5 h-5 text-brand-blue-400" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Log Fuel filling</h3>
                  <p className="text-[10px] text-brand-navy-400">Record a new vehicle refueling payload</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setErrors({});
                }}
                className="p-2 rounded-xl text-brand-navy-400 hover:text-white hover:bg-brand-navy-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleLogFuel} className="space-y-5">
              {/* Vehicle */}
              <div className="space-y-1.5">
                <label htmlFor="modal-vehicle" className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy-300">
                  Vehicle <span className="text-red-500">*</span>
                </label>
                <input
                  id="modal-vehicle"
                  type="text"
                  placeholder="e.g. TRK-1092 (Volvo FH16)"
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

              {/* Quantity (Liters) & Cost */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="modal-liters" className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy-300">
                    Fuel Quantity (Liters) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="modal-liters"
                    type="number"
                    placeholder="e.g. 450"
                    value={liters}
                    onChange={(e) => handleFieldChange('liters', e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl bg-brand-navy-950 border ${
                      errors.liters ? 'border-red-500 focus:border-red-500' : 'border-brand-navy-850 focus:border-brand-blue-500'
                    } text-white placeholder-brand-navy-600 text-sm focus:outline-none focus:ring-1 ${
                      errors.liters ? 'focus:ring-red-500/20' : 'focus:ring-brand-blue-500/20'
                    } transition-all`}
                  />
                  {errors.liters && (
                    <p className="text-[10px] text-red-400 font-semibold">{errors.liters}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="modal-cost" className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy-300">
                    Fuel Cost ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="modal-cost"
                    type="number"
                    placeholder="e.g. 900"
                    value={cost}
                    onChange={(e) => handleFieldChange('cost', e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl bg-brand-navy-950 border ${
                      errors.cost ? 'border-red-500 focus:border-red-500' : 'border-brand-navy-850 focus:border-brand-blue-500'
                    } text-white placeholder-brand-navy-600 text-sm focus:outline-none focus:ring-1 ${
                      errors.cost ? 'focus:ring-red-500/20' : 'focus:ring-brand-blue-500/20'
                    } transition-all`}
                  />
                  {errors.cost && (
                    <p className="text-[10px] text-red-400 font-semibold">{errors.cost}</p>
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label htmlFor="modal-date" className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy-300">
                  Refueling Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="modal-date"
                  type="date"
                  value={date}
                  onChange={(e) => handleFieldChange('date', e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl bg-brand-navy-950 border ${
                    errors.date ? 'border-red-500 focus:border-red-500' : 'border-brand-navy-850 focus:border-brand-blue-500'
                  } text-white text-sm focus:outline-none focus:ring-1 ${
                    errors.date ? 'focus:ring-red-500/20' : 'focus:ring-brand-blue-500/20'
                  } transition-all`}
                />
                {errors.date && (
                  <p className="text-[10px] text-red-400 font-semibold">{errors.date}</p>
                )}
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
                  Log refueling
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
