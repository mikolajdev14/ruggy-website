"use client";

import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Check, Ruler, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  calculateCustomRugPriceCents,
  CUSTOM_RUG_MAX_DIMENSION_CM,
  CUSTOM_RUG_MIN_DIMENSION_CM,
  formatPriceCents,
} from "@/lib/custom-rug-price";
import type { Booking } from "./page";

type RugSize = {
  id: number;
  label: string;
  price_cents: number | string;
};

type SizeData = {
  name: string;
  rug_sizes: RugSize[];
};

type SizePickerProps = {
  id: string;
  booking: Booking;
  setBooking: Dispatch<SetStateAction<Booking>>;
};

const fieldClass =
  "h-12 w-full rounded-xl border-2 border-[var(--ruggy-border-strong)] bg-[var(--ruggy-surface)] px-4 text-base font-bold text-[var(--ruggy-ink)] outline-none transition-colors placeholder:text-[var(--ruggy-muted)] hover:border-[var(--ruggy-ink)] focus:border-[var(--ruggy-blue)] focus:ring-4 focus:ring-[var(--ruggy-blue-soft)]";

export const SizePicker = ({ id, booking, setBooking }: SizePickerProps) => {
  const [sizeData, setSizeData] = useState<SizeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchSizes = async () => {
      setIsLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("rug_types")
        .select("name, rug_sizes(*)")
        .eq("id", id)
        .single();

      if (!isMounted) return;

      if (error || !data) {
        setLoadError(true);
      } else {
        setSizeData(data as SizeData);
      }
      setIsLoading(false);
    };

    void fetchSizes();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const isCustomType = sizeData?.name.trim().toLocaleLowerCase() === "inne";
  const customPriceCents = calculateCustomRugPriceCents(
    booking.customHeightCm,
  );

  const choosePresetSize = (sizeId: number) => {
    setBooking((previous) => ({
      ...previous,
      pickedSize: sizeId,
      customWidthCm: null,
      customHeightCm: null,
    }));
  };

  const updateCustomDimension = (
    field: "customWidthCm" | "customHeightCm",
    value: string,
  ) => {
    setBooking((previous) => ({
      ...previous,
      pickedSize: null,
      [field]: value === "" ? null : Number(value),
    }));
  };

  return (
    <section className="space-y-5" aria-labelledby="size-picker-title">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--ruggy-blue-soft)] text-[var(--ruggy-blue)]">
          <Ruler className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h3 id="size-picker-title" className="text-lg font-black text-[var(--ruggy-ink)]">
            Rozmiar dywanu
          </h3>
          <p className="mt-1 text-sm leading-6 text-[var(--ruggy-body)]">
            Wybierz gotowy format albo wpisz własny, jeśli masz nietypowy pomysł.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border-2 border-dashed border-[var(--ruggy-border-strong)] bg-[var(--ruggy-surface)] p-5 text-sm font-bold text-[var(--ruggy-muted)]" role="status">
          Ładuję dostępne rozmiary…
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border-2 border-[var(--ruggy-error)] bg-[var(--ruggy-surface)] p-5 text-sm font-bold text-[var(--ruggy-error)]" role="alert">
          Nie udało się pobrać rozmiarów. Odśwież stronę i spróbuj ponownie.
        </div>
      ) : isCustomType ? (
        <div className="rounded-[1.5rem] border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-blue-soft)] p-5 shadow-[5px_6px_0_var(--ruggy-ink)] sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--ruggy-yellow)] text-[var(--ruggy-ink)]">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-base font-black text-[var(--ruggy-ink)]">Twój wymiar, nasza włóczka</p>
              <p className="mt-1 text-sm leading-6 text-[var(--ruggy-body)]">
                Podaj wysokość dywanu. Szerokość możesz dodać, jeśli ma znaczenie dla projektu.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-black text-[var(--ruggy-ink)]">
                Szerokość (cm, opcjonalnie)
              </span>
              <input
                type="number"
                min={CUSTOM_RUG_MIN_DIMENSION_CM}
                max={CUSTOM_RUG_MAX_DIMENSION_CM}
                step="1"
                inputMode="numeric"
                value={booking.customWidthCm ?? ""}
                onChange={(event) => updateCustomDimension("customWidthCm", event.target.value)}
                placeholder="np. 100"
                className={fieldClass}
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-black text-[var(--ruggy-ink)]">
                Wysokość (cm) *
              </span>
              <input
                type="number"
                min={CUSTOM_RUG_MIN_DIMENSION_CM}
                max={CUSTOM_RUG_MAX_DIMENSION_CM}
                step="1"
                inputMode="numeric"
                value={booking.customHeightCm ?? ""}
                onChange={(event) => updateCustomDimension("customHeightCm", event.target.value)}
                placeholder="np. 70"
                className={fieldClass}
                required
              />
            </label>
          </div>

          <div className="mt-5 flex flex-col gap-3 rounded-2xl border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-surface)] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--ruggy-muted)]">Podana wysokość</p>
              <p className="mt-1 text-xl font-black text-[var(--ruggy-ink)]" aria-live="polite">
                {booking.customHeightCm != null
                  ? `${booking.customHeightCm} cm`
                  : "Wpisz wysokość"}
              </p>
            </div>
            <div className="sm:text-end">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--ruggy-muted)]">Szacunkowa cena</p>
              <p className="mt-1 text-2xl font-black text-[var(--ruggy-blue)]" aria-live="polite">
                {formatPriceCents(customPriceCents)}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-[var(--ruggy-body)]">
            Wzór: 249 zł opłaty bazowej plus 4,20 zł za każdy centymetr wysokości, zaokrąglone w górę do pełnych 10 zł.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {sizeData?.rug_sizes.map((size) => {
            const isSelected = booking.pickedSize === size.id;
            return (
              <button
                key={size.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => choosePresetSize(size.id)}
                className={`relative flex min-h-20 items-center justify-between gap-4 rounded-2xl border-2 p-4 text-start transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-blue)] ${
                  isSelected
                    ? "border-[var(--ruggy-ink)] bg-[var(--ruggy-yellow)] shadow-[4px_5px_0_var(--ruggy-ink)]"
                    : "border-[var(--ruggy-border-strong)] bg-[var(--ruggy-surface)] hover:border-[var(--ruggy-ink)]"
                }`}
              >
                <span>
                  <span className="block text-base font-black text-[var(--ruggy-ink)]">{size.label}</span>
                  <span className="mt-1 block text-sm font-bold text-[var(--ruggy-body)]">Gotowy format Ruggy</span>
                </span>
                <span className="shrink-0 text-lg font-black text-[var(--ruggy-blue)]">
                  {Number(size.price_cents) / 100} zł
                </span>
                {isSelected ? (
                  <span className="absolute end-3 top-3 flex size-6 items-center justify-center rounded-full bg-[var(--ruggy-ink)] text-white">
                    <Check className="size-4" aria-hidden="true" />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};
