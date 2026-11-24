import { motion } from 'framer-motion';
import { PHASES, QUESTIONS, TOTAL } from '../data/questions';

export default function ProgressBar({ stage, idx }) {
  const inQuiz = stage === 'quiz' || stage === 'sending';
  const done = inQuiz ? idx : 0;
  const pct = Math.round((done / TOTAL) * 100);

  let label = '00. DATOS INICIALES';
  let counter = '';
  if (inQuiz) {
    const q = QUESTIONS[idx];
    const ph = PHASES.find((p) => p.id === q.phase);
    label = `${String(ph.id).padStart(2, '0')}. ${ph.name}`;
    counter = `${idx + 1} / ${TOTAL}`;
  }

  const segments = PHASES.map((ph) => {
    const qs = QUESTIONS.filter((q) => q.phase === ph.id);
    const d = qs.filter((q) => QUESTIONS.indexOf(q) < done).length;
    return { id: ph.id, count: qs.length, fill: d / qs.length };
  });

  return (
    <header className="relative z-20 px-6 pt-5 sm:px-10 sm:pt-7">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-4 text-[11px] tracking-[0.2em] text-silver/70 sm:text-xs">
          <span className="truncate">{label}</span>
          <span className="shrink-0 tabular-nums">
            {counter}
            {counter && <span className="hidden text-silver/40 sm:inline"> · {pct}%</span>}
          </span>
        </div>
        <div className="mt-3 flex gap-1.5" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
          {segments.map((s) => (
            <div key={s.id} className="h-[2px] overflow-hidden bg-white/10" style={{ flex: s.count }}>
              <motion.div
                className="h-full bg-white"
                initial={false}
                animate={{ width: `${s.fill * 100}%` }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
