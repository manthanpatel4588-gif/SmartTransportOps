import { useState } from 'react';
import {
  Plus,
  Search,
  X,
  Truck,
  Wrench,
  DollarSign,
  Calendar,
  Trash2
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
    type: 'Transmission Service',
    description: 'Testing clutch plates for slipping; inspecting fluid.',
    cost: 1600,
    startDate: '2026-07-10',
    status: 'Active'
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

  // Validation Error State
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

    // Validate real-time
    let errMsg = '';
    const nameMap: Record<string, string> = {
      vehicle: 'Vehicle',
      type: 'Maintenance Type',
      description: 'Description',
      cost: 'Cost',
      startDate: 'Start Date'
    };

    if (!val.trim()) {
      errMsg = `${nameMap[field]} is required.`;
    } else if (field === 'cost') {
      const num = parseFloat(val);
      if (isNaN(num) || num <= 0) {
        errMsg = 'Cost must be a positive number.';
      }
    }

    setErrors((prev) => ({
      ...prev,
      [field]: errMsg
    }));
  };

  const handleLogRecord = (e: React.FormEvent) => {
    e.preventDefault();

    // Perform final validation
    const finalErrors: typeof errors = {};
    if (!vehicle.trim()) finalErrors.vehicle = 'Vehicle is required.';
    if (!type.trim()) finalErrors.type = 'Maintenance Type is required.';
    if (!description.trim()) finalErrors.description = 'Description is required.';
    if (!startDate.trim()) finalErrors.startDate = 'Start Date is required.';

    const costNum = parseFloat(cost);
    if (!cost.trim()) {
      finalErrors.cost = 'Cost is required.';
    } else if (isNaN(costNum) || costNum <= 0) {
      finalErrors.cost = 'Cost must be a positive number.';
    }

    if (Object.values(finalErrors).some((err) => !!err)) {
      setErrors(finalErrors);
      addToast('Please correct validation errors in form fields.', 'error');
      return;
    }

    // Generate new record ID
    const maxId = records.reduce((max, rec) => {
      const num = parseInt(rec.id.split('-')[1]);
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
    setIsModalOpen(false);
    addToast(`New Maintenance record ${newId} logged successfully!`, 'success');

    // Reset Form Fields
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
  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.id.toLowerCase().includes(search.toLowerCase()) ||
      rec.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      rec.type.toLowerCase().includes(search.toLowerCase()) ||
      rec.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">Maintenance Management</h2>
          <p className="text-xs text-brand-navy-400">Track scheduled maintenance, service costs, and active vehicle repairs</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-blue-600 to-brand-blue-500 hover:from-brand-blue-500 hover:to-brand-blue-400 active:scale-[0.98] transition-all duration-200 shadow-md shadow-brand-blue-600/10 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Log Record</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between p-4 rounded-2xl bg-brand-navy-900/60 border border-brand-navy-800 backdrop-blur-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-brand-navy-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search records by ID, vehicle, type, details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-navy-950 border border-brand-navy-850 text-sm text-white placeholder-brand-navy-500 focus:outline-none focus:border-brand-blue-500 transition-colors"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-brand-navy-950/80 border border-brand-navy-850 self-start lg:self-center">
          {['All', 'Active', 'Completed'].map((tab) => (
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

      {/* Records Table / Grid */}
      {filteredRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-brand-navy-900/40 border border-brand-navy-800 border-dashed text-center">
          <div className="p-3 rounded-full bg-brand-navy-900 border border-brand-navy-800 text-brand-navy-400 mb-4">
            <Wrench className="w-8 h-8" />
          </div>
          <h3 className="font-display font-semibold text-lg">No records found</h3>
          <p className="text-xs text-brand-navy-500 mt-1 max-w-sm">
            Try adjusting your search criteria or log a new vehicle maintenance record.
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
                    <th className="p-4">Maintenance Type</th>
                    <th className="p-4">Service Cost</th>
                    <th className="p-4">Start Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-navy-900 text-sm">
                  {filteredRecords.map((rec) => (
                    <tr key={rec.id} className="group hover:bg-brand-navy-900/40 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="space-y-0.5">
                          <div className="font-mono text-[10px] text-brand-navy-400">{rec.id}</div>
                          <div className="flex items-center gap-1.5 text-white font-semibold">
                            <Truck className="w-3.5 h-3.5 text-brand-blue-400" />
                            <span>{rec.vehicle}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <div className="text-white font-medium">{rec.type}</div>
                          <div className="text-[10px] text-brand-navy-400 max-w-xs truncate" title={rec.description}>
                            {rec.description}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center text-emerald-400 font-semibold font-mono">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>{rec.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-brand-navy-300">
                          <Calendar className="w-3.5 h-3.5 text-brand-navy-400" />
                          <span>{rec.startDate}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          rec.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          'bg-brand-blue-500/10 text-brand-blue-400 border border-brand-blue-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            rec.status === 'Completed' ? 'bg-emerald-400' : 'bg-brand-blue-400'
                          }`}></span>
                          {rec.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => handleDelete(rec.id)}
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
            {filteredRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-5 rounded-2xl bg-brand-navy-900/60 border border-brand-navy-800 backdrop-blur-sm space-y-4"
              >
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div className="font-mono text-xs text-brand-navy-400">{rec.id}</div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    rec.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    'bg-brand-blue-500/10 text-brand-blue-400 border border-brand-blue-500/20'
                  }`}>
                    {rec.status}
                  </span>
                </div>

                {/* Vehicle & type */}
                <div className="space-y-1 text-sm border-y border-brand-navy-850 py-3">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Truck className="w-4 h-4 text-brand-blue-400 flex-shrink-0" />
                    <span>{rec.vehicle}</span>
                  </div>
                  <div className="text-brand-navy-200 font-semibold pl-6">{rec.type}</div>
                  <div className="text-[11px] text-brand-navy-400 pl-6 leading-relaxed mt-1">
                    {rec.description}
                  </div>
                </div>

                {/* Details Footer */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-brand-navy-500 uppercase tracking-wider text-[10px] mb-1">Cost</p>
                    <p className="text-emerald-400 font-bold font-mono text-sm">
                      ${rec.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-brand-navy-500 uppercase tracking-wider text-[10px] mb-1">Start Date</p>
                    <p className="text-white font-semibold">{rec.startDate}</p>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex justify-end pt-3 border-t border-brand-navy-850">
                  <button
                    onClick={() => handleDelete(rec.id)}
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
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Log Maintenance Record</h3>
                  <p className="text-[10px] text-brand-navy-400">Record a new mechanical check or servicing</p>
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
            <form onSubmit={handleLogRecord} className="space-y-5">
              {/* Vehicle & Maintenance Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="space-y-1.5">
                  <label htmlFor="modal-type" className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy-300">
                    Maintenance Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="modal-type"
                    type="text"
                    placeholder="e.g. Brake Overhaul"
                    value={type}
                    onChange={(e) => handleFieldChange('type', e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl bg-brand-navy-950 border ${
                      errors.type ? 'border-red-500 focus:border-red-500' : 'border-brand-navy-850 focus:border-brand-blue-500'
                    } text-white placeholder-brand-navy-600 text-sm focus:outline-none focus:ring-1 ${
                      errors.type ? 'focus:ring-red-500/20' : 'focus:ring-brand-blue-500/20'
                    } transition-all`}
                  />
                  {errors.type && (
                    <p className="text-[10px] text-red-400 font-semibold">{errors.type}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="modal-description" className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy-300">
                  Service Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="modal-description"
                  placeholder="Describe the mechanical actions or inspection details..."
                  value={description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-xl bg-brand-navy-950 border ${
                    errors.description ? 'border-red-500 focus:border-red-500' : 'border-brand-navy-850 focus:border-brand-blue-500'
                  } text-white placeholder-brand-navy-600 text-sm focus:outline-none focus:ring-1 ${
                    errors.description ? 'focus:ring-red-500/20' : 'focus:ring-brand-blue-500/20'
                  } transition-all resize-none`}
                />
                {errors.description && (
                  <p className="text-[10px] text-red-400 font-semibold">{errors.description}</p>
                )}
              </div>

              {/* Cost & Start Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="modal-cost" className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy-300">
                    Service Cost ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="modal-cost"
                    type="number"
                    placeholder="e.g. 1250"
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
                <div className="space-y-1.5">
                  <label htmlFor="modal-date" className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy-300">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="modal-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => handleFieldChange('startDate', e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl bg-brand-navy-950 border ${
                      errors.startDate ? 'border-red-500 focus:border-red-500' : 'border-brand-navy-850 focus:border-brand-blue-500'
                    } text-white text-sm focus:outline-none focus:ring-1 ${
                      errors.startDate ? 'focus:ring-red-500/20' : 'focus:ring-brand-blue-500/20'
                    } transition-all`}
                  />
                  {errors.startDate && (
                    <p className="text-[10px] text-red-400 font-semibold">{errors.startDate}</p>
                  )}
                </div>
              </div>

              {/* Status Selection */}
              <div className="space-y-1.5">
                <label htmlFor="modal-status" className="block text-[10px] font-bold uppercase tracking-wider text-brand-navy-300">
                  Repair Status
                </label>
                <select
                  id="modal-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-brand-navy-950 border border-brand-navy-850 text-white text-sm focus:outline-none focus:border-brand-blue-500 transition-all appearance-none"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
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
                  Log Service Record
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
