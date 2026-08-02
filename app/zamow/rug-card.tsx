import Image from "next/image";
import Link from "next/link";
import { ArrowRight, AtSign, Clock, CreditCard, TriangleAlert } from "lucide-react";
import type { GalleryPhoto } from "@/lib/gallery";
import { formatPriceCents } from "@/lib/custom-rug-price";
import { RugDelayOverlay } from "@/components/rug-delay-notice";
import { RUG_LEAD_TIME_LABEL } from "@/lib/rug-lead-time";

export type RugOrderMode = "checkout" | "quote";

interface RugProps {
  id: number | string;
  slug: string;
  name: string;
  description: string;
  mode: RugOrderMode;
  hasDelay?: boolean;
  fromPriceCents: number | null;
  hasSubcategories?: boolean;
  // Resolved by the page: an uploaded cover when the category has one, the
  // curated photo from lib/gallery.ts otherwise.
  cover?: GalleryPhoto;
}

export const RugCard = (props: RugProps) => {
  const cover = props.cover;
  const isCheckout = props.mode === "checkout";
  // Types with subrodzajs (papadywany) pick one on a dedicated page first;
  // everything else goes straight to the details form.
  const href = props.hasSubcategories
    ? `/zamow/${props.id}/podrodzaj`
    : `/zamow/${props.id}`;

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[2rem] border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-surface)] shadow-[5px_6px_0_var(--ruggy-ink)] transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-blue)]"
    >
      {/* Covers are portrait cut-outs on white, so the frame is square and the
          photo is contained rather than cropped — a rug sliced in half sells
          nothing. The white letterboxing melts into the white frame. */}
      <div className="relative aspect-square overflow-hidden bg-white">
        {cover ? (
          <Image
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            src={cover.src}
            alt={props.name}
            className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[var(--ruggy-blue-soft)] text-4xl font-black text-[var(--ruggy-blue)]">
            {props.name.charAt(0)}
          </div>
        )}
        {/* One chip on the photo, always the same one: two of them collided on
            a narrow card, and the lead time reads better next to the price. */}
        <span className="absolute end-4 top-4 inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-surface)] px-3 py-1.5 text-xs font-black text-[var(--ruggy-ink)]">
          {isCheckout ? (
            <>
              <CreditCard className="size-3.5" aria-hidden="true" />
              Płatność online
            </>
          ) : (
            <>
              <AtSign className="size-3.5" aria-hidden="true" />
              Wycena na Instagramie
            </>
          )}
        </span>
        {props.hasDelay ? <RugDelayOverlay /> : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-xl font-black tracking-tight text-[var(--ruggy-ink)]">
          {props.name}
        </h2>

        {/* Every card fills this slot, delayed or not, so the title, the term
            and the price sit on the same line across the whole grid. */}
        {props.hasDelay ? (
          <span className="mt-2.5 inline-flex w-fit items-center gap-1.5 rounded-full border-2 border-[var(--ruggy-ink)] bg-[#fdecea] px-3 py-1 text-xs font-black text-[var(--ruggy-error)]">
            <TriangleAlert className="size-3.5 shrink-0" aria-hidden="true" />
            Termin potwierdzę indywidualnie
          </span>
        ) : (
          <span className="mt-2.5 inline-flex w-fit items-center gap-1.5 rounded-full border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-yellow)] px-3 py-1 text-xs font-black text-[var(--ruggy-ink)]">
            <Clock className="size-3.5 shrink-0" aria-hidden="true" />
            Realizacja {RUG_LEAD_TIME_LABEL}
          </span>
        )}

        {/* flex-1 absorbs the difference between a one-line and a three-line
            description, which is what pushes the footers out of line. */}
        <p className="mt-4 line-clamp-3 flex-1 text-base leading-7 text-[var(--ruggy-body)]">
          {props.description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-4 border-t-2 border-[var(--ruggy-border)] pt-4">
          <span className="min-w-0">
            <span className="block text-[0.7rem] font-black uppercase tracking-[0.12em] text-[var(--ruggy-muted)]">
              {isCheckout ? "Cena" : "Cena orientacyjna"}
            </span>
            <span className="block text-lg font-black text-[var(--ruggy-blue)]">
              {props.fromPriceCents != null
                ? `od ${formatPriceCents(props.fromPriceCents)}`
                : "Wycena indywidualna"}
            </span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-black text-[var(--ruggy-ink)] transition-transform group-hover:translate-x-1">
            Wybierz
            <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
};
