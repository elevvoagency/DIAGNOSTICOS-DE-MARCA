// Isotipo aproximado (doble flecha ascendente). Reemplazable por el isotipo oficial en /public.
export function Isotipo({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="elv-g" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#D1D5DB" />
        </linearGradient>
      </defs>
      <path d="M7 26 L24 9 L41 26" stroke="url(#elv-g)" strokeWidth="4.5" strokeLinecap="square" />
      <path d="M7 40 L24 23 L41 40" stroke="url(#elv-g)" strokeWidth="4.5" strokeLinecap="square" opacity="0.5" />
    </svg>
  );
}

export function Logo({ size = 'md', className = '' }) {
  const big = size === 'lg';
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Isotipo size={big ? 44 : 28} />
      <span className={`font-semibold text-white ${big ? 'text-2xl tracking-[0.38em]' : 'text-base tracking-[0.34em]'}`}>
        ELEVVO
      </span>
    </div>
  );
}
