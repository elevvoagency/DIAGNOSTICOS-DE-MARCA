import { PHASES, QUESTIONS } from '../data/questions';

const clean = (s) => (s || '').trim();

export function answerLines(q, v) {
  if (q.type === 'text') return clean(v) ? [clean(v)] : [];
  if (q.type === 'list') return (v || []).map(clean).filter(Boolean);
  if (q.type === 'services') {
    return (v || [])
      .filter((r) => clean(r.name) || clean(r.desc))
      .map((r) => `${clean(r.name)} — ${clean(r.desc)}`);
  }
  return [];
}

export function answerText(q, v) {
  const lines = answerLines(q, v);
  if (q.type === 'text') return lines[0] || '';
  return lines.map((l, i) => `${i + 1}. ${l}`).join('\n');
}

export function buildPayload(contact, answers) {
  return {
    source: 'elevvo-brand-discovery-fase-01',
    submittedAt: new Date().toISOString(),
    contact: {
      name: clean(contact.name),
      brand: clean(contact.brand),
      reach: clean(contact.reach),
    },
    answers: QUESTIONS.map((q, i) => {
      const ph = PHASES.find((p) => p.id === q.phase);
      return {
        n: i + 1,
        id: q.id,
        phase: `${String(ph.id).padStart(2, '0')}. ${ph.name}`,
        question: q.title,
        answer: answerText(q, answers[q.id]),
        raw: answers[q.id],
      };
    }),
  };
}

export function buildSummaryText(contact, answers) {
  const out = [
    'ELEVVO · GROWTH · STRATEGY · DIGITAL TRANSFORMATION',
    'BRAND DISCOVERY · FASE 01 — Diagnóstico inicial de marca personal',
    '',
    `Nombre: ${clean(contact.name)}`,
    `Marca / empresa: ${clean(contact.brand)}`,
    `Contacto: ${clean(contact.reach)}`,
    '',
  ];
  let lastPhase = 0;
  QUESTIONS.forEach((q, i) => {
    if (q.phase !== lastPhase) {
      const ph = PHASES.find((p) => p.id === q.phase);
      out.push(`── FASE ${String(ph.id).padStart(2, '0')}: ${ph.name} ──`, '');
      lastPhase = q.phase;
    }
    out.push(`${i + 1}. ${q.title}`, answerText(q, answers[q.id]) || '—', '');
  });
  return out.join('\n');
}

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function buildSummaryHtml(contact, answers) {
  let lastPhase = 0;
  const blocks = QUESTIONS.map((q, i) => {
    let head = '';
    if (q.phase !== lastPhase) {
      const ph = PHASES.find((p) => p.id === q.phase);
      head = `<h2>${String(ph.id).padStart(2, '0')}. ${esc(ph.name)}</h2>`;
      lastPhase = q.phase;
    }
    const lines = answerLines(q, answers[q.id]);
    const body =
      q.type === 'text'
        ? `<p>${esc(lines[0] || '—').replace(/\n/g, '<br>')}</p>`
        : `<ol>${lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ol>`;
    return `${head}<div class="q"><h3><span>${String(i + 1).padStart(2, '0')}</span>${esc(q.title)}</h3>${body}</div>`;
  }).join('');

  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
<title>Diagnóstico de marca · ${esc(clean(contact.brand))}</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
<style>
  @page { margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: Poppins, Arial, sans-serif; color: #0d1117; font-weight: 300; line-height: 1.55; margin: 0; }
  header { border-bottom: 2px solid #0d1117; padding-bottom: 14px; margin-bottom: 18px; }
  .brand { font-weight: 600; letter-spacing: .32em; font-size: 20px; }
  .tag { font-size: 9px; letter-spacing: .25em; color: #6b7280; margin-top: 4px; }
  h1 { font-size: 18px; font-weight: 600; margin: 16px 0 6px; }
  .meta { font-size: 12px; color: #374151; }
  .meta b { font-weight: 600; }
  h2 { font-size: 10px; letter-spacing: .22em; font-weight: 600; color: #6b7280; margin: 26px 0 8px; padding-top: 10px; border-top: 1px solid #d1d5db; break-after: avoid; }
  .q { break-inside: avoid; margin-bottom: 14px; }
  h3 { font-size: 13px; font-weight: 600; margin: 0 0 4px; }
  h3 span { color: #9ca3af; margin-right: 8px; font-weight: 400; }
  p, li { font-size: 12.5px; margin: 0; }
  ol { margin: 0; padding-left: 20px; }
</style></head><body>
<header>
  <div class="brand">ELEVVO</div>
  <div class="tag">GROWTH · STRATEGY · DIGITAL TRANSFORMATION</div>
  <h1>Diagnóstico inicial de marca personal</h1>
  <div class="meta"><b>Nombre:</b> ${esc(clean(contact.name))} &nbsp;·&nbsp; <b>Marca:</b> ${esc(clean(contact.brand))} &nbsp;·&nbsp; <b>Contacto:</b> ${esc(clean(contact.reach))}</div>
</header>
${blocks}
<script>window.addEventListener('load',function(){setTimeout(function(){window.print()},500)})</script>
</body></html>`;
}
