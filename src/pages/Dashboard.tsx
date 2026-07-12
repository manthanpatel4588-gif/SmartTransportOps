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
      
      {/* Soft blurred logistics background representation (5-10% opacity) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.05] filter blur-[1px] pointer-events-none"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1200')` }}
      ></div>
      <div className="absolute inset-0 bg-slate-100/10 pointer-events-none"></div>

      {/* 1. Left Sidebar - Fixed & Premium Dark Navy Theme */}
      <aside className="hidden md:flex flex-col w-72 border-r border-[#E5E7EB] bg-[#0F172A] p-8 justify-between flex-shrink-0 z-20">
        <div className="flex flex-col gap-10">
          {/* Logo container inside sidebar */}
          <div className="bg-slate-900 px-4 py-3 rounded-xl border border-slate-850 shadow-md">
            <Logo iconSize={22} textSize="text-base" />
          </div>

          {/* Nav links with gap-3.5 spacing */}
          <nav className="flex flex-col gap-3.5">
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
                className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] border-l-4 ${
                  activeTab === item.name
                    ? 'bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)] border-blue-400'
                    : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeTab === item.name ? 'bg-white/20 text-white' : 'bg-slate-850 text-slate-400'
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
        <header className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-[#E5E7EB] bg-white sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg bg-white border border-[#E5E7EB] text-slate-600 hover:text-slate-900 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-xl font-extrabold tracking-tight text-[#0F172A]">{activeTab}</h1>
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
                className="w-60 pl-10 pr-4 py-1.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563EB] transition-colors"
              />
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 rounded-lg bg-white border border-[#E5E7EB] text-slate-500 hover:text-slate-850 transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
            </button>

            {/* Mobile Logout */}
            <button
              onClick={handleLogout}
              className="md:hidden p-2 rounded-lg bg-white border border-[#E5E7EB] text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dashboard Grid Content - p-8 md:p-10 and gap-10 gives the absolute spaciest feel! */}
        <div className="p-8 md:p-10 flex flex-col gap-10 w-full min-h-screen animate-fadeIn">
          
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
            <div className="p-8 rounded-[20px] bg-white border border-[#E5E7EB] space-y-6 shadow-xs animate-slide-up-fade">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-display font-bold text-lg text-[#0F172A]">Control Center Inbox</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]">12 Unread Alerts</span>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { text: 'Urgent Weather Warning: Heavy rainfall in Midwest Region (ORD1). Redirection active.', type: 'warning' },
                  { text: 'Operator Elena Rostova license warning: Expiry date 2027-05-20.', type: 'info' },
                  { text: 'Vehicle TRK-9801 has completed dispatch leg: Chicago Hub.', type: 'success' },
                  { text: 'Maintenance Schedule Request: Volvo FH16 requires service interval.', type: 'info' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-xs font-semibold text-slate-700 hover:bg-[#F1F5F9] hover:scale-[1.01] transition-all duration-200 shadow-xs">
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
              {/* Hero Banner Section with subtle blurred background truck image (5-10% opacity) */}
              <div className="relative overflow-hidden rounded-[24px] border border-[#E5E7EB] bg-white p-8 shadow-xs transition-all duration-300 hover:shadow-sm animate-slide-up-fade" style={{ animationDelay: '0ms' }}>
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.05] filter blur-[1px]"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1200')` }}
                ></div>
                <div className="absolute inset-0 bg-slate-100/10"></div>
                
                <div className="relative z-10 flex flex-col gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] self-start">
                    System Telemetry Online
                  </span>
                  <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#0F172A]">
                    Enterprise Logistics Console
                  </h2>
                  <p className="text-sm text-slate-500 max-w-2xl leading-relaxed font-semibold">
                    Real-time logistical monitoring, operator dispatch workflows, and fleet maintenance telemetry dashboard. Orchestrate routes, inspect payloads, and log expenses seamlessly.
                  </p>
                </div>
              </div>

              {/* Weather Alert banner - separated appropriately */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-[20px] bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] shadow-xs animate-slide-up-fade" style={{ animationDelay: '50ms' }}>
                <div className="flex items-start gap-3.5">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#D97706]" />
                  <div>
                    <p className="text-sm font-bold text-[#92400E] tracking-tight">Weather Alert: Midwest Region (ORD1)</p>
                    <p className="text-xs text-amber-800 mt-1 font-semibold leading-relaxed">Heavy rainfall expected. Fleet operators are advised to enable route redirection for high-priority shipments.</p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold self-start sm:self-center transition-all duration-200 active:scale-[0.98] shadow-sm">
                  Manage Re-Routing
                </button>
              </div>

              {/* Summary Metric Cards - Spacious 3-column grid (lg:grid-cols-3) to double card horizontal space */}
              {/* Uses rounded-[20px], p-8 (32px padding), and min-h-[160px] to make boxes larger with beautiful breathing room */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch w-full animate-fadeIn">
                {[
                  { title: 'Active Vehicles', value: kpis.activeVehicles.toLocaleString(), desc: 'Active in transit', icon: Truck, trend: '+4.2%', up: true, color: 'text-[#2563EB] bg-[#EFF6FF] border border-[#DBEAFE]' },
                  { title: 'Available Vehicles', value: kpis.availableVehicles.toLocaleString(), desc: 'Ready for dispatch', icon: CheckCircle, trend: '+1.8%', up: true, color: 'text-[#22C55E] bg-[#F0FDF4] border border-[#DCFCE7]' },
                  { title: 'Vehicles In Maintenance', value: kpis.inMaintenance.toLocaleString(), desc: 'At garage facility', icon: Wrench, trend: '-0.5%', up: false, color: 'text-[#EF4444] bg-[#FEF2F2] border border-[#FEE2E2]' },
                  { title: 'Active Trips', value: kpis.activeTrips.toLocaleString(), desc: 'Active route legs', icon: Navigation, trend: '+12.4%', up: true, color: 'text-[#6366F1] bg-[#EEF2FF] border border-[#E0E7FF]' },
                  { title: 'Drivers On Duty', value: kpis.driversOnDuty.toLocaleString(), desc: '82% total workforce', icon: Users, trend: '+2.3%', up: true, color: 'text-[#8B5CF6] bg-[#F5F3FF] border border-[#EDE9FE]' },
                  { title: 'Fleet Utilization', value: `${kpis.utilization}%`, desc: 'Target optimal: 85%', icon: TrendingUp, trend: '+3.4%', up: true, color: 'text-[#06B6D4] bg-[#ECFEFF] border border-[#CFFAFE]' }
                ].map((stat, idx) => (
                  <div 
                    key={idx} 
                    className="p-8 rounded-[20px] bg-white border border-[#E5E7EB] relative overflow-hidden group hover:scale-[1.02] hover:-translate-y-1 hover:shadow-md hover:border-slate-350 transition-all duration-300 shadow-xs flex flex-col justify-between min-h-[185px] animate-slide-up-fade"
                    style={{ animationDelay: `${100 + idx * 50}ms` }}
                  >
                    <div className="relative z-10 flex flex-col justify-between h-full gap-5">
                      <div className="flex justify-between items-start">
                        <div className={`p-3 rounded-xl ${stat.color} transition-all duration-300 group-hover:scale-105 shadow-xs`}>
                          <stat.icon className="w-5 h-5" />
                        </div>
                        <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          stat.up 
                            ? 'bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]' 
                            : 'bg-[#FCE8E6] text-[#C5221F] border-[#FAD2CF]'
                        }`}>
                          {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {stat.trend}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 leading-tight">{stat.title}</h3>
                        <p className="text-3xl font-display font-extrabold text-[#0F172A] tracking-tight leading-none">{stat.value}</p>
                      </div>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">{stat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Large Analytics Visualization & Recent Dispatches Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start w-full">
                
                {/* Left Column (Feeds + Quick Actions + Analytics charts) - gap-10 prevents overlaps! */}
                <div className="lg:col-span-2 flex flex-col gap-10">
                  {/* Real-Time Dispatch Feeds */}
                  <div className="p-8 rounded-[20px] bg-white border border-[#E5E7EB] flex flex-col gap-6 shadow-xs animate-slide-up-fade" style={{ animationDelay: '400ms' }}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="font-display text-lg font-bold text-[#0F172A] tracking-tight">Real-Time Dispatch Feeds</h2>
                        <p className="text-xs text-slate-500 font-medium">Current tracking list for dispatch terminals</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] text-xs text-slate-650 hover:text-slate-900 hover:border-slate-400 transition-all duration-200 active:scale-[0.98] shadow-xs font-semibold">
                          <Filter className="w-3.5 h-3.5" />
                          <span>Filter</span>
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[#E5E7EB] text-xs font-bold uppercase tracking-wider text-slate-500">
                            <th className="pb-4 pr-4 pt-2 pl-4">Truck ID</th>
                            <th className="pb-4 pr-4 pt-2">Driver</th>
                            <th className="pb-4 pr-4 pt-2">Destination</th>
                            <th className="pb-4 pr-4 pt-2">Route Status</th>
                            <th className="pb-4 pr-4 pt-2">ETA</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB] text-sm text-slate-800">
                          {dispatches.map((dispatch) => (
                            <tr key={dispatch.id} className="group hover:bg-[#F9FAFB] transition-colors">
                              <td className="py-4.5 font-mono font-bold text-[#2563EB] hover:text-blue-700 hover:underline cursor-pointer pr-4 pl-4">{dispatch.id}</td>
                              <td className="py-4.5 font-semibold pr-4">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(dispatch.driver)}&background=f0f7ff&color=2563eb&bold=true&rounded=true&size=32`}
                                    alt={dispatch.driver}
                                    className="w-7 h-7 rounded-full object-cover shadow-xs border border-slate-100"
                                  />
                                  <span>{dispatch.driver}</span>
                                </div>
                              </td>
                              <td className="py-4.5 text-slate-500 pr-4">{dispatch.destination}</td>
                              <td className="py-4.5 pr-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                  dispatch.status === 'Completed' 
                                    ? 'bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]' 
                                    : 'bg-[#E8F0FE] text-[#1A73E8] border border-[#D2E3FC]'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    dispatch.status === 'Completed' ? 'bg-[#137333]' : 'bg-[#1A73E8]'
                                  }`}></span>
                                  {dispatch.status}
                                </span>
                              </td>
                              <td className="py-4.5 text-slate-500 font-medium pr-4">{dispatch.ETA}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recharts Analytics Section: Utilization Area Chart - Glass Card */}
                  <div className="p-8 rounded-[20px] bg-white border border-[#E5E7EB] flex flex-col gap-6 shadow-xs hover:scale-[1.01] hover:shadow-md hover:border-slate-350 transition-all duration-300 animate-slide-up-fade" style={{ animationDelay: '450ms' }}>
                    <div>
                      <h2 className="font-display text-lg font-bold text-[#0F172A] tracking-tight">Fleet Utilization Trend</h2>
                      <p className="text-xs text-slate-500 font-medium">Active utilization percentage levels tracked weekly</p>
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
                            contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '12px', fontSize: '11px', color: '#0F172A', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}
                          />
                          <Area type="monotone" dataKey="Utilization" name="Utilization Rate (%)" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#utilGrad)" isAnimationActive={true} animationDuration={1000} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Recharts Analytics Section: Cost Bar Chart - Glass Card */}
                  <div className="p-8 rounded-[20px] bg-white border border-[#E5E7EB] flex flex-col gap-6 shadow-xs hover:scale-[1.01] hover:shadow-md hover:border-slate-350 transition-all duration-300 animate-slide-up-fade" style={{ animationDelay: '500ms' }}>
                    <div>
                      <h2 className="font-display text-lg font-bold text-[#0F172A] tracking-tight">Fleet Cost Breakdown</h2>
                      <p className="text-xs text-slate-500 font-medium">Comparison of fuel expenses vs workshop maintenance costs per vehicle</p>
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
                            contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '12px', fontSize: '11px', color: '#0F172A', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}
                          />
                          <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', color: '#64748B' }} />
                          <Bar dataKey="Fuel" name="Fuel Expenses ($)" fill="#2563EB" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={1200} />
                          <Bar dataKey="Maintenance" name="Maintenance Cost ($)" fill="#0F172A" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={1200} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Quick Actions Panel - Glass Card */}
                  <div className="p-8 rounded-[20px] bg-white border border-[#E5E7EB] flex flex-col gap-6 shadow-xs animate-slide-up-fade" style={{ animationDelay: '550ms' }}>
                    <div>
                      <h3 className="font-display text-base font-bold text-[#0F172A] tracking-tight">Quick Actions</h3>
                      <p className="text-xs text-slate-500 font-medium">Trigger active workflows directly from Overview console</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      {[
                        { name: 'New Trip', desc: 'Create a new trip', icon: Compass, tab: 'Trip Management', color: 'text-[#2563EB] bg-[#EFF6FF] border border-[#DBEAFE]' },
                        { name: 'Schedule Maintenance', desc: 'Add maintenance task', icon: Wrench, tab: 'Maintenance', color: 'text-purple-600 bg-purple-50 border border-purple-100' },
                        { name: 'Add Fuel Log', desc: 'Record fuel entry', icon: Droplet, tab: 'Fuel Management', color: 'text-cyan-600 bg-cyan-50 border border-cyan-100' },
                        { name: 'Add Expense', desc: 'Record other expense', icon: DollarSign, tab: 'System Settings', color: 'text-amber-600 bg-amber-50 border border-[#FDE68A]' },
                        { name: 'View Reports', desc: 'Analytics & insights', icon: TrendingUp, tab: 'Overview', color: 'text-indigo-650 bg-[#EEF2FF] border border-[#E0E7FF]' }
                      ].map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveTab(action.tab)}
                          className="flex flex-col items-start p-5 rounded-[18px] border border-[#E5E7EB] bg-[#F9FAFB] hover:bg-[#F1F5F9] hover:border-slate-350 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xs text-left transition-all duration-305 group relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-blue-50/5 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                          <div className={`p-3 rounded-xl border ${action.color} mb-4 group-hover:scale-105 transition-transform duration-300 shadow-sm`}>
                            <action.icon className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-[#2563EB] transition-colors duration-200">{action.name}</p>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal font-semibold">{action.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column (Map + GPS Telemetry Logs) - gap-10 prevents vertical overlaps! */}
                <div className="flex flex-col gap-10">
                  
                  {/* Network Routing Map Card - Glass Card */}
                  <div className="p-8 rounded-[20px] bg-white border border-[#E5E7EB] flex flex-col h-[380px] shadow-xs hover:scale-[1.01] hover:shadow-sm transition-all duration-300 animate-slide-up-fade" style={{ animationDelay: '600ms' }}>
                    <div>
                      <h2 className="font-display text-base font-bold text-[#0F172A] tracking-tight">Network Routing Map</h2>
                      <p className="text-xs text-slate-500 font-medium">Live visual feed of logistics grid</p>
                    </div>

                    <div className="relative flex-1 my-4 rounded-xl border border-[#E5E7EB] bg-[#0F172A] overflow-hidden flex items-center justify-center shadow-inner">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:1.25rem_1.25rem] opacity-[0.15]"></div>
                      
                      <svg className="w-full h-full absolute inset-0 opacity-40">
                        <path d="M50 80 Q 150 120 220 70 T 320 180" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
                        <path d="M100 200 Q 200 110 300 120" fill="none" stroke="#f59e0b" strokeWidth="2" />
                      </svg>

                      {/* Marker Pulse Animations */}
                      <span className="absolute left-[50px] top-[80px] flex h-4.5 w-4.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-450 opacity-60"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#2563EB] shadow-md border-2 border-white"></span>
                      </span>
                      <span className="absolute left-[220px] top-[70px] flex h-4.5 w-4.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-450 opacity-60"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#2563EB] shadow-md border-2 border-white"></span>
                      </span>
                      <span className="absolute left-[300px] top-[120px] flex h-4.5 w-4.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-455 opacity-60"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#EF4444] shadow-md border-2 border-white"></span>
                      </span>

                      <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-slate-900/90 border border-slate-800 backdrop-blur-md flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-slate-400">Interactive Feed Active</span>
                        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
                          ONLINE
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-450 border-t border-slate-100 pt-3 font-semibold">
                      <span>Refreshed: Just Now</span>
                      <span className="text-[#2563EB] cursor-pointer hover:underline">Re-center Map</span>
                    </div>
                  </div>

                  {/* GPS Feed Logs (Terminal signal logs) - Glass Card */}
                  <div className="p-8 rounded-[20px] bg-white border border-[#E5E7EB] shadow-xs hover:scale-[1.01] hover:shadow-sm transition-all duration-300 flex flex-col justify-between animate-slide-up-fade" style={{ animationDelay: '650ms' }}>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-display text-base font-bold text-[#0F172A] tracking-tight">GPS Terminal Feed</h3>
                        <List className="w-4 h-4 text-slate-500" />
                      </div>
                      <p className="text-xs text-slate-500 font-medium">Live signal lock messages from operator network</p>
                    </div>

                    <div className="flex-1 my-4 overflow-y-auto space-y-3.5 pr-1 max-h-[300px]">
                      {[
                        { time: '12:03:45', vehicle: 'TRK-1092', action: 'Pinged coordinates near Chicago Hub (ORD1). Speed: 85 km/h.', status: 'success' },
                        { time: '12:03:32', vehicle: 'TRK-4421', action: 'Cleared route checkpoint near Denver Corridor (DEN2).', status: 'info' },
                        { time: '12:03:15', vehicle: 'TRK-9801', action: 'Brake diagnostic payload compiled. Status: Clean.', status: 'success' },
                        { time: '12:02:50', vehicle: 'TRK-5524', action: 'Route deviation warning triggered near Houston Beltway.', status: 'warn' },
                        { time: '12:02:10', vehicle: 'TRK-8843', action: 'Stopped at logistics base terminal Dallas North.', status: 'info' }
                      ].map((log, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] hover:border-slate-350 hover:bg-[#F1F5F9] hover:shadow-xs transition-all duration-200 space-y-2">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-mono font-bold text-[#2563EB] flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {log.vehicle}
                            </span>
                            <span className="text-slate-500 font-semibold">{log.time}</span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed font-semibold">{log.action}</p>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              log.status === 'success' ? 'bg-[#22C55E]' :
                              log.status === 'warn' ? 'bg-[#F59E0B]' : 'bg-[#2563EB]'
                            }`}></span>
                            <span className="text-[9px] uppercase font-bold text-slate-500">{log.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-[10px] text-slate-500 text-center border-t border-slate-100 pt-4 mt-2 font-semibold">
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
        <div className="fixed inset-0 bg-white z-40 flex flex-col p-6 md:hidden animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-6">
            <div className="bg-[#0F172A] px-4 py-3 rounded-xl border border-slate-800 shadow-sm">
              <Logo iconSize={22} textSize="text-base" />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800"
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
                    ? 'bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)] border-l-4 border-blue-400'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeTab === item.name ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="border-t border-slate-200 pt-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-650 bg-red-50 hover:bg-red-100 transition-all"
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
