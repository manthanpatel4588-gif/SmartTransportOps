import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react';
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
    }, 1500);
  };

  return (
    <div className="flex min-h-screen w-full bg-brand-navy-950 text-white font-sans overflow-hidden">
      {/* Background glowing blobs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-blue-500/5 rounded-full blur-3xl"></div>

      {/* Left side: Premium Branding & Live Analytics (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-7/12 relative flex-col justify-between p-12 border-r border-brand-navy-800 bg-brand-navy-950/50 backdrop-blur-md">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>

        <div className="relative z-10">
          <Logo textSize="text-2xl" iconSize={36} />
        </div>

        {/* Dynamic Telemetry Showcase */}
        <div className="relative z-10 my-auto max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-blue-500/10 border border-brand-blue-500/20 text-brand-blue-400 mb-6 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-brand-blue-400"></span>
            Global Fleet Operations Active
          </span>
          <h1 className="font-display text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight mb-4">
            Next-Gen Fleet Management & Logistics Orchestration
          </h1>
          <p className="text-brand-navy-400 text-lg leading-relaxed mb-8">
            Monitor, route, and optimize transport operations in real-time. Boost efficiency and minimize delays with AI-driven operations telemetry.
          </p>

          {/* Quick Metrics display */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-brand-navy-800">
            <div>
              <p className="text-brand-blue-400 font-display text-2xl font-bold">1,842</p>
              <p className="text-xs text-brand-navy-400 mt-1 uppercase tracking-wider">Active Fleets</p>
            </div>
            <div>
              <p className="text-brand-blue-400 font-display text-2xl font-bold">99.4%</p>
              <p className="text-xs text-brand-navy-400 mt-1 uppercase tracking-wider">On-Time Rate</p>
            </div>
            <div>
              <p className="text-brand-blue-400 font-display text-2xl font-bold">&lt; 14m</p>
              <p className="text-xs text-brand-navy-400 mt-1 uppercase tracking-wider">Dispatch Time</p>
            </div>
          </div>
        </div>

        {/* Live system state footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-brand-navy-500 border-t border-brand-navy-900 pt-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted Connection Active (AES-256)</span>
          </div>
          <span>v2.4.1-stable</span>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center items-center p-6 md:p-12 relative z-10">
        {/* Mobile Header */}
        <div className="lg:hidden w-full max-w-md mb-8 flex justify-center">
          <Logo textSize="text-xl" iconSize={30} />
        </div>

        <div className="w-full max-w-md">
          {/* Form Header */}
          <div className="mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
              Operator Sign In
            </h2>
            <p className="text-brand-navy-400 text-sm">
              Enter your credentials to access the logistics control center.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-shake">
                <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-brand-navy-300">
                Control Room Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-navy-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-brand-navy-900 border border-brand-navy-800 text-white placeholder-brand-navy-600 focus:outline-none focus:border-brand-blue-500 focus:ring-1 focus:ring-brand-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-brand-navy-300">
                  Operator Password
                </label>
                <a href="#" className="text-xs text-brand-blue-400 hover:text-brand-blue-300 transition-colors">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-navy-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-brand-navy-900 border border-brand-navy-800 text-white placeholder-brand-navy-600 focus:outline-none focus:border-brand-blue-500 focus:ring-1 focus:ring-brand-blue-500 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-navy-500 hover:text-brand-navy-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="h-4.5 w-4.5 rounded-md border-brand-navy-800 bg-brand-navy-900 text-brand-blue-500 focus:ring-brand-blue-500/20"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-brand-navy-400 cursor-pointer select-none">
                Remember my workstation
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full group flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-blue-600 to-brand-blue-500 hover:from-brand-blue-500 hover:to-brand-blue-400 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-brand-blue-600/20 disabled:opacity-75 disabled:pointer-events-none"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Verifying Operator...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Registration link placeholder */}
          <div className="mt-8 text-center text-sm text-brand-navy-400">
            Need workstation access?{' '}
            <a href="#" className="font-semibold text-brand-blue-400 hover:text-brand-blue-300 transition-colors">
              Contact Administrator
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
