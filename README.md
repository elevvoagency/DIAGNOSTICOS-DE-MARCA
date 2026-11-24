# ELEVVO · Diagnóstico inicial de marca personal

Quiz funnel de una pregunta por pantalla (Vite + React + Tailwind + Framer Motion).
Al terminar, el diagnóstico llega como **PDF adjunto por correo** a elevvocorp@gmail.com.

## Correr en local
```bash
npm install
npm run dev
```
Abre http://localhost:5173. Para borrar el progreso guardado: `?reset=1` al final de la URL.
(En local no existe `/api/submit`; las respuestas quedan en `localStorage`, clave `elevvo_outbox`. Para probar el correo usa `npx netlify dev` con las variables en `.env`.)

## 1. Activar el envío del PDF por correo (Resend, gratis)
1. Crea una cuenta en https://resend.com **con el correo elevvocorp@gmail.com**.
   Con el remitente de prueba (`onboarding@resend.dev`) Resend solo entrega al correo de la propia cuenta, y justo es el destino.
2. En Resend → **API Keys** → *Create API Key* (permiso "Sending access"). Copia la clave (`re_...`).
3. Guárdala como variable `RESEND_API_KEY` en Netlify (paso siguiente).

*Opcional:* si verificas `elevvoagency.com` en Resend → Domains, puedes enviar desde `diagnostico@elevvoagency.com` (`MAIL_FROM`) y a cualquier destino (`MAIL_TO`).

## 2. Desplegar en Netlify (link público)
Sitio ya creado en tu cuenta: **elevvo-diagnostico** → https://elevvo-diagnostico.netlify.app
1. Sube esta carpeta a un repo de GitHub y en Netlify → *Project configuration → Build & deploy → Link repository*.
   (Build: `npm run build`, publish: `dist`; ya está en `netlify.toml`.)
2. En *Project configuration → Environment variables* agrega `RESEND_API_KEY` (alcance: Functions) y, si quieres, `VITE_CALENDLY_URL`.
3. Deploy. El diagnóstico queda en https://elevvo-diagnostico.netlify.app (puedes enlazar un subdominio propio en *Domain management*).

> Si cambias variables después, haz un nuevo deploy para que apliquen.

## Cómo funciona el envío
El navegador envía el JSON a `/api/submit` (`netlify/functions/submit.mts`), que genera el PDF (`lib/pdf.js`) y lo manda por Resend. Si además defines `WEBHOOK_URL`, reenvía el mismo JSON (Make, n8n, Sheets...). Basta con que un canal funcione para considerar el envío exitoso.
- Sin `RESEND_API_KEY` ni `WEBHOOK_URL`, la app funciona pero las respuestas solo quedan en el navegador del cliente. **Configúralo antes de compartir el link.**
- Si el envío falla, el cliente ve "Reintentar"; sus respuestas no se pierden.
- Los errores de entrega quedan en Netlify → Logs → Functions (`[ELEVVO submit]`).

## Personalizar
- Preguntas y fases: `src/data/questions.js`
- Diseño del PDF: `lib/pdf.js`
- Colores y tipografía: `tailwind.config.js` y `src/index.css`
- Isotipo: `src/components/Logo.jsx` y `lib/pdf.js` (aproximación; reemplázalo por el oficial)
