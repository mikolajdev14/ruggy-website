"use client";

import { useEffect, useRef } from "react";

/**
 * A living field of short yarn tufts rendered on a Canvas 2D layer. Each strand
 * sways gently on its own and parts away from the pointer, like running a hand
 * across a hand-tufted rug. Sits behind section content as decoration only.
 *
 * - Respects prefers-reduced-motion (renders a single static frame).
 * - Pauses its animation frame whenever the section is off-screen.
 * - Scales strand count to the viewport so mid-range phones stay smooth.
 */

type Strand = {
  x: number;
  y: number;
  len: number;
  baseAngle: number;
  thickness: number;
  color: string;
  phase: number;
  swayAmp: number;
  swaySpeed: number;
};

// Weighted palette: mostly tonal powder blues so copy stays readable, with rare
// cobalt / sunflower / coral flecks for the youth-magazine pop.
const PALETTE: { color: string; weight: number }[] = [
  { color: "#a8cdf8", weight: 48 }, // blue-soft-strong
  { color: "#8fbdf2", weight: 25 },
  { color: "#7db0ea", weight: 17 },
  { color: "#2864f0", weight: 6 }, // cobalt
  { color: "#f4c842", weight: 3 }, // sunflower
  { color: "#d85f4b", weight: 2 }, // coral
];

const pickColor = (r: number) => {
  const total = PALETTE.reduce((sum, p) => sum + p.weight, 0);
  let t = r * total;
  for (const p of PALETTE) {
    if (t < p.weight) return p.color;
    t -= p.weight;
  }
  return PALETTE[0].color;
};

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

// Deterministic pseudo-random so re-layouts stay stable (no Math.random flicker
// on resize; also avoids hydration concerns since this only runs client-side).
const makeRng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

export function TuftedField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let strands: Strand[] = [];

    // Pointer in CSS pixels relative to the canvas. active fades 0..1.
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let active = 0;
    let targetActive = 0;

    const build = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Spacing scales with area; coarser on touch / small screens for perf.
      const base = coarse ? 44 : width < 640 ? 36 : 30;
      const cols = Math.ceil(width / base) + 1;
      const rows = Math.ceil(height / base) + 1;
      const rng = makeRng(0x9e37 + cols * 131 + rows);

      const next: Strand[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const jitterX = (rng() - 0.5) * base * 0.7;
          const jitterY = (rng() - 0.5) * base * 0.7;
          const x = c * base + base * 0.5 + jitterX;
          const y = r * base + base * 0.5 + jitterY;
          next.push({
            x,
            y,
            len: base * (0.52 + rng() * 0.4),
            baseAngle: (rng() - 0.5) * 0.5,
            thickness: 1.7 + rng() * 1.6,
            color: pickColor(rng()),
            phase: rng() * Math.PI * 2,
            swayAmp: 0.12 + rng() * 0.16,
            swaySpeed: 0.6 + rng() * 0.7,
          });
        }
      }
      strands = next;
    };

    const draw = (timeMs: number) => {
      const t = timeMs / 1000;
      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = "round";

      active += (targetActive - active) * 0.08;
      pointer.x += (pointer.tx - pointer.x) * 0.18;
      pointer.y += (pointer.ty - pointer.y) * 0.18;

      const R = coarse ? 120 : 150;

      for (let i = 0; i < strands.length; i++) {
        const s = strands[i];

        let angle = reduceMotion
          ? s.baseAngle
          : s.baseAngle + Math.sin(t * s.swaySpeed + s.phase) * s.swayAmp;
        let len = s.len;

        if (active > 0.01 && !reduceMotion) {
          const dx = s.x - pointer.x;
          const dy = s.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < R) {
            const influence = smoothstep(R, 0, dist) * active;
            // Lean outward, away from the pointer (parting the pile).
            const away = Math.atan2(dx, -dy);
            let delta = away - angle;
            delta = ((delta + Math.PI) % (Math.PI * 2)) - Math.PI;
            angle += delta * influence * 0.9;
            // Press the pile flatter right under the hand.
            len *= 1 - 0.28 * influence;
          }
        }

        const dirX = Math.sin(angle);
        const dirY = -Math.cos(angle);
        const tipX = s.x + dirX * len;
        const tipY = s.y + dirY * len;
        // Slight curl via a control point offset perpendicular to the strand.
        const perpX = -dirY;
        const perpY = dirX;
        const curl = len * 0.14;
        const cx = (s.x + tipX) / 2 + perpX * curl;
        const cy = (s.y + tipY) / 2 + perpY * curl;

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.quadraticCurveTo(cx, cy, tipX, tipY);
        ctx.lineWidth = s.thickness;
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = 0.85;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    let rafId = 0;
    let running = false;
    const loop = (ts: number) => {
      draw(ts);
      rafId = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
    };

    build();

    if (reduceMotion) {
      // One static frame, no animation loop.
      draw(0);
    } else {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) start();
          else stop();
        },
        { threshold: 0 },
      );
      io.observe(host);

      const onVisibility = () => {
        if (document.hidden) stop();
        else if (io) start();
      };
      document.addEventListener("visibilitychange", onVisibility);

      const onMove = (e: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        pointer.tx = e.clientX - rect.left;
        pointer.ty = e.clientY - rect.top;
        if (pointer.x < -9000) {
          pointer.x = pointer.tx;
          pointer.y = pointer.ty;
        }
        targetActive = 1;
      };
      const onLeave = () => {
        targetActive = 0;
      };
      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerleave", onLeave);
      host.addEventListener("pointercancel", onLeave);

      const ro = new ResizeObserver(() => build());
      ro.observe(host);

      return () => {
        stop();
        io.disconnect();
        ro.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerleave", onLeave);
        host.removeEventListener("pointercancel", onLeave);
      };
    }

    // Reduced-motion path: still rebuild on resize so it stays crisp.
    const ro = new ResizeObserver(() => {
      build();
      draw(0);
    });
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
