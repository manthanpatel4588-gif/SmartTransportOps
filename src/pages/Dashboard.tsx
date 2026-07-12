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
  Droplet,
  Menu,
  X,
  DollarSign
} from 'lucide-react';
import Logo from '../components/Logo';
import TripManagement from '../components/TripManagement';
import MaintenanceManagement from '../components/MaintenanceManagement';
import FuelManagement from '../components/FuelManagement';
import ActiveFleets from '../components/ActiveFleets';
import LiveTracking from '../components/LiveTracking';
import SystemSettings from '../components/SystemSettings';
import DriverManagement from '../components/DriverManagement';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
              { name: 'Reports & Analytics', icon: TrendingUp },
              { name: 'Drivers', icon: Users },
              { name: 'Notifications', icon: Bell, badge: '12' },
              { name: 'System Settings', icon: Settings }
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === item.name
                    ? 'bg-brand-blue-600 text-white shadow-lg shadow-brand-blue-600/10'
                    : 'text-slate-400 hover:text-white hover:bg-brand-navy-900'
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
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative bg-[#f8fafc] text-slate-800">
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Main Content Header */}
        <header className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">Operations Hub</h1>
              <p className="text-xs text-slate-400 hidden sm:block">Real-time status updates and telemetry feeds</p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative hidden lg:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search fleets, routes, drivers..."
                className="w-64 pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-blue-500 transition-colors"
              />
            </div>

            {/* Notification Bell */}
            <button className="relative p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-350 hover:shadow-xs transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-blue-400"></span>
            </button>

            {/* Mobile Logout (visible on mobile only) */}
            <button
              onClick={handleLogout}
              className="md:hidden p-2.5 rounded-xl bg-white border border-slate-200 text-red-500 hover:bg-red-50 transition-all"
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
          ) : activeTab === 'Active Fleets' ? (
            <ActiveFleets />
          ) : activeTab === 'Live Tracking' ? (
            <LiveTracking />
          ) : activeTab === 'Drivers' ? (
            <DriverManagement />
          ) : activeTab === 'Reports & Analytics' ? (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
              <TrendingUp className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="font-display font-bold text-lg text-slate-800">Operational Report Hub</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">Full visual fleet analytics, fuel efficiency quotients, and route optimization report metrics. To view consolidated charts, check the Overview tab dashboard.</p>
            </div>
          ) : activeTab === 'Notifications' ? (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-display font-bold text-lg text-slate-800">Control Center Inbox</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-blue-50 text-brand-blue-600 border border-brand-blue-100">12 Unread Alerts</span>
              </div>
              <div className="space-y-3.5">
                {[
                  { text: 'Urgent Weather Warning: Heavy rainfall in Midwest Region (ORD1). Redirection active.', type: 'warning' },
                  { text: 'Operator Elena Rostova license warning: Expiry date 2027-05-20.', type: 'info' },
                  { text: 'Vehicle TRK-9801 has completed dispatch leg: Chicago Hub.', type: 'success' },
                  { text: 'Maintenance Schedule Request: Volvo FH16 requires service interval.', type: 'info' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/85 text-xs font-medium text-slate-700">
                    <span className={`w-2 h-2 rounded-full mt-1 ${
                      item.type === 'warning' ? 'bg-amber-500' :
                      item.type === 'success' ? 'bg-emerald-500' : 'bg-brand-blue-500'
                    }`}></span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'System Settings' ? (
            <SystemSettings />
          ) : (
            <>
              {/* Live Alert banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 shadow-sm">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Weather Alert: Midwest Region (ORD1)</p>
                    <p className="text-xs text-slate-500 mt-0.5">Heavy rainfall expected. Fleet operators are advised to enable route redirection for high-priority shipments.</p>
                  </div>
                </div>
                <button className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold self-start sm:self-center transition-colors">
                  Manage Re-Routing
                </button>
              </div>

              {/* Summary Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
                {[
                  { title: 'Active Vehicles', value: '1,248', desc: 'Active in transit', icon: Truck, trend: '+4.2%', up: true },
                  { title: 'Available Vehicles', value: '482', desc: 'Ready for dispatch', icon: CheckCircle, trend: '+1.8%', up: true },
                  { title: 'In Maintenance', value: '112', desc: 'At garage facility', icon: Wrench, trend: '-0.5%', up: false },
                  { title: 'Active Trips', value: '956', desc: 'Active route legs', icon: Navigation, trend: '+12.4%', up: true },
                  { title: 'Drivers On Duty', value: '1,180', desc: '82% total workforce', icon: Users, trend: '+2.3%', up: true },
                  { title: 'Fleet Utilization', value: '87.6%', desc: 'Target optimal: 85%', icon: TrendingUp, trend: '+3.4%', up: true }
                ].map((stat, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 relative overflow-hidden group hover:border-brand-blue-500 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 rounded-xl bg-slate-50 text-brand-blue-500 group-hover:bg-brand-blue-600 group-hover:text-white transition-colors duration-300">
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {stat.up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                        {stat.trend}
                      </span>
                    </div>
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 leading-tight truncate">{stat.title}</h3>
                    <p className="text-2xl font-display font-extrabold text-slate-900 mb-1">{stat.value}</p>
                    <p className="text-[10px] text-slate-400 truncate leading-none">{stat.desc}</p>
                  </div>
                ))}
              </div>

              {/* Large Analytics Visualization & Recent Dispatches Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left/Middle Column (Feeds + Quick Actions) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Real-Time Dispatch Feeds */}
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="font-display text-lg font-bold text-slate-900">Real-Time Dispatch Feeds</h2>
                        <p className="text-xs text-slate-400">Current tracking list for dispatch terminals</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 hover:text-slate-900 hover:border-slate-350 transition-all">
                          <Filter className="w-3.5 h-3.5" />
                          <span>Filter</span>
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/40">
                            <th className="pb-3 pr-4">Truck ID</th>
                            <th className="pb-3 pr-4">Driver</th>
                            <th className="pb-3 pr-4">Destination</th>
                            <th className="pb-3 pr-4">Route Status</th>
                            <th className="pb-3 pr-4">ETA</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                          {dispatches.map((dispatch) => (
                            <tr key={dispatch.id} className="group hover:bg-slate-50/50 transition-colors">
                              <td className="py-3.5 font-mono font-bold text-brand-blue-600 hover:underline cursor-pointer pr-4">{dispatch.id}</td>
                              <td className="py-3.5 text-slate-800 font-semibold pr-4">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(dispatch.driver)}&background=f0f7ff&color=0284c7&bold=true&rounded=true&size=32`}
                                    alt={dispatch.driver}
                                    className="w-7 h-7 rounded-full object-cover"
                                  />
                                  <span>{dispatch.driver}</span>
                                </div>
                              </td>
                              <td className="py-3.5 text-slate-600 pr-4">{dispatch.destination}</td>
                              <td className="py-3.5 pr-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                  dispatch.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                  dispatch.status === 'Delayed' ? 'bg-red-50 text-red-600 border border-red-100' :
                                  dispatch.status === 'Out for Delivery' ? 'bg-cyan-50 text-cyan-600 border border-cyan-100' :
                                  'bg-blue-50 text-blue-600 border border-blue-100'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    dispatch.status === 'Completed' ? 'bg-emerald-500' :
                                    dispatch.status === 'Delayed' ? 'bg-red-500' :
                                    dispatch.status === 'Out for Delivery' ? 'bg-cyan-500' :
                                    'bg-blue-500'
                                  }`}></span>
                                  {dispatch.status}
                                </span>
                              </td>
                              <td className="py-3.5 text-slate-400 font-medium pr-4">{dispatch.ETA}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Quick Actions Panel */}
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
                    <h3 className="font-display text-sm font-bold text-slate-800">Quick Actions</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      {[
                        { name: 'New Trip', desc: 'Create a new trip', icon: Compass, tab: 'Trip Management', color: 'text-brand-blue-500 bg-brand-blue-50' },
                        { name: 'Schedule Maintenance', desc: 'Add maintenance task', icon: Wrench, tab: 'Maintenance', color: 'text-purple-500 bg-purple-50' },
                        { name: 'Add Fuel Log', desc: 'Record fuel entry', icon: Droplet, tab: 'Fuel Management', color: 'text-cyan-500 bg-cyan-50' },
                        { name: 'Add Expense', desc: 'Record other expense', icon: DollarSign, tab: 'System Settings', color: 'text-amber-500 bg-amber-50' },
                        { name: 'View Reports', desc: 'Analytics & insights', icon: TrendingUp, tab: 'Overview', color: 'text-indigo-500 bg-indigo-50' }
                      ].map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveTab(action.tab)}
                          className="flex flex-col items-start p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-350 hover:shadow-xs text-left transition-all group"
                        >
                          <div className={`p-2 rounded-lg ${action.color} mb-3 group-hover:scale-105 transition-transform`}>
                            <action.icon className="w-4 h-4" />
                          </div>
                          <p className="text-xs font-bold text-slate-800 leading-tight">{action.name}</p>
                          <p className="text-[10px] text-slate-400 mt-1 leading-none">{action.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column (Map + Utilization line chart) */}
                <div className="space-y-6">
                  {/* Network Routing Map Card */}
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col h-[340px] shadow-sm">
                    <div>
                      <h2 className="font-display text-base font-bold text-slate-900">Network Routing Map</h2>
                      <p className="text-xs text-slate-400">Live visual feed of logistics grid</p>
                    </div>

                    <div className="relative flex-1 my-4 rounded-xl border border-slate-200 bg-slate-900 overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:1.25rem_1.25rem] opacity-20"></div>
                      
                      <svg className="w-full h-full absolute inset-0 opacity-40">
                        <path d="M50 80 Q 150 120 220 70 T 320 180" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 4" />
                        <path d="M100 200 Q 200 110 300 120" fill="none" stroke="#f59e0b" strokeWidth="2" />
                      </svg>

                      <span className="absolute left-[50px] top-[80px] flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-blue-500"></span>
                      </span>
                      <span className="absolute left-[220px] top-[70px] flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-blue-500"></span>
                      </span>
                      <span className="absolute left-[300px] top-[120px] flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-450 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>

                      <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-slate-900/90 border border-slate-800 backdrop-blur-md flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-slate-300">Interactive Feed Active</span>
                        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          ONLINE
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-3">
                      <span>Refreshed: Just Now</span>
                      <span className="text-brand-blue-600 cursor-pointer hover:underline">Re-center Map</span>
                    </div>
                  </div>

                  {/* Fleet Utilization Overview */}
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-display text-sm font-bold text-slate-800">Fleet Utilization Overview</h3>
                        <p className="text-[10px] text-slate-400">Live utilization trend for this week</p>
                      </div>
                      <div className="relative">
                        <select className="px-2.5 py-1 rounded-lg border border-slate-250 bg-white text-[10px] font-semibold text-slate-600 focus:outline-none">
                          <option>This Week</option>
                          <option>Last Week</option>
                        </select>
                      </div>
                    </div>

                    {/* SVG Line Chart */}
                    <div className="relative pt-4 flex justify-center items-center">
                      <svg viewBox="0 0 500 220" className="w-full h-auto">
                        <defs>
                          <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.00" />
                          </linearGradient>
                        </defs>

                        {/* Grid lines */}
                        <line x1="40" y1="30" x2="480" y2="30" stroke="#f1f5f9" strokeWidth="1.5" />
                        <line x1="40" y1="72" x2="480" y2="72" stroke="#f1f5f9" strokeWidth="1.5" />
                        <line x1="40" y1="114" x2="480" y2="114" stroke="#f1f5f9" strokeWidth="1.5" />
                        <line x1="40" y1="156" x2="480" y2="156" stroke="#f1f5f9" strokeWidth="1.5" />
                        <line x1="40" y1="198" x2="480" y2="198" stroke="#f1f5f9" strokeWidth="1.5" />

                        {/* Y Axis Labels */}
                        <text x="30" y="34" className="text-[10px] font-mono font-bold text-slate-400" textAnchor="end">100%</text>
                        <text x="30" y="76" className="text-[10px] font-mono font-bold text-slate-400" textAnchor="end">75%</text>
                        <text x="30" y="118" className="text-[10px] font-mono font-bold text-slate-400" textAnchor="end">50%</text>
                        <text x="30" y="160" className="text-[10px] font-mono font-bold text-slate-400" textAnchor="end">25%</text>
                        <text x="30" y="202" className="text-[10px] font-mono font-bold text-slate-400" textAnchor="end">0%</text>

                        {/* Area gradient under line */}
                        <path
                          d="M 50 198 L 50 130 C 85 110, 85 100, 120 100 C 155 100, 155 115, 190 115 C 225 115, 225 100, 260 100 C 295 100, 295 125, 330 125 C 365 125, 365 110, 400 110 C 435 110, 435 60, 470 60 L 470 198 Z"
                          fill="url(#chart-grad)"
                        />

                        {/* Smooth line */}
                        <path
                          d="M 50 130 C 85 110, 85 100, 120 100 C 155 100, 155 115, 190 115 C 225 115, 225 100, 260 100 C 295 100, 295 125, 330 125 C 365 125, 365 110, 400 110 C 435 110, 435 60, 470 60"
                          fill="none"
                          stroke="#6366f1"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />

                        {/* Data points */}
                        <circle cx="50" cy="130" r="4" fill="#ffffff" stroke="#6366f1" strokeWidth="2.5" />
                        <circle cx="120" cy="100" r="4" fill="#ffffff" stroke="#6366f1" strokeWidth="2.5" />
                        <circle cx="190" cy="115" r="4" fill="#ffffff" stroke="#6366f1" strokeWidth="2.5" />
                        <circle cx="260" cy="100" r="4" fill="#ffffff" stroke="#6366f1" strokeWidth="2.5" />
                        <circle cx="330" cy="125" r="4" fill="#ffffff" stroke="#6366f1" strokeWidth="2.5" />
                        <circle cx="400" cy="110" r="4" fill="#ffffff" stroke="#6366f1" strokeWidth="2.5" />
                        <circle cx="470" cy="60" r="5" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />

                        {/* X Axis Labels */}
                        <text x="50" y="216" className="text-[10px] font-semibold text-slate-400" textAnchor="middle">Mon</text>
                        <text x="120" y="216" className="text-[10px] font-semibold text-slate-400" textAnchor="middle">Tue</text>
                        <text x="190" y="216" className="text-[10px] font-semibold text-slate-400" textAnchor="middle">Wed</text>
                        <text x="260" y="216" className="text-[10px] font-semibold text-slate-400" textAnchor="middle">Thu</text>
                        <text x="330" y="216" className="text-[10px] font-semibold text-slate-400" textAnchor="middle">Fri</text>
                        <text x="400" y="216" className="text-[10px] font-semibold text-slate-400" textAnchor="middle">Sat</text>
                        <text x="470" y="216" className="text-[10px] font-semibold text-slate-400" textAnchor="middle">Sun</text>

                        {/* Peak Value Badge on Sunday */}
                        <g transform="translate(440, 15)">
                          <rect width="42" height="18" rx="5" fill="#6366f1" />
                          <text x="21" y="12" className="text-[9px] font-mono font-bold fill-white" textAnchor="middle">87.6%</text>
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-brand-navy-950/95 z-40 flex flex-col p-6 md:hidden animate-fadeIn">
          <div className="flex items-center justify-between border-b border-brand-navy-900 pb-5 mb-6">
            <Logo iconSize={26} textSize="text-lg" />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-brand-navy-900 border border-brand-navy-800 text-brand-navy-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex-1 space-y-2 overflow-y-auto">
            {[
              { name: 'Overview', icon: LayoutDashboard },
              { name: 'Trip Management', icon: Compass },
              { name: 'Maintenance', icon: Wrench },
              { name: 'Fuel Management', icon: Droplet },
              { name: 'Active Fleets', icon: Truck, badge: '1,842' },
              { name: 'Live Tracking', icon: Navigation },
              { name: 'Reports & Analytics', icon: TrendingUp },
              { name: 'Drivers', icon: Users },
              { name: 'Notifications', icon: Bell, badge: '12' },
              { name: 'System Settings', icon: Settings }
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === item.name
                    ? 'bg-brand-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-brand-navy-900'
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

          <div className="border-t border-brand-navy-900 pt-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Operator Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
