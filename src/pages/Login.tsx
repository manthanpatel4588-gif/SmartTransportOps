import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import Logo from '../components/Logo';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    // Simulate frontend login and transition to dashboard
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F5F7FA] text-slate-800 font-sans overflow-hidden items-center justify-center relative p-4">
      {/* Background soft glowing elements */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"></div>

      {/* Main Container - Split Left/Right Layout (responsive) */}
      <div className="flex w-full max-w-5xl h-[640px] bg-white border border-[#E5E7EB] rounded-2xl shadow-lg overflow-hidden relative z-10">
        
        {/* Left Side: Professional SaaS Branding Showcase (hidden on mobile) */}
        <div className="hidden md:flex md:w-1/2 bg-[#0F172A] p-12 flex-col justify-between relative overflow-hidden text-white">
          {/* Subtle blurred truck image overlay in background */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 filter blur-[1px]"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1200')` }}
          ></div>
          <div className="absolute inset-0 bg-slate-900/40"></div>

          <div className="relative z-10">
            <Logo textSize="text-xl" iconSize={28} />
          </div>

          <div className="relative z-10 flex flex-col gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 border border-blue-500/30 text-blue-400 self-start">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
              Global Fleet Control Active
            </span>
            <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight">
              Enterprise Logistics & Operations Console
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Log, track, and optimize logistical dispatch operations in real-time. Control fleets, audit maintenance costs, and manage operators under a secure framework.
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-6">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>SSL Encryption Secured</span>
            </div>
            <span>v2.4.1</span>
          </div>
        </div>

        {/* Right Side: Clean Login Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 bg-white">
          <div className="w-full max-w-sm mx-auto flex flex-col gap-6">
            
            {/* Header */}
            <div className="flex flex-col gap-1">
              <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">Operator Sign In</h2>
              <p className="text-xs text-slate-500">Enter your credentials to access your control workstation.</p>
            </div>

            {/* Error alerts */}
            {error && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-shake">
                <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              
              {/* Email Block */}
              <div className="flex flex-col gap-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Control Room Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="operator@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Password Block */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Workstation Password</label>
                  <a href="#" className="text-xs text-brand-blue-600 hover:underline">Forgot?</a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-blue-600 focus:ring-blue-500/20"
                />
                <label htmlFor="remember" className="ml-2 text-xs text-slate-500 cursor-pointer select-none">
                  Remember my workstation
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-blue-600 to-brand-blue-500 hover:from-brand-blue-500 hover:to-brand-blue-400 active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Workstation...</span>
                  </div>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-100 mt-2">
              Need assistance?{' '}
              <a href="#" className="font-semibold text-brand-blue-600 hover:underline">Contact System Admin</a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
