import { saveOutbox } from './storage';

const SUBMIT_URL = import.meta.env.VITE_SUBMIT_URL || '/api/submit';

// Envía el diagnóstico a /api/submit (que lo reenvía al webhook).
// Si el endpoint no existe o no está configurado (desarrollo local / WEBHOOK_URL vacía),
// guarda una copia en localStorage ('elevvo_outbox') y continúa sin error.
export async function submitDiagnosis(payload) {
  let res;
  try {
    res = await fetch(SUBMIT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error('network');
  }

  const isJson = (res.headers.get('content-type') || '').includes('json');
  if (res.ok && isJson) return { mode: 'remote' };

  let code = '';
  if (isJson) {
    try {
      code = (await res.json()).error;
    } catch {
      /* ignore */
    }
  }

  // Endpoint inexistente (dev) o sin WEBHOOK_URL: copia local y seguimos.
  if (res.status === 404 || code === 'not_configured' || (res.ok && !isJson)) {
    saveOutbox(payload);
    console.warn('[ELEVVO] Sin webhook configurado: respuestas guardadas en localStorage (elevvo_outbox).');
    return { mode: 'local' };
  }
  throw new Error(`http_${res.status}`);
}
