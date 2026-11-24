export default function Sending({ status, onRetry, onSkip }) {
  const failed = status === 'error';
  return (
    <section className="mx-auto w-full max-w-xl px-6 py-10 text-center sm:px-10">
      {!failed ? (
        <>
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-white" />
          <p className="mt-8 text-xl font-light text-silver">Enviando tu diagnóstico…</p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold">No pudimos enviar tu diagnóstico</h2>
          <p className="mt-3 font-light text-silver/70">
            Revisa tu conexión e inténtalo de nuevo. Tus respuestas están guardadas en este dispositivo.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={onRetry} className="btn-primary">
              Reintentar
            </button>
            <button type="button" onClick={onSkip} className="btn-ghost">
              Continuar sin enviar
            </button>
          </div>
        </>
      )}
    </section>
  );
}
