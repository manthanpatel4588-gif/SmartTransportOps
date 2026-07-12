import { useState, useEffect } from 'react';
import {
  Truck,
  Search,
  Users,
  Compass,
  Gauge,
  Loader2
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
  const [vehicles] = useState<FleetVehicle[]>(INITIAL_FLEET);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">Active Fleets</h2>
        <p className="text-xs text-slate-500">Monitor active transportation vehicles, fuel stats, and speeds</p>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search fleets by vehicle, driver, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-blue-500 transition-colors"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-250 self-start lg:self-center">
          {['All', 'On Duty', 'Idle', 'Maintenance'].map((tab) => (
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

      {/* Loading State Overlay */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-20 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <Loader2 className="w-8 h-8 text-brand-blue-600 animate-spin mb-3" />
          <p className="text-xs text-slate-500">Loading updated telemetry feeds...</p>
        </div>
      ) : filteredVehicles.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-16 rounded-2xl bg-white border border-slate-200 border-dashed text-center">
          <div className="p-3.5 rounded-full bg-slate-50 border border-slate-100 text-slate-400 mb-4">
            <Truck className="w-8 h-8" />
          </div>
          <h3 className="font-display font-semibold text-lg text-slate-800">No vehicles found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            No active fleet vehicles match your query. Try resetting your filters.
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
                    <th className="p-4 pl-6">Vehicle ID</th>
                    <th className="p-4">Model & Driver</th>
                    <th className="p-4">Current Location</th>
                    <th className="p-4">Speed</th>
                    <th className="p-4">Fuel Level</th>
                    <th className="p-4 pr-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredVehicles.map((v) => (
                    <tr key={v.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6 font-mono font-bold text-brand-blue-600">{v.id}</td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <div className="text-slate-900 font-semibold">{v.model}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span>{v.driver}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Compass className="w-3.5 h-3.5 text-slate-400" />
                          <span>{v.location}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-slate-800 font-medium">
                          <Gauge className="w-3.5 h-3.5 text-slate-400" />
                          <span>{v.speed} km/h</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                v.fuel > 50 ? 'bg-emerald-500' : v.fuel > 20 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${v.fuel}%` }}
                            ></div>
                          </div>
                          <span className="font-mono text-xs font-semibold text-slate-500">{v.fuel}%</span>
                        </div>
                      </td>
                      <td className="p-4 pr-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          v.status === 'On Duty' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          v.status === 'Idle' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                          'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            v.status === 'On Duty' ? 'bg-emerald-500' :
                            v.status === 'Idle' ? 'bg-blue-500' :
                            'bg-amber-500'
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

          {/* Mobile Grid View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredVehicles.map((v) => (
              <div key={v.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div className="font-mono text-sm font-bold text-brand-blue-600">{v.id}</div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    v.status === 'On Duty' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    v.status === 'Idle' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                    'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {v.status}
                  </span>
                </div>

                <div className="space-y-1.5 border-y border-slate-100 py-3 text-sm">
                  <div className="text-slate-800 font-bold">{v.model}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Driver: {v.driver}</span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-slate-400" />
                    <span>Loc: {v.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-slate-450 uppercase tracking-wider text-[10px] mb-1">Current Speed</p>
                    <p className="text-slate-800 font-bold">{v.speed} km/h</p>
                  </div>
                  <div>
                    <p className="text-slate-450 uppercase tracking-wider text-[10px] mb-1">Fuel Capacity</p>
                    <p className="text-slate-800 font-bold font-mono">{v.fuel}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
