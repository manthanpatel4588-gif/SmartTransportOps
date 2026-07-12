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
    <div className="flex h-screen w-full bg-[#050814] text-slate-100 font-sans overflow-hidden relative">
      
      {/* Soft blurred logistics background representation */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.04] filter blur-[8px] pointer-events-none"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1200')` }}
      ></div>

      {/* Decorative colored glow blobs for glassmorphism highlights */}
      <div className="absolute top-[10%] left-[20%] w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '6000ms' }}></div>
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-indigo-500/8 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8000ms' }}></div>

      {/* 1. Left Sidebar - Fixed & Premium Dark Glass Theme */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/5 bg-[#0b0f19]/70 backdrop-blur-xl p-6 justify-between flex-shrink-0 z-20">
        <div className="flex flex-col gap-8">
          {/* Logo container inside sidebar */}
          <div className="bg-slate-950/40 px-4 py-3 rounded-xl border border-slate-900 shadow-md">
            <Logo iconSize={22} textSize="text-base" />
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-2">
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
                    ? 'bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeTab === item.name ? 'bg-white/20 text-white' : 'bg-slate-950/60 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="border-t border-white/5 pt-6 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2563EB] to-blue-500 flex items-center justify-center font-display font-bold text-white shadow-md shadow-blue-500/10">
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
        <header className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-white/5 bg-[#0b0f19]/45 backdrop-blur-md sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg bg-slate-950 border border-slate-900 text-slate-350 hover:text-white md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-xl font-extrabold tracking-tight text-white">{activeTab}</h1>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative hidden lg:block">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search fleets, routes, drivers..."
                className="w-60 pl-10 pr-4 py-1.5 rounded-lg bg-slate-950/60 border border-slate-900 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#2563EB] transition-colors"
              />
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 rounded-lg bg-slate-950 border border-slate-900 text-slate-400 hover:text-white transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
            </button>

            {/* Mobile Logout */}
            <button
              onClick={handleLogout}
              className="md:hidden p-2 rounded-lg bg-slate-950 border border-slate-900 text-red-400 hover:bg-red-500/5 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dashboard Grid Content - 24px-32px margins and spacing - flex flex-col gap-8 solves overlaps! */}
        <div className="p-6 md:p-8 flex flex-col gap-8 w-full min-h-screen animate-fadeIn">
          
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
            <div className="p-8 rounded-[20px] bg-[#0b0f19]/60 backdrop-blur-xl border border-white/10 space-y-6 shadow-[0_8px_30px_rgba(0,0,0,0.3)] animate-slide-up-fade">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-display font-bold text-lg text-white">Control Center Inbox</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">12 Unread Alerts</span>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { text: 'Urgent Weather Warning: Heavy rainfall in Midwest Region (ORD1). Redirection active.', type: 'warning' },
                  { text: 'Operator Elena Rostova license warning: Expiry date 2027-05-20.', type: 'info' },
                  { text: 'Vehicle TRK-9801 has completed dispatch leg: Chicago Hub.', type: 'success' },
                  { text: 'Maintenance Schedule Request: Volvo FH16 requires service interval.', type: 'info' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 p-4 rounded-xl bg-slate-950/40 border border-slate-900 text-xs font-medium text-slate-350 hover:scale-[1.01] transition-transform duration-200 shadow-md">
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
              <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0b0f19]/60 backdrop-blur-xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:border-blue-500/20 animate-slide-up-fade" style={{ animationDelay: '0ms' }}>
                {/* Truck background with 6% opacity & blur */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.03] filter blur-[1px]"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1200')` }}
                ></div>
                
                <div className="relative z-10 flex flex-col gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 self-start">
                    System Telemetry Online
                  </span>
                  <h2 className="font-display text-2xl font-extrabold text-white">Enterprise Logistics Console</h2>
                  <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                    Real-time logistical monitoring, operator dispatch workflows, and fleet maintenance telemetry dashboard. Orchestrate routes, inspect payloads, and log expenses seamlessly.
                  </p>
                </div>
              </div>

              {/* Weather Alert banner - separated appropriately */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-[20px] bg-amber-500/5 backdrop-blur-md border border-amber-500/20 text-amber-400 shadow-md animate-slide-up-fade" style={{ animationDelay: '50ms' }}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500 animate-bounce" style={{ animationDuration: '3s' }} />
                  <div>
                    <p className="text-sm font-bold text-amber-300">Weather Alert: Midwest Region (ORD1)</p>
                    <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">Heavy rainfall expected. Fleet operators are advised to enable route redirection for high-priority shipments.</p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold self-start sm:self-center transition-all duration-200 active:scale-[0.98] shadow-md shadow-amber-600/10">
                  Manage Re-Routing
                </button>
              </div>

              {/* Summary Metric Cards - Equal height (items-stretch) & Staggered slide entrance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 items-stretch w-full">
                {[
                  { title: 'Active Vehicles', value: kpis.activeVehicles.toLocaleString(), desc: 'Active in transit', icon: Truck, trend: '+4.2%', up: true, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                  { title: 'Available Vehicles', value: kpis.availableVehicles.toLocaleString(), desc: 'Ready for dispatch', icon: CheckCircle, trend: '+1.8%', up: true, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                  { title: 'In Maintenance', value: kpis.inMaintenance.toLocaleString(), desc: 'At garage facility', icon: Wrench, trend: '-0.5%', up: false, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                  { title: 'Active Trips', value: kpis.activeTrips.toLocaleString(), desc: 'Active route legs', icon: Navigation, trend: '+12.4%', up: true, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
                  { title: 'Drivers On Duty', value: kpis.driversOnDuty.toLocaleString(), desc: '82% total workforce', icon: Users, trend: '+2.3%', up: true, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                  { title: 'Fleet Utilization', value: `${kpis.utilization}%`, desc: 'Target optimal: 85%', icon: TrendingUp, trend: '+3.4%', up: true, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' }
                ].map((stat, idx) => (
                  <div 
                    key={idx} 
                    className="p-6 rounded-[20px] bg-[#0b0f19]/60 backdrop-blur-xl border border-white/10 relative overflow-hidden group hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:border-blue-500/25 transition-all duration-300 shadow-md flex flex-col justify-between items-stretch animate-slide-up-fade"
                    style={{ animationDelay: `${100 + idx * 50}ms` }}
                  >
                    <div className="absolute -inset-px bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[20px] pointer-events-none" />
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-2.5 rounded-xl border ${stat.color} transition-all duration-300 group-hover:scale-105 shadow-xs`}>
                          <stat.icon className="w-5 h-5" />
                        </div>
                        <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          stat.up 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {stat.trend}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 leading-tight truncate">{stat.title}</h3>
                        <p className="text-2xl font-display font-extrabold text-white mb-1 tracking-tight">{stat.value}</p>
                      </div>
                      <p className="text-[10px] text-slate-550 mt-2 truncate leading-none">{stat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Large Analytics Visualization & Recent Dispatches Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
                
                {/* Left Column (Feeds + Quick Actions + Analytics charts) - flex gap-8 prevents vertical overlaps! */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                  {/* Real-Time Dispatch Feeds */}
                  <div className="p-8 rounded-[20px] bg-[#0b0f19]/60 backdrop-blur-xl border border-white/10 flex flex-col gap-6 shadow-[0_8px_30px_rgba(0,0,0,0.3)] animate-slide-up-fade" style={{ animationDelay: '400ms' }}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="font-display text-lg font-bold text-white tracking-tight">Real-Time Dispatch Feeds</h2>
                        <p className="text-xs text-slate-400">Current tracking list for dispatch terminals</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-900 text-xs text-slate-350 hover:text-white hover:border-slate-800 transition-all duration-200 active:scale-[0.98] shadow-xs">
                          <Filter className="w-3.5 h-3.5" />
                          <span>Filter</span>
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 text-xs font-bold uppercase tracking-wider text-slate-500">
                            <th className="pb-4 pr-4 pt-2 pl-4">Truck ID</th>
                            <th className="pb-4 pr-4 pt-2">Driver</th>
                            <th className="pb-4 pr-4 pt-2">Destination</th>
                            <th className="pb-4 pr-4 pt-2">Route Status</th>
                            <th className="pb-4 pr-4 pt-2">ETA</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                          {dispatches.map((dispatch) => (
                            <tr key={dispatch.id} className="group hover:bg-white/5 transition-colors">
                              <td className="py-4.5 font-mono font-bold text-blue-400 hover:text-blue-300 hover:underline cursor-pointer pr-4 pl-4">{dispatch.id}</td>
                              <td className="py-4.5 text-slate-200 font-semibold pr-4">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(dispatch.driver)}&background=0284c7&color=ffffff&bold=true&rounded=true&size=32`}
                                    alt={dispatch.driver}
                                    className="w-7 h-7 rounded-full object-cover shadow-xs border border-white/5"
                                  />
                                  <span>{dispatch.driver}</span>
                                </div>
                              </td>
                              <td className="py-4.5 text-slate-400 pr-4">{dispatch.destination}</td>
                              <td className="py-4.5 pr-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                  dispatch.status === 'Completed' 
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    dispatch.status === 'Completed' ? 'bg-emerald-400' : 'bg-blue-400'
                                  }`}></span>
                                  {dispatch.status}
                                </span>
                              </td>
                              <td className="py-4.5 text-slate-450 font-medium pr-4">{dispatch.ETA}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recharts Analytics Section: Utilization Area Chart - Glass Card */}
                  <div className="p-8 rounded-[20px] bg-[#0b0f19]/60 backdrop-blur-xl border border-white/10 flex flex-col gap-6 shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:border-blue-500/20 transition-all duration-300 animate-slide-up-fade" style={{ animationDelay: '450ms' }}>
                    <div>
                      <h2 className="font-display text-lg font-bold text-white tracking-tight">Fleet Utilization Trend</h2>
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
                              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25}/>
                              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '11px', color: '#f8fafc', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)' }}
                          />
                          <Area type="monotone" dataKey="Utilization" name="Utilization Rate (%)" stroke="#38bdf8" strokeWidth={2.5} fillOpacity={1} fill="url(#utilGrad)" isAnimationActive={true} animationDuration={1000} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Recharts Analytics Section: Cost Bar Chart - Glass Card */}
                  <div className="p-8 rounded-[20px] bg-[#0b0f19]/60 backdrop-blur-xl border border-white/10 flex flex-col gap-6 shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:border-blue-500/20 transition-all duration-300 animate-slide-up-fade" style={{ animationDelay: '500ms' }}>
                    <div>
                      <h2 className="font-display text-lg font-bold text-white tracking-tight">Fleet Cost Breakdown</h2>
                      <p className="text-xs text-slate-400">Comparison of fuel expenses vs workshop maintenance costs per vehicle</p>
                    </div>

                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={fleetCostData}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '11px', color: '#f8fafc', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)' }}
                          />
                          <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', color: '#64748B' }} />
                          <Bar dataKey="Fuel" name="Fuel Expenses ($)" fill="#38bdf8" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={1200} />
                          <Bar dataKey="Maintenance" name="Maintenance Cost ($)" fill="#4f46e5" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={1200} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Quick Actions Panel - Glass Card */}
                  <div className="p-8 rounded-[20px] bg-[#0b0f19]/60 backdrop-blur-xl border border-white/10 flex flex-col gap-6 shadow-[0_8px_30px_rgba(0,0,0,0.3)] animate-slide-up-fade" style={{ animationDelay: '550ms' }}>
                    <div>
                      <h3 className="font-display text-base font-bold text-white tracking-tight">Quick Actions</h3>
                      <p className="text-xs text-slate-400">Trigger active workflows directly from Overview console</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      {[
                        { name: 'New Trip', desc: 'Create a new trip', icon: Compass, tab: 'Trip Management', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                        { name: 'Schedule Maintenance', desc: 'Add maintenance task', icon: Wrench, tab: 'Maintenance', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                        { name: 'Add Fuel Log', desc: 'Record fuel entry', icon: Droplet, tab: 'Fuel Management', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
                        { name: 'Add Expense', desc: 'Record other expense', icon: DollarSign, tab: 'System Settings', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                        { name: 'View Reports', desc: 'Analytics & insights', icon: TrendingUp, tab: 'Overview', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' }
                      ].map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveTab(action.tab)}
                          className="flex flex-col items-start p-5 rounded-[18px] border border-white/5 bg-slate-900/35 hover:bg-slate-900/70 hover:border-blue-500/30 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-lg text-left transition-all duration-300 group relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-blue-50/5 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                          <div className={`p-3 rounded-xl border ${action.color} mb-4 group-hover:scale-105 transition-transform duration-300 shadow-sm`}>
                            <action.icon className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-bold text-slate-200 leading-tight group-hover:text-blue-400 transition-colors duration-200">{action.name}</p>
                          <p className="text-[10px] text-slate-550 mt-1 leading-normal">{action.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column (Map + GPS Telemetry Logs) - flex gap-8 prevents vertical overlaps! */}
                <div className="flex flex-col gap-8">
                  
                  {/* Network Routing Map Card - Glass Card */}
                  <div className="p-8 rounded-[20px] bg-[#0b0f19]/60 backdrop-blur-xl border border-white/10 flex flex-col h-[380px] shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-300 animate-slide-up-fade" style={{ animationDelay: '600ms' }}>
                    <div>
                      <h2 className="font-display text-base font-bold text-white tracking-tight">Network Routing Map</h2>
                      <p className="text-xs text-slate-400">Live visual feed of logistics grid</p>
                    </div>

                    <div className="relative flex-1 my-4 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden flex items-center justify-center shadow-inner">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:1.25rem_1.25rem] opacity-25"></div>
                      
                      <svg className="w-full h-full absolute inset-0 opacity-40">
                        <path d="M50 80 Q 150 120 220 70 T 320 180" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
                        <path d="M100 200 Q 200 110 300 120" fill="none" stroke="#f59e0b" strokeWidth="2" />
                      </svg>

                      {/* Marker Pulse Animations */}
                      <span className="absolute left-[50px] top-[80px] flex h-4.5 w-4.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-450 opacity-60"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-400 shadow-md border-2 border-slate-900"></span>
                      </span>
                      <span className="absolute left-[220px] top-[70px] flex h-4.5 w-4.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-450 opacity-60"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-400 shadow-md border-2 border-slate-900"></span>
                      </span>
                      <span className="absolute left-[300px] top-[120px] flex h-4.5 w-4.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-455 opacity-60"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-400 shadow-md border-2 border-slate-900"></span>
                      </span>

                      <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-slate-950/90 border border-white/5 backdrop-blur-md flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-slate-400">Interactive Feed Active</span>
                        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-pulse"></span>
                          ONLINE
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-white/5 pt-3">
                      <span>Refreshed: Just Now</span>
                      <span className="text-blue-400 cursor-pointer hover:underline">Re-center Map</span>
                    </div>
                  </div>

                  {/* GPS Feed Logs (Terminal signal logs) - Glass Card */}
                  <div className="p-8 rounded-[20px] bg-[#0b0f19]/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col justify-between animate-slide-up-fade" style={{ animationDelay: '650ms' }}>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-display text-base font-bold text-white tracking-tight">GPS Terminal Feed</h3>
                        <List className="w-4 h-4 text-slate-500" />
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
                        <div key={idx} className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/80 hover:border-blue-500/25 hover:bg-slate-900/60 hover:shadow-md transition-all duration-200 space-y-2">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-mono font-bold text-blue-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {log.vehicle}
                            </span>
                            <span className="text-slate-500 font-semibold">{log.time}</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed font-medium">{log.action}</p>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              log.status === 'success' ? 'bg-emerald-500' :
                              log.status === 'warn' ? 'bg-amber-500' : 'bg-blue-500'
                            }`}></span>
                            <span className="text-[9px] uppercase font-bold text-slate-500">{log.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-[10px] text-slate-550 text-center border-t border-white/5 pt-4 mt-2">
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
        <div className="fixed inset-0 bg-[#0b0f19]/95 backdrop-blur-xl z-40 flex flex-col p-6 md:hidden animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-6">
            <div className="bg-slate-950 px-4 py-3 rounded-xl border border-slate-900 shadow-sm">
              <Logo iconSize={22} textSize="text-base" />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex flex-col gap-2 overflow-y-auto">
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
                    ? 'bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeTab === item.name ? 'bg-white/20 text-white' : 'bg-slate-950/60 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="border-t border-white/5 pt-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-all"
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
