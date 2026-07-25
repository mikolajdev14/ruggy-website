"use client";

import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Check, Layers3 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Booking } from "./page";

type Variant = {
  id: number;
  name: string;
  slug: string;
  is_active: boolean | null;
  display_order: number | string | null;
};

type SubcategoryPickerProps = {
  id: string;
  booking: Booking;
  setBooking: Dispatch<SetStateAction<Booking>>;
};

// Papadywany comes in named subrodzajs (podrodzaje). Choosing one is the
// deliberate first step of the order — it decides which preset sizes appear
// next — so it lives in its own panel and never auto-selects. Switching it
// clears the size, which the SizePicker then re-defaults for the new subrodzaj.
export const SubcategoryPicker = ({
  id,
  booking,
  setBooking,
}: SubcategoryPickerProps) => {
  const [variants, setVariants] = useState<Variant[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchVariants = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("rug_types")
        .select("rug_variants(id, name, slug, is_active, display_order)")
        .eq("id", id)
        .single();

      if (!isMounted) return;

      if (error || !data) {
        setLoadError(true);
        return;
      }

      const active = (
        (data as unknown as { rug_variants: Variant[] }).rug_variants ?? []
      )
        .filter((variant) => variant.is_active !== false)
        .toSorted(
          (first, second) =>
            Number(first.display_order ?? 0) - Number(second.display_order ?? 0),
        );

      setVariants(active);
      setLoadError(false);
    };

    void fetchVariants();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const choose = (variantId: number) => {
    setBooking((previous) => ({
      ...previous,
      rugVariantId: variantId,
      pickedSize: null,
      customWidthCm: null,
      customHeightCm: null,
    }));
  };

  if (loadError) {
    return (
      <div
        className="rounded-2xl border-2 border-[var(--ruggy-error)] bg-[var(--ruggy-surface)] p-5 text-sm font-bold text-[var(--ruggy-error)]"
        role="alert"
      >
        Nie udało się pobrać podrodzajów. Odśwież stronę i spróbuj ponownie.
      </div>
    );
  }

  if (!variants) {
    return (
      <div
        className="rounded-2xl border-2 border-dashed border-[var(--ruggy-border-strong)] bg-[var(--ruggy-surface)] p-5 text-sm font-bold text-[var(--ruggy-muted)]"
        role="status"
      >
        Ładuję podrodzaje…
      </div>
    );
  }

  if (!variants.length) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-[var(--ruggy-border-strong)] bg-[var(--ruggy-surface)] p-5 text-sm font-bold text-[var(--ruggy-muted)]">
        Brak dostępnych podrodzajów.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {variants.map((variant) => {
        const isSelected = booking.rugVariantId === variant.id;

        return (
          <button
            key={variant.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => choose(variant.id)}
            className={`relative flex min-h-16 items-center gap-3 rounded-2xl border-2 px-4 py-3 text-start text-base font-black transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-blue)] ${
              isSelected
                ? "border-[var(--ruggy-ink)] bg-[var(--ruggy-yellow)] shadow-[3px_4px_0_var(--ruggy-ink)]"
                : "border-[var(--ruggy-border-strong)] bg-[var(--ruggy-surface)] hover:border-[var(--ruggy-ink)]"
            }`}
          >
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--ruggy-ink)] ${
                isSelected
                  ? "bg-[var(--ruggy-ink)] text-white"
                  : "bg-[var(--ruggy-blue-soft)] text-[var(--ruggy-blue)]"
              }`}
            >
              <Layers3 className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 text-[var(--ruggy-ink)]">
              {variant.name}
            </span>
            {isSelected ? (
              <Check
                className="size-5 shrink-0 text-[var(--ruggy-ink)]"
                aria-hidden="true"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
};
