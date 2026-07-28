import { Fragment } from "react";
import type { LucideIcon } from "lucide-react";
import { TemptationWhisper } from "@/components/temptation-whisper";

type PosterWord = { text: string; emphasis?: boolean };

interface PosterHeroProps {
  /** Optional kicker above the headline — omit both to let the title lead. */
  icon?: LucideIcon;
  eyebrow?: string;
  words: PosterWord[];
  description: string;
}

// Colossal canvas masthead: no container, no badge — the headline itself is the
// hero, set at full-bleed editorial scale straight on the canvas. A faint
// marquee of temptations ghosts behind it, the words rise in one by one, and a
// hand-swiped sunflower highlight wipes in under the emphasised word. A small
// inline kicker carries the step label. Motion is CSS-only (globals.css) and
// fully disabled under prefers-reduced-motion.
export function PosterHero({
  icon: Icon,
  eyebrow,
  words,
  description,
}: PosterHeroProps) {
  return (
    <div className="ruggy-masthead relative isolate overflow-hidden py-2 sm:py-4">
      <TemptationWhisper />

      <div className="relative z-10">
        {Icon && eyebrow ? (
          <p className="ruggy-poster-kicker flex items-center gap-2.5 text-xs font-black uppercase tracking-[0.22em] text-[var(--ruggy-blue)]">
            <Icon className="size-4" aria-hidden="true" />
            {eyebrow}
          </p>
        ) : null}

        <h1
          className={`ruggy-poster-title max-w-5xl font-black leading-[0.88] tracking-[-0.05em] text-[var(--ruggy-ink)]${
            Icon && eyebrow ? " mt-5" : ""
          }`}
        >
          {words.map((word, index) => (
            <Fragment key={index}>
              <span className="ruggy-poster-word">
                {word.emphasis ? (
                  <span className="ruggy-poster-mark" aria-hidden="true" />
                ) : null}
                <span
                  className={`ruggy-poster-word-text${
                    word.emphasis ? " relative" : ""
                  }`}
                  style={{ animationDelay: `${0.12 + index * 0.1}s` }}
                >
                  {word.text}
                </span>
              </span>
              {index < words.length - 1 ? " " : null}
            </Fragment>
          ))}
        </h1>

        <div className="ruggy-poster-sub mt-8 flex items-start gap-4 sm:mt-10">
          <span
            aria-hidden="true"
            className="mt-2.5 h-1 w-10 shrink-0 rounded-full bg-[var(--ruggy-blue)] sm:mt-3 sm:w-14"
          />
          <p className="max-w-2xl text-base leading-7 text-[var(--ruggy-body)] sm:text-lg">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
