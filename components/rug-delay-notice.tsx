import { TriangleAlert } from "lucide-react";
import { RUG_LEAD_TIME_LABEL } from "@/lib/rug-lead-time";

// Shown wherever a category with rug_types.has_delay = true is presented, so
// the shop never quotes the standard window while the owner is behind.

export const RUG_DELAY_HEADLINE = "Opóźnienie w realizacji";

export const RUG_DELAY_MESSAGE =
  `Ten dywan mam chwilowo zakolejkowany — realizacja potrwa dłużej niż ${RUG_LEAD_TIME_LABEL}. ` +
  "Dokładny termin potwierdzę po złożeniu zamówienia.";

/** Full-width banner for a category page. */
export function RugDelayBanner() {
  return (
    <p className="flex items-start gap-2 rounded-2xl border-2 border-[var(--ruggy-ink)] bg-[#fdecea] px-4 py-3 text-sm font-bold leading-6 text-[var(--ruggy-error)]">
      <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>
        <span className="block font-black uppercase tracking-[0.08em]">
          {RUG_DELAY_HEADLINE}
        </span>
        {RUG_DELAY_MESSAGE}
      </span>
    </p>
  );
}

/** Overlay strip laid over a category card's cover photo. */
export function RugDelayOverlay() {
  return (
    <div className="absolute inset-0 flex items-end bg-[var(--ruggy-ink)]/10">
      <p className="flex w-full items-center gap-2 border-t-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-error)] px-4 py-2.5 text-xs font-black uppercase tracking-[0.08em] text-white">
        <TriangleAlert className="size-4 shrink-0" aria-hidden="true" />
        {RUG_DELAY_HEADLINE}
      </p>
    </div>
  );
}
