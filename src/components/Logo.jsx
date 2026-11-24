// Isotipo oficial de ELEVVO (public/isotipo.png).
export function Isotipo({ size = 32, className = '' }) {
  return (
    <img
      src="/isotipo.png"
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      draggable="false"
      className={`select-none object-contain ${className}`}
    />
  );
}

export function Logo({ size = 'md', className = '' }) {
  const big = size === 'lg';
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-label="ELEVVO">
      <Isotipo size={big ? 44 : 28} />
      <span className={`font-normal text-white ${big ? 'text-2xl tracking-[0.42em]' : 'text-base tracking-[0.38em]'}`}>
        ELEVVO
      </span>
    </div>
  );
}
