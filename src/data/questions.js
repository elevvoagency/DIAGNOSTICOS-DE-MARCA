export const PHASES = [
  { id: 1, name: 'ESENCIA Y VALORES' },
  { id: 2, name: 'CONTEXTO DE INDUSTRIA' },
  { id: 3, name: 'PROPÓSITO Y PROYECCIÓN' },
];

// type: 'text' | 'list' | 'services'
export const QUESTIONS = [
  // FASE 01 · ESENCIA Y VALORES
  {
    id: 'q1',
    phase: 1,
    type: 'list',
    title: '¿Por qué quieres que te conozcan?',
    hint: 'Escribe 3 palabras clave con las que te gustaría que las personas te identificaran.',
    base: 3,
    min: 3,
    max: 3,
    placeholder: 'Palabra clave',
    errorMsg: 'Completa las 3 palabras clave para continuar.',
  },
  {
    id: 'q2',
    phase: 1,
    type: 'text',
    title: '¿Cuáles son tus valores no negociables?',
    hint: 'Menciona al menos 2 valores que representen tu forma de ser y trabajar.',
  },
  {
    id: 'q3',
    phase: 1,
    type: 'text',
    title: '¿Cuál es tu visión?',
    hint: '¿Qué quieres lograr profesionalmente y cómo visualizas tu futuro?',
  },
  {
    id: 'q4',
    phase: 1,
    type: 'text',
    title: '¿Qué impacto quieres generar?',
    hint: '¿Qué te gustaría aportar o cambiar a través de tu trabajo?',
  },
  // FASE 02 · CONTEXTO DE INDUSTRIA
  {
    id: 'q5',
    phase: 2,
    type: 'text',
    title: '¿En qué industria o sector trabajas?',
    hint: 'Cuéntanos brevemente a qué te dedicas y cuál es tu especialidad.',
  },
  {
    id: 'q6',
    phase: 2,
    type: 'list',
    title: '¿Cuáles son los 3 productos o servicios más vendidos o solicitados en tu industria?',
    hint: '',
    base: 3,
    min: 3,
    max: 3,
    placeholder: 'Producto o servicio',
    errorMsg: 'Completa los 3 productos o servicios para continuar.',
  },
  {
    id: 'q7',
    phase: 2,
    type: 'text',
    title: '¿Cuál consideras que es tu diferencial dentro de la industria?',
    hint: '¿Qué te hace diferente frente a otras personas o empresas?',
  },
  // FASE 03 · PROPÓSITO Y PROYECCIÓN
  {
    id: 'q8',
    phase: 3,
    type: 'text',
    title: '¿Cuál es tu propósito?',
    hint: '¿Por qué haces lo que haces y qué te motiva a continuar?',
  },
  {
    id: 'q9',
    phase: 3,
    type: 'list',
    title: '¿Qué tres temas te gustaría compartir en tus redes sociales?',
    hint: '',
    base: 3,
    min: 3,
    max: 3,
    placeholder: 'Tema',
    errorMsg: 'Escribe los 3 temas para continuar.',
  },
  {
    id: 'q10',
    phase: 3,
    type: 'text',
    title: '¿Cuáles son tus expectativas con este proyecto?',
    hint: '¿Cómo te gustaría verte al finalizar este proceso? ¿Qué metas quieres alcanzar y qué esperas obtener de tu marca personal?',
  },
];

export const TOTAL = QUESTIONS.length;

export function initialValue(q) {
  if (q.type === 'text') return '';
  if (q.type === 'list') return Array(q.base).fill('');
  if (q.type === 'services') return Array.from({ length: q.rows }, () => ({ name: '', desc: '' }));
  return '';
}

export function initialAnswers() {
  return Object.fromEntries(QUESTIONS.map((q) => [q.id, initialValue(q)]));
}

// Devuelve '' si es válida, o el mensaje de error.
export function validate(q, v) {
  if (q.type === 'text') {
    return (v || '').trim().length >= 3 ? '' : 'Cuéntanos un poco más para poder continuar.';
  }
  if (q.type === 'list') {
    const filled = (v || []).filter((s) => s.trim()).length;
    return filled >= q.min ? '' : q.errorMsg;
  }
  if (q.type === 'services') {
    const r = (v || [])[0];
    return r && r.name.trim() && r.desc.trim() ? '' : q.errorMsg;
  }
  return '';
}

// Depura respuestas guardadas con otra versión del formulario: si la forma no coincide, usa el valor inicial.
export function sanitizeAnswers(saved) {
  const out = initialAnswers();
  if (!saved || typeof saved !== 'object') return out;
  for (const q of QUESTIONS) {
    const v = saved[q.id];
    if (q.type === 'text' && typeof v === 'string') out[q.id] = v;
    else if (q.type === 'list' && Array.isArray(v) && v.every((x) => typeof x === 'string')) {
      const arr = v.slice(0, q.max);
      while (arr.length < q.base) arr.push('');
      out[q.id] = arr;
    } else if (
      q.type === 'services' &&
      Array.isArray(v) &&
      v.length === q.rows &&
      v.every((r) => r && typeof r.name === 'string' && typeof r.desc === 'string')
    ) out[q.id] = v;
  }
  return out;
}
