"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import type { GalleryPhoto } from "@/lib/gallery";

const focusLightClass =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

export function GalleryCarousel({ photos }: { photos: GalleryPhoto[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const maxScroll = track.scrollWidth - track.clientWidth;
    setAtStart(track.scrollLeft <= 4);
    setAtEnd(track.scrollLeft >= maxScroll - 4);
  }, []);

  useEffect(() => {
    syncEdges();
    const track = trackRef.current;
    if (!track) {
      return;
    }
    track.addEventListener("scroll", syncEdges, { passive: true });
    window.addEventListener("resize", syncEdges);
    return () => {
      track.removeEventListener("scroll", syncEdges);
      window.removeEventListener("resize", syncEdges);
    };
  }, [syncEdges]);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const card = track.querySelector<HTMLElement>("[data-carousel-card]");
    const step = card ? card.offsetWidth + 20 : track.clientWidth * 0.8;
    track.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  return (
    <div data-scroll-reveal className="relative mt-12">
      <ul
        ref={trackRef}
        className="ruggy-carousel-track flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4"
      >
        {photos.map((photo, index) => (
          <li
            key={photo.src}
            data-carousel-card
            className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]"
          >
            <figure className="overflow-hidden rounded-[2rem] border-2 border-white/80 bg-[var(--ruggy-surface)] p-2 text-[var(--ruggy-ink)]">
              <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-white">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 78vw"
                  className="object-cover"
                  priority={index < 2}
                />
              </div>
              <figcaption className="flex items-center justify-between gap-3 px-3 py-3 text-base font-black">
                {photo.category}
                <span className="text-[var(--ruggy-blue)]" aria-hidden="true">
                  ✦
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          disabled={atStart}
          aria-label="Poprzednie realizacje"
          className={`inline-flex size-12 items-center justify-center rounded-full border-2 border-white bg-transparent text-white transition-all hover:bg-white hover:text-[var(--ruggy-ink)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white ${focusLightClass}`}
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={atEnd}
          aria-label="Kolejne realizacje"
          className={`inline-flex size-12 items-center justify-center rounded-full border-2 border-white bg-transparent text-white transition-all hover:bg-white hover:text-[var(--ruggy-ink)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white ${focusLightClass}`}
        >
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
