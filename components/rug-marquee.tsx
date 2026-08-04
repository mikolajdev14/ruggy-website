"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent, KeyboardEvent } from "react";
import type { GalleryPhoto } from "@/lib/gallery";

// Momentum left after one second of coasting, and the speed below which we
// simply stop and let the automatic scroll take over again.
const MOMENTUM_DECAY = 0.002;
const MOMENTUM_CUTOFF = 4;
const KEY_STEP = 180;

type RowState = {
  x: number;
  half: number;
  velocity: number;
  dragging: boolean;
  paused: boolean;
  visible: boolean;
  lastPointerX: number;
  lastMoveTime: number;
};

type MarqueeRowProps = {
  photos: GalleryPhoto[];
  durationSeconds: number;
  label: string;
};

const MarqueeRow = ({ photos, durationSeconds, label }: MarqueeRowProps) => {
  // Duplicate the row so wrapping by half the track width loops seamlessly.
  // The second copy is decorative, so it is hidden from assistive technology.
  const items = [...photos, ...photos];

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const stateRef = useRef<RowState>({
    x: 0,
    half: 0,
    velocity: 0,
    dragging: false,
    paused: false,
    visible: true,
    lastPointerX: 0,
    lastMoveTime: 0,
  });

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const state = stateRef.current;
    const measure = () => {
      state.half = track.scrollWidth / 2;
    };
    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        state.visible = entry.isIntersecting;
      },
      { rootMargin: "200px" },
    );
    visibilityObserver.observe(viewport);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;
    let previous = performance.now();

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const delta = Math.min((now - previous) / 1000, 0.05);
      previous = now;

      if (state.half <= 0) return;

      if (!state.dragging) {
        const autoSpeed =
          state.paused || reducedMotion.matches || !state.visible
            ? 0
            : state.half / durationSeconds;

        state.x += (autoSpeed + state.velocity) * delta;
        state.velocity *= MOMENTUM_DECAY ** delta;
        if (Math.abs(state.velocity) < MOMENTUM_CUTOFF) state.velocity = 0;
      }

      // Keep the offset in (-half, 0] so the loop never runs out of track.
      state.x = ((state.x % state.half) - state.half) % state.half;
      track.style.transform = `translate3d(${state.x}px, 0, 0)`;
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [durationSeconds]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;

    const state = stateRef.current;
    state.dragging = true;
    state.velocity = 0;
    state.lastPointerX = event.clientX;
    state.lastMoveTime = event.timeStamp;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = stateRef.current;
    if (!state.dragging) return;

    const dx = event.clientX - state.lastPointerX;
    const dt = (event.timeStamp - state.lastMoveTime) / 1000;

    state.x += dx;
    if (dt > 0) state.velocity = dx / dt;

    state.lastPointerX = event.clientX;
    state.lastMoveTime = event.timeStamp;
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = stateRef.current;
    if (!state.dragging) return;

    state.dragging = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const state = stateRef.current;
    if (event.key === "ArrowLeft") {
      state.x -= KEY_STEP;
      event.preventDefault();
    } else if (event.key === "ArrowRight") {
      state.x += KEY_STEP;
      event.preventDefault();
    }
  };

  return (
    <div
      ref={viewportRef}
      role="group"
      aria-label={label}
      tabIndex={0}
      className="group relative cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") stateRef.current.paused = true;
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") stateRef.current.paused = false;
      }}
      onKeyDown={handleKeyDown}
    >
      <ul ref={trackRef} className="flex w-max list-none will-change-transform">
        {items.map((photo, index) => {
          const isDuplicate = index >= photos.length;

          return (
            <li
              key={`${photo.src}-${index}`}
              aria-hidden={isDuplicate}
              className="me-4 shrink-0 sm:me-6"
            >
              <figure className="relative h-40 w-40 overflow-hidden rounded-2xl border-2 border-white/10 bg-white shadow-[4px_5px_0_rgba(0,0,0,0.35)] sm:h-56 sm:w-56">
                <Image
                  src={photo.src}
                  alt={isDuplicate ? "" : photo.alt}
                  fill
                  sizes="(min-width: 640px) 224px, 160px"
                  loading={isDuplicate ? "lazy" : undefined}
                  draggable={false}
                  className="object-cover"
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
      <MarqueeRow
        photos={rowOne}
        durationSeconds={64}
        label="Galeria realizacji, rząd 1 – przeciągnij, aby przewinąć"
      />
      <MarqueeRow
        photos={rowTwo}
        durationSeconds={82}
        label="Galeria realizacji, rząd 2 – przeciągnij, aby przewinąć"
      />
    </div>
  );
};
