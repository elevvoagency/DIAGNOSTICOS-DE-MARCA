import { useState } from 'react';
import StepShell from './StepShell';
import { TextField } from './fields';

const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
const isPhone = (s) => s.replace(/\D/g, '').length >= 7;

function check(c) {
  if (c.name.trim().length < 3) return 'Escribe tu nombre completo.';
  if (c.brand.trim().length < 2) return 'Escribe el nombre de tu marca o empresa.';
  const r = c.reach.trim();
  if (!isEmail(r) && !isPhone(r)) return 'Escribe un WhatsApp (con indicativo) o un correo válido.';
  return '';
}

export default function ContactStep({ value, onChange, onNext, onPrev }) {
  const [error, setError] = useState('');
  const [shake, setShake] = useState(0);
  const set = (k) => (v) => {
    onChange({ ...value, [k]: v });
    if (error) setError('');
  };
  const next = () => {
    const msg = check(value);
    if (msg) {
      setError(msg);
      setShake((s) => s + 1);
      return;
    }
    onNext();
  };

  return (
    <StepShell
      eyebrow="ANTES DE EMPEZAR"
      title="Cuéntanos quién eres"
      hint="Con estos datos asociamos tu diagnóstico a tu perfil."
      error={error}
      shakeKey={shake}
      onNext={next}
      onPrev={onPrev}
      nextLabel="Continuar"
    >
      <div className="space-y-7">
        <TextField label="NOMBRE COMPLETO" value={value.name} onChange={set('name')} placeholder="Tu nombre y apellido" autoComplete="name" />
        <TextField label="NOMBRE DE TU MARCA O EMPRESA" value={value.brand} onChange={set('brand')} placeholder="Cómo se llama tu marca" autoComplete="organization" />
        <TextField label="WHATSAPP O CORREO ELECTRÓNICO" value={value.reach} onChange={set('reach')} placeholder="+57 300 000 0000 · tu@correo.com" autoComplete="email" />
      </div>
    </StepShell>
  );
}
