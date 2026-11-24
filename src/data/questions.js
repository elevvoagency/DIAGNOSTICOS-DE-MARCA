export const PHASES = [
  { id: 1, name: 'ESENCIA Y POSICIONAMIENTO' },
  { id: 2, name: 'CONTEXTO DE NEGOCIO E INDUSTRIA' },
  { id: 3, name: 'HISTORIA Y PROPÓSITO' },
  { id: 4, name: 'PROYECCIÓN DE MARCA' },
  { id: 5, name: 'CIERRE DEL DIAGNÓSTICO' },
];

// type: 'text' | 'list' | 'services'
export const QUESTIONS = [
  // FASE 01
  {
    id: 'q1',
    phase: 1,
    type: 'list',
    title: '¿Por qué quieres que te conozcan?',
    hint: 'Escribe 7 palabras clave que te gustaría que las personas asociaran contigo y con tu marca personal. (Ejemplo: liderazgo, innovación, confianza, creatividad, experiencia, estrategia, transformación).',
    base: 7,
    min: 7,
    max: 13,
    addLabel: 'Añadir otra palabra',
    examples: ['Liderazgo', 'Innovación', 'Confianza', 'Creatividad', 'Experiencia', 'Estrategia', 'Transformación'],
    twoCols: true,
    errorMsg: 'Completa las 7 palabras clave para continuar.',
  },
  {
    id: 'q2',
    phase: 1,
    type: 'text',
    title: '¿Cuáles son tus valores no negociables?',
    hint: 'Menciona entre 3 y 5 principios que guían tu manera de trabajar, relacionarte con los demás y tomar decisiones.',
  },
  {
    id: 'q3',
    phase: 1,
    type: 'text',
    title: '¿Cuál es tu visión?',
    hint: '¿Qué te gustaría lograr profesionalmente en los próximos años? ¿Cómo te gustaría que evolucionara tu marca personal?',
  },
  {
    id: 'q4',
    phase: 1,
    type: 'text',
    title: '¿Qué impacto quieres generar?',
    hint: '¿Qué te gustaría aportar a las personas, empresas o comunidad a través de tu trabajo?',
  },
  // FASE 02
  {
    id: 'q5',
    phase: 2,
    type: 'text',
    title: '¿En qué industria o sector trabajas actualmente?',
    hint: 'Describe brevemente a qué te dedicas, en qué mercado te mueves y cuál es tu especialidad.',
  },
  {
    id: 'q6',
    phase: 2,
    type: 'text',
    title: '¿Quién es tu cliente o público principal?',
    hint: '¿A qué tipo de personas, empresas o perfiles van dirigidos tus productos o servicios?',
  },
  {
    id: 'q7',
    phase: 2,
    type: 'services',
    title: '¿Cuáles son tus 3 productos o servicios más vendidos o solicitados?',
    hint: 'Queremos identificar qué es lo que realmente mueve tu negocio y cuáles son tus principales líneas comerciales.',
    rows: 3,
    errorMsg: 'Completa al menos tu primer producto o servicio y en qué consiste.',
  },
  {
    id: 'q8',
    phase: 2,
    type: 'text',
    title: '¿Qué te diferencia de otras personas o empresas de tu industria?',
    hint: '¿Qué haces diferente? ¿Por qué alguien debería elegirte a ti y no a otra alternativa?',
  },
  // FASE 03
  {
    id: 'q9',
    phase: 3,
    type: 'text',
    title: 'Tu nota de fundadora / fundador: ¿Por qué haces lo que haces?',
    hint: 'Queremos conocer tu motivación personal y profesional. No necesitas escribir algo perfecto, simplemente contar tu historia: ¿Por qué empezaste a hacer lo que haces? ¿Qué te motivó a entrar en esta industria? ¿Qué te impulsa a continuar?',
  },
  {
    id: 'q10',
    phase: 3,
    type: 'text',
    title: '¿Qué problema estás resolviendo actualmente?',
    hint: '¿Cuál es la necesidad, dificultad o situación que ayudas a solucionar a través de tu trabajo?',
  },
  {
    id: 'q11',
    phase: 3,
    type: 'text',
    title: '¿Cuál es la transformación que quieres ofrecer?',
    hint: '¿Cómo quieres que cambie la vida, el negocio o la experiencia de las personas después de trabajar contigo o adquirir tus productos?',
  },
  // FASE 04
  {
    id: 'q12',
    phase: 4,
    type: 'text',
    title: '¿Qué te gustaría conseguir con tu marca personal?',
    hint: '¿Qué esperas que tu marca te ayude a lograr? (Ejemplos: reconocimiento, autoridad en la industria, nuevos clientes, oportunidades comerciales, alianzas estratégicas o posicionamiento).',
  },
  {
    id: 'q13',
    phase: 4,
    type: 'list',
    title: '¿Qué temas te gustaría compartir en tus redes sociales?',
    hint: 'Menciona entre 3 y 5 temas sobre los que te sientas cómodo hablando, enseñando o creando contenido.',
    base: 5,
    min: 3,
    max: 9,
    addLabel: 'Añadir otro tema',
    twoCols: false,
    errorMsg: 'Menciona al menos 3 temas para continuar.',
  },
  // FASE 05
  {
    id: 'q14',
    phase: 5,
    type: 'text',
    title: 'Si alguien descubre tu marca personal por primera vez, ¿qué te gustaría que pensara, sintiera o recordara de ti?',
    hint: '',
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
