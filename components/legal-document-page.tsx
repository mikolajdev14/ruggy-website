import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface LegalDocumentPageProps {
  title: string;
  content: string;
}

const legalLinks = [
  { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
  { href: "/zwroty", label: "Zwroty" },
  { href: "/regulamin", label: "Regulamin" },
];

const focusClass =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-ink)]";
const focusLightClass =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

export function LegalDocumentPage({
  title,
  content,
}: LegalDocumentPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--ruggy-canvas)] text-[var(--ruggy-ink)]">
      <header className="border-b border-[var(--ruggy-border)] bg-[var(--ruggy-canvas)]">
        <nav
          aria-label="Nawigacja dokumentów"
          className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-5 px-5 sm:px-8 lg:px-10"
        >
          <Link href="/" className={`ruggy-wordmark text-4xl ${focusClass}`}>
            ruggy<span className="text-[var(--ruggy-blue)]">.</span>
          </Link>
          <Link
            href="/"
            className={`inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-[var(--ruggy-ink)] px-5 text-sm font-black transition-colors hover:bg-[var(--ruggy-yellow)] ${focusClass}`}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Wróć na stronę
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--ruggy-blue)]">
          Informacje prawne
        </p>
        <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
          {title}
        </h1>

        <article className="mt-10 border-y-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-surface)] py-8 sm:py-12">
          <p className="whitespace-pre-wrap text-base leading-8 text-[var(--ruggy-body)] sm:text-lg">
            {content.trim()}
          </p>
        </article>

        <nav
          aria-label="Pozostałe dokumenty"
          className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold"
        >
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`underline decoration-2 underline-offset-4 transition-colors hover:text-[var(--ruggy-blue)] ${focusClass}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </main>

      <footer className="bg-[var(--ruggy-ink)] px-5 py-8 text-white sm:px-8 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Ruggy. Wszystkie prawa zastrzeżone.</span>
          <Link
            href="/"
            className={`font-bold transition-colors hover:text-[var(--ruggy-yellow)] ${focusLightClass}`}
          >
            Strona główna
          </Link>
        </div>
      </footer>
    </div>
  );
}
