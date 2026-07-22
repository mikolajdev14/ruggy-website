import { createPublicClient } from "@/lib/supabase/public";
import { ArrowLeft, ArrowRight, CreditCard, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { RugCard } from "./rug-card";

export const metadata: Metadata = {
  title: "Zamów personalizowany dywan",
  description:
    "Wybierz wariant, rozmiar i termin wykonania ręcznie tuftowanego dywanu Ruggy.",
  alternates: { canonical: "/zamow" },
};

export const revalidate = 300;

export default async function ZamowPage() {
  const supabase = createPublicClient();
  const { data: rugTypes, error } = await supabase
    .from("rug_types")
    .select("id, name, description, lead_time_days")
    .eq("is_active", true);

  return (
    <main className="min-h-screen bg-[var(--ruggy-canvas)] text-[var(--ruggy-ink)]">
      <header className="border-b border-[var(--ruggy-border)]">
        <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
          <Link href="/" className="ruggy-wordmark text-4xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-ink)]">
            ruggy<span className="text-[var(--ruggy-blue)]">.</span>
          </Link>
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-bold transition-colors hover:bg-[var(--ruggy-blue-soft)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-ink)]">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Wróć na stronę
          </Link>
        </div>
      </header>

      <Link
        href="/zamow/zaplac"
        className="group block border-b-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-yellow)] text-[var(--ruggy-ink)] transition-colors hover:bg-[var(--ruggy-blue-soft)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--ruggy-blue)]"
      >
        <span className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-10">
          <span className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--ruggy-ink)] text-white">
              <CreditCard className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-xs font-black uppercase tracking-[0.12em] text-[var(--ruggy-body)]">
                Płatność za ustalony projekt
              </span>
              <span className="block text-sm font-black sm:text-base">
                Masz już dogadany projekt? Zapłać tutaj
              </span>
            </span>
          </span>
          <ArrowRight
            className="size-5 shrink-0 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </Link>

      <section className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
        <div className="ruggy-thread-bg rounded-[2rem] border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-blue-soft)] p-7 shadow-[7px_8px_0_var(--ruggy-ink)] sm:p-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--ruggy-yellow)] px-4 py-2 text-xs font-black uppercase tracking-[0.16em]">
            <Sparkles className="size-4" aria-hidden="true" />
            Krok pierwszy
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-[-0.04em] sm:text-6xl">
            Wybierz bazę dla swojego pomysłu.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--ruggy-body)] sm:text-lg">
            Przejrzyj dostępne warianty. Rozmiar, inspirację, termin i dostawę ustawisz spokojnie w kolejnym kroku.
          </p>
        </div>

        {error ? (
          <div className="mt-10 rounded-2xl border-2 border-[var(--ruggy-error)] bg-[var(--ruggy-surface)] p-6">
            <p className="text-base font-bold text-[var(--ruggy-ink)]">
              Nie udało się pobrać typów dywanów.
            </p>
            <p className="mt-2 text-base text-[var(--ruggy-body)]">
              Odśwież stronę albo spróbuj ponownie za chwilę.
            </p>
          </div>
        ) : rugTypes?.length ? (
          <ul className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {rugTypes.map((rug) => (
              <li key={rug.id}>
                <RugCard
                  id={rug.id}
                  name={rug.name}
                  description={rug.description}
                  leadDays={rug.lead_time_days}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 rounded-2xl border-2 border-dashed border-[var(--ruggy-border-strong)] bg-[var(--ruggy-surface)] p-8 text-center">
            <p className="text-base font-bold text-[var(--ruggy-ink)]">
              Brak aktywnych wariantów.
            </p>
            <p className="mt-2 text-base text-[var(--ruggy-body)]">
              Aktualnie nie ma dostępnych typów dywanów do zamówienia.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
