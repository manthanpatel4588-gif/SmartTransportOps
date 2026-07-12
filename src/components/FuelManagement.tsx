import { useState } from 'react';
import {
  Plus,
  Search,
  X,
  Truck,
  Droplet,
  Calendar,
  Trash2,
  ArrowUpDown,
  CheckCircle,
  AlertTriangle
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
    liters: 500,
    cost: 1050,
    date: '2026-07-08'
  },
  {
    id: 'FL-105',
    vehicle: 'TRK-5524 (Scania R730)',
    liters: 420,
    cost: 840,
    date: '2026-06-28'
  }
];

export default function FuelManagement() {
  const [logs, setLogs] = useState<FuelLog[]>(INITIAL_LOGS);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAscending, setIsAscending] = useState(false);

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
    addToast(`Fuel fill log ${id} has been deleted.`, 'info');
  };

  const handleFieldChange = (field: string, val: string) => {
    if (field === 'vehicle') setVehicle(val);
    if (field === 'liters') setLiters(val);
    if (field === 'cost') setCost(val);
    if (field === 'date') setDate(val);

    // Validate real-time change
    let errMsg = '';
    const nameMap: Record<string, string> = {
      vehicle: 'Vehicle Name',
      liters: 'Fuel Quantity',
      cost: 'Fuel Cost',
      date: 'Log Date'
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

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();

    // Perform final check
    const finalErrors: typeof errors = {};
    if (!vehicle.trim()) finalErrors.vehicle = 'Vehicle is required.';
    if (!date.trim()) finalErrors.date = 'Log Date is required.';

    const litersNum = parseFloat(liters);
    if (!liters.trim()) {
      finalErrors.liters = 'Fuel Quantity (Liters) is required.';
    } else if (isNaN(litersNum) || litersNum <= 0) {
      finalErrors.liters = 'Fuel Quantity must be a positive number.';
    }

    const costNum = parseFloat(cost);
    if (!cost.trim()) {
      finalErrors.cost = 'Fuel Cost ($ USD) is required.';
    } else if (isNaN(costNum) || costNum <= 0) {
      finalErrors.cost = 'Fuel Cost must be a positive number.';
    }

    if (Object.values(finalErrors).some((err) => !!err)) {
      setErrors(finalErrors);
      addToast('Please correct validation errors in form fields.', 'error');
      return;
    }

    // Generate new ID
    const maxId = logs.reduce((max, l) => {
      const num = parseInt(l.id.split('-')[1]);
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
    addToast(`Fuel Log ${newId} logged successfully!`, 'success');

    // Reset and close
    setIsModalOpen(false);
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

  // Sorting
  const sortedLogs = [...logs].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return isAscending ? dateA - dateB : dateB - dateA;
  });

  // Filtered logs
  const filteredLogs = sortedLogs.filter((l) => {
    return (
      l.id.toLowerCase().includes(search.toLowerCase()) ||
      l.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      l.date.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Title & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">Fuel Management</h2>
          <p className="text-xs text-slate-500">Record vehicle refuel fill logs, inspect quantities, and track consumption costs</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-blue-600 to-brand-blue-500 hover:from-brand-blue-500 hover:to-brand-blue-400 active:scale-[0.98] transition-all self-start sm:self-center shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Log Fuel Fill</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search fuel logs by ID, vehicle, or date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-blue-500 transition-colors"
          />
        </div>

        {/* Sort Trigger */}
        <button
          onClick={() => setIsAscending(!isAscending)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:text-slate-900 hover:border-slate-350 transition-all self-start sm:self-center"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Sort by Date: {isAscending ? 'Oldest first' : 'Newest first'}</span>
        </button>
      </div>

      {/* Grid Display */}
      {filteredLogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-white border border-slate-200 border-dashed text-center">
          <div className="p-3 rounded-full bg-slate-50 border border-slate-100 text-slate-400 mb-4">
            <Droplet className="w-8 h-8" />
          </div>
          <h3 className="font-display font-semibold text-lg text-slate-800">No fuel logs found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Try adjusting your search query, or log a new vehicle fuel refuel log.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/60">
                    <th className="p-4 pl-6">Log ID</th>
                    <th className="p-4">Vehicle</th>
                    <th className="p-4">Quantity (Liters)</th>
                    <th className="p-4">Total Cost</th>
                    <th className="p-4">Refuel Date</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {filteredLogs.map((l) => (
                    <tr key={l.id} className="group hover:bg-slate-50/40 transition-colors">
                      <td className="p-4 pl-6 font-mono font-bold text-brand-blue-600">{l.id}</td>
                      <td className="p-4 font-semibold text-slate-800">
                        <div className="flex items-center gap-2">
                          <Truck className="w-3.5 h-3.5 text-slate-400" />
                          <span>{l.vehicle}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                          <Droplet className="w-3.5 h-3.5 text-slate-400" />
                          <span>{l.liters.toLocaleString()} L</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-900">
                        ${l.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{l.date}</span>
                        </div>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => handleDelete(l.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Delete fuel log"
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

          {/* Mobile Grid View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredLogs.map((l) => (
              <div key={l.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div className="font-mono text-sm font-bold text-brand-blue-600">{l.id}</div>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{l.date}</span>
                  </span>
                </div>

                <div className="space-y-1.5 border-y border-slate-100 py-3 text-xs text-slate-600">
                  <div>Vehicle: <strong>{l.vehicle}</strong></div>
                  <div className="flex items-center gap-1">Quantity: <strong className="text-slate-800">{l.liters} L</strong></div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Log Cost</span>
                    <strong className="text-slate-800">${l.cost}</strong>
                  </div>
                  <button
                    onClick={() => handleDelete(l.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600"
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
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h3 className="font-display font-bold text-lg text-slate-800">Add Fuel Log Entry</h3>
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

            <form onSubmit={handleCreateLog} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Fleet Vehicle *</label>
                <input
                  type="text"
                  placeholder="e.g. TRK-1092 (Volvo FH16)"
                  value={vehicle}
                  onChange={(e) => handleFieldChange('vehicle', e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl bg-slate-50 border ${
                    errors.vehicle ? 'border-red-500' : 'border-slate-200 focus:border-brand-blue-500'
                  } text-slate-800 text-sm focus:outline-none`}
                />
                {errors.vehicle && <p className="text-[10px] text-red-500 font-semibold">{errors.vehicle}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Fuel Quantity (Liters) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 450"
                    value={liters}
                    onChange={(e) => handleFieldChange('liters', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none"
                  />
                  {errors.liters && <p className="text-[10px] text-red-500 font-semibold">{errors.liters}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Fuel Fill Cost ($ USD) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 900"
                    value={cost}
                    onChange={(e) => handleFieldChange('cost', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none"
                  />
                  {errors.cost && <p className="text-[10px] text-red-500 font-semibold">{errors.cost}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Refuel Date *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => handleFieldChange('date', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none"
                />
                {errors.date && <p className="text-[10px] text-red-500 font-semibold">{errors.date}</p>}
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
                  Log Fill
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
            {t.type === 'info' && <Droplet className="w-5 h-5" />}
            <span className="text-xs font-semibold">{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
