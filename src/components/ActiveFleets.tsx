import { useState, useEffect } from 'react';
import {
  Truck,
  Search,
  Compass,
  Loader2,
  Plus,
  X,
  CheckCircle,
  AlertTriangle,
  Wrench
} from 'lucide-react';

interface FleetVehicle {
  id: string;
  model: string;
  driver: string;
  status: 'On Duty' | 'Idle' | 'Maintenance';
  fuel: number;
  location: string;
  speed: number;
}

const INITIAL_FLEET: FleetVehicle[] = [
  { id: 'TRK-1092', model: 'Volvo FH16', driver: 'Samuel Jackson', status: 'On Duty', fuel: 75, location: 'Chicago, IL', speed: 85 },
  { id: 'TRK-9801', model: 'Mack Anthem', driver: 'Marcus Vance', status: 'Maintenance', fuel: 40, location: 'St. Louis, MO', speed: 0 },
  { id: 'TRK-4421', model: 'Peterbilt 579', driver: 'Elena Rostova', status: 'On Duty', fuel: 90, location: 'Denver, CO', speed: 95 },
  { id: 'TRK-8843', model: 'Freightliner Cascadia', driver: 'David Miller', status: 'Idle', fuel: 15, location: 'Dallas, TX', speed: 0 },
  { id: 'TRK-5524', model: 'Scania R730', driver: 'Sarah Connor', status: 'On Duty', fuel: 65, location: 'Houston, TX', speed: 80 },
  { id: 'TRK-7712', model: 'Kenworth T680', driver: 'John Doe', status: 'Idle', fuel: 82, location: 'Atlanta, GA', speed: 0 }
];

export default function ActiveFleets() {
  const [vehicles, setVehicles] = useState<FleetVehicle[]>(() => {
    const saved = localStorage.getItem('smartops_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_FLEET;
  });

  useEffect(() => {
    localStorage.setItem('smartops_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form Fields State
  const [vehId, setVehId] = useState('');
  const [model, setModel] = useState('');
  const [driver, setDriver] = useState('');
  const [status, setStatus] = useState<'On Duty' | 'Idle' | 'Maintenance'>('On Duty');
  const [fuel, setFuel] = useState('80');
  const [location, setLocation] = useState('');
  const [speed, setSpeed] = useState('0');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Simulate dynamic network loading when filters change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.id.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.driver.toLowerCase().includes(search.toLowerCase()) ||
      v.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics dynamically
  const totalCount = vehicles.length;
  const activeCount = vehicles.filter(v => v.status === 'On Duty').length;
  const idleCount = vehicles.filter(v => v.status === 'Idle').length;
  const maintenanceCount = vehicles.filter(v => v.status === 'Maintenance').length;

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!vehId.trim() || !/^TRK-\d{4}$/.test(vehId.toUpperCase())) {
      newErrors.vehId = 'Vehicle ID must be in format TRK-XXXX (e.g. TRK-5524)';
    } else if (vehicles.some(v => v.id.toUpperCase() === vehId.toUpperCase())) {
      newErrors.vehId = 'This Vehicle ID is already registered';
    }

    if (!model.trim()) newErrors.model = 'Model name is required';
    if (!driver.trim()) newErrors.driver = 'Assigned driver is required';
    if (!location.trim()) newErrors.location = 'Current location city is required';
    
    const fuelNum = parseInt(fuel);
    if (isNaN(fuelNum) || fuelNum < 0 || fuelNum > 100) {
      newErrors.fuel = 'Fuel level must be between 0 and 100';
    }

    const speedNum = parseInt(speed);
    if (isNaN(speedNum) || speedNum < 0) {
      newErrors.speed = 'Speed must be a valid number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Success - add vehicle
    const newVehicle: FleetVehicle = {
      id: vehId.toUpperCase(),
      model,
      driver,
      status,
      fuel: fuelNum,
      location,
      speed: speedNum
    };

    setVehicles([newVehicle, ...vehicles]);
    setIsDrawerOpen(false);

    // Reset Form
    setVehId('');
    setModel('');
    setDriver('');
    setStatus('On Duty');
    setFuel('80');
    setLocation('');
    setSpeed('0');
    setErrors({});
  };

  return (
    <div className="space-y-8 animate-fadeIn relative">
      
      {/* Page Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#111827]">Active Fleets</h2>
          <p className="text-sm text-[#6B7280] font-semibold mt-1">Real-time status tracking, fuel levels, speeds, and dispatch actions</p>
        </div>
        <button
          onClick={() => {
            setErrors({});
            setIsDrawerOpen(true);
          }}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#2563EB] hover:bg-blue-700 active:scale-[0.98] transition-all self-start sm:self-center shadow-md shadow-blue-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Top Statistics Cards - Enterprise visual standard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Fleet Size', value: totalCount, sub: 'Registered vehicles', icon: Truck, color: 'bg-blue-500 text-white shadow-blue-500/10' },
          { label: 'Active In Transit', value: activeCount, sub: 'Currently on duty', icon: Compass, color: 'bg-indigo-500 text-white shadow-indigo-500/10' },
          { label: 'Ready & Available', value: idleCount, sub: 'Awaiting dispatch', icon: CheckCircle, color: 'bg-emerald-500 text-white shadow-emerald-500/10' },
          { label: 'In Maintenance', value: maintenanceCount, sub: 'At workshop bay', icon: Wrench, color: 'bg-rose-500 text-white shadow-rose-500/10' }
        ].map((card, idx) => (
          <div 
            key={idx} 
            className="p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03),0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-slate-350 transition-all duration-300 relative min-h-[140px] flex flex-col justify-between overflow-hidden"
          >
            {/* Top row: Label */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">{card.label}</span>
            </div>

            {/* Bottom row: Value on left, Icon & Subtitle on right */}
            <div className="flex items-end justify-between mt-1">
              <div>
                <p className="text-3xl font-display font-black text-[#111827] leading-none">{card.value}</p>
              </div>

              <div className="flex flex-col items-end gap-1 z-10">
                {/* Subtitle moved to the right and up a little */}
                <span className="text-xs font-semibold text-[#6B7280] text-right leading-none mb-1">{card.sub}</span>
                
                {/* Icon moved a little right and down */}
                <div className={`w-11 h-11 rounded-full ${card.color} flex items-center justify-center shadow-md translate-x-1.5 translate-y-1.5`}>
                  <card.icon className="w-5.5 h-5.5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search fleets by vehicle, driver, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-sm text-[#111827] placeholder-slate-400 focus:outline-none focus:border-[#2563EB] transition-colors"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-slate-100 border border-[#E5E7EB] self-start lg:self-center font-semibold">
          {['All', 'On Duty', 'Idle', 'Maintenance'].map((tab) => (
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

      {/* Main Telemetry Data Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-24 rounded-[20px] bg-white border border-[#E5E7EB] shadow-xs">
          <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin mb-3" />
          <p className="text-xs text-slate-500 font-semibold">Loading updated telemetry feeds...</p>
        </div>
      ) : filteredVehicles.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-20 rounded-[20px] bg-white border border-[#E5E7EB] border-dashed text-center">
          <div className="p-4 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] text-slate-400 mb-4">
            <Truck className="w-8 h-8" />
          </div>
          <h3 className="font-display font-semibold text-lg text-slate-800">No vehicles registered</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm font-semibold">
            No active fleet vehicles match your query. Try resetting your search filters or add a new vehicle.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table Data Grid - Rounded B2B container */}
          <div className="hidden md:block overflow-hidden rounded-[20px] bg-white border border-[#E5E7EB] shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB] text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                    <th className="p-5 pl-6">Vehicle ID</th>
                    <th className="p-5">Model Details</th>
                    <th className="p-5">Assigned Operator</th>
                    <th className="p-5">Location</th>
                    <th className="p-5">Current Speed</th>
                    <th className="p-5 font-mono">Fuel Level</th>
                    <th className="p-5 pr-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-800">
                  {filteredVehicles.map((v) => (
                    <tr key={v.id} className="group hover:bg-[#F9FAFB] transition-colors">
                      <td className="p-5 pl-6 font-mono font-bold text-[#2563EB]">{v.id}</td>
                      <td className="p-5 font-semibold text-[#111827]">{v.model}</td>
                      <td className="p-5 font-semibold">
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(v.driver)}&background=f0f7ff&color=2563eb&bold=true&rounded=true&size=30`}
                            alt={v.driver}
                            className="w-7 h-7 rounded-full object-cover shadow-xs border border-slate-100"
                          />
                          <span>{v.driver}</span>
                        </div>
                      </td>
                      <td className="p-5 text-slate-500 font-semibold">{v.location}</td>
                      <td className="p-5 font-semibold text-[#111827]">{v.speed} km/h</td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full bg-slate-150 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                v.fuel > 50 ? 'bg-[#22C55E]' : v.fuel > 20 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'
                              }`}
                              style={{ width: `${v.fuel}%` }}
                            ></div>
                          </div>
                          <span className="font-mono text-xs font-semibold text-slate-500">{v.fuel}%</span>
                        </div>
                      </td>
                      <td className="p-5 pr-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          v.status === 'On Duty' ? 'bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]' :
                          v.status === 'Idle' ? 'bg-[#E8F0FE] text-[#1A73E8] border border-[#D2E3FC]' :
                          'bg-[#FCE8E6] text-[#C5221F] border border-[#FAD2CF]'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            v.status === 'On Duty' ? 'bg-[#137333]' :
                            v.status === 'Idle' ? 'bg-[#1A73E8]' :
                            'bg-[#C5221F]'
                          }`}></span>
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Grid Layout */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredVehicles.map((v) => (
              <div key={v.id} className="p-5 rounded-[20px] bg-white border border-[#E5E7EB] shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm font-bold text-[#2563EB]">{v.id}</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    v.status === 'On Duty' ? 'bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]' :
                    v.status === 'Idle' ? 'bg-[#E8F0FE] text-[#1A73E8] border border-[#D2E3FC]' :
                    'bg-[#FCE8E6] text-[#C5221F] border border-[#FAD2CF]'
                  }`}>
                    {v.status}
                  </span>
                </div>
                <div className="space-y-1.5 border-y border-slate-100 py-3 text-xs text-[#6B7280]">
                  <div>Vehicle Model: <strong className="text-slate-800 font-bold">{v.model}</strong></div>
                  <div>Operator: <strong className="text-slate-800 font-bold">{v.driver}</strong></div>
                  <div>Location: <strong className="text-slate-800 font-bold">{v.location}</strong></div>
                  <div>Telemetry speed: <strong className="text-slate-850 font-bold">{v.speed} km/h</strong></div>
                  <div className="flex items-center gap-2">
                    <span>Fuel:</span>
                    <div className="flex-1 max-w-[80px] h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className={`h-full ${v.fuel > 50 ? 'bg-[#22C55E]' : v.fuel > 20 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`} style={{ width: `${v.fuel}%` }}></div>
                    </div>
                    <strong>{v.fuel}%</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 3. Sliding Add Vehicle Drawer Panel (B2B design standard) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-xs transition-opacity duration-300"
          ></div>

          {/* Sliding drawer container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl border-l border-[#E5E7EB] flex flex-col justify-between p-8 animate-slideIn">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#2563EB] flex items-center justify-center shadow-xs">
                    <Truck className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#111827]">Register Vehicle</h3>
                    <p className="text-[11px] text-slate-500 font-semibold">Log a new asset into fleet network</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-[#E5E7EB] text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Form fields content */}
              <form onSubmit={handleAddVehicle} className="flex-1 my-6 overflow-y-auto pr-1 space-y-5">
                
                {/* ID input */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Asset ID Code</label>
                  <input
                    type="text"
                    placeholder="TRK-5524"
                    value={vehId}
                    onChange={(e) => setVehId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] transition-colors"
                  />
                  {errors.vehId && <p className="text-[10px] font-bold text-red-650 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {errors.vehId}</p>}
                </div>

                {/* Model input */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Manufacturer / Model</label>
                  <input
                    type="text"
                    placeholder="Volvo FH16 Globetrotter"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] transition-colors"
                  />
                  {errors.model && <p className="text-[10px] font-bold text-red-650 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {errors.model}</p>}
                </div>

                {/* Driver input */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Assigned Driver</label>
                  <input
                    type="text"
                    placeholder="Marcus Vance"
                    value={driver}
                    onChange={(e) => setDriver(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] transition-colors"
                  />
                  {errors.driver && <p className="text-[10px] font-bold text-red-650 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {errors.driver}</p>}
                </div>

                {/* Two Column details: Fuel & Speed */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Fuel level (%)</label>
                    <input
                      type="number"
                      placeholder="80"
                      value={fuel}
                      onChange={(e) => setFuel(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] transition-colors"
                    />
                    {errors.fuel && <p className="text-[10px] font-bold text-red-650 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {errors.fuel}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Current Speed (km/h)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={speed}
                      onChange={(e) => setSpeed(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] transition-colors"
                    />
                    {errors.speed && <p className="text-[10px] font-bold text-red-650 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {errors.speed}</p>}
                  </div>
                </div>

                {/* Location input */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Current GPS Terminal</label>
                  <input
                    type="text"
                    placeholder="St. Louis, MO"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] transition-colors"
                  />
                  {errors.location && <p className="text-[10px] font-bold text-red-650 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {errors.location}</p>}
                </div>

                {/* Status selection */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Asset Status</label>
                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] transition-colors appearance-none cursor-pointer"
                    >
                      <option value="On Duty">On Duty (In Transit)</option>
                      <option value="Idle">Idle (Ready for Dispatch)</option>
                      <option value="Maintenance">Maintenance (At Workshop)</option>
                    </select>
                  </div>
                </div>

              </form>

              {/* Drawer Footer Actions */}
              <div className="border-t border-slate-100 pt-5 flex items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-[#E5E7EB] text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddVehicle}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-xs font-bold text-white shadow-md shadow-blue-500/10 transition-all active:scale-[0.98]"
                >
                  Register Vehicle
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
