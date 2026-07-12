import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  LayoutDashboard,
  Truck,
  Navigation,
  Settings,
  AlertTriangle,
  TrendingUp,
  Compass,
  Bell,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Wrench,
  Users,
  CheckCircle,
  Droplet
} from 'lucide-react';
import Logo from '../components/Logo';
import TripManagement from '../components/TripManagement';
import MaintenanceManagement from '../components/MaintenanceManagement';
import FuelManagement from '../components/FuelManagement';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');

  const dispatches = [
    { id: 'TRK-9801', driver: 'Marcus Vance', destination: 'Chicago Hub (ORD1)', status: 'In Transit', ETA: '14:45', progress: 65, alert: false },
    { id: 'TRK-4421', driver: 'Elena Rostova', destination: 'Los Angeles Depot (LAX4)', status: 'Completed', ETA: 'Delivered', progress: 100, alert: false },
    { id: 'TRK-1092', driver: 'Sarah Jenkins', destination: 'Houston Terminal (IAH2)', status: 'Delayed', ETA: '18:15', progress: 40, alert: true },
    { id: 'TRK-8843', driver: 'Rajesh Patel', destination: 'New York Port (JFK8)', status: 'Out for Delivery', ETA: '11:30', progress: 90, alert: false },
    { id: 'TRK-3021', driver: 'Carlos Gomez', destination: 'Miami Logistics (MIA3)', status: 'In Transit', ETA: '16:10', progress: 75, alert: false }
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-full bg-brand-navy-950 text-white font-sans overflow-hidden">
      {/* 1. Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 border-r border-brand-navy-800 bg-brand-navy-950/80 backdrop-blur-md p-6 justify-between flex-shrink-0 z-20">
        <div className="space-y-8">
          <Logo iconSize={26} textSize="text-lg" />

          {/* Nav links */}
          <nav className="space-y-1.5">
            {[
              { name: 'Overview', icon: LayoutDashboard },
              { name: 'Trip Management', icon: Compass },
              { name: 'Maintenance', icon: Wrench },
              { name: 'Fuel Management', icon: Droplet },
              { name: 'Active Fleets', icon: Truck, badge: '1,842' },
              { name: 'Live Tracking', icon: Navigation },
              { name: 'System Settings', icon: Settings }
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === item.name
                    ? 'bg-brand-blue-600 text-white shadow-lg shadow-brand-blue-600/10'
                    : 'text-brand-navy-400 hover:text-white hover:bg-brand-navy-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeTab === item.name ? 'bg-white/20 text-white' : 'bg-brand-navy-800 text-brand-blue-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="border-t border-brand-navy-900 pt-6 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue-600 to-brand-blue-400 flex items-center justify-center font-display font-bold text-white shadow-md">
              OP
            </div>
            <div>
              <p className="text-sm font-bold text-white">Operator #402</p>
              <p className="text-xs text-brand-navy-400">Control Center 2</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Operator Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Dashboard Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Dashboard Top Header */}
        <header className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-brand-navy-900 bg-brand-navy-950/40 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {/* Mobile menu logo placeholder */}
            <div className="md:hidden">
              <Logo showText={false} iconSize={24} />
            </div>
            <div>
              <h1 className="font-display text-xl md:text-2xl font-extrabold tracking-tight">Operations Hub</h1>
              <p className="text-xs text-brand-navy-400 hidden sm:block">Real-time status updates and telemetry feeds</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search bar */}
            <div className="relative hidden lg:block">
              <Search className="w-4 h-4 text-brand-navy-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search fleets, routes, drivers..."
                className="w-64 pl-9 pr-4 py-2 rounded-xl bg-brand-navy-900 border border-brand-navy-800 text-sm text-white placeholder-brand-navy-500 focus:outline-none focus:border-brand-blue-500 transition-colors"
              />
            </div>

            {/* Notification Bell */}
            <button className="relative p-2.5 rounded-xl bg-brand-navy-900 border border-brand-navy-800 text-brand-navy-300 hover:text-white hover:border-brand-navy-700 transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-blue-400"></span>
            </button>

            {/* Mobile Logout (visible on mobile only) */}
            <button
              onClick={handleLogout}
              className="md:hidden p-2.5 rounded-xl bg-brand-navy-900 border border-brand-navy-800 text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dashboard Grid Content */}
        <div className="flex-1 p-6 md:p-8 space-y-6">
          {activeTab === 'Trip Management' ? (
            <TripManagement />
          ) : activeTab === 'Maintenance' ? (
            <MaintenanceManagement />
          ) : activeTab === 'Fuel Management' ? (
            <FuelManagement />
          ) : (
            <>
              {/* Live Alert banner if any */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-brand-accent-amber-500">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-white">Weather Alert: Midwest Region (ORD1)</p>
                    <p className="text-xs text-brand-navy-400 mt-0.5">Heavy rainfall expected. Fleet operators are advised to enable route redirection for high-priority shipments.</p>
                  </div>
                </div>
                <button className="px-4 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-white text-xs font-semibold self-start sm:self-center transition-colors">
                  Manage Re-Routing
                </button>
              </div>

              {/* 3. Summary Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
                {[
                  { title: 'Active Vehicles', value: '1,248', desc: 'Active in transit', icon: Truck, trend: '+4.2%', up: true },
                  { title: 'Available Vehicles', value: '482', desc: 'Ready for dispatch', icon: CheckCircle, trend: '+1.8%', up: true },
                  { title: 'In Maintenance', value: '112', desc: 'At garage facility', icon: Wrench, trend: '-0.5%', up: false },
                  { title: 'Active Trips', value: '956', desc: 'Active route legs', icon: Navigation, trend: '+12.4%', up: true },
                  { title: 'Drivers On Duty', value: '1,180', desc: '82% total workforce', icon: Users, trend: '+2.3%', up: true },
                  { title: 'Fleet Utilization', value: '87.6%', desc: 'Target optimal: 85%', icon: TrendingUp, trend: '+3.4%', up: true }
                ].map((stat, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-brand-navy-900/60 border border-brand-navy-800 backdrop-blur-sm relative overflow-hidden group hover:border-brand-navy-700 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 rounded-xl bg-brand-navy-850 text-brand-blue-400 group-hover:bg-brand-blue-600 group-hover:text-white transition-colors duration-300">
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        stat.up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {stat.up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                        {stat.trend}
                      </span>
                    </div>
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-brand-navy-400 mb-1 leading-tight truncate">{stat.title}</h3>
                    <p className="text-2xl font-display font-extrabold text-white mb-1">{stat.value}</p>
                    <p className="text-[10px] text-brand-navy-500 truncate leading-none">{stat.desc}</p>
                  </div>
                ))}
              </div>

              {/* 4. Large Analytics Visualization & Recent Dispatches Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left/Middle: Dispatch Center (Table) */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-brand-navy-900/60 border border-brand-navy-800 backdrop-blur-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display text-lg font-bold">Real-Time Dispatch Feeds</h2>
                      <p className="text-xs text-brand-navy-400">Current tracking list for dispatch terminals</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-navy-850 border border-brand-navy-800 text-xs text-brand-navy-300 hover:text-white hover:border-brand-navy-700 transition-all">
                        <Filter className="w-3.5 h-3.5" />
                        <span>Filter</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-brand-navy-800 text-xs font-bold uppercase tracking-wider text-brand-navy-400">
                          <th className="pb-3 pr-4">Truck ID</th>
                          <th className="pb-3 pr-4">Driver</th>
                          <th className="pb-3 pr-4">Destination</th>
                          <th className="pb-3 pr-4">Route Status</th>
                          <th className="pb-3 pr-4">ETA</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-navy-900 text-sm">
                        {dispatches.map((dispatch) => (
                          <tr key={dispatch.id} className="group hover:bg-brand-navy-900/40 transition-colors">
                            <td className="py-3.5 font-mono font-bold text-brand-blue-400 pr-4">{dispatch.id}</td>
                            <td className="py-3.5 text-white font-semibold pr-4">{dispatch.driver}</td>
                            <td className="py-3.5 text-brand-navy-300 pr-4">{dispatch.destination}</td>
                            <td className="py-3.5 pr-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                dispatch.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                dispatch.status === 'Delayed' ? 'bg-red-500/10 text-red-400' :
                                dispatch.status === 'Out for Delivery' ? 'bg-cyan-500/10 text-cyan-400' :
                                'bg-brand-blue-500/10 text-brand-blue-400'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  dispatch.status === 'Completed' ? 'bg-emerald-400' :
                                  dispatch.status === 'Delayed' ? 'bg-red-400' :
                                  dispatch.status === 'Out for Delivery' ? 'bg-cyan-400' :
                                  'bg-brand-blue-400'
                                }`}></span>
                                {dispatch.status}
                              </span>
                            </td>
                            <td className="py-3.5 text-brand-navy-400 pr-4">{dispatch.ETA}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right: Map Telemetry Placeholder */}
                <div className="p-6 rounded-2xl bg-brand-navy-900/60 border border-brand-navy-800 backdrop-blur-sm flex flex-col justify-between h-[360px] lg:h-auto">
                  <div>
                    <h2 className="font-display text-lg font-bold">Network Routing Map</h2>
                    <p className="text-xs text-brand-navy-400">Live visual feed of logistics grid</p>
                  </div>

                  {/* Map Graphic Mock */}
                  <div className="relative flex-1 my-4 rounded-xl border border-brand-navy-800 bg-brand-navy-950 overflow-hidden flex items-center justify-center">
                    {/* Visual grid layout simulating map telemetry */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-30"></div>
                    
                    {/* Node paths SVG */}
                    <svg className="w-full h-full absolute inset-0 opacity-40">
                      <path d="M50 80 Q 150 120 220 70 T 320 180" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 4" />
                      <path d="M100 200 Q 200 110 300 120" fill="none" stroke="#f59e0b" strokeWidth="2" />
                    </svg>

                    {/* Blinking Nodes */}
                    <span className="absolute left-[50px] top-[80px] flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-blue-500"></span>
                    </span>
                    <span className="absolute left-[220px] top-[70px] flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-blue-500"></span>
                    </span>
                    <span className="absolute left-[300px] top-[120px] flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>

                    <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-brand-navy-900/90 border border-brand-navy-800 backdrop-blur-md flex items-center justify-between text-xs">
                      <span className="font-semibold">Interactive Feed Active</span>
                      <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        ONLINE
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-brand-navy-400 border-t border-brand-navy-900 pt-4">
                    <span>Refreshed: Just Now</span>
                    <span className="text-brand-blue-400 cursor-pointer hover:underline">Re-center Map</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
