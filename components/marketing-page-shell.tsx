import { absoluteUrl } from "@/lib/site-config";
import { ArrowRight, AtSign, Check, ChevronRight } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type ContentSection = {
  title: string;
  content: ReactNode;
  points?: string[];
};

export function MarketingPageShell({
  path,
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  sections,
  ctaTitle = "Opowiedz nam o swoim pomyśle",
  ctaText = "Wybierz wariant, dodaj zdjęcie i zarezerwuj dogodny termin online.",
}: {
  path: string;
  eyebrow: string;
  title: string;
  intro: string;
  image: StaticImageData;
  imageAlt: string;
  sections: ContentSection[];
  ctaTitle?: string;
  ctaText?: string;
}) {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Strona główna",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: title,
        item: absoluteUrl(path),
      },
    ],
  };

  return (
    <div className="bg-[var(--ruggy-canvas)] text-[var(--ruggy-ink)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData).replace(/</g, "\\u003c"),
        }}
      />

      <header className="border-b-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-canvas)]">
        <nav
          aria-label="Główna nawigacja"
          className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-5 px-5 sm:px-8 lg:px-10"
        >
          <Link
            href="/"
            className="ruggy-wordmark text-4xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-blue)]"
          >
            ruggy<span className="text-[var(--ruggy-blue)]">.</span>
          </Link>
          <div className="hidden items-center gap-6 text-sm font-bold lg:flex">
            <Link href="/#jak-to-dziala" className="hover:text-[var(--ruggy-blue)]">
              Proces
            </Link>
            <Link href="/#realizacje" className="hover:text-[var(--ruggy-blue)]">
              Realizacje
            </Link>
            <Link href="/#faq" className="hover:text-[var(--ruggy-blue)]">
              FAQ
            </Link>
          </div>
          <Link
            href="/zamow"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--ruggy-blue)] px-5 text-sm font-black text-white transition-transform hover:-translate-y-0.5"
          >
            Zamów dywan
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </nav>
      </header>

      <main>
        <section className="relative isolate flex min-h-[68svh] items-end overflow-hidden border-b-2 border-[var(--ruggy-ink)]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(20,32,51,0.94)_0%,rgba(20,32,51,0.72)_50%,rgba(20,32,51,0.18)_100%)]" />
          <div className="mx-auto w-full max-w-7xl px-5 pb-14 pt-24 text-white sm:px-8 sm:pb-20 lg:px-10">
            <nav aria-label="Okruszki" className="flex items-center gap-2 text-sm text-white/75">
              <Link href="/" className="hover:text-white">Strona główna</Link>
              <ChevronRight size={14} aria-hidden="true" />
              <span>{eyebrow}</span>
            </nav>
            <p className="mt-8 text-sm font-black uppercase tracking-[0.16em] text-[var(--ruggy-yellow)]">
              {eyebrow}
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-none sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
              {intro}
            </p>
          </div>
        </section>

        {sections.map((section, index) => (
          <section
            key={section.title}
            className={`border-b-2 border-[var(--ruggy-border)] ${
              index % 2 === 0
                ? "bg-[var(--ruggy-canvas)]"
                : "bg-[var(--ruggy-blue-soft)]"
            }`}
          >
            <div className="mx-auto grid w-full max-w-6xl gap-7 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-10">
              <h2 className="text-3xl font-black leading-tight sm:text-4xl">
                {section.title}
              </h2>
              <div className="text-base leading-8 text-[var(--ruggy-body)] sm:text-lg">
                {section.content}
                {section.points?.length ? (
                  <ul className="mt-7 space-y-3">
                    {section.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--ruggy-yellow)] text-[var(--ruggy-ink)]">
                          <Check size={14} aria-hidden="true" />
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </section>
        ))}

        <section className="ruggy-thread-bg bg-[var(--ruggy-blue)] text-white">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-8 px-5 py-14 sm:px-8 sm:py-20 lg:flex-row lg:items-center lg:px-10">
            <div>
              <h2 className="max-w-3xl text-3xl font-black sm:text-5xl">{ctaTitle}</h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/80">{ctaText}</p>
            </div>
            <Link
              href="/zamow"
              className="inline-flex min-h-14 shrink-0 items-center gap-3 rounded-full bg-[var(--ruggy-yellow)] px-7 text-base font-black text-[var(--ruggy-ink)] transition-transform hover:-translate-y-1"
            >
              Przejdź do zamówienia
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[var(--ruggy-ink)] px-5 py-10 text-white sm:px-8 lg:px-10">
        <div className="mx-auto grid w-full max-w-7xl gap-8 border-b border-white/20 pb-9 sm:grid-cols-3">
          <div>
            <Link href="/" className="ruggy-wordmark text-5xl">ruggy<span className="text-[var(--ruggy-yellow)]">.</span></Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/65">
              Personalizowane dywany wykonywane ręcznie w Polsce.
            </p>
          </div>
          <nav aria-label="Nawigacja" className="flex flex-col items-start gap-3 text-sm font-bold">
            <Link href="/#jak-to-dziala">Proces</Link>
            <Link href="/#realizacje">Realizacje</Link>
            <Link href="/#faq">FAQ</Link>
          </nav>
          <div className="flex flex-col items-start gap-3 text-sm font-bold">
            <a href="https://www.instagram.com/ruggy.pl/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
              <AtSign size={16} aria-hidden="true" /> Instagram
            </a>
          </div>
        </div>
        <p className="mx-auto w-full max-w-7xl pt-6 text-xs text-white/50">
          © 2026 Ruggy. Wszystkie prawa zastrzeżone.
        </p>
      </footer>
    </div>
  );
}
