import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Estructura común de cada pantalla: título, ayuda, campos, error y navegación.
// Maneja Enter: avanza al siguiente campo y, en el último, a la siguiente pantalla.
// En <textarea>, Shift+Enter inserta salto de línea.
export default function StepShell({
  eyebrow,
  title,
  hint,
  children,
  error,
  shakeKey = 0,
  onNext,
  onPrev,
  nextLabel = 'Siguiente',
  multiline = false,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => {
      const fields = [...(ref.current?.querySelectorAll('input,textarea') || [])];
      const target = fields.find((f) => !f.value) || fields[0];
      target?.focus({ preventScroll: true });
    }, 380);
    return () => clearTimeout(t);
  }, []);

  const onKeyDown = (e) => {
    if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;
    const el = e.target;
    if (el.tagName === 'BUTTON') return;
    if (el.tagName === 'TEXTAREA' && e.shiftKey) return;
    e.preventDefault();
    const fields = [...ref.current.querySelectorAll('input,textarea')];
    const i = fields.indexOf(el);
    if (i >= 0 && i < fields.length - 1) fields[i + 1].focus();
    else onNext();
  };

  return (
    <section ref={ref} onKeyDown={onKeyDown} className="mx-auto w-full max-w-3xl px-6 py-8 sm:px-10">
      <div className="mb-5 flex items-center gap-3 text-xs tracking-[0.25em] text-silver/60">
        <span>{eyebrow}</span>
        <span className="h-px w-10 bg-silver/30" />
      </div>
      <h2 className="text-2xl font-semibold leading-tight text-white sm:text-4xl">{title}</h2>
      {hint && <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-silver/70 sm:text-lg">{hint}</p>}

      <motion.div
        key={shakeKey}
        className="mt-8"
        animate={shakeKey ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>

      <p role="alert" className="mt-4 min-h-[1.5rem] text-sm text-rose-300">
        {error}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {onPrev && (
          <button type="button" onClick={onPrev} className="btn-ghost">
            <span aria-hidden>←</span> Anterior
          </button>
        )}
        <button type="button" onClick={onNext} className="btn-primary group">
          {nextLabel}
          <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
        </button>
        <span className="hidden text-xs text-silver/40 sm:inline">
          presiona <kbd className="font-sans text-silver/70">Enter ↵</kbd>
          {multiline && ' · Shift + Enter para salto de línea'}
        </span>
      </div>
    </section>
  );
}
