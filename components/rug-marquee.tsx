"use client";

import type { CSSProperties } from "react";
import type { GalleryPhoto } from "@/lib/gallery";

const marqueeCss = `
  .ruggy-marquee-track {
    animation: ruggy-marquee-ltr var(--marquee-duration, 70s) linear infinite;
    will-change: transform;
  }

  @keyframes ruggy-marquee-ltr {
    from {
      transform: translateX(-50%);
    }
    to {
      transform: translateX(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ruggy-marquee-track {
      animation: none;
      transform: none;
    }

    .ruggy-marquee-row {
      overflow-x: auto;
    }
  }
`;

type MarqueeRowProps = {
  photos: GalleryPhoto[];
  duration: string;
};

const MarqueeRow = ({ photos, duration }: MarqueeRowProps) => {
  // Duplicate the row so translateX(-50%) → 0 loops seamlessly. The second
  // copy is decorative, so it is hidden from assistive technology.
  const items = [...photos, ...photos];

  return (
    <div className="ruggy-marquee-row group relative overflow-hidden">
      <ul
        className="ruggy-marquee-track flex w-max list-none group-hover:[animation-play-state:paused]"
        style={{ "--marquee-duration": duration } as CSSProperties}
      >
        {items.map((photo, index) => {
          const isDuplicate = index >= photos.length;

          return (
            <li
              key={`${photo.src}-${index}`}
              aria-hidden={isDuplicate}
              className="me-4 shrink-0 sm:me-6"
            >
              <figure className="h-40 w-40 overflow-hidden rounded-2xl border-2 border-white/10 bg-white shadow-[4px_5px_0_rgba(0,0,0,0.35)] sm:h-56 sm:w-56">
                <img
                  src={photo.src}
                  alt={isDuplicate ? "" : photo.alt}
                  loading={isDuplicate ? "lazy" : undefined}
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </figure>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const RugMarquee = ({ photos }: { photos: GalleryPhoto[] }) => {
  const mid = Math.ceil(photos.length / 2);
  const rowOne = photos.slice(0, mid);
  const rowTwo = photos.slice(mid);

  return (
    <div className="relative space-y-4 [-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] sm:space-y-6">
      <style>{marqueeCss}</style>
      <MarqueeRow photos={rowOne} duration="64s" />
      <MarqueeRow photos={rowTwo} duration="82s" />
    </div>
  );
};
