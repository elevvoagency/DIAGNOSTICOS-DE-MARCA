// Netlify Function → POST /api/submit
// 1) Genera el PDF con las respuestas y lo envía por correo (Resend) a MAIL_TO.
// 2) Opcional: reenvía el JSON a WEBHOOK_URL (Make, n8n, Sheets...).
import type { Config } from '@netlify/functions';
// @ts-ignore (módulo JS)
import { buildPdf } from '../../lib/pdf.js';

const oneLine = (s: unknown) => String(s ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, 120);
const esc = (s: unknown) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = (s: unknown) =>
  oneLine(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'cliente';
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

async function sendEmail(payload: any, key: string) {
  const to = Netlify.env.get('MAIL_TO') || 'elevvocorp@gmail.com';
  const from = Netlify.env.get('MAIL_FROM') || 'ELEVVO Diagnóstico <onboarding@resend.dev>';
  const { contact } = payload;
  const pdf = await buildPdf(payload);
  const brand = oneLine(contact.brand);
  const name = oneLine(contact.name);

  const html = `<div style="font-family:Arial,sans-serif;color:#0d1117;max-width:560px">
  <p style="letter-spacing:.3em;font-weight:700;margin:0">ELEVVO</p>
  <p style="font-size:11px;letter-spacing:.2em;color:#6b7280;margin:2px 0 20px">BRAND DISCOVERY · FASE 01</p>
  <h2 style="margin:0 0 12px">Nuevo diagnóstico de marca personal</h2>
  <p style="margin:0 0 4px"><b>Nombre:</b> ${esc(name)}</p>
  <p style="margin:0 0 4px"><b>Marca / empresa:</b> ${esc(brand)}</p>
  <p style="margin:0 0 16px"><b>Contacto:</b> ${esc(oneLine(contact.reach))}</p>
  <p style="margin:0;color:#374151">Las respuestas completas van en el PDF adjunto.</p></div>`;
  const text = `Nuevo diagnóstico de marca personal\nNombre: ${name}\nMarca: ${brand}\nContacto: ${oneLine(contact.reach)}\n\nLas respuestas completas van en el PDF adjunto.`;

  const body: Record<string, unknown> = {
    from,
    to: [to],
    subject: `Nuevo diagnóstico de marca · ${brand} (${name})`,
    html,
    text,
    attachments: [{ filename: `diagnostico-${slug(brand)}.pdf`, content: Buffer.from(pdf).toString('base64') }],
  };
  const reach = oneLine(contact.reach);
  if (isEmail(reach)) body.reply_to = reach;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`resend_${r.status}: ${(await r.text()).slice(0, 300)}`);
}

async function sendWebhook(payload: unknown, url: string) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`webhook_${r.status}`);
}

export default async (req: Request) => {
  if (req.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);

  const key = Netlify.env.get('RESEND_API_KEY');
  const hook = Netlify.env.get('WEBHOOK_URL');
  if (!key && !hook) return json({ ok: false, error: 'not_configured' }, 503);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }
  if (!body || !body.contact || !Array.isArray(body.answers) || body.answers.length > 50) {
    return json({ ok: false, error: 'invalid_payload' }, 400);
  }

  const jobs: Promise<void>[] = [];
  if (key) jobs.push(sendEmail(body, key));
  if (hook) jobs.push(sendWebhook(body, hook));
  const results = await Promise.allSettled(jobs);
  results.forEach((r) => r.status === 'rejected' && console.error('[ELEVVO submit]', (r.reason as Error)?.message || r.reason));

  // Éxito si al menos un canal entregó el diagnóstico.
  if (results.some((r) => r.status === 'fulfilled')) return json({ ok: true });
  return json({ ok: false, error: 'delivery_failed' }, 502);
};

export const config: Config = { path: '/api/submit' };
