interface LogoProps {
  className?: string;
  iconSize?: number;
  showText?: boolean;
  textSize?: string;
}

export default function Logo({
  className = '',
  iconSize = 32,
  showText = true,
  textSize = 'text-xl'
}: LogoProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-brand-blue-600 to-brand-blue-400 p-2 text-white shadow-lg shadow-brand-blue-500/20">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Abstract Delivery Truck representing logistics */}
          <rect x="2" y="8" width="12" height="9" rx="1.5" />
          <path d="M14 10l5 1.5V17h-5" />
          <circle cx="5.5" cy="17" r="1.5" fill="currentColor" />
          <circle cx="12.5" cy="17" r="1.5" fill="currentColor" />
          {/* Signal arrows indicating telemetry / smart routing */}
          <path d="M19 6l3 3-3 3" />
          <path d="M9 4h10" />
        </svg>
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
      </div>
      {showText && (
        <span className={`font-display font-extrabold tracking-tight ${textSize} bg-gradient-to-r from-white via-brand-blue-100 to-brand-blue-400 bg-clip-text text-transparent`}>
          Smart<span className="text-brand-blue-400 font-normal">Transport</span>Ops
        </span>
      )}
    </div>
  );
}
