"use client";

import { useEffect } from "react";

/**
 * Gives the FAQ its soft landing. A native <details> drops its answer in with
 * no transition and snaps it away again, because the browser hides the content
 * the moment `open` is removed. This holds `open` in place for the length of
 * the closing transition so the answer can settle both ways.
 *
 * Behaviour only — the markup stays in the page. Without JS the disclosures
 * still open and close natively, just instantly, and reduced motion is left on
 * that same native path on purpose.
 */

export function FaqAccordion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-faq-accordion]");

    if (!root) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const items = Array.from(
      root.querySelectorAll<HTMLDetailsElement>("[data-faq-item]"),
    );

    const teardown = items.map((details) => {
      const summary = details.querySelector("summary");
      const panel = details.querySelector<HTMLElement>("[data-faq-panel]");

      if (!summary || !panel) {
        return () => {};
      }

      let closeTimer = 0;
      let closeFrame = 0;
      let collapseStarted = false;

      const clearCloseTimer = () => {
        if (closeTimer) {
          window.clearTimeout(closeTimer);
          closeTimer = 0;
        }

        if (closeFrame) {
          window.cancelAnimationFrame(closeFrame);
          closeFrame = 0;
        }
      };

      // How long the collapse will actually take, read from the element rather
      // than assumed. Returns 0 when nothing will animate.
      const collapseDuration = () => {
        const styles = window.getComputedStyle(panel);
        const longest = (value: string) =>
          value
            .split(",")
            .reduce((max, part) => Math.max(max, Number.parseFloat(part) || 0), 0);

        return (
          (longest(styles.transitionDuration) +
            longest(styles.transitionDelay)) *
          1000
        );
      };

      const finishClose = () => {
        clearCloseTimer();

        if (!details.hasAttribute("data-faq-open")) {
          details.open = false;
        }
      };

      const handleClick = (event: MouseEvent) => {
        event.preventDefault();
        clearCloseTimer();

        // Clicking mid-close simply re-opens: the transition reverses from
        // wherever it currently is.
        if (details.hasAttribute("data-faq-open")) {
          collapseStarted = false;
          details.removeAttribute("data-faq-open");

          // `open` has to outlive the collapse, otherwise the browser hides the
          // panel before it can animate — but correctness must not depend on a
          // transition that may never run, or the panel stays open forever.
          //
          // A declared duration is not a promise that anything animates, so
          // rather than trusting it, watch for the collapse actually starting.
          // If it hasn't by the next frame, nothing is going to move and the
          // panel closes at once instead of waiting out a phantom transition.
          closeFrame = window.requestAnimationFrame(() => {
            closeFrame = window.requestAnimationFrame(() => {
              closeFrame = 0;

              if (!collapseStarted) {
                finishClose();
              }
            });
          });

          closeTimer = window.setTimeout(finishClose, collapseDuration() + 150);

          return;
        }

        details.open = true;
        // Render the panel collapsed and flush that style before expanding.
        // A closed <details> never styles its content, so without this read
        // the first open of each disclosure has no value to animate from and
        // snaps straight to full height.
        void panel.offsetHeight;
        details.setAttribute("data-faq-open", "");
      };

      const handleTransitionRun = (event: TransitionEvent) => {
        if (
          event.target === panel &&
          event.propertyName === "grid-template-rows"
        ) {
          collapseStarted = true;
        }
      };

      const handleTransitionEnd = (event: TransitionEvent) => {
        if (
          event.target !== panel ||
          event.propertyName !== "grid-template-rows" ||
          details.hasAttribute("data-faq-open")
        ) {
          return;
        }

        finishClose();
      };

      summary.addEventListener("click", handleClick);
      panel.addEventListener("transitionrun", handleTransitionRun);
      panel.addEventListener("transitionend", handleTransitionEnd);

      return () => {
        clearCloseTimer();
        summary.removeEventListener("click", handleClick);
        panel.removeEventListener("transitionrun", handleTransitionRun);
        panel.removeEventListener("transitionend", handleTransitionEnd);
        details.removeAttribute("data-faq-open");
      };
    });

    // Anything already open in the markup keeps its expanded state once the
    // controller takes over the expansion attribute.
    items.forEach((details) => {
      if (details.open) {
        details.setAttribute("data-faq-open", "");
      }
    });

    root.dataset.faqLive = "true";

    return () => {
      teardown.forEach((dispose) => dispose());
      delete root.dataset.faqLive;
    };
  }, []);

  return null;
}
