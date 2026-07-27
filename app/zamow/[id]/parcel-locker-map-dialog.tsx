"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  GEOWIDGET_CONFIG,
  GEOWIDGET_SCRIPT_URL,
  GEOWIDGET_STYLE_URL,
  GEOWIDGET_TOKEN,
  formatGeowidgetPointAddress,
  type GeowidgetPoint,
} from "@/lib/inpost-geowidget";
import { useDialogChrome } from "./use-dialog-chrome";

// The SDK dispatches the pick as a bubbling CustomEvent named after the
// `onpoint` attribute — it only calls a global function when one already exists
// under that name. A namespaced name we never define globally therefore keeps
// the callback out of `window` entirely.
const POINT_EVENT = "ruggy-inpost-point-selected";

// The map SDK is ~100 kB and only matters once someone opens the dialog, so it
// is injected on demand rather than on every order page. The promise is module
// scoped so reopening the dialog reuses the already-loaded SDK.
let sdkPromise: Promise<void> | null = null;

const loadGeowidgetSdk = () => {
  sdkPromise ??= new Promise<void>((resolve, reject) => {
    if (!document.querySelector(`link[href="${GEOWIDGET_STYLE_URL}"]`)) {
      const stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href = GEOWIDGET_STYLE_URL;
      document.head.append(stylesheet);
    }

    if (customElements.get("inpost-geowidget")) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = GEOWIDGET_SCRIPT_URL;
    script.defer = true;
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => {
      // Let a later attempt retry instead of caching the failure forever.
      sdkPromise = null;
      script.remove();
      reject(new Error("Nie udało się wczytać mapy InPost."));
    });
    document.head.append(script);
  });

  return sdkPromise;
};

type ParcelLockerMapDialogProps = {
  onSelect: (selection: { code: string; address: string }) => void;
  onClose: () => void;
};

export function ParcelLockerMapDialog({
  onSelect,
  onClose,
}: ParcelLockerMapDialogProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useDialogChrome({
    onEscape: onClose,
    initialFocusRef: closeButtonRef,
  });
  const dialogBodyRef = useRef<HTMLDivElement>(null);
  const widgetHostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    let isMounted = true;

    loadGeowidgetSdk()
      .then(() => isMounted && setStatus("ready"))
      .catch(() => isMounted && setStatus("error"));

    return () => {
      isMounted = false;
    };
  }, []);

  // The event bubbles out of <inpost-geowidget>, so listening on the wrapper
  // works no matter when the SDK gets around to defining the element.
  const handlePointSelected = useCallback(
    (event: Event) => {
      const point = (event as CustomEvent<GeowidgetPoint>).detail;
      const code = point?.name?.trim();

      if (!code) {
        return;
      }

      onSelect({ code, address: formatGeowidgetPointAddress(point) });
    },
    [onSelect],
  );

  useEffect(() => {
    const body = dialogBodyRef.current;

    if (!body) {
      return;
    }

    body.addEventListener(POINT_EVENT, handlePointSelected);

    return () => body.removeEventListener(POINT_EVENT, handlePointSelected);
  }, [handlePointSelected]);

  // The widget is mounted by hand rather than as JSX for two reasons: React 19
  // assigns props on a custom element as *properties* whenever the key exists
  // on it, and every one of these is a getter-only accessor on the SDK's class,
  // so React would throw. And the SDK declares no observedAttributes — it reads
  // token/config/language/onpoint once, inside connectedCallback — so the
  // attributes have to be in place before the element enters the DOM.
  useEffect(() => {
    const host = widgetHostRef.current;

    if (status !== "ready" || !host) {
      return;
    }

    const widget = document.createElement("inpost-geowidget");
    widget.setAttribute("token", GEOWIDGET_TOKEN);
    widget.setAttribute("language", "pl");
    widget.setAttribute("config", GEOWIDGET_CONFIG);
    widget.setAttribute("onpoint", POINT_EVENT);
    widget.style.display = "block";
    widget.style.height = "100%";
    host.append(widget);

    return () => widget.remove();
  }, [status]);

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-[var(--ruggy-ink)]/70 p-4 backdrop-blur-sm">
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="parcel-locker-map-title"
        className="flex max-h-[92vh] w-full max-w-3xl flex-col rounded-[2rem] border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-surface)] p-5 shadow-[8px_10px_0_var(--ruggy-yellow)] sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="parcel-locker-map-title"
              className="text-xl font-black leading-tight text-[var(--ruggy-ink)] sm:text-2xl"
            >
              Wybierz paczkomat
            </h2>
            <p className="mt-1 text-sm leading-6 text-[var(--ruggy-body)]">
              Wpisz miasto lub ulicę, a potem kliknij pinezkę na mapie.
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Zamknij mapę paczkomatów"
            className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--ruggy-ink)] transition-colors hover:bg-[var(--ruggy-blue-soft)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-ink)]"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div
          ref={dialogBodyRef}
          className="mt-4 min-h-0 flex-1 overflow-hidden rounded-2xl border-2 border-[var(--ruggy-border-strong)]"
          style={{ height: "min(66vh, 34rem)" }}
        >
          {status === "loading" ? (
            <p
              className="flex h-full items-center justify-center p-5 text-sm font-bold text-[var(--ruggy-muted)]"
              role="status"
            >
              Ładuję mapę paczkomatów…
            </p>
          ) : null}

          {status === "error" ? (
            <p
              className="flex h-full items-center justify-center p-5 text-center text-sm font-bold text-[var(--ruggy-error)]"
              role="alert"
            >
              Nie udało się wczytać mapy InPost. Zamknij to okno i wpisz kod
              paczkomatu ręcznie.
            </p>
          ) : null}

          {/* Left empty on purpose: the widget node is appended here by hand,
              so React must never own this element's children. */}
          <div
            ref={widgetHostRef}
            className={status === "ready" ? "size-full" : "hidden"}
          />
        </div>
      </section>
    </div>
  );
}
