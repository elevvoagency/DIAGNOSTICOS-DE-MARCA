import { useEffect } from 'react';
import { Logo } from './Logo';

export default function Welcome({ onStart }) {
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onStart();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onStart]);

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-10 sm:px-10">
      <Logo size="lg" className="mb-12 sm:mb-16" />
      <div className="mb-6 flex items-center gap-3 text-xs tracking-[0.28em] text-silver/60">
        <span>BRAND DISCOVERY · FASE 01</span>
        <span className="h-px w-10 bg-silver/30" />
      </div>
      <h1 className="text-4xl font-semibold leading-[1.1] sm:text-6xl">Diagnóstico inicial de marca personal</h1>
      <p className="mt-5 text-xl font-light italic text-silver sm:text-2xl">
        Construyamos una marca con propósito, identidad y dirección.
      </p>
      <p className="mt-8 max-w-2xl text-base font-light leading-relaxed text-silver/70 sm:text-lg">
        Este breve diagnóstico nos permitirá conocer tu esencia, entender tu industria, identificar tus fortalezas y
        definir hacia dónde quieres llevar tu marca personal.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-5">
        <button type="button" onClick={onStart} className="btn-primary group">
          Comenzar diagnóstico
          <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
        </button>
        <span className="hidden text-xs text-silver/40 sm:inline">
          presiona <kbd className="font-sans text-silver/70">Enter ↵</kbd>
        </span>
      </div>
      <p className="mt-16 text-[10px] tracking-[0.3em] text-silver/35 sm:text-xs">
        GROWTH · STRATEGY · DIGITAL TRANSFORMATION
      </p>
    </section>
  );
}
