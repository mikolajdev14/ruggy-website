"use client";

import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRef, useSyncExternalStore } from "react";
import { useDialogChrome } from "./use-dialog-chrome";

// Acceptance is remembered for the tab so the warning fires once per visit —
// at the subrodzaj step — instead of again on the details page behind it.
const ACCEPTED_KEY = "ruggy:papadywany-content-warning";

// sessionStorage is the source of truth; the in-memory copy keeps the gate
// working when storage is blocked (private mode) and covers same-tab writes,
// which never emit a `storage` event.
let acceptedInMemory = false;
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function getSnapshot() {
  if (acceptedInMemory) return true;

  try {
    return window.sessionStorage.getItem(ACCEPTED_KEY) === "1";
  } catch {
    return false;
  }
}

// Rendering nothing on the server keeps hydration clean; React re-reads the
// real snapshot immediately afterwards and shows the dialog if it is needed.
function getServerSnapshot() {
  return true;
}

function markAccepted() {
  acceptedInMemory = true;

  try {
    window.sessionStorage.setItem(ACCEPTED_KEY, "1");
  } catch {
    // Failing to persist only means the warning returns in the next tab.
  }

  for (const listener of listeners) {
    listener();
  }
}

/**
 * Gates papadywany behind the content warning. Rendered by both the subrodzaj
 * picker and the order details page; whichever the visitor reaches first shows
 * the dialog, and the other stays quiet.
 */
export function ContentWarningGate() {
  const hasAccepted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (hasAccepted) {
    return null;
  }

  return <ContentWarningDialog onAccept={markAccepted} />;
}

function ContentWarningDialog({ onAccept }: { onAccept: () => void }) {
  const acceptButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useDialogChrome({ initialFocusRef: acceptButtonRef });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--ruggy-ink)]/70 p-4 backdrop-blur-sm">
      <section
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="content-warning-title"
        aria-describedby="content-warning-description"
        className="w-full max-w-xl rounded-[2rem] border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-surface)] p-6 shadow-[8px_10px_0_var(--ruggy-yellow)] sm:p-8"
      >
        <span className="flex size-12 items-center justify-center rounded-2xl bg-[var(--ruggy-yellow)] text-[var(--ruggy-ink)]">
          <TriangleAlert size={24} aria-hidden="true" />
        </span>
        <h2
          id="content-warning-title"
          className="mt-5 text-2xl font-black text-[var(--ruggy-ink)] sm:text-3xl"
        >
          Uwaga dotycząca treści
        </h2>
        <p
          id="content-warning-description"
          className="mt-4 text-base leading-7 text-[var(--ruggy-body)]"
        >
          Serwis nie ma na celu urażania niczyich przekonań religijnych, ale
          zawarte tu materiały mogą okazać się kontrowersyjne. Osobom wierzącym
          uprzejmie sugeruję rozważenie opuszczenia strony. Dziękuję za
          wyrozumiałość.
        </p>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/zamow"
            className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[var(--ruggy-ink)] px-5 text-sm font-black transition-colors hover:bg-[var(--ruggy-blue-soft)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-ink)]"
          >
            Wróć do wariantów
          </Link>
          <button
            ref={acceptButtonRef}
            type="button"
            onClick={onAccept}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--ruggy-blue)] px-5 text-sm font-black text-white transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-ink)]"
          >
            Rozumiem, przechodzę dalej
          </button>
        </div>
      </section>
    </div>
  );
}
