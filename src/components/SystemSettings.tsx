import { useState } from 'react';
import {
  Settings,
  Bell,
  User,
  Shield,
  Loader2,
  Lock,
  Save,
  CheckCircle2
} from 'lucide-react';

export default function SystemSettings() {
  const [operatorName, setOperatorName] = useState('Manthan Patel');
  const [operatorRole, setOperatorRole] = useState('System Administrator');
  const [centerId, setCenterId] = useState('ORD-Chicago-01');

  const [fuelThreshold, setFuelThreshold] = useState('20');
  const [speedThreshold, setSpeedThreshold] = useState('110');
  const [pingInterval, setPingInterval] = useState('10');

  const [notifSound, setNotifSound] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">System Settings</h2>
        <p className="text-xs text-slate-500">Configure logistics triggers, thresholds, alerts, and operator profiles</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Operator Profile */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <User className="w-5 h-5 text-brand-blue-600" />
              <h3 className="font-display font-bold text-sm text-slate-800">Operator Profile</h3>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Operator Name</label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-brand-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Role</label>
                <input
                  type="text"
                  value={operatorRole}
                  onChange={(e) => setOperatorRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-brand-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Control Center Terminal ID</label>
                <input
                  type="text"
                  value={centerId}
                  onChange={(e) => setCenterId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-brand-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Telemetry Threshold Triggers */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Settings className="w-5 h-5 text-brand-blue-600" />
              <h3 className="font-display font-bold text-sm text-slate-800">Telemetry Thresholds</h3>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Fuel Warning Threshold (%)</label>
                <input
                  type="number"
                  value={fuelThreshold}
                  onChange={(e) => setFuelThreshold(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-brand-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Speed Warning Limit (km/h)</label>
                <input
                  type="number"
                  value={speedThreshold}
                  onChange={(e) => setSpeedThreshold(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-brand-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">GPS Ping Interval (Seconds)</label>
                <input
                  type="number"
                  value={pingInterval}
                  onChange={(e) => setPingInterval(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-brand-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Operator Alerts settings */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Bell className="w-5 h-5 text-brand-blue-600" />
              <h3 className="font-display font-bold text-sm text-slate-800">System Notifications</h3>
            </div>
            
            <div className="space-y-4 pt-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">Critical Alert Sounds</h4>
                  <p className="text-[10px] text-slate-500">Play alert chime when a vehicle warning triggers</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifSound}
                  onChange={(e) => setNotifSound(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-blue-600 bg-white focus:ring-brand-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">Weekly Email Summary</h4>
                  <p className="text-[10px] text-slate-500">Send fleet utilization reports directly to admins</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifEmail}
                  onChange={(e) => setNotifEmail(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-blue-600 bg-white focus:ring-brand-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">Operator SMS Dispatch alerts</h4>
                  <p className="text-[10px] text-slate-500">Send auto-SMS prompts to drivers on active assignments</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifSMS}
                  onChange={(e) => setNotifSMS(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-blue-600 bg-white focus:ring-brand-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Security details (Readonly/Disabled Mock) */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Shield className="w-5 h-5 text-brand-blue-600" />
              <h3 className="font-display font-bold text-sm text-slate-800">Security & Access Locks</h3>
            </div>
            
            <div className="space-y-4 pt-1.5 opacity-70">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">MFA Authentication</h4>
                  <p className="text-[10px] text-slate-500">Double verification check required upon sign-in</p>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-xs bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Enforced</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">Cluster Log Retention</h4>
                  <p className="text-[10px] text-slate-500">System records auto-prune interval threshold</p>
                </div>
                <span className="text-xs font-bold font-mono text-slate-600">90 Days</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end border-t border-slate-100 pt-5">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-blue-600 to-brand-blue-500 hover:from-brand-blue-500 hover:to-brand-blue-400 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-xs"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

      {/* Settings Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-250 text-emerald-600 shadow-lg transition-all transform translate-y-0 scale-100 animate-slideIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span className="text-xs font-semibold">System configuration triggers updated successfully!</span>
        </div>
      )}
    </div>
  );
}
