import { useState } from 'react';
import { Isotipo } from './Logo';
import { buildSummaryHtml, buildSummaryText } from '../lib/summary';

const WA = (import.meta.env.VITE_WHATSAPP_NUMBER || '573104213595').replace(/\D/g, '');
const CALENDLY = import.meta.env.VITE_CALENDLY_URL || '';

export default function Final({ contact, answers, submitted, status, onRetry }) {
  const [copied, setCopied] = useState(false);
  const first = contact.name.trim().split(/\s+/)[0] || '';

  const copy = async () => {
    const text = buildSummaryText(contact, answers);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const pdf = () => {
    const w = window.open('', '_blank');
    if (!w) {
      // Pop-up bloqueado: descarga como texto.
      const blob = new Blob([buildSummaryText(contact, answers)], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'diagnostico-elevvo.txt';
      a.click();
      return;
    }
    w.document.open();
    w.document.write(buildSummaryHtml(contact, answers));
    w.document.close();
  };

  const waText = encodeURIComponent(
    `Hola, soy ${contact.name.trim()} (${contact.brand.trim()}). Acabo de completar el Diagnóstico inicial de marca personal de ELEVVO y quiero agendar mi sesión.`
  );

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-10 text-center sm:px-10">
      <Isotipo size={56} className="mx-auto" />
      <h1 className="mt-6 text-4xl font-semibold tracking-[0.34em] sm:text-6xl">ELEVVO</h1>
      <p className="mt-4 text-[11px] tracking-[0.3em] text-silver/70 sm:text-sm">
        GROWTH · STRATEGY · DIGITAL TRANSFORMATION
      </p>
      <p className="mx-auto mt-8 max-w-xl text-xl font-light italic text-silver sm:text-2xl">
        El punto de partida para construir una marca con propósito, identidad y dirección.
      </p>
      <p className="mx-auto mt-6 max-w-xl font-light text-silver/60">
        {first ? `Gracias, ${first}. ` : ''}Recibimos tu diagnóstico{contact.brand.trim() ? ` de ${contact.brand.trim()}` : ''}.
      </p>

      {!submitted && (
        <div className="mx-auto mt-6 max-w-md rounded-xl border border-rose-300/30 bg-rose-300/5 p-4 text-sm text-rose-200">
          Tus respuestas aún no se han enviado.{' '}
          <button type="button" onClick={onRetry} disabled={status === 'sending'} className="underline underline-offset-4">
            {status === 'sending' ? 'Enviando…' : 'Reintentar envío'}
          </button>
        </div>
      )}

      <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <a
          href={`https://wa.me/${WA}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary group justify-center"
        >
          Agendar mi sesión por WhatsApp
          <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
        </a>
        {CALENDLY && (
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="btn-outline justify-center">
            Agendar en Calendly
          </a>
        )}
      </div>
      <div className="mt-3 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <button type="button" onClick={pdf} className="btn-outline justify-center">
          Descargar resumen (PDF)
        </button>
        <button type="button" onClick={copy} className="btn-outline justify-center">
          {copied ? '¡Copiado!' : 'Copiar resumen'}
        </button>
      </div>
    </section>
  );
}
