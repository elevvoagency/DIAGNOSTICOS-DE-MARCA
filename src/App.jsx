import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { QUESTIONS, TOTAL, sanitizeAnswers } from './data/questions';
import { loadState, saveState } from './lib/storage';
import { buildPayload } from './lib/summary';
import { submitDiagnosis } from './lib/submit';
import ProgressBar from './components/ProgressBar';
import Welcome from './components/Welcome';
import ContactStep from './components/ContactStep';
import QuestionStep from './components/QuestionStep';
import Sending from './components/Sending';
import Final from './components/Final';

const saved = loadState();

export default function App() {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(saved?.stage === 'sending' ? 'quiz' : saved?.stage || 'welcome');
  const [idx, setIdx] = useState(Math.min(saved?.idx ?? 0, TOTAL - 1));
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState(() => sanitizeAnswers(saved?.answers));
  const [contact, setContact] = useState(saved?.contact || { name: '', brand: '', reach: '' });
  const [submitted, setSubmitted] = useState(!!saved?.submitted);
  const [status, setStatus] = useState('idle');
  const [resumed, setResumed] = useState(saved?.stage === 'contact' || saved?.stage === 'quiz');

  useEffect(() => {
    saveState({ stage, idx, answers, contact, submitted });
  }, [stage, idx, answers, contact, submitted]);

  useEffect(() => {
    if (!resumed) return;
    const t = setTimeout(() => setResumed(false), 3500);
    return () => clearTimeout(t);
  }, [resumed]);

  const goStage = (s, d = 1) => {
    setDir(d);
    setStage(s);
  };
  const goIdx = (i, d) => {
    setDir(d);
    setIdx(i);
  };

  const send = useCallback(async () => {
    setStatus('sending');
    try {
      await submitDiagnosis(buildPayload(contact, answers));
      setSubmitted(true);
      setStatus('ok');
      setDir(1);
      setStage('done');
    } catch {
      setStatus('error');
    }
  }, [contact, answers]);

  const finish = () => {
    goStage('sending');
    send();
  };

  const variants = {
    initial: (d) => ({ opacity: 0, y: reduce ? 0 : d > 0 ? 28 : -28, filter: reduce ? 'blur(0px)' : 'blur(6px)' }),
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: (d) => ({ opacity: 0, y: reduce ? 0 : d > 0 ? -28 : 28, filter: reduce ? 'blur(0px)' : 'blur(6px)' }),
  };

  let view;
  let key = stage;
  if (stage === 'welcome') {
    view = <Welcome onStart={() => goStage('contact')} />;
  } else if (stage === 'contact') {
    view = (
      <ContactStep
        value={contact}
        onChange={setContact}
        onPrev={() => goStage('welcome', -1)}
        onNext={() => {
          setDir(1);
          setIdx(0);
          setStage('quiz');
        }}
      />
    );
  } else if (stage === 'quiz') {
    const q = QUESTIONS[idx];
    key = `q${idx}`;
    view = (
      <QuestionStep
        q={q}
        index={idx}
        value={answers[q.id]}
        onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
        onPrev={() => (idx === 0 ? goStage('contact', -1) : goIdx(idx - 1, -1))}
        onNext={() => (idx === TOTAL - 1 ? finish() : goIdx(idx + 1, 1))}
      />
    );
  } else if (stage === 'sending') {
    view = <Sending status={status} onRetry={send} onSkip={() => goStage('done')} />;
  } else {
    view = <Final contact={contact} answers={answers} submitted={submitted} status={status} onRetry={send} />;
  }

  const showProgress = stage === 'contact' || stage === 'quiz' || stage === 'sending';

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden">
      <div className="backdrop pointer-events-none absolute inset-0" />
      {showProgress && <ProgressBar stage={stage} idx={idx} />}

      <AnimatePresence>
        {resumed && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute left-1/2 top-16 z-30 -translate-x-1/2 rounded-full border border-white/15 bg-carbon/90 px-4 py-2 text-xs text-silver backdrop-blur sm:top-20"
          >
            Retomamos donde lo dejaste
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="flex min-h-full items-center">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={key}
              custom={dir}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              {view}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
