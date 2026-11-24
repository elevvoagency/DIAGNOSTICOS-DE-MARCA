// Isotipo y logotipo oficiales de ELEVVO (public/isotipo.png, public/wordmark.png).
const WORDMARK_RATIO = 696 / 75;

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

export function Wordmark({ height = 16, className = '' }) {
  return (
    <img
      src="/wordmark.png"
      height={height}
      width={Math.round(height * WORDMARK_RATIO)}
      alt="ELEVVO"
      draggable="false"
      className={`select-none ${className}`}
      style={{ height, width: 'auto' }}
    />
  );
}

export function Logo({ size = 'md', className = '' }) {
  const big = size === 'lg';
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Isotipo size={big ? 44 : 28} />
      <Wordmark height={big ? 18 : 12} />
    </div>
  );
}
