import Image from "next/image";
import Link from "next/link";
import { ArrowRight, AtSign, CreditCard } from "lucide-react";
import { getCategoryCover } from "@/lib/gallery";
import { formatPriceCents } from "@/lib/custom-rug-price";

export type RugOrderMode = "checkout" | "quote";

interface RugProps {
  id: number | string;
  slug: string;
  name: string;
  description: string;
  leadDays: number;
  mode: RugOrderMode;
  fromPriceCents: number | null;
}

export const RugCard = (props: RugProps) => {
  const cover = getCategoryCover(props.slug);
  const isCheckout = props.mode === "checkout";

  return (
    <Link
      href={`/zamow/${props.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[2rem] border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-surface)] shadow-[5px_6px_0_var(--ruggy-ink)] transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-blue)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        {cover ? (
          <Image
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            src={cover.src}
            alt={props.name}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[var(--ruggy-blue-soft)] text-4xl font-black text-[var(--ruggy-blue)]">
            {props.name.charAt(0)}
          </div>
        )}
        <div className="absolute start-4 top-4 rounded-full border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-yellow)] px-3 py-1.5 text-xs font-black text-[var(--ruggy-ink)]">
          {props.leadDays} dni realizacji
        </div>
        <div className="absolute end-4 top-4 inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-surface)] px-3 py-1.5 text-xs font-black text-[var(--ruggy-ink)]">
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
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-xl font-black tracking-tight text-[var(--ruggy-ink)]">
          {props.name}
        </h2>

        <p className="mt-3 line-clamp-3 text-base leading-7 text-[var(--ruggy-body)]">
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
