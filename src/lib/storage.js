const KEY = 'elevvo_diag_v2';

// ?reset=1 limpia el progreso guardado (útil para pruebas).
export function loadState() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has('reset')) {
      localStorage.removeItem(KEY);
      window.history.replaceState(null, '', window.location.pathname);
      return null;
    }
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* almacenamiento no disponible: se ignora */
  }
}

export function saveOutbox(payload) {
  try {
    const list = JSON.parse(localStorage.getItem('elevvo_outbox') || '[]');
    list.push(payload);
    localStorage.setItem('elevvo_outbox', JSON.stringify(list));
  } catch {
    /* ignore */
  }
}
