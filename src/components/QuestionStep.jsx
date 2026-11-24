import { useEffect, useState } from 'react';
import { PHASES, TOTAL, validate } from '../data/questions';
import StepShell from './StepShell';
import { ListField, ServicesField, TextAreaField } from './fields';

export default function QuestionStep({ q, index, value, onChange, onNext, onPrev }) {
  const [error, setError] = useState('');
  const [shake, setShake] = useState(0);

  useEffect(() => {
    if (error && !validate(q, value)) setError('');
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const next = () => {
    const msg = validate(q, value);
    if (msg) {
      setError(msg);
      setShake((s) => s + 1);
      return;
    }
    setError('');
    onNext();
  };

  const ph = PHASES.find((p) => p.id === q.phase);
  const last = index === TOTAL - 1;

  return (
    <StepShell
      eyebrow={`PREGUNTA ${String(index + 1).padStart(2, '0')} · ${ph.name}`}
      title={q.title}
      hint={q.hint}
      error={error}
      shakeKey={shake}
      onNext={next}
      onPrev={onPrev}
      nextLabel={last ? 'Finalizar' : 'Siguiente'}
      multiline={q.type === 'text'}
    >
      {q.type === 'text' && <TextAreaField value={value} onChange={onChange} />}
      {q.type === 'list' && (
        <ListField
          value={value}
          onChange={onChange}
          min={q.min}
          max={q.max}
          addLabel={q.addLabel}
          examples={q.examples}
          twoCols={q.twoCols}
        />
      )}
      {q.type === 'services' && <ServicesField value={value} onChange={onChange} />}
    </StepShell>
  );
}
