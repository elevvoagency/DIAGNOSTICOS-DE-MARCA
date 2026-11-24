import { useEffect, useRef } from 'react';

export function TextAreaField({ value, onChange, placeholder = 'Escribe tu respuesta aquí…' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  return (
    <textarea
      ref={ref}
      rows={3}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="field resize-none leading-relaxed"
    />
  );
}

export function TextField({ label, value, onChange, placeholder, type = 'text', autoComplete, inputMode }) {
  return (
    <label className="block">
      <span className="text-xs tracking-[0.2em] text-silver/60">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="field"
      />
    </label>
  );
}

export function ListField({ value, onChange, min, max, addLabel, examples, twoCols }) {
  const ref = useRef(null);
  const filled = value.filter((v) => v.trim()).length;
  const set = (i, v) => onChange(value.map((x, j) => (j === i ? v : x)));
  const add = () => {
    if (value.length >= max) return;
    onChange([...value, '']);
    setTimeout(() => {
      const f = ref.current?.querySelectorAll('input');
      f?.[f.length - 1]?.focus();
    }, 60);
  };
  return (
    <div ref={ref}>
      <div className={`grid gap-x-10 gap-y-1 ${twoCols ? 'md:grid-cols-2' : ''}`}>
        {value.map((v, i) => (
          <label key={i} className="group flex items-baseline gap-4">
            <span className="w-7 shrink-0 text-xs tabular-nums text-silver/40 transition-colors group-focus-within:text-white">
              {String(i + 1).padStart(2, '0')}
            </span>
            <input
              value={v}
              onChange={(e) => set(i, e.target.value)}
              placeholder={examples?.[i] ? `Ej. ${examples[i]}` : ''}
              aria-label={`${i + 1}`}
              className="field-sm"
            />
          </label>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between gap-4 text-sm">
        <button
          type="button"
          onClick={add}
          disabled={value.length >= max}
          className="text-silver/70 transition hover:text-white disabled:opacity-30"
        >
          + {addLabel}
        </button>
        <span className="tabular-nums text-silver/50">
          {filled} / {min} mínimo
        </span>
      </div>
    </div>
  );
}

export function ServicesField({ value, onChange }) {
  const set = (i, k, v) => onChange(value.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  return (
    <div className="space-y-6">
      {value.map((r, i) => (
        <div key={i} className="group flex items-baseline gap-4">
          <span className="w-7 shrink-0 text-xs tabular-nums text-silver/40 transition-colors group-focus-within:text-white">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className="grid flex-1 gap-x-8 gap-y-1 md:grid-cols-[1fr_1.5fr]">
            <input
              value={r.name}
              onChange={(e) => set(i, 'name', e.target.value)}
              placeholder="Producto o servicio"
              aria-label={`Producto o servicio ${i + 1}`}
              className="field-sm font-medium"
            />
            <input
              value={r.desc}
              onChange={(e) => set(i, 'desc', e.target.value)}
              placeholder="¿En qué consiste?"
              aria-label={`¿En qué consiste el producto o servicio ${i + 1}?`}
              className="field-sm"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
