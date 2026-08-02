import { createPublicClient } from "@/lib/supabase/public";
import { PAPADYWANY_SLUG } from "@/lib/rug-order-mode";
import { RugDelayBanner } from "@/components/rug-delay-notice";
import { PosterHero } from "@/components/poster-hero";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ContentWarningGate } from "../content-warning-gate";
import { SubcategoryCard } from "../subcategory-card";

type VariantSize = { price_cents: number | string; is_active: boolean | null };

type VariantRow = {
  id: number;
  name: string;
  slug: string;
  is_active: boolean | null;
  display_order: number | string | null;
  rug_sizes: VariantSize[];
};

type RugTypeRow = {
  id: number;
  name: string;
  slug: string;
  has_delay: boolean | null;
  rug_variants: VariantRow[];
};

export const metadata: Metadata = {
  title: "Wybierz podrodzaj papadywanu",
  description:
    "Każdy papadywan ma swój motyw. Wybierz podrodzaj, a potem dopniesz rozmiar, termin i dostawę.",
};

export const revalidate = 300;

export default async function PodrodzajPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("rug_types")
    .select(
      "id, name, slug, has_delay, rug_variants(id, name, slug, is_active, display_order, rug_sizes(price_cents, is_active))",
    )
    .eq("id", id)
    .single();

  const rugType = data as unknown as RugTypeRow | null;

  // Only papadywany branches into subrodzajs; anything else (or a missing row)
  // goes straight to the details page.
  if (error || !rugType || rugType.slug !== PAPADYWANY_SLUG) {
    redirect(`/zamow/${id}`);
  }

  const variants = (rugType.rug_variants ?? [])
    .filter((variant) => variant.is_active !== false)
    .toSorted(
      (first, second) =>
        Number(first.display_order ?? 0) - Number(second.display_order ?? 0),
    );

  return (
    <main className="min-h-screen bg-[var(--ruggy-canvas)] text-[var(--ruggy-ink)]">
      {/* This page is papadywany-only (guarded above), so the warning always
          applies — it now lands here, before any subrodzaj is visible. */}
      <ContentWarningGate />

      <header className="border-b border-[var(--ruggy-border)]">
        <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="ruggy-wordmark text-4xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-ink)]"
          >
            ruggy<span className="text-[var(--ruggy-blue)]">.</span>
          </Link>
          <Link
            href="/zamow"
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-bold transition-colors hover:bg-[var(--ruggy-blue-soft)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-ink)]"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Wróć do wariantów
          </Link>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
        <PosterHero
          words={[
            { text: "Wybierz" },
            { text: "podrodzaj", emphasis: true },
            { text: "papadywanu." },
          ]}
          description="Każdy motyw ma swój charakter i cenę. Wybierz ten, który do Ciebie mówi — rozmiar, termin i dostawę ustawisz w kolejnym kroku."
        />

        {rugType.has_delay ? (
          <div className="mt-8">
            <RugDelayBanner />
          </div>
        ) : null}

        {variants.length ? (
          <ul className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {variants.map((variant) => (
              <li key={variant.id}>
                <SubcategoryCard
                  rugTypeId={rugType.id}
                  id={variant.id}
                  name={variant.name}
                  slug={variant.slug}
                  sizes={variant.rug_sizes}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 rounded-2xl border-2 border-dashed border-[var(--ruggy-border-strong)] bg-[var(--ruggy-surface)] p-8 text-center">
            <p className="text-base font-bold text-[var(--ruggy-ink)]">
              Brak dostępnych podrodzajów.
            </p>
            <p className="mt-2 text-base text-[var(--ruggy-body)]">
              Napisz do mnie na Instagramie, a znajdziemy coś dla Ciebie.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
