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
    <div className="flex min-h-screen w-full bg-[#F5F7FA] text-slate-800 font-sans overflow-hidden items-center justify-center relative p-4 animate-fadeIn">
      {/* Main Container - Split Left/Right Layout (responsive) - Clean Enterprise SaaS Card */}
      <div className="flex w-full max-w-5xl h-[640px] bg-white border border-[#E5E7EB] rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.03),0_20px_25px_-5px_rgba(0,0,0,0.02)] overflow-hidden relative z-10 animate-slide-up-fade" style={{ animationDelay: '0ms' }}>
        
        {/* Left Side: Professional SaaS Branding Showcase (hidden on mobile) */}
        <div className="hidden md:flex md:w-1/2 bg-[#0F172A] p-12 flex-col justify-between relative overflow-hidden text-white border-r border-[#E5E7EB]">
          {/* Subtle blurred truck image overlay in background with 5-10% opacity */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.06] filter blur-[1px]"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1200')` }}
          ></div>
          <div className="absolute inset-0 bg-[#0F172A]/40"></div>

          <div className="relative z-10">
            <Logo textSize="text-xl" iconSize={28} />
          </div>

          <div className="relative z-10 flex flex-col gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 self-start">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-450 animate-ping"></span>
              Global Fleet Control Active
            </span>
            <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-white">
              Enterprise Logistics & Operations Console
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
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

        {/* Right Side: Clean Enterprise Light Login Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 bg-white">
          <div className="w-full max-w-sm mx-auto flex flex-col gap-6">
            
            {/* Header - Staggered delay */}
            <div className="flex flex-col gap-1 animate-slide-up-fade" style={{ animationDelay: '100ms' }}>
              <h2 className="font-display text-2xl font-extrabold text-[#0F172A] tracking-tight">Operator Sign In</h2>
              <p className="text-xs text-slate-500 font-medium">Enter your credentials to access your control workstation.</p>
            </div>

            {/* Error alerts - Staggered delay */}
            {error && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold animate-shake">
                <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
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
                    className="text-slate-400" 
                    style={{ position: 'absolute', left: '0.85rem', width: '1rem', height: '1rem', pointerEvents: 'none' }}
                  />
                  <input
                    type="email"
                    placeholder="operator@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    style={{ paddingLeft: '2.75rem', paddingRight: '1rem' }}
                    className="w-full py-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-slate-800 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500/20 transition-all hover:border-slate-300"
                  />
                </div>
              </div>

              {/* Password Block - Staggered delay & input padding fix */}
              <div className="flex flex-col gap-2 animate-slide-up-fade" style={{ animationDelay: '300ms' }}>
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Workstation Password</label>
                  <a href="#" className="text-xs text-[#2563EB] font-bold hover:underline">Forgot?</a>
                </div>
                <div className="relative flex items-center">
                  <Lock 
                    className="text-slate-400" 
                    style={{ position: 'absolute', left: '0.85rem', width: '1rem', height: '1rem', pointerEvents: 'none' }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                    className="w-full py-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-slate-800 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500/20 transition-all hover:border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
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
                  className="w-4 h-4 rounded border-slate-350 text-[#2563EB] focus:ring-blue-500/20 cursor-pointer"
                />
                <label htmlFor="remember" className="ml-2 text-xs text-slate-500 cursor-pointer select-none font-medium">
                  Remember my workstation
                </label>
              </div>

              {/* Submit Button - Staggered delay */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-[#2563EB] hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-60 shadow-md shadow-blue-500/10 animate-slide-up-fade"
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

            <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-100 mt-2 animate-slide-up-fade" style={{ animationDelay: '600ms' }}>
              Need assistance?{' '}
              <a href="#" className="font-semibold text-[#2563EB] hover:underline">Contact System Admin</a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
