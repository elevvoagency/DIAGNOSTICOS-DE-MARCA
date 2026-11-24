// Genera el PDF del diagnóstico en el servidor (pdf-lib, sin navegador).
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ISOTIPO_PNG_BASE64 } from './isotipo.js';

const INK = rgb(0.051, 0.067, 0.09); // #0D1117
const SILVER = rgb(0.82, 0.835, 0.859); // #D1D5DB
const GRAY = rgb(0.42, 0.45, 0.5);
const LINE = rgb(0.82, 0.835, 0.859);
const W = 595.28;
const H = 841.89;
const M = 48;

export async function buildPdf({ contact, answers, submittedAt }) {
  const pdf = await PDFDocument.create();
  const reg = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const ital = await pdf.embedFont(StandardFonts.HelveticaOblique);
  const ok = new Set(reg.getCharacterSet());

  const clean = (s) =>
    Array.from(String(s ?? '').replace(/\r/g, '').replace(/\t/g, '  '))
      .map((ch) => {
        if (ch === '\n') return ch;
        const cp = ch.codePointAt(0);
        if (ok.has(cp)) return ch;
        if (ch === '→') return '->';
        if (ch === '←') return '<-';
        return '?';
      })
      .join('');

  const wrap = (text, font, size, maxW) => {
    const out = [];
    for (const para of clean(text).split('\n')) {
      if (!para.trim()) {
        out.push('');
        continue;
      }
      let line = '';
      for (const word of para.split(/\s+/)) {
        let w = word;
        // palabra más larga que la línea: partirla
        while (font.widthOfTextAtSize(w, size) > maxW) {
          let cut = w.length;
          while (cut > 1 && font.widthOfTextAtSize(w.slice(0, cut), size) > maxW) cut--;
          if (line) {
            out.push(line);
            line = '';
          }
          out.push(w.slice(0, cut));
          w = w.slice(cut);
        }
        const test = line ? `${line} ${w}` : w;
        if (font.widthOfTextAtSize(test, size) <= maxW) line = test;
        else {
          out.push(line);
          line = w;
        }
      }
      if (line) out.push(line);
    }
    return out;
  };

  const spaced = (page, text, x, y, font, size, color, spacing) => {
    let cx = x;
    for (const ch of clean(text)) {
      page.drawText(ch, { x: cx, y, size, font, color });
      cx += font.widthOfTextAtSize(ch, size) + spacing;
    }
    return cx;
  };

  const chevrons = (page, x, y, s, color) => {
    const t = 2.4;
    const line = (x1, y1, x2, y2, opacity) =>
      page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness: t, color, opacity });
    line(x, y + s * 0.35, x + s / 2, y + s * 0.85, 1);
    line(x + s / 2, y + s * 0.85, x + s, y + s * 0.35, 1);
    line(x, y - s * 0.1, x + s / 2, y + s * 0.4, 0.5);
    line(x + s / 2, y + s * 0.4, x + s, y - s * 0.1, 0.5);
  };

  // ── Página 1: cabecera de marca ──
  let page = pdf.addPage([W, H]);
  page.drawRectangle({ x: 0, y: H - 96, width: W, height: 96, color: INK });
  const iso = await pdf.embedPng(Buffer.from(ISOTIPO_PNG_BASE64, 'base64'));
  page.drawImage(iso, { x: M - 2, y: H - 74, width: 30, height: 30 });
  spaced(page, 'ELEVVO', M + 36, H - 58, bold, 19, rgb(1, 1, 1), 5);
  spaced(page, 'GROWTH  ·  STRATEGY  ·  DIGITAL TRANSFORMATION', M + 36, H - 76, reg, 7, SILVER, 1.6);
  spaced(page, 'BRAND DISCOVERY  ·  FASE 01', W - M - 150, H - 58, reg, 7, SILVER, 1.6);

  let y = H - 96 - 38;
  page.drawText(clean('Diagnóstico inicial de marca personal'), { x: M, y, size: 19, font: bold, color: INK });
  y -= 26;

  const fecha = (() => {
    try {
      return new Date(submittedAt).toLocaleString('es-CO', { timeZone: 'America/Bogota', dateStyle: 'long', timeStyle: 'short' });
    } catch {
      return String(submittedAt || '');
    }
  })();
  const meta = [
    ['NOMBRE', contact.name],
    ['MARCA / EMPRESA', contact.brand],
    ['CONTACTO', contact.reach],
    ['FECHA', fecha],
  ];
  for (const [k, v] of meta) {
    spaced(page, k, M, y, reg, 7, GRAY, 1.4);
    const lines = wrap(v || '—', bold, 10.5, W - M * 2 - 110);
    lines.forEach((l, i) => page.drawText(l, { x: M + 110, y: y - i * 14, size: 10.5, font: bold, color: INK }));
    y -= Math.max(1, lines.length) * 14 + 4;
  }
  y -= 6;

  const newPage = () => {
    page = pdf.addPage([W, H]);
    y = H - M;
  };
  const ensure = (h) => {
    if (y - h < M + 24) newPage();
  };

  // ── Respuestas ──
  let lastPhase = '';
  for (const a of answers) {
    const qLines = wrap(a.question, bold, 11.5, W - M * 2 - 26);
    const aLines = wrap(a.answer || '—', reg, 10.5, W - M * 2 - 26);

    if (a.phase !== lastPhase) {
      ensure(70);
      y -= 12;
      page.drawLine({ start: { x: M, y: y + 12 }, end: { x: W - M, y: y + 12 }, thickness: 0.6, color: LINE });
      spaced(page, a.phase, M, y - 4, bold, 8, GRAY, 1.8);
      y -= 24;
      lastPhase = a.phase;
    }

    // Mantener título + al menos 2 líneas de respuesta juntos
    ensure(qLines.length * 15 + Math.min(aLines.length, 2) * 14 + 10);
    page.drawText(String(a.n).padStart(2, '0'), { x: M, y, size: 9, font: reg, color: GRAY });
    for (const l of qLines) {
      page.drawText(l, { x: M + 26, y, size: 11.5, font: bold, color: INK });
      y -= 15;
    }
    y -= 1;
    for (const l of aLines) {
      ensure(14);
      if (l) page.drawText(l, { x: M + 26, y, size: 10.5, font: reg, color: rgb(0.2, 0.23, 0.28) });
      y -= 14;
    }
    y -= 12;
  }

  // ── Pie en todas las páginas ──
  const pages = pdf.getPages();
  pages.forEach((p, i) => {
    spaced(p, 'ELEVVO  ·  GROWTH  ·  STRATEGY  ·  DIGITAL TRANSFORMATION', M, 26, reg, 6.5, GRAY, 1.2);
    const t = `${i + 1} / ${pages.length}`;
    p.drawText(t, { x: W - M - reg.widthOfTextAtSize(t, 8), y: 26, size: 8, font: ital, color: GRAY });
  });

  return pdf.save();
}
