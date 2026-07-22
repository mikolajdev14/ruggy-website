export default function ZamowLoading() {
  return (
    <main className="min-h-screen bg-[var(--ruggy-canvas)] text-[var(--ruggy-ink)]">
      <header className="border-b border-[var(--ruggy-border)]">
        <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <span className="ruggy-wordmark text-4xl">
            ruggy<span className="text-[var(--ruggy-blue)]">.</span>
          </span>
          <span className="h-11 w-36 rounded-full bg-[var(--ruggy-blue-soft)]" />
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl animate-pulse px-5 py-10 motion-reduce:animate-none sm:px-8 sm:py-14 lg:px-10 lg:py-16">
        <div className="rounded-[2rem] border-2 border-[var(--ruggy-border-strong)] bg-[var(--ruggy-blue-soft)] p-7 sm:p-10">
          <div className="h-8 w-32 rounded-full bg-[var(--ruggy-yellow)]" />
          <div className="mt-6 h-12 max-w-2xl rounded-xl bg-white/80 sm:h-16" />
          <div className="mt-4 h-7 max-w-xl rounded-lg bg-white/70" />
        </div>

        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-[2rem] border-2 border-[var(--ruggy-border)] bg-[var(--ruggy-surface)]"
            >
              <div className="aspect-[4/3] bg-[var(--ruggy-blue-soft)]" />
              <div className="space-y-3 p-6">
                <div className="h-7 w-2/3 rounded-lg bg-[var(--ruggy-blue-soft-strong)]" />
                <div className="h-5 w-full rounded-lg bg-[var(--ruggy-blue-soft)]" />
                <div className="h-5 w-4/5 rounded-lg bg-[var(--ruggy-blue-soft)]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
