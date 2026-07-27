"use client";

import { useEffect } from "react";

/**
 * Drives the "cztery kroki" rail: a cobalt thread that is stitched down the
 * process as the visitor scrolls. The tip follows the scroll position
 * continuously, and each step activates the moment the tip passes its stitch.
 *
 * Behaviour only — the markup lives in the page so the section stays a Server
 * Component. Without JS, or with reduced motion, the CSS defaults render the
 * thread fully drawn and every step in one readable resting state.
 */

const FOCUS_RATIO = 0.52;

export function ProcessRail() {
  useEffect(() => {
    const rail = document.querySelector<HTMLElement>("[data-process-rail]");

    if (!rail) {
      return;
    }

    const steps = Array.from(
      rail.querySelectorAll<HTMLElement>("[data-rail-step]"),
    );

    if (steps.length === 0) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const counter = document.querySelector<HTMLElement>(
      "[data-process-counter]",
    );

    // Stitch positions, measured from the rail's own top edge. offsetTop and
    // offsetHeight ignore transforms, so the active step's lift cannot feed
    // back into the measurement it was derived from.
    let anchors: number[] = [];
    let origin = 0;
    let span = 1;
    let frame = 0;
    let activeIndex = -1;

    const measure = () => {
      anchors = steps.map((step) => step.offsetTop + step.offsetHeight / 2);
      origin = anchors[0];
      span = Math.max(anchors[anchors.length - 1] - origin, 1);
      rail.style.setProperty("--rail-top", `${origin}px`);
      rail.style.setProperty("--rail-span", `${span}px`);
    };

    const update = () => {
      frame = 0;

      const focusLine = window.innerHeight * FOCUS_RATIO;
      const tip = focusLine - rail.getBoundingClientRect().top - origin;
      const progress = Math.min(Math.max(tip / span, 0), 1);

      rail.style.setProperty("--rail-progress", `${progress}`);

      let index = 0;
      for (let i = 0; i < anchors.length; i += 1) {
        if (anchors[i] - origin <= tip) {
          index = i;
        }
      }

      if (index === activeIndex) {
        return;
      }

      activeIndex = index;

      steps.forEach((step, i) => {
        step.dataset.railState =
          i < index ? "done" : i === index ? "active" : "ahead";
      });

      counter?.style.setProperty("--rail-step", `${index}`);
    };

    const requestUpdate = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(update);
    };

    const remeasure = () => {
      measure();
      requestUpdate();
    };

    measure();
    rail.dataset.railLive = "true";
    update();

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", remeasure);

    // Card heights shift with font loading and breakpoint changes; the stitches
    // have to follow them.
    const resizeObserver =
      "ResizeObserver" in window ? new ResizeObserver(remeasure) : null;
    resizeObserver?.observe(rail);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", remeasure);
      resizeObserver?.disconnect();

      delete rail.dataset.railLive;
      rail.style.removeProperty("--rail-top");
      rail.style.removeProperty("--rail-span");
      rail.style.removeProperty("--rail-progress");
      steps.forEach((step) => delete step.dataset.railState);
      counter?.style.removeProperty("--rail-step");
    };
  }, []);

  return null;
}
