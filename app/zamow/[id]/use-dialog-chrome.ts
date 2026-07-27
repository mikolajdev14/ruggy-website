"use client";

import { type RefObject, useEffect, useRef } from "react";

/** Shared modal plumbing: scroll lock, focus trap, Escape, focus restore. */
export function useDialogChrome(options?: {
  onEscape?: () => void;
  initialFocusRef?: RefObject<HTMLElement | null>;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const onEscape = options?.onEscape;
  const initialFocusRef = options?.initialFocusRef;

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const getFocusable = () =>
      Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    (initialFocusRef?.current ?? getFocusable()[0])?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (onEscape) {
          event.preventDefault();
          onEscape();
        }
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getFocusable();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!firstElement || !lastElement) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElement?.focus();
    };
  }, [onEscape, initialFocusRef]);

  return containerRef;
}
