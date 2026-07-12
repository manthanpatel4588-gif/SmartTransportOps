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
    <div className="flex min-h-screen w-full bg-[#050814] text-slate-100 font-sans overflow-hidden items-center justify-center relative p-4 animate-fadeIn">
      {/* Background animated floating glow blobs */}
      <div 
        className="absolute top-[10%] -left-20 w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-float"
        style={{ animationDelay: '0s' }}
      ></div>
      <div 
        className="absolute bottom-[10%] right-[-100px] w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-[120px] pointer-events-none animate-float"
        style={{ animationDelay: '3s' }}
      ></div>

      {/* Main Container - Split Left/Right Layout (responsive) with glassmorphism styling */}
      <div className="flex w-full max-w-5xl h-[640px] bg-[#0b0f19]/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative z-10 animate-slide-up-fade" style={{ animationDelay: '0ms' }}>
        
        {/* Left Side: Professional SaaS Branding Showcase (hidden on mobile) */}
        <div className="hidden md:flex md:w-1/2 bg-[#0b0f19]/80 p-12 flex-col justify-between relative overflow-hidden border-r border-white/5 text-white">
          {/* Subtle blurred truck image overlay in background */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.04] filter blur-[1px]"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1200')` }}
          ></div>
          <div className="absolute inset-0 bg-slate-950/40"></div>

          <div className="relative z-10">
            <Logo textSize="text-xl" iconSize={28} />
          </div>

          <div className="relative z-10 flex flex-col gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 border border-blue-500/30 text-blue-400 self-start">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
              Global Fleet Control Active
            </span>
            <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-white">
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

        {/* Right Side: Clean Dark Glass Login Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 bg-slate-900/30 backdrop-blur-md">
          <div className="w-full max-w-sm mx-auto flex flex-col gap-6">
            
            {/* Header - Staggered delay */}
            <div className="flex flex-col gap-1 animate-slide-up-fade" style={{ animationDelay: '100ms' }}>
              <h2 className="font-display text-2xl font-extrabold text-white tracking-tight">Operator Sign In</h2>
              <p className="text-xs text-slate-400">Enter your credentials to access your control workstation.</p>
            </div>

            {/* Error alerts - Staggered delay */}
            {error && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium animate-shake">
                <ShieldAlert className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              
              {/* Email Block - Staggered delay & input padding fix */}
              <div className="flex flex-col gap-2 animate-slide-up-fade" style={{ animationDelay: '200ms' }}>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Control Room Email</label>
                <div className="relative flex items-center">
                  <Mail 
                    className="text-slate-500" 
                    style={{ position: 'absolute', left: '0.85rem', width: '1rem', height: '1rem', pointerEvents: 'none' }}
                  />
                  <input
                    type="email"
                    placeholder="operator@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    style={{ paddingLeft: '2.75rem', paddingRight: '1rem' }}
                    className="w-full py-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all hover:border-slate-700"
                  />
                </div>
              </div>

              {/* Password Block - Staggered delay & input padding fix */}
              <div className="flex flex-col gap-2 animate-slide-up-fade" style={{ animationDelay: '300ms' }}>
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Workstation Password</label>
                  <a href="#" className="text-xs text-blue-400 hover:underline">Forgot?</a>
                </div>
                <div className="relative flex items-center">
                  <Lock 
                    className="text-slate-500" 
                    style={{ position: 'absolute', left: '0.85rem', width: '1rem', height: '1rem', pointerEvents: 'none' }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                    className="w-full py-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all hover:border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-500 hover:text-slate-350 focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me - Staggered delay */}
              <div className="flex items-center animate-slide-up-fade" style={{ animationDelay: '400ms' }}>
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                />
                <label htmlFor="remember" className="ml-2 text-xs text-slate-400 cursor-pointer select-none">
                  Remember my workstation
                </label>
              </div>

              {/* Submit Button - Staggered delay */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all disabled:opacity-60 shadow-lg shadow-blue-500/10 animate-slide-up-fade"
                style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', animationDelay: '500ms' }}
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

            <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-850 mt-2 animate-slide-up-fade" style={{ animationDelay: '600ms' }}>
              Need assistance?{' '}
              <a href="#" className="font-semibold text-blue-400 hover:underline">Contact System Admin</a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
