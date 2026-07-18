import { fulfillCheckout } from "@/lib/fulfill-checkout";
import { CheckCircle2, Clock3, TriangleAlert } from "lucide-react";
import Link from "next/link";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string | string[] }>;
}) {
  const params = await searchParams;
  const sessionId = Array.isArray(params.session_id)
    ? params.session_id[0]
    : params.session_id;
  const result = sessionId
    ? await fulfillCheckout(sessionId)
    : {
        success: false as const,
        reason: "invalid_session" as const,
        message: "Brak identyfikatora płatności.",
      };

  const isPending = !result.success && result.reason === "not_paid";
  const Icon = result.success
    ? CheckCircle2
    : isPending
      ? Clock3
      : TriangleAlert;

  return (
    <main className="ruggy-thread-bg flex min-h-screen items-center justify-center bg-[var(--ruggy-blue-soft)] px-5 py-12 text-[var(--ruggy-ink)]">
      <section className="w-full max-w-xl rounded-[2rem] border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-surface)] p-7 shadow-[8px_10px_0_var(--ruggy-ink)] sm:p-10">
        <Link href="/" className="ruggy-wordmark text-4xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-blue)]">
          ruggy<span className="text-[var(--ruggy-blue)]">.</span>
        </Link>
        <span
          className={`mt-8 flex size-14 items-center justify-center rounded-2xl ${
            result.success
              ? "bg-emerald-100 text-emerald-700"
              : isPending
                ? "bg-amber-100 text-amber-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          <Icon size={24} aria-hidden="true" />
        </span>

        <h1 className="mt-6 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
          {result.success
            ? "Dziękujemy za zamówienie!"
            : isPending
              ? "Płatność jest przetwarzana"
              : "Nie udało się zapisać zamówienia"}
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--ruggy-body)]">
          {result.success
            ? "Twój pomysł jest już po naszej stronie. Odezwę się, jeśli będę potrzebował dodatkowych informacji. Do zobaczenia w pracowni!"
            : isPending
              ? "Stripe nie potwierdził jeszcze płatności. Zamówienie zostanie zapisane automatycznie po otrzymaniu potwierdzenia."
              : "Płatność mogła zostać przyjęta, ale zapis zamówienia wymaga sprawdzenia. Zachowaj identyfikator sesji widoczny poniżej."}
        </p>

        {sessionId && !result.success ? (
          <p className="mt-5 break-all rounded-xl bg-[var(--ruggy-blue-soft)] px-4 py-3 font-mono text-xs text-[var(--ruggy-body)]">
            {sessionId}
          </p>
        ) : null}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--ruggy-blue)] px-6 text-sm font-black text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-ink)]"
          >
            Wróć na stronę główną
          </Link>
          {!result.success ? (
            <Link
              href="/zamow"
              className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[var(--ruggy-ink)] px-6 text-sm font-black transition-colors hover:bg-[var(--ruggy-yellow)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-ink)]"
            >
              Zobacz warianty
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  );
}
