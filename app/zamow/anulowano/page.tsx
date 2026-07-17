import { ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="ruggy-thread-bg flex min-h-screen items-center justify-center bg-[var(--ruggy-blue-soft)] px-5 py-12 text-[var(--ruggy-ink)]">
      <section className="w-full max-w-xl rounded-[2rem] border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-surface)] p-7 shadow-[8px_10px_0_var(--ruggy-ink)] sm:p-10">
        <Link href="/" className="ruggy-wordmark text-4xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-blue)]">
          ruggy<span className="text-[var(--ruggy-blue)]">.</span>
        </Link>
        <span className="mt-8 flex size-14 items-center justify-center rounded-2xl bg-[var(--ruggy-yellow)]">
          <RotateCcw className="size-7" aria-hidden="true" />
        </span>
        <p className="mt-6 text-sm font-black uppercase tracking-[0.16em] text-[var(--ruggy-blue)]">Nic straconego</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] sm:text-4xl">Płatność została anulowana.</h1>
        <p className="mt-4 text-base leading-7 text-[var(--ruggy-body)]">
          Zamówienie nie zostało opłacone. Możesz wrócić do wybranego wariantu i spróbować ponownie, gdy będziesz gotowy.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/zamow" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--ruggy-blue)] px-6 text-sm font-black text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-ink)]">
            Spróbuj ponownie
            <RotateCcw className="size-4" aria-hidden="true" />
          </Link>
          <Link href="/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-[var(--ruggy-ink)] px-6 text-sm font-black transition-colors hover:bg-[var(--ruggy-yellow)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-ink)]">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Strona główna
          </Link>
        </div>
      </section>
    </main>
  );
}
