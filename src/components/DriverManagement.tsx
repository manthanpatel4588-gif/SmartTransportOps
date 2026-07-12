import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  X,
  User,
  Shield,
  Phone,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Edit2
} from 'lucide-react';

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  expiryDate: string;
  contactNumber: string;
  safetyScore: number;
  status: 'Available' | 'On Trip' | 'Off Duty' | 'Suspended';
}

const INITIAL_DRIVERS: Driver[] = [
  {
    id: 'DRV-101',
    name: 'Alexander Pierce',
    licenseNumber: 'DL-3849502',
    licenseCategory: 'Class A',
    expiryDate: '2027-11-15',
    contactNumber: '+1 (555) 019-2834',
    safetyScore: 94,
    status: 'Available'
  },
  {
    id: 'DRV-102',
    name: 'Marcus Vance',
    licenseNumber: 'DL-4820194',
    licenseCategory: 'Class B',
    expiryDate: '2026-08-30',
    contactNumber: '+1 (555) 014-9482',
    safetyScore: 88,
    status: 'On Trip'
  },
  {
    id: 'DRV-103',
    name: 'Sarah Connor',
    licenseNumber: 'DL-9081234',
    licenseCategory: 'Class C',
    expiryDate: '2028-03-12',
    contactNumber: '+1 (555) 017-3829',
    safetyScore: 97,
    status: 'Available'
  },
  {
    id: 'DRV-104',
    name: 'Derrick Rose',
    licenseNumber: 'DL-1102938',
    licenseCategory: 'Heavy Rigid',
    expiryDate: '2026-07-28',
    contactNumber: '+1 (555) 012-3849',
    safetyScore: 78,
    status: 'Off Duty'
  },
  {
    id: 'DRV-105',
    name: 'Elena Rostova',
    licenseNumber: 'DL-5520938',
    licenseCategory: 'Class A',
    expiryDate: '2027-05-20',
    contactNumber: '+1 (555) 015-8930',
    safetyScore: 92,
    status: 'Suspended'
  }
];

export default function DriverManagement() {
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem('smartops_drivers');
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  useEffect(() => {
    localStorage.setItem('smartops_drivers', JSON.stringify(drivers));
  }, [drivers]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  // Form Fields State
  const [name, setName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseCategory, setLicenseCategory] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [safetyScore, setSafetyScore] = useState('');
  const [status, setStatus] = useState<'Available' | 'On Trip' | 'Off Duty' | 'Suspended'>('Available');

  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleEditClick = (driver: Driver) => {
    setEditingDriver(driver);
    setName(driver.name);
    setLicenseNumber(driver.licenseNumber);
    setLicenseCategory(driver.licenseCategory);
    setExpiryDate(driver.expiryDate);
    setContactNumber(driver.contactNumber);
    setSafetyScore(driver.safetyScore.toString());
    setStatus(driver.status);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDrivers(drivers.filter((d) => d.id !== id));
    addToast(`Driver record ${id} has been deleted.`, 'info');
  };

  const handleFieldChange = (field: string, val: string) => {
    if (field === 'name') setName(val);
    if (field === 'licenseNumber') setLicenseNumber(val);
    if (field === 'licenseCategory') setLicenseCategory(val);
    if (field === 'expiryDate') setExpiryDate(val);
    if (field === 'contactNumber') setContactNumber(val);
    if (field === 'safetyScore') setSafetyScore(val);

    let errMsg = '';
    const nameMap: Record<string, string> = {
      name: 'Driver Name',
      licenseNumber: 'License Number',
      licenseCategory: 'License Class',
      expiryDate: 'Expiry Date',
      contactNumber: 'Contact Number',
      safetyScore: 'Safety Score'
    };

    if (!val.trim()) {
      errMsg = `${nameMap[field]} is required.`;
    } else if (field === 'safetyScore') {
      const num = parseInt(val);
      if (isNaN(num) || num < 0 || num > 100) {
        errMsg = 'Safety Score must be between 0 and 100.';
      }
    }

    setErrors((prev) => ({
      ...prev,
      [field]: errMsg
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Final checks
    const finalErrors: typeof errors = {};
    if (!name.trim()) finalErrors.name = 'Driver Name is required.';
    if (!licenseNumber.trim()) finalErrors.licenseNumber = 'License Number is required.';
    if (!licenseCategory.trim()) finalErrors.licenseCategory = 'License Class is required.';
    if (!expiryDate.trim()) finalErrors.expiryDate = 'Expiry Date is required.';
    if (!contactNumber.trim()) finalErrors.contactNumber = 'Contact Number is required.';

    const scoreNum = parseInt(safetyScore);
    if (!safetyScore.trim()) {
      finalErrors.safetyScore = 'Safety Score is required.';
    } else if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      finalErrors.safetyScore = 'Safety Score must be between 0 and 100.';
    }

    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      addToast('Please correct validation errors.', 'error');
      return;
    }

    if (editingDriver) {
      // Update
      setDrivers(
        drivers.map((d) =>
          d.id === editingDriver.id
            ? { ...d, name, licenseNumber, licenseCategory, expiryDate, contactNumber, safetyScore: scoreNum, status }
            : d
        )
      );
      addToast(`Driver ${editingDriver.id} updated successfully!`, 'success');
    } else {
      // Create
      const maxId = drivers.reduce((max, d) => {
        const num = parseInt(d.id.split('-')[1]);
        return num > max ? num : max;
      }, 100);
      const newId = `DRV-${maxId + 1}`;

      const newDriver: Driver = {
        id: newId,
        name,
        licenseNumber,
        licenseCategory,
        expiryDate,
        contactNumber,
        safetyScore: scoreNum,
        status
      };

      setDrivers([newDriver, ...drivers]);
      addToast(`New Driver ${newId} registered successfully!`, 'success');
    }

    setIsModalOpen(false);
    setEditingDriver(null);
    setName('');
    setLicenseNumber('');
    setLicenseCategory('');
    setExpiryDate('');
    setContactNumber('');
    setSafetyScore('');
    setStatus('Available');
    setErrors({});
  };

  const isFormInvalid =
    !name.trim() ||
    !licenseNumber.trim() ||
    !licenseCategory.trim() ||
    !expiryDate.trim() ||
    !contactNumber.trim() ||
    !safetyScore.trim() ||
    Object.values(errors).some((err) => !!err);

  // Expiry check
  const checkLicenseStatus = (dateStr: string) => {
    const today = new Date('2026-07-12'); // Simulation date
    const expiry = new Date(dateStr);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Expired', style: 'bg-red-50 text-red-600 border-red-100' };
    if (diffDays <= 30) return { label: 'Expiring Soon', style: 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse' };
    return { label: 'Active', style: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
  };

  // Filtered drivers
  const filteredDrivers = drivers.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">Driver Management</h2>
          <p className="text-xs text-brand-navy-400">Track and manage vehicle operators, license statuses, and safety scores</p>
        </div>
        <button
          onClick={() => {
            setEditingDriver(null);
            setName('');
            setLicenseNumber('');
            setLicenseCategory('');
            setExpiryDate('');
            setContactNumber('');
            setSafetyScore('');
            setStatus('Available');
            setErrors({});
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-blue-600 to-brand-blue-500 hover:from-brand-blue-500 hover:to-brand-blue-400 active:scale-[0.98] transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add Driver</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between p-4 rounded-2xl bg-white border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search operators by ID, name, license..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-blue-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
          {['All', 'Available', 'On Trip', 'Off Duty', 'Suspended'].map((tab) => (
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

      {/* Grid Table */}
      {filteredDrivers.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-white border border-slate-200 border-dashed text-center">
          <div className="p-3 rounded-full bg-slate-50 border border-slate-100 text-slate-400 mb-4">
            <User className="w-8 h-8" />
          </div>
          <h3 className="font-display font-semibold text-lg text-slate-800">No operators found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Try adjusting your search criteria or register a new fleet driver.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-2xl bg-white border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/40">
                    <th className="p-4 pl-6">Operator ID & Name</th>
                    <th className="p-4">License Category</th>
                    <th className="p-4">License Expiry</th>
                    <th className="p-4">Contact Number</th>
                    <th className="p-4">Safety Score</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {filteredDrivers.map((d) => {
                    const expiryInfo = checkLicenseStatus(d.expiryDate);
                    return (
                      <tr key={d.id} className="group hover:bg-slate-50/40 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=f0f7ff&color=0284c7&bold=true&rounded=true&size=36`}
                              alt={d.name}
                              className="w-9 h-9 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-mono text-[10px] text-slate-400 leading-none">{d.id}</div>
                              <div className="text-slate-800 font-bold mt-0.5">{d.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-slate-800">
                          <div className="flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-brand-blue-500" />
                            <span>{d.licenseCategory}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="text-slate-500 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>{d.expiryDate}</span>
                            </div>
                            <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded border ${expiryInfo.style}`}>
                              {expiryInfo.label}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-slate-500 flex items-center gap-1.5 mt-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{d.contactNumber}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="relative flex items-center justify-center">
                              <svg className="w-8 h-8 transform -rotate-90">
                                <circle cx="16" cy="16" r="12" stroke="#f1f5f9" strokeWidth="2.5" fill="none" />
                                <circle
                                  cx="16"
                                  cy="16"
                                  r="12"
                                  stroke={d.safetyScore > 85 ? '#10b981' : d.safetyScore > 70 ? '#f59e0b' : '#ef4444'}
                                  strokeWidth="2.5"
                                  fill="none"
                                  strokeDasharray={2 * Math.PI * 12}
                                  strokeDashoffset={2 * Math.PI * 12 * (1 - d.safetyScore / 100)}
                                />
                              </svg>
                              <span className="absolute font-mono text-[9px] font-bold text-slate-700">{d.safetyScore}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            d.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            d.status === 'On Trip' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                            d.status === 'Off Duty' ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                            'bg-red-50 text-red-600 border border-red-100'
                          }`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditClick(d)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-blue-500 hover:bg-brand-blue-50 transition-all"
                              title="Edit driver"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(d.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                              title="Delete driver"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Grid View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredDrivers.map((d) => (
              <div key={d.id} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=f0f7ff&color=0284c7&bold=true&rounded=true&size=32`}
                      alt={d.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <span className="font-mono text-xs text-slate-400">{d.id}</span>
                      <h4 className="text-sm font-bold text-slate-800">{d.name}</h4>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    d.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    d.status === 'On Trip' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                    d.status === 'Off Duty' ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                    'bg-red-50 text-red-600 border border-red-100'
                  }`}>
                    {d.status}
                  </span>
                </div>

                <div className="space-y-1.5 border-y border-slate-100 py-3 text-xs text-slate-600">
                  <div>License Category: <strong className="text-slate-800">{d.licenseCategory} ({d.licenseNumber})</strong></div>
                  <div>Expiry: <strong className="text-slate-800">{d.expiryDate}</strong></div>
                  <div>Phone: <strong className="text-slate-800">{d.contactNumber}</strong></div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Safety Rating</span>
                    <strong className="text-slate-800 text-sm font-mono">{d.safetyScore}%</strong>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(d)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 font-semibold"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md z-50 animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h3 className="font-display font-bold text-lg text-slate-800">
                {editingDriver ? 'Edit Operator Record' : 'Register New Operator'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingDriver(null);
                  setErrors({});
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Driver Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Samuel Jackson"
                  value={name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl bg-slate-50 border ${
                    errors.name ? 'border-red-500' : 'border-slate-200 focus:border-brand-blue-500'
                  } text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue-500/20`}
                />
                {errors.name && <p className="text-[10px] text-red-500 font-semibold">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">License Number *</label>
                  <input
                    type="text"
                    placeholder="e.g. DL-3849502"
                    value={licenseNumber}
                    onChange={(e) => handleFieldChange('licenseNumber', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue-500/20"
                  />
                  {errors.licenseNumber && <p className="text-[10px] text-red-500 font-semibold">{errors.licenseNumber}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">License Category *</label>
                  <input
                    type="text"
                    placeholder="e.g. Class A"
                    value={licenseCategory}
                    onChange={(e) => handleFieldChange('licenseCategory', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue-500/20"
                  />
                  {errors.licenseCategory && <p className="text-[10px] text-red-500 font-semibold">{errors.licenseCategory}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Expiry Date *</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => handleFieldChange('expiryDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-1"
                  />
                  {errors.expiryDate && <p className="text-[10px] text-red-500 font-semibold">{errors.expiryDate}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Safety Score (0-100) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 95"
                    value={safetyScore}
                    onChange={(e) => handleFieldChange('safetyScore', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-1"
                  />
                  {errors.safetyScore && <p className="text-[10px] text-red-500 font-semibold">{errors.safetyScore}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Contact Number *</label>
                <input
                  type="text"
                  placeholder="e.g. +1 (555) 019-2834"
                  value={contactNumber}
                  onChange={(e) => handleFieldChange('contactNumber', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-1"
                />
                {errors.contactNumber && <p className="text-[10px] text-red-500 font-semibold">{errors.contactNumber}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Operator Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none appearance-none"
                >
                  <option value="Available">Available</option>
                  <option value="On Trip">On Trip</option>
                  <option value="Off Duty">Off Duty</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingDriver(null);
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toasts */}
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
            {t.type === 'info' && <User className="w-5 h-5" />}
            <span className="text-xs font-semibold">{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
