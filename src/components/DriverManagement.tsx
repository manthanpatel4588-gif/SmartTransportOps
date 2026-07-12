import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  X,
  User,
  Shield,
  Phone,
  AlertTriangle,
  Trash2,
  Edit2,
  List,
  Grid
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
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleEditClick = (driver: Driver) => {
    setEditingDriver(driver);
    setName(driver.name);
    setLicenseNumber(driver.licenseNumber);
    setLicenseCategory(driver.licenseCategory);
    setExpiryDate(driver.expiryDate);
    setContactNumber(driver.contactNumber);
    setSafetyScore(driver.safetyScore.toString());
    setStatus(driver.status);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to remove driver ${id}?`)) {
      setDrivers(drivers.filter(d => d.id !== id));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = 'Driver full name is required';
    if (!licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
    if (!licenseCategory.trim()) newErrors.licenseCategory = 'License category is required';
    if (!expiryDate.trim()) newErrors.expiryDate = 'License expiration date is required';
    if (!contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';

    const scoreNum = parseInt(safetyScore);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      newErrors.safetyScore = 'Safety rating score must be between 0 and 100';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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

  // Expiry status checks
  const checkLicenseStatus = (dateStr: string) => {
    const today = new Date('2026-07-12'); // Simulation date
    const expiry = new Date(dateStr);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Expired', style: 'bg-red-50 text-red-600 border-red-100' };
    if (diffDays <= 30) return { label: 'Expiring Soon', style: 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse' };
    return { label: 'Active', style: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
  };

  // Filtered list
  const filteredDrivers = drivers.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Page Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#111827]">Drivers & Operators</h2>
          <p className="text-sm text-[#6B7280] font-semibold mt-1">Manage personnel registry, driver safety scores, and commercial licensing data</p>
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
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#2563EB] hover:bg-blue-700 active:scale-[0.98] transition-all self-start sm:self-center shadow-md shadow-blue-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>Add Operator</span>
        </button>
      </div>

      {/* Filters and View Toggle Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search operators by ID, name, license..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-sm text-[#111827] placeholder-slate-400 focus:outline-none focus:border-[#2563EB] transition-colors"
          />
        </div>

        {/* Filters & Grid Mode Selector */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-slate-100 border border-[#E5E7EB] font-semibold">
            {['All', 'Available', 'On Trip', 'Off Duty', 'Suspended'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-2 rounded-lg text-xs transition-all ${
                  statusFilter === tab
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-slate-500 hover:text-[#111827]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table / Cards mode selectors */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-[#E5E7EB]">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'cards' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Card View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      {filteredDrivers.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 rounded-[20px] bg-white border border-[#E5E7EB] border-dashed text-center">
          <div className="p-4 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] text-slate-400 mb-4">
            <User className="w-8 h-8" />
          </div>
          <h3 className="font-display font-semibold text-lg text-slate-800">No operators found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm font-semibold">
            No drivers match your filters. Register a new driver or reset the status selectors.
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        
        /* 1. Driver Profile Cards View (B2B UI design) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDrivers.map((d) => {
            const expiryInfo = checkLicenseStatus(d.expiryDate);
            return (
              <div 
                key={d.id} 
                className="p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03),0_10px_15px_-3px_rgba(0,0,0,0.05),0_0_0_1px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-350 transition-all duration-300 flex flex-col justify-between gap-6"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Driver Name & Avatar info */}
                  <div className="flex items-center gap-3.5">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=f0f7ff&color=2563eb&bold=true&rounded=true&size=48`}
                      alt={d.name}
                      className="w-12 h-12 rounded-xl object-cover shadow-xs border border-slate-100"
                    />
                    <div>
                      <span className="font-mono text-[9px] font-bold text-slate-400 block leading-none">{d.id}</span>
                      <h4 className="text-base font-bold text-[#111827] mt-1">{d.name}</h4>
                      <span className="text-[10px] text-[#6B7280] font-semibold flex items-center gap-1 mt-0.5">
                        <Shield className="w-3.5 h-3.5 text-slate-400" />
                        {d.licenseCategory}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    d.status === 'Available' ? 'bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]' :
                    d.status === 'On Trip' ? 'bg-[#E8F0FE] text-[#1A73E8] border border-[#D2E3FC]' :
                    d.status === 'Off Duty' ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                    'bg-[#FCE8E6] text-[#C5221F] border border-[#FAD2CF]'
                  }`}>
                    {d.status}
                  </span>
                </div>

                {/* License & Expiration Progress Info */}
                <div className="space-y-2.5 border-y border-slate-100 py-4 text-xs font-semibold text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>License Code:</span>
                    <span className="text-[#111827] font-mono">{d.licenseNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>License Expiry:</span>
                    <span className="text-slate-500">{d.expiryDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>License Status:</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${expiryInfo.style}`}>{expiryInfo.label}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Contact Line:</span>
                    <span className="text-[#111827] flex items-center gap-1 text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {d.contactNumber}
                    </span>
                  </div>
                </div>

                {/* Safety Score Meter circular progress ring */}
                <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Operator Rating</span>
                    <span className="text-xs text-[#6B7280] font-semibold mt-0.5 block">Safety record compliance</span>
                  </div>

                  <div className="relative flex items-center justify-center flex-shrink-0">
                    <svg className="w-11 h-11 transform -rotate-90">
                      <circle cx="22" cy="22" r="16" stroke="#e2e8f0" strokeWidth="3" fill="none" />
                      <circle
                        cx="22"
                        cy="22"
                        r="16"
                        stroke={d.safetyScore > 85 ? '#22C55E' : d.safetyScore > 70 ? '#F59E0B' : '#EF4444'}
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={2 * Math.PI * 16}
                        strokeDashoffset={2 * Math.PI * 16 * (1 - d.safetyScore / 100)}
                      />
                    </svg>
                    <span className="absolute font-mono text-[10px] font-bold text-[#111827]">{d.safetyScore}%</span>
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-3 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => handleEditClick(d)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="py-2.5 px-3 rounded-xl border border-red-200 hover:border-red-300 text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete Operator"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        
        /* 2. Driver Table View (Zebra Row Hover Data Grid) */
        <div className="overflow-hidden rounded-[20px] bg-white border border-[#E5E7EB] shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB] text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                  <th className="p-5 pl-6">Operator ID & Name</th>
                  <th className="p-5">License Class</th>
                  <th className="p-5">License Expiration</th>
                  <th className="p-5">Contact Number</th>
                  <th className="p-5">Safety score</th>
                  <th className="p-5">Registry Status</th>
                  <th className="p-5 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-800">
                {filteredDrivers.map((d) => {
                  const expiryInfo = checkLicenseStatus(d.expiryDate);
                  return (
                    <tr key={d.id} className="group hover:bg-[#F9FAFB] transition-colors">
                      <td className="p-5 pl-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=f0f7ff&color=2563eb&bold=true&rounded=true&size=36`}
                            alt={d.name}
                            className="w-9 h-9 rounded-full object-cover shadow-xs border"
                          />
                          <div>
                            <span className="font-mono text-[9px] text-slate-400 block leading-none">{d.id}</span>
                            <div className="text-[#111827] font-bold mt-1">{d.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 font-semibold text-[#111827]">
                        <div className="flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-[#2563EB]" />
                          <span>{d.licenseCategory}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="space-y-1 font-semibold">
                          <span className="text-slate-500 block">{d.expiryDate}</span>
                          <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded border ${expiryInfo.style}`}>
                            {expiryInfo.label}
                          </span>
                        </div>
                      </td>
                      <td className="p-5 font-semibold text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {d.contactNumber}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <div className="relative flex items-center justify-center">
                            <svg className="w-8 h-8 transform -rotate-90">
                              <circle cx="16" cy="16" r="12" stroke="#f1f5f9" strokeWidth="2.5" fill="none" />
                              <circle
                                cx="16"
                                cy="16"
                                r="12"
                                stroke={d.safetyScore > 85 ? '#22C55E' : d.safetyScore > 70 ? '#F59E0B' : '#EF4444'}
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
                      <td className="p-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          d.status === 'Available' ? 'bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]' :
                          d.status === 'On Trip' ? 'bg-[#E8F0FE] text-[#1A73E8] border border-[#D2E3FC]' :
                          d.status === 'Off Duty' ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                          'bg-[#FCE8E6] text-[#C5221F] border border-[#FAD2CF]'
                        }`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="p-5 pr-6 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleEditClick(d)}
                            className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-slate-50 text-slate-500 hover:text-[#2563EB] transition-colors"
                            title="Edit operator"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(d.id)}
                            className="p-1.5 rounded-lg border border-red-150 hover:bg-red-50 text-red-500 transition-colors"
                            title="Delete operator"
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
      )}

      {/* 3. Add / Edit Driver Modal (multi-column layout form) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden font-sans">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-xs transition-opacity"
          ></div>

          {/* Modal Container Card */}
          <div className="relative bg-white rounded-[20px] shadow-2xl border border-[#E5E7EB] w-full max-w-xl p-8 flex flex-col justify-between animate-fadeIn z-10">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#2563EB] flex items-center justify-center">
                  <User className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#111827]">{editingDriver ? `Edit Operator: ${editingDriver.id}` : 'Register Operator'}</h3>
                  <p className="text-[11px] text-slate-500 font-semibold">Define operator credentials and safety standards</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Form Fields - Multi-column layout */}
            <form onSubmit={handleFormSubmit} className="my-6 space-y-5">
              
              {/* Full Name input */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Operator Full Name</label>
                <input
                  type="text"
                  placeholder="Alexander Pierce"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] transition-colors"
                />
                {errors.name && <p className="text-[10px] font-bold text-red-650 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {errors.name}</p>}
              </div>

              {/* Multi-column row: License Code & Class */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">License Number</label>
                  <input
                    type="text"
                    placeholder="DL-3849502"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] transition-colors"
                  />
                  {errors.licenseNumber && <p className="text-[10px] font-bold text-red-650 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {errors.licenseNumber}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">License Category</label>
                  <input
                    type="text"
                    placeholder="Class A Commercial"
                    value={licenseCategory}
                    onChange={(e) => setLicenseCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] transition-colors"
                  />
                  {errors.licenseCategory && <p className="text-[10px] font-bold text-red-650 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {errors.licenseCategory}</p>}
                </div>
              </div>

              {/* Multi-column row: Expiry Date & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">License Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] transition-colors"
                  />
                  {errors.expiryDate && <p className="text-[10px] font-bold text-red-650 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {errors.expiryDate}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Contact Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 019-2834"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] transition-colors"
                  />
                  {errors.contactNumber && <p className="text-[10px] font-bold text-red-650 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {errors.contactNumber}</p>}
                </div>
              </div>

              {/* Multi-column row: Safety Rating & Registry Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Safety Rating Score (%)</label>
                  <input
                    type="number"
                    placeholder="95"
                    value={safetyScore}
                    onChange={(e) => setSafetyScore(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] transition-colors"
                  />
                  {errors.safetyScore && <p className="text-[10px] font-bold text-red-650 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {errors.safetyScore}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Registry Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="Available">Available (On Duty)</option>
                    <option value="On Trip">On Trip (In Transit)</option>
                    <option value="Off Duty">Off Duty (Resting)</option>
                    <option value="Suspended">Suspended (Alerted)</option>
                  </select>
                </div>
              </div>

            </form>

            {/* Modal Footer Actions */}
            <div className="border-t border-slate-100 pt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-[#E5E7EB] text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFormSubmit}
                className="flex-1 py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-xs font-bold text-white shadow-md shadow-blue-500/10 transition-all active:scale-[0.98]"
              >
                {editingDriver ? 'Save Changes' : 'Register Operator'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
