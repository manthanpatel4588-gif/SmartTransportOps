import { useState } from 'react';
import {
  Compass,
  MapPin,
  RefreshCw,
  Cpu,
  Radio,
  Clock,
  Navigation,
  Loader2,
  List
} from 'lucide-react';

interface TrackingLog {
  time: string;
  vehicle: string;
  action: string;
  status: 'info' | 'success' | 'warn';
}

const INITIAL_LOGS: TrackingLog[] = [
  { time: '12:03:45', vehicle: 'TRK-1092', action: 'Pinged coordinates near Chicago Hub (ORD1). Speed: 85 km/h.', status: 'success' },
  { time: '12:03:32', vehicle: 'TRK-4421', action: 'Cleared route checkpoint near Denver Corridor (DEN2).', status: 'info' },
  { time: '12:03:15', vehicle: 'TRK-9801', action: 'Brake diagnostic payload compiled. Status: Clean.', status: 'success' },
  { time: '12:02:50', vehicle: 'TRK-5524', action: 'Route deviation warning triggered near Houston Beltway.', status: 'warn' },
  { time: '12:02:10', vehicle: 'TRK-8843', action: 'Stopped at logistics base terminal Dallas North.', status: 'info' }
];

export default function LiveTracking() {
  const [logs, setLogs] = useState<TrackingLog[]>(INITIAL_LOGS);
  const [isPinging, setIsPinging] = useState(false);

  const handleManualPing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      const currentTime = new Date().toLocaleTimeString(undefined, { hour12: false });
      const newLog: TrackingLog = {
        time: currentTime,
        vehicle: `TRK-${Math.floor(1000 + Math.random() * 9000)}`,
        action: 'Manual GPS override ping successful. All transponders responsive.',
        status: 'success'
      };
      setLogs([newLog, ...logs]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">Live Tracking</h2>
          <p className="text-xs text-brand-navy-400">Real-time GPS coordinate telemetry overlay and routing logs</p>
        </div>
        <button
          onClick={handleManualPing}
          disabled={isPinging}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-blue-600 to-brand-blue-500 hover:from-brand-blue-500 hover:to-brand-blue-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed self-start sm:self-center"
        >
          {isPinging ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          <span>Request GPS Ping</span>
        </button>
      </div>

      {/* Analytics Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'GPS Network Strength', value: '98.4%', desc: 'Carrier lock: Strong', icon: Radio, color: 'text-cyan-400' },
          { label: 'Active Satellites', value: '14 Locked', desc: 'Optimal visual field', icon: Compass, color: 'text-brand-blue-400' },
          { label: 'Uplink Latency', value: '24 ms', desc: 'API threshold: Good', icon: Clock, color: 'text-emerald-400' },
          { label: 'Transponder CPU', value: '31.2%', desc: 'Cluster state: Stable', icon: Cpu, color: 'text-brand-navy-300' }
        ].map((card, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-brand-navy-900/60 border border-brand-navy-800 backdrop-blur-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-xl bg-brand-navy-850">
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-brand-navy-400 mb-1">{card.label}</h3>
            <p className="text-2xl font-display font-extrabold text-white mb-1">{card.value}</p>
            <p className="text-[10px] text-brand-navy-500">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Map telemetry */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-brand-navy-900/60 border border-brand-navy-800 backdrop-blur-sm flex flex-col justify-between min-h-[400px]">
          <div>
            <h3 className="font-display text-lg font-bold">Logistics Telemetry Map</h3>
            <p className="text-xs text-brand-navy-400">Interactive live dispatch coordinate lock dashboard</p>
          </div>

          <div className="relative flex-1 my-4 rounded-xl border border-brand-navy-800 bg-brand-navy-950 overflow-hidden flex items-center justify-center min-h-[300px]">
            {/* Visual grid layout */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-35"></div>

            {/* Simulated routes */}
            <svg className="w-full h-full absolute inset-0 opacity-40">
              <path d="M100 150 Q 250 80 400 220 T 550 100" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="6 6" />
              <path d="M50 250 Q 300 200 500 150" fill="none" stroke="#10b981" strokeWidth="2" />
            </svg>

            {/* GPS Lock Blinker Nodes */}
            <span className="absolute left-[100px] top-[150px] flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-brand-blue-500"></span>
            </span>
            <span className="absolute left-[400px] top-[220px] flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-brand-blue-500"></span>
            </span>
            <span className="absolute left-[500px] top-[150px] flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>

            {/* Interactive coordinates helper */}
            <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-brand-navy-900/90 border border-brand-navy-800 backdrop-blur-md flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-brand-blue-400 animate-pulse" />
                <span className="font-semibold text-white">Tracking 1,248 Transponders</span>
              </div>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                LIVE OVERLAY ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Right: GPS Feed Logs */}
        <div className="p-6 rounded-2xl bg-brand-navy-900/60 border border-brand-navy-800 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-lg font-bold">GPS Terminal Feed</h3>
              <List className="w-4 h-4 text-brand-navy-400" />
            </div>
            <p className="text-xs text-brand-navy-400">Live signal lock messages from operator network</p>
          </div>

          <div className="flex-1 my-4 overflow-y-auto space-y-3.5 pr-1 max-h-[300px]">
            {logs.map((log, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-brand-navy-950 border border-brand-navy-850 space-y-1.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-mono font-bold text-brand-blue-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {log.vehicle}
                  </span>
                  <span className="text-brand-navy-500 font-semibold">{log.time}</span>
                </div>
                <p className="text-xs text-brand-navy-300 leading-relaxed">{log.action}</p>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    log.status === 'success' ? 'bg-emerald-400' :
                    log.status === 'warn' ? 'bg-amber-400' : 'bg-brand-blue-400'
                  }`}></span>
                  <span className="text-[9px] uppercase font-bold text-brand-navy-400">{log.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-brand-navy-500 text-center border-t border-brand-navy-900 pt-4 mt-2">
            Auto-refresh active (interval: 5000ms)
          </div>
        </div>
      </div>
    </div>
  );
}
