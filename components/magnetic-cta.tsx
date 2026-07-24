"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

const focusClass =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-ink)]";

const INSET = 15;
const RADIUS = 30;
const MASK_WIDTH = 18;
const MAX_PULL = 16;
const STRENGTH = 0.3;

const roundedRectPath = (
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) => {
  const rr = Math.min(r, w / 2, h / 2);
  return `M ${x + rr} ${y} H ${x + w - rr} A ${rr} ${rr} 0 0 1 ${x + w} ${
    y + rr
  } V ${y + h - rr} A ${rr} ${rr} 0 0 1 ${x + w - rr} ${y + h} H ${x + rr} A ${rr} ${rr} 0 0 1 ${x} ${
    y + h - rr
  } V ${y + rr} A ${rr} ${rr} 0 0 1 ${x + rr} ${y} Z`;
};

export function MagneticCta({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const stitchRef = useRef<SVGPathElement>(null);
  const maskRef = useRef<SVGPathElement>(null);
  const tailRef = useRef<SVGPathElement>(null);
  const btnRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const svg = svgRef.current;
    const stitch = stitchRef.current;
    const mask = maskRef.current;
    const tail = tailRef.current;
    const btn = btnRef.current;
    if (!card || !svg || !stitch || !mask || !tail || !btn) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let perim = 0;
    let drawn = false;

    const layout = () => {
      const rect = card.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      const d = roundedRectPath(INSET, INSET, w - INSET * 2, h - INSET * 2, RADIUS);
      stitch.setAttribute("d", d);
      mask.setAttribute("d", d);
      const innerW = Math.max(0, w - INSET * 2 - RADIUS * 2);
      const innerH = Math.max(0, h - INSET * 2 - RADIUS * 2);
      perim = 2 * (innerW + innerH) + 2 * Math.PI * RADIUS;
      mask.style.strokeDasharray = `${perim}`;
      mask.style.strokeDashoffset = drawn ? "0" : `${perim}`;
    };

    layout();

    const ro = new ResizeObserver(() => layout());
    ro.observe(card);

    // Stitch draws itself when the card scrolls into view.
    let io: IntersectionObserver | null = null;
    if (reduce) {
      drawn = true;
      mask.style.strokeDashoffset = "0";
    } else {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !drawn) {
            drawn = true;
            requestAnimationFrame(() => {
              mask.style.strokeDashoffset = "0";
            });
          }
        },
        { threshold: 0.3 },
      );
      io.observe(card);
    }

    // Magnetic button + trailing yarn thread.
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;
    let running = false;

    const frame = () => {
      cur.x += (target.x - cur.x) * 0.16;
      cur.y += (target.y - cur.y) * 0.16;
      btn.style.transform = `translate(${cur.x}px, ${cur.y}px)`;

      const bRect = btn.getBoundingClientRect();
      const cRect = card.getBoundingClientRect();
      const cx = bRect.left - cRect.left + bRect.width / 2;
      const cy = bRect.top - cRect.top + bRect.height / 2;
      const restX = cx - cur.x;
      const restY = cy - cur.y;
      const dist = Math.hypot(cur.x, cur.y);

      if (dist > 1.5) {
        const midX = (restX + cx) / 2;
        const midY = (restY + cy) / 2 + Math.min(22, dist * 0.7);
        tail.setAttribute("d", `M ${restX} ${restY} Q ${midX} ${midY} ${cx} ${cy}`);
        tail.style.opacity = `${Math.min(1, dist / 7)}`;
      } else {
        tail.style.opacity = "0";
      }

      const settled =
        Math.abs(target.x - cur.x) < 0.1 &&
        Math.abs(target.y - cur.y) < 0.1 &&
        dist < 0.5;
      if (settled) {
        running = false;
        tail.style.opacity = "0";
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const bRect = btn.getBoundingClientRect();
      const restCx = bRect.left + bRect.width / 2 - cur.x;
      const restCy = bRect.top + bRect.height / 2 - cur.y;
      let dx = (e.clientX - restCx) * STRENGTH;
      let dy = (e.clientY - restCy) * STRENGTH;
      const m = Math.hypot(dx, dy);
      if (m > MAX_PULL) {
        dx = (dx / m) * MAX_PULL;
        dy = (dy / m) * MAX_PULL;
      }
      target.x = dx;
      target.y = dy;
      start();
    };

    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      start();
    };

    if (!reduce) {
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      data-scroll-reveal="scale"
      className="ruggy-thread-bg relative mx-auto flex w-full max-w-7xl flex-col items-center overflow-hidden rounded-[2.5rem] border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-blue)] px-6 py-14 text-center text-white shadow-[10px_12px_0_var(--ruggy-ink)] sm:px-12 sm:py-20"
    >
      <svg
        ref={svgRef}
        aria-hidden="true"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        <defs>
          <mask id="ctaStitchReveal">
            <path
              ref={maskRef}
              className="cta-stitch-mask"
              fill="none"
              stroke="white"
              strokeWidth={MASK_WIDTH}
              strokeLinecap="round"
            />
          </mask>
        </defs>
        <g mask="url(#ctaStitchReveal)">
          <path
            ref={stitchRef}
            fill="none"
            stroke="rgba(255,255,255,0.62)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray="0.5 11"
          />
        </g>
        <path
          ref={tailRef}
          fill="none"
          stroke="var(--ruggy-yellow)"
          strokeWidth={3.5}
          strokeLinecap="round"
          style={{ opacity: 0 }}
        />
      </svg>

      <span className="relative flex size-14 items-center justify-center rounded-full bg-[var(--ruggy-yellow)] text-[var(--ruggy-ink)] shadow-[3px_3px_0_var(--ruggy-ink)]">
        <Sparkles className="size-7" aria-hidden="true" />
      </span>
      <h2 className="relative mt-7 max-w-4xl text-4xl font-black tracking-[-0.04em] sm:text-6xl">
        {title}
      </h2>
      <p className="relative mt-5 max-w-2xl text-lg leading-8 text-white/85">
        {subtitle}
      </p>
      <span ref={btnRef} className="relative mt-8 inline-block will-change-transform">
        <Link
          href={ctaHref}
          className={`inline-flex min-h-14 items-center gap-3 rounded-full bg-[var(--ruggy-yellow)] px-7 text-base font-black text-[var(--ruggy-ink)] shadow-[4px_4px_0_var(--ruggy-ink)] transition-transform hover:-translate-y-1 ${focusClass}`}
        >
          {ctaLabel}
          <ArrowRight className="size-5" aria-hidden="true" />
        </Link>
      </span>
    </div>
  );
}
