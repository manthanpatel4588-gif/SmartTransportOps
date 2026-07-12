import { useState } from 'react';
import {
  Plus,
  Search,
  X,
  Truck,
  Wrench,
  Calendar,
  Trash2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export interface MaintenanceRecord {
  id: string;
  vehicle: string;
  type: string;
  description: string;
  cost: number;
  startDate: string;
  status: 'Active' | 'Completed';
}

const INITIAL_RECORDS: MaintenanceRecord[] = [
  {
    id: 'MNT-101',
    vehicle: 'TRK-1092 (Volvo FH16)',
    type: 'Engine Tune-up',
    description: 'Periodic oil change, air filter replacement, and spark plug adjustment.',
    cost: 1250,
    startDate: '2026-07-01',
    status: 'Completed'
  },
  {
    id: 'MNT-102',
    vehicle: 'TRK-9801 (Mack Anthem)',
    type: 'Brake Overhaul',
    description: 'Replaced front brake pads and rotors; bled the lines.',
    cost: 850,
    startDate: '2026-07-08',
    status: 'Active'
  },
  {
    id: 'MNT-103',
    vehicle: 'TRK-4421 (Peterbilt 579)',
    type: 'Tire Alignment',
    description: 'Rotated all 10 tires and adjusted alignment.',
    cost: 400,
    startDate: '2026-07-05',
    status: 'Completed'
  },
  {
    id: 'MNT-104',
    vehicle: 'TRK-8843 (Freightliner Cascadia)',
    type: 'Transmission Flush',
    description: 'Flushed transmission fluid and replaced filter gasket.',
    cost: 1550,
    startDate: '2026-07-10',
    status: 'Active'
  },
  {
    id: 'MNT-105',
    vehicle: 'TRK-5524 (Scania R730)',
    type: 'Coolant Refill',
    description: 'Drained radiator reservoir, flushed core, and added fresh antifreeze.',
    cost: 320,
    startDate: '2026-06-25',
    status: 'Completed'
  }
];

export default function MaintenanceManagement() {
  const [records, setRecords] = useState<MaintenanceRecord[]>(INITIAL_RECORDS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields State
  const [vehicle, setVehicle] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [startDate, setStartDate] = useState('');
  const [status, setStatus] = useState<'Active' | 'Completed'>('Active');

  // Validation State
  const [errors, setErrors] = useState<{
    vehicle?: string;
    type?: string;
    description?: string;
    cost?: string;
    startDate?: string;
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
    setRecords(records.filter((r) => r.id !== id));
    addToast(`Maintenance record ${id} has been deleted.`, 'info');
  };

  const handleFieldChange = (field: string, val: string) => {
    if (field === 'vehicle') setVehicle(val);
    if (field === 'type') setType(val);
    if (field === 'description') setDescription(val);
    if (field === 'cost') setCost(val);
    if (field === 'startDate') setStartDate(val);

    // Validate real-time change
    let errMsg = '';
    const nameMap: Record<string, string> = {
      vehicle: 'Vehicle Name',
      type: 'Maintenance Type',
      description: 'Work Description',
      cost: 'Maintenance Cost',
      startDate: 'Start Date'
    };

    if (!val.trim()) {
      errMsg = `${nameMap[field]} is required.`;
    } else if (field === 'cost') {
      const num = parseFloat(val);
      if (isNaN(num) || num <= 0) {
        errMsg = 'Maintenance Cost must be a positive number.';
      }
    }

    setErrors((prev) => ({
      ...prev,
      [field]: errMsg
    }));
  };

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();

    // Perform final check
    const finalErrors: typeof errors = {};
    if (!vehicle.trim()) finalErrors.vehicle = 'Vehicle is required.';
    if (!type.trim()) finalErrors.type = 'Maintenance Type is required.';
    if (!description.trim()) finalErrors.description = 'Work Description is required.';
    if (!startDate.trim()) finalErrors.startDate = 'Start Date is required.';

    const costNum = parseFloat(cost);
    if (!cost.trim()) {
      finalErrors.cost = 'Maintenance Cost is required.';
    } else if (isNaN(costNum) || costNum <= 0) {
      finalErrors.cost = 'Maintenance Cost must be a positive number.';
    }

    if (Object.values(finalErrors).some((err) => !!err)) {
      setErrors(finalErrors);
      addToast('Please correct validation errors in form fields.', 'error');
      return;
    }

    // Generate new ID
    const maxId = records.reduce((max, r) => {
      const num = parseInt(r.id.split('-')[1]);
      return num > max ? num : max;
    }, 100);
    const newId = `MNT-${maxId + 1}`;

    const newRecord: MaintenanceRecord = {
      id: newId,
      vehicle,
      type,
      description,
      cost: costNum,
      startDate,
      status
    };

    setRecords([newRecord, ...records]);
    addToast(`Record ${newId} has been successfully logged!`, 'success');

    // Reset and close
    setIsModalOpen(false);
    setVehicle('');
    setType('');
    setDescription('');
    setCost('');
    setStartDate('');
    setStatus('Active');
    setErrors({});
  };

  const isFormInvalid =
    !vehicle.trim() ||
    !type.trim() ||
    !description.trim() ||
    !cost.trim() ||
    !startDate.trim() ||
    Object.values(errors).some((err) => !!err);

  // Filtered list
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Title & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">Maintenance Records</h2>
          <p className="text-xs text-slate-500">Log repair workflows, track workshop tasks, and manage service costs</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-blue-600 to-brand-blue-500 hover:from-brand-blue-500 hover:to-brand-blue-400 active:scale-[0.98] transition-all self-start sm:self-center shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Record</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search records by ID, vehicle, type, details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-blue-500 transition-colors"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-250 self-start lg:self-center">
          {['All', 'Active', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === tab
                  ? 'bg-brand-blue-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Display */}
      {filteredRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-white border border-slate-200 border-dashed text-center">
          <div className="p-3 rounded-full bg-slate-50 border border-slate-100 text-slate-400 mb-4">
            <Wrench className="w-8 h-8" />
          </div>
          <h3 className="font-display font-semibold text-lg text-slate-800">No maintenance records found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Try adjusting your search query or status filter, or log a new workshop record.
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
                    <th className="p-4 pl-6">Record ID</th>
                    <th className="p-4">Vehicle</th>
                    <th className="p-4">Maintenance Type</th>
                    <th className="p-4">Cost</th>
                    <th className="p-4">Start Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {filteredRecords.map((r) => (
                    <tr key={r.id} className="group hover:bg-slate-50/40 transition-colors">
                      <td className="p-4 pl-6 font-mono font-bold text-brand-blue-600">{r.id}</td>
                      <td className="p-4 font-semibold text-slate-800">
                        <div className="flex items-center gap-2">
                          <Truck className="w-3.5 h-3.5 text-slate-400" />
                          <span>{r.vehicle}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <div className="text-slate-800 font-bold flex items-center gap-1.5">
                            <Wrench className="w-3.5 h-3.5 text-slate-400" />
                            <span>{r.type}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 leading-tight line-clamp-1 max-w-xs">{r.description}</div>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-900">
                        ${r.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{r.startDate}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          r.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            r.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}></span>
                          {r.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
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

          {/* Mobile Grid View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredRecords.map((r) => (
              <div key={r.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div className="font-mono text-sm font-bold text-brand-blue-600">{r.id}</div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    r.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {r.status}
                  </span>
                </div>

                <div className="space-y-1.5 border-y border-slate-100 py-3 text-xs text-slate-650">
                  <div>Vehicle: <strong>{r.vehicle}</strong></div>
                  <div>Type: <strong>{r.type}</strong></div>
                  <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{r.description}</div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-450 block">Log Cost</span>
                    <strong className="text-slate-800">${r.cost}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-450 block">Start Date</span>
                    <strong className="text-slate-800">{r.startDate}</strong>
                  </div>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-650"
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
              <h3 className="font-display font-bold text-lg text-slate-800">Add Maintenance Record</h3>
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

            <form onSubmit={handleCreateRecord} className="space-y-4">
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

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Maintenance Action Type *</label>
                <input
                  type="text"
                  placeholder="e.g. Brake Overhaul"
                  value={type}
                  onChange={(e) => handleFieldChange('type', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none"
                />
                {errors.type && <p className="text-[10px] text-red-500 font-semibold">{errors.type}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Work Checklist Description *</label>
                <textarea
                  placeholder="Describe the diagnostics, replacement parts, or service particulars..."
                  value={description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none"
                />
                {errors.description && <p className="text-[10px] text-red-500 font-semibold">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Service Cost ($ USD) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 850"
                    value={cost}
                    onChange={(e) => handleFieldChange('cost', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none"
                  />
                  {errors.cost && <p className="text-[10px] text-red-500 font-semibold">{errors.cost}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Start Date *</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => handleFieldChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none"
                  />
                  {errors.startDate && <p className="text-[10px] text-red-500 font-semibold">{errors.startDate}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none appearance-none"
                >
                  <option value="Active">Active (In Shop)</option>
                  <option value="Completed">Completed (Repaired)</option>
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
                  Log Record
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
            {t.type === 'info' && <Wrench className="w-5 h-5" />}
            <span className="text-xs font-semibold">{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
