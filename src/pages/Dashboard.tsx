import { useState, useEffect } from 'react';
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
  DollarSign,
  List,
  MapPin
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

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

  // Animated KPI Counters State
  const [kpis, setKpis] = useState({
    activeVehicles: 0,
    availableVehicles: 0,
    inMaintenance: 0,
    activeTrips: 0,
    driversOnDuty: 0,
    utilization: 0
  });

  useEffect(() => {
    // Staggered KPI Count-up animation on mount
    const duration = 800;
    const steps = 30;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setKpis({
        activeVehicles: Math.min(Math.round((1248 / steps) * step), 1248),
        availableVehicles: Math.min(Math.round((482 / steps) * step), 482),
        inMaintenance: Math.min(Math.round((112 / steps) * step), 112),
        activeTrips: Math.min(Math.round((956 / steps) * step), 956),
        driversOnDuty: Math.min(Math.round((1180 / steps) * step), 1180),
        utilization: parseFloat(Math.min((87.6 / steps) * step, 87.6).toFixed(1))
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const dispatches = [
    { id: 'TRK-9801', driver: 'Marcus Vance', destination: 'Chicago Hub (ORD1)', status: 'In Transit', ETA: '14:45' },
    { id: 'TRK-4421', driver: 'Elena Rostova', destination: 'Los Angeles Depot (LAX4)', status: 'Completed', ETA: 'Delivered' },
    { id: 'TRK-1092', driver: 'Sarah Connor', destination: 'Houston Terminal (IAH2)', status: 'In Transit', ETA: '18:15' },
    { id: 'TRK-8843', driver: 'Rajesh Patel', destination: 'New York Port (JFK8)', status: 'Out for Delivery', ETA: '11:30' },
    { id: 'TRK-3021', driver: 'Carlos Gomez', destination: 'Miami Logistics (MIA3)', status: 'In Transit', ETA: '16:10' }
  ];

  const utilizationData = [
    { name: 'Mon', Utilization: 70 },
    { name: 'Tue', Utilization: 80 },
    { name: 'Wed', Utilization: 78 },
    { name: 'Thu', Utilization: 82 },
    { name: 'Fri', Utilization: 72 },
    { name: 'Sat', Utilization: 80 },
    { name: 'Sun', Utilization: 87.6 }
  ];

  const fleetCostData = [
    { name: 'Volvo FH16', Fuel: 900, Maintenance: 1250 },
    { name: 'Mack Anthem', Fuel: 1200, Maintenance: 850 },
    { name: 'Peterbilt 579', Fuel: 760, Maintenance: 400 },
    { name: 'Cascadia', Fuel: 1050, Maintenance: 1550 },
    { name: 'Scania R730', Fuel: 840, Maintenance: 320 }
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-full bg-[#F5F7FA] text-slate-800 font-sans overflow-hidden relative">
      
      {/* Soft blurred logistics background representation */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.05] filter blur-[6px] pointer-events-none"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1200')` }}
      ></div>

      {/* Decorative colored glow blobs for glassmorphism highlights */}
      <div className="absolute top-[10%] left-[20%] w-[350px] h-[350px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-indigo-400/8 rounded-full blur-[120px] pointer-events-none"></div>

      {/* 1. Left Sidebar - Fixed & Professional Navy Theme */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[#E5E7EB] bg-[#0F172A] p-6 justify-between flex-shrink-0 z-20">
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
              { name: 'Drivers', icon: Users },
              { name: 'Notifications', icon: Bell, badge: '12' },
              { name: 'System Settings', icon: Settings }
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                  activeTab === item.name
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeTab === item.name ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="border-t border-slate-800 pt-6 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2563EB] to-blue-500 flex items-center justify-center font-display font-bold text-white shadow-xs">
              OP
            </div>
            <div>
              <p className="text-sm font-bold text-white">Operator #402</p>
              <p className="text-xs text-slate-400">Control Center 2</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all duration-150"
          >
            <LogOut className="w-4 h-4" />
            <span>Operator Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main content container */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative bg-transparent z-10">
        
        {/* Minimal Navbar */}
        <header className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-[#E5E7EB] bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-xl font-extrabold tracking-tight text-slate-900">{activeTab}</h1>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative hidden lg:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search fleets, routes, drivers..."
                className="w-60 pl-10 pr-4 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563EB] transition-colors"
              />
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
            </button>

            {/* Mobile Logout */}
            <button
              onClick={handleLogout}
              className="md:hidden p-2 rounded-lg bg-white border border-slate-200 text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dashboard Grid Content - 24px-32px margins and spacing */}
        <div className="flex-1 p-6 md:p-8 space-y-8 animate-fadeIn">
          
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
          ) : activeTab === 'Notifications' ? (
            <div className="p-8 rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 space-y-6 shadow-sm animate-slide-up-fade">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-display font-bold text-lg text-slate-800">Control Center Inbox</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">12 Unread Alerts</span>
              </div>
              <div className="space-y-4">
                {[
                  { text: 'Urgent Weather Warning: Heavy rainfall in Midwest Region (ORD1). Redirection active.', type: 'warning' },
                  { text: 'Operator Elena Rostova license warning: Expiry date 2027-05-20.', type: 'info' },
                  { text: 'Vehicle TRK-9801 has completed dispatch leg: Chicago Hub.', type: 'success' },
                  { text: 'Maintenance Schedule Request: Volvo FH16 requires service interval.', type: 'info' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 p-4 rounded-xl bg-white/50 border border-slate-200 text-xs font-medium text-slate-700 hover:scale-[1.01] transition-transform duration-200">
                    <span className={`w-2 h-2 rounded-full mt-1 ${
                      item.type === 'warning' ? 'bg-[#F59E0B]' :
                      item.type === 'success' ? 'bg-[#22C55E]' : 'bg-[#2563EB]'
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
              {/* Hero Banner Section with subtle blurred background truck image */}
              <div className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/70 backdrop-blur-md p-6 md:p-8 shadow-xs animate-slide-up-fade [animation-delay:0ms]">
                {/* Truck background with 6% opacity & blur */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.06] filter blur-[1px]"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1200')` }}
                ></div>
                
                <div className="relative z-10 space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                    System Telemetry Online
                  </span>
                  <h2 className="font-display text-2xl font-extrabold text-[#0F172A]">Enterprise Logistics Console</h2>
                  <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
                    Real-time logistical monitoring, operator dispatch workflows, and fleet maintenance telemetry dashboard. Orchestrate routes, inspect payloads, and log expenses seamlessly.
                  </p>
                </div>
              </div>

              {/* Weather Alert banner - separated appropriately */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-amber-50/80 backdrop-blur-md border border-amber-200 text-amber-700 shadow-xs animate-slide-up-fade [animation-delay:50ms]">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Weather Alert: Midwest Region (ORD1)</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Heavy rainfall expected. Fleet operators are advised to enable route redirection for high-priority shipments.</p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-xl bg-amber-650 hover:bg-amber-700 text-white text-xs font-semibold self-start sm:self-center transition-all duration-200 active:scale-[0.98] shadow-xs">
                  Manage Re-Routing
                </button>
              </div>

              {/* Summary Metric Cards - Equal height (items-stretch) & Staggered slide entrance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 items-stretch">
                {[
                  { title: 'Active Vehicles', value: kpis.activeVehicles.toLocaleString(), desc: 'Active in transit', icon: Truck, trend: '+4.2%', up: true },
                  { title: 'Available Vehicles', value: kpis.availableVehicles.toLocaleString(), desc: 'Ready for dispatch', icon: CheckCircle, trend: '+1.8%', up: true },
                  { title: 'In Maintenance', value: kpis.inMaintenance.toLocaleString(), desc: 'At garage facility', icon: Wrench, trend: '-0.5%', up: false },
                  { title: 'Active Trips', value: kpis.activeTrips.toLocaleString(), desc: 'Active route legs', icon: Navigation, trend: '+12.4%', up: true },
                  { title: 'Drivers On Duty', value: kpis.driversOnDuty.toLocaleString(), desc: '82% total workforce', icon: Users, trend: '+2.3%', up: true },
                  { title: 'Fleet Utilization', value: `${kpis.utilization}%`, desc: 'Target optimal: 85%', icon: TrendingUp, trend: '+3.4%', up: true }
                ].map((stat, idx) => (
                  <div 
                    key={idx} 
                    className="p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 relative overflow-hidden group hover:scale-[1.02] hover:shadow-md hover:border-[#2563EB] transition-all duration-300 shadow-xs flex flex-col justify-between items-stretch animate-slide-up-fade"
                    style={{ animationDelay: `${100 + idx * 50}ms` }}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-xl bg-slate-50 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-200">
                          <stat.icon className="w-5 h-5" />
                        </div>
                        <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          stat.up ? 'bg-emerald-50 text-[#22C55E]' : 'bg-red-50 text-[#EF4444]'
                        }`}>
                          {stat.up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                          {stat.trend}
                        </span>
                      </div>
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 leading-tight truncate">{stat.title}</h3>
                      <p className="text-2xl font-display font-extrabold text-slate-900 mb-1">{stat.value}</p>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 truncate leading-none">{stat.desc}</p>
                  </div>
                ))}
              </div>

              {/* Large Analytics Visualization & Recent Dispatches Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Column (Feeds + Quick Actions + Analytics charts) */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Real-Time Dispatch Feeds */}
                  <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 space-y-6 shadow-xs animate-slide-up-fade [animation-delay:400ms]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="font-display text-lg font-bold text-slate-900">Real-Time Dispatch Feeds</h2>
                        <p className="text-xs text-slate-400">Current tracking list for dispatch terminals</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] text-xs text-slate-600 hover:text-slate-900 hover:border-slate-350 transition-all duration-200 active:scale-[0.98]">
                          <Filter className="w-3.5 h-3.5" />
                          <span>Filter</span>
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                            <th className="pb-3 pr-4 pt-2 pl-4">Truck ID</th>
                            <th className="pb-3 pr-4 pt-2">Driver</th>
                            <th className="pb-3 pr-4 pt-2">Destination</th>
                            <th className="pb-3 pr-4 pt-2">Route Status</th>
                            <th className="pb-3 pr-4 pt-2">ETA</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                          {dispatches.map((dispatch) => (
                            <tr key={dispatch.id} className="group hover:bg-slate-50/50 transition-colors">
                              <td className="py-3.5 font-mono font-bold text-[#2563EB] hover:underline cursor-pointer pr-4 pl-4">{dispatch.id}</td>
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
                              <td className="py-3.5 text-slate-500 pr-4">{dispatch.destination}</td>
                              <td className="py-3.5 pr-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                  dispatch.status === 'Completed' ? 'bg-emerald-50 text-[#22C55E] border border-emerald-100' :
                                  'bg-blue-50 text-[#2563EB] border border-blue-100'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    dispatch.status === 'Completed' ? 'bg-[#22C55E]' : 'bg-[#2563EB]'
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

                  {/* Recharts Analytics Section: Utilization Area Chart - Glass Card */}
                  <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 space-y-6 shadow-xs animate-slide-up-fade [animation-delay:450ms]">
                    <div>
                      <h2 className="font-display text-lg font-bold text-slate-900">Fleet Utilization Trend</h2>
                      <p className="text-xs text-slate-400">Active utilization percentage levels tracked weekly</p>
                    </div>

                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={utilizationData}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="utilGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                          <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '12px', fontSize: '11px', color: '#0F172A' }}
                          />
                          <Area type="monotone" dataKey="Utilization" name="Utilization Rate (%)" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#utilGrad)" isAnimationActive={true} animationDuration={1000} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Recharts Analytics Section: Cost Bar Chart - Glass Card */}
                  <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 space-y-6 shadow-xs animate-slide-up-fade [animation-delay:500ms]">
                    <div>
                      <h2 className="font-display text-lg font-bold text-slate-900">Fleet Cost Breakdown</h2>
                      <p className="text-xs text-slate-400">Comparison of fuel expenses vs workshop maintenance costs per vehicle</p>
                    </div>

                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={fleetCostData}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                          <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '12px', fontSize: '11px', color: '#0F172A' }}
                          />
                          <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', color: '#64748B' }} />
                          <Bar dataKey="Fuel" name="Fuel Expenses ($)" fill="#2563EB" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={1200} />
                          <Bar dataKey="Maintenance" name="Maintenance Cost ($)" fill="#0F172A" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={1200} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Quick Actions Panel - Glass Card */}
                  <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 space-y-4 shadow-xs animate-slide-up-fade [animation-delay:550ms]">
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
                          className="flex flex-col items-start p-4 rounded-xl border border-slate-200 bg-white/60 hover:bg-slate-50 hover:border-slate-350 hover:scale-[1.05] hover:shadow-xs text-left transition-all duration-300 group"
                        >
                          <div className={`p-2 rounded-lg ${action.color} mb-3 group-hover:scale-105 transition-transform duration-300`}>
                            <action.icon className="w-4 h-4" />
                          </div>
                          <p className="text-xs font-bold text-slate-800 leading-tight">{action.name}</p>
                          <p className="text-[10px] text-slate-400 mt-1 leading-none">{action.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column (Map + GPS Telemetry Logs) - Separated with gap-8 */}
                <div className="space-y-8">
                  
                  {/* Network Routing Map Card - Glass Card */}
                  <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 flex flex-col h-[340px] shadow-xs animate-slide-up-fade [animation-delay:600ms]">
                    <div>
                      <h2 className="font-display text-base font-bold text-slate-900">Network Routing Map</h2>
                      <p className="text-xs text-slate-400">Live visual feed of logistics grid</p>
                    </div>

                    <div className="relative flex-1 my-4 rounded-xl border border-slate-200 bg-slate-900 overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:1.25rem_1.25rem] opacity-20"></div>
                      
                      <svg className="w-full h-full absolute inset-0 opacity-40">
                        <path d="M50 80 Q 150 120 220 70 T 320 180" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
                        <path d="M100 200 Q 200 110 300 120" fill="none" stroke="#f59e0b" strokeWidth="2" />
                      </svg>

                      {/* Marker Pulse Animations */}
                      <span className="absolute left-[50px] top-[80px] flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500 shadow-sm border border-white"></span>
                      </span>
                      <span className="absolute left-[220px] top-[70px] flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500 shadow-sm border border-white"></span>
                      </span>
                      <span className="absolute left-[300px] top-[120px] flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 shadow-sm border border-white"></span>
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

                  {/* GPS Feed Logs (Terminal signal logs) - Glass Card */}
                  <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 shadow-xs flex flex-col justify-between animate-slide-up-fade [animation-delay:650ms]">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-display text-base font-bold text-slate-900">GPS Terminal Feed</h3>
                        <List className="w-4 h-4 text-slate-400" />
                      </div>
                      <p className="text-xs text-slate-400">Live signal lock messages from operator network</p>
                    </div>

                    <div className="flex-1 my-4 overflow-y-auto space-y-3.5 pr-1 max-h-[300px]">
                      {[
                        { time: '12:03:45', vehicle: 'TRK-1092', action: 'Pinged coordinates near Chicago Hub (ORD1). Speed: 85 km/h.', status: 'success' },
                        { time: '12:03:32', vehicle: 'TRK-4421', action: 'Cleared route checkpoint near Denver Corridor (DEN2).', status: 'info' },
                        { time: '12:03:15', vehicle: 'TRK-9801', action: 'Brake diagnostic payload compiled. Status: Clean.', status: 'success' },
                        { time: '12:02:50', vehicle: 'TRK-5524', action: 'Route deviation warning triggered near Houston Beltway.', status: 'warn' },
                        { time: '12:02:10', vehicle: 'TRK-8843', action: 'Stopped at logistics base terminal Dallas North.', status: 'info' }
                      ].map((log, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-white/50 border border-slate-200/80 space-y-1.5 hover:scale-[1.01] transition-transform">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-mono font-bold text-[#2563EB] flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {log.vehicle}
                            </span>
                            <span className="text-slate-400 font-semibold">{log.time}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{log.action}</p>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              log.status === 'success' ? 'bg-emerald-500' :
                              log.status === 'warn' ? 'bg-amber-500' : 'bg-brand-blue-500'
                            }`}></span>
                            <span className="text-[9px] uppercase font-bold text-slate-400">{log.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-[10px] text-slate-400 text-center border-t border-slate-100 pt-4 mt-2">
                      Auto-refresh active (interval: 5000ms)
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
        <div className="fixed inset-0 bg-[#0F172A]/95 z-40 flex flex-col p-6 md:hidden animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
            <Logo iconSize={26} textSize="text-lg" />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex-1 space-y-1.5 overflow-y-auto">
            {[
              { name: 'Overview', icon: LayoutDashboard },
              { name: 'Trip Management', icon: Compass },
              { name: 'Maintenance', icon: Wrench },
              { name: 'Fuel Management', icon: Droplet },
              { name: 'Active Fleets', icon: Truck, badge: '1,842' },
              { name: 'Live Tracking', icon: Navigation },
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
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-all active:scale-[0.98] ${
                  activeTab === item.name
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeTab === item.name ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="border-t border-slate-800 pt-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all"
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
