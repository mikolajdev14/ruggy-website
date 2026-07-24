import {
  ArrowRight,
  ArrowUpRight,
  AtSign,
  Camera,
  Heart,
  PackageCheck,
  Palette,
  Ruler,
  Scissors,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import DomeGallery from "@/components/DomeGallery";
import { ExperimentalHero } from "@/components/experimental-hero";
import { HomeScrollReveal } from "@/components/home-scroll-reveal";
import { MagneticCta } from "@/components/magnetic-cta";
import { OrganizationJsonLd } from "@/components/organization-json-ld";
import { TuftedField } from "@/components/tufted-field";
import { allRugPhotos } from "@/lib/gallery";

const benefits = [
  {
    icon: Heart,
    title: "Prezent, którego nie da się powtórzyć",
    description: "Twój pomysł zamieniam w miękki obiekt z własnym charakterem.",
  },
  {
    icon: Palette,
    title: "Projekt w Twoim stylu",
    description:
      "Kolor, forma i detal powstają wokół tego, co naprawdę lubisz.",
  },
  {
    icon: Scissors,
    title: "Ręczna robota od początku do końca",
    description:
      "Każdy fragment przechodzi przez prawdziwą pracownię, nie taśmę produkcyjną.",
  },
];

const steps = [
  {
    number: "01",
    icon: Camera,
    title: "Pokaż mi pomysł",
    description:
      "Wyślij zdjęcie, szkic albo opisz motyw, który chodzi Ci po głowie.",
  },
  {
    number: "02",
    icon: Ruler,
    title: "Wybierz wariant",
    description:
      "Dobierz rozmiar, termin i sposób dostawy w prostym formularzu.",
  },
  {
    number: "03",
    icon: Scissors,
    title: "Wchodzę do pracowni",
    description: "Tuftuję, docinam i wykańczam każdy detal ręcznie.",
  },
  {
    number: "04",
    icon: PackageCheck,
    title: "Ruggy rusza w drogę",
    description:
      "Gotowy dywan wysyłam do paczkomatu albo prosto pod Twoje drzwi.",
  },
];

const faqs = [
  {
    question: "Ile kosztuje zrobienie dywanu?",
    answer:
      "Cena zależy od wybranego wariantu, rozmiaru i złożoności wzoru. Dokładną kwotę zobaczysz podczas składania zamówienia.",
  },
  {
    question: "Co jeśli nie mam gotowego projektu?",
    answer:
      "Wystarczy inspiracja, zdjęcie albo krótki opis. Pomogę Ci przełożyć pomysł na formę, która dobrze zadziała jako dywan.",
  },
  {
    question: "Czy mogę zamówić dowolny kształt?",
    answer:
      "Tak. Lubię nieregularne formy, ale ostateczny kształt zależy od możliwości wykonania konkretnego wzoru.",
  },
  {
    question: "Jak długo trwa realizacja?",
    answer:
      "Aktualny czas wykonania jest podany przy każdym wariancie. Termin wybierasz przed opłaceniem zamówienia.",
  },
];

const focusClass =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-ink)]";
const focusLightClass =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div
      data-ruggy-home
      className="overflow-x-hidden bg-[var(--ruggy-canvas)] text-[var(--ruggy-ink)]"
    >
      <HomeScrollReveal />
      <OrganizationJsonLd />
      <a
        href="#main-content"
        className="sr-only z-50 rounded-full bg-[var(--ruggy-ink)] px-5 py-3 text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
      >
        Przejdź do treści
      </a>

      <header className="relative z-20 bg-[var(--ruggy-surface)] shadow-[0_8px_24px_-14px_rgba(20,32,51,0.45)]">
        <nav
          aria-label="Główna nawigacja"
          className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-5 px-5 sm:px-8 lg:px-10"
        >
          <Link href="/" className={`ruggy-wordmark text-4xl ${focusClass}`}>
            ruggy<span className="text-[var(--ruggy-blue)]">.</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-bold md:flex">
            <Link
              className={`transition-opacity hover:opacity-60 ${focusClass}`}
              href="#jak-to-dziala"
            >
              Proces
            </Link>
            <Link
              className={`transition-opacity hover:opacity-60 ${focusClass}`}
              href="#realizacje"
            >
              Realizacje
            </Link>
            <Link
              className={`transition-opacity hover:opacity-60 ${focusClass}`}
              href="#faq"
            >
              FAQ
            </Link>
          </div>

          <Link
            href="/zamow"
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--ruggy-ink)] px-5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 ${focusClass}`}
          >
            Wyceń dywan
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </nav>
      </header>

      <main id="main-content">
        <ExperimentalHero />

        <section
          id="dlaczego"
          className="relative isolate scroll-mt-24 overflow-hidden border-y-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-blue-soft)]"
        >
          <TuftedField />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
            <div data-scroll-reveal className="mx-auto max-w-3xl text-center">
              <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-[var(--ruggy-blue)]">
                <span
                  aria-hidden="true"
                  className="h-2 w-8 rounded-full bg-[repeating-linear-gradient(90deg,var(--ruggy-blue)_0_6px,transparent_6px_11px)]"
                />
                Więcej niż dekoracja
              </p>
              <h2 className="mt-4 text-balance text-4xl font-black tracking-[-0.04em] sm:text-6xl">
                Kawałek Ciebie,{" "}
                <span className="relative inline-block whitespace-nowrap">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-[-0.1em] bottom-[0.1em] top-[0.55em] -rotate-[1.2deg] rounded-[0.2em] bg-[var(--ruggy-yellow)]"
                  />
                  <span className="relative">tylko bardziej miękki.</span>
                </span>
              </h2>
            </div>

            <ul
              data-scroll-stagger
              className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                const badgeTone = [
                  "bg-[var(--ruggy-yellow)]",
                  "bg-[var(--ruggy-blue)] text-white",
                  "bg-[var(--ruggy-coral)] text-white",
                ][index];
                return (
                  <li
                    key={benefit.title}
                    data-scroll-reveal
                    className={[
                      "ruggy-swatch group relative rounded-[2rem] border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-surface)] p-7 shadow-[7px_8px_0_var(--ruggy-ink)]",
                      index === 1
                        ? "sm:mt-8 sm:rotate-[0.9deg]"
                        : index === 2
                          ? "lg:mt-4 sm:-rotate-[0.8deg]"
                          : "sm:-rotate-[1.2deg]",
                      index === 2 ? "sm:col-span-2 lg:col-span-1" : "",
                    ].join(" ")}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-2 rounded-[1.5rem] border-2 border-dashed border-[var(--ruggy-ink)]/20"
                    />
                    <div className="relative flex items-start justify-between">
                      <span
                        className={`flex size-14 items-center justify-center rounded-2xl border-2 border-[var(--ruggy-ink)] shadow-[3px_3px_0_var(--ruggy-ink)] transition-transform duration-300 group-hover:-rotate-6 ${badgeTone}`}
                      >
                        <Icon className="size-7" aria-hidden="true" />
                      </span>
                      <span
                        aria-hidden="true"
                        className="mt-1 font-editorial text-5xl leading-none text-[var(--ruggy-ink)]/10"
                      >
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="relative mt-7 text-2xl font-black tracking-tight">
                      {benefit.title}
                    </h3>
                    <p className="relative mt-3 text-base leading-7 text-[var(--ruggy-body)]">
                      {benefit.description}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section
          id="realizacje"
          className="scroll-mt-24 bg-[var(--ruggy-ink)] text-white"
        >
          <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
            <div
              data-scroll-reveal
              className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
            >
              <div className="max-w-3xl">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--ruggy-yellow)]">
                  Pomysł nie zna kształtu
                </p>
                <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-6xl">
                  Galeria rzeczy, które nie chciały być zwykłe.
                </h2>
              </div>
              <a
                href="https://www.instagram.com/ruggy.pl/"
                target="_blank"
                rel="noreferrer"
                className={`inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full border-2 border-white px-5 font-bold transition-colors hover:bg-white hover:text-[var(--ruggy-ink)] ${focusLightClass}`}
              >
                <AtSign className="size-5" aria-hidden="true" />
                @ruggy.pl
              </a>
            </div>

            <div
              data-scroll-reveal
              className="relative mt-12 h-[90vh] min-h-[640px] w-full touch-none overflow-hidden rounded-[2rem]"
            >
              <DomeGallery
                images={allRugPhotos}
                grayscale={false}
                overlayBlurColor="#142033"
                fit={0.62}
                openedImageWidth="380px"
                openedImageHeight="380px"
              />
            </div>
          </div>
        </section>

        <section
          id="jak-to-dziala"
          className="scroll-mt-24 bg-[var(--ruggy-canvas)]"
        >
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 lg:px-10">
            <div
              data-scroll-reveal
              className="lg:sticky lg:top-28 lg:self-start"
            >
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--ruggy-blue)]">
                Cztery kroki
              </p>
              <h2 className="mt-4 text-4xl font-black leading-[0.98] tracking-[-0.05em] sm:text-6xl">
                Od{" "}
                <span className="relative inline-block whitespace-nowrap text-[var(--ruggy-blue)]">
                  <span
                    className="absolute inset-x-0 bottom-0 h-3 -rotate-2 rounded-full bg-[var(--ruggy-yellow)] sm:h-4"
                    aria-hidden="true"
                  />
                  <span className="relative">„hej, mam pomysł”</span>
                </span>
                <span className="my-3 block text-[var(--ruggy-body)] sm:my-5">
                  do
                </span>
                <span className="relative inline-block whitespace-nowrap text-[var(--ruggy-ink)]">
                  <span
                    className="absolute inset-x-0 bottom-0 h-3 rotate-1 rounded-full bg-[var(--ruggy-blue-soft-strong)] sm:h-4"
                    aria-hidden="true"
                  />
                  <span className="relative">„hej, mam dywan”.</span>
                </span>
              </h2>
              <p className="mt-5 max-w-md text-lg leading-8 text-[var(--ruggy-body)]">
                Formularz zajmie chwilę. Ręczne wykonanie trochę dłużej. Warto.
              </p>
              <Link
                href="/zamow"
                className={`mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--ruggy-blue)] px-6 font-black text-white transition-transform hover:-translate-y-0.5 ${focusClass}`}
              >
                Zacznij od pomysłu
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </div>

            <ol data-scroll-stagger className="space-y-4">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <li
                    key={step.number}
                    data-scroll-reveal="right"
                    className="group grid gap-5 rounded-[2rem] border-2 border-[var(--ruggy-border-strong)] bg-[var(--ruggy-surface)] p-6 transition-colors hover:border-[var(--ruggy-ink)] sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-7"
                  >
                    <span className="text-5xl font-black tracking-[-0.07em] text-[var(--ruggy-blue-soft-strong)] group-hover:text-[var(--ruggy-yellow)] sm:text-7xl">
                      {step.number}
                    </span>
                    <div>
                      <h3 className="text-2xl font-black tracking-tight">
                        {step.title}
                      </h3>
                      <p className="mt-2 max-w-xl text-base leading-7 text-[var(--ruggy-body)]">
                        {step.description}
                      </p>
                    </div>
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-[var(--ruggy-blue-soft)] text-[var(--ruggy-blue)]">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section
          id="faq"
          className="scroll-mt-24 border-y-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-yellow)]"
        >
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20 lg:px-10">
            <div data-scroll-reveal>
              <p className="text-sm font-black uppercase tracking-[0.18em]">
                Zanim zapytasz na DM
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-6xl">
                Pytania mają miękkie lądowanie.
              </h2>
            </div>

            <div data-scroll-stagger className="space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  data-scroll-reveal
                  className="group rounded-2xl border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-surface)] open:shadow-[5px_5px_0_var(--ruggy-ink)]"
                >
                  <summary
                    className={`flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-lg font-black [&::-webkit-details-marker]:hidden ${focusClass}`}
                  >
                    {faq.question}
                    <span
                      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--ruggy-ink)] text-white transition-transform group-open:rotate-45"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <p className="max-w-2xl px-5 pb-5 text-base leading-7 text-[var(--ruggy-body)]">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--ruggy-blue-soft)] px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
          <MagneticCta
            title="Masz zdjęcie, pomysł albo bardzo konkretną fazę?"
            subtitle="Super. To dokładnie tyle, ile potrzebuję, żeby zacząć."
            ctaLabel="Wyceń swój dywan"
            ctaHref="/zamow"
          />
        </section>
      </main>

      <footer className="bg-[var(--ruggy-ink)] px-5 py-10 text-white sm:px-8 lg:px-10">
        <div
          data-scroll-reveal
          className="mx-auto grid w-full max-w-7xl gap-10 border-b border-white/20 pb-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr]"
        >
          <div>
            <Link
              href="/"
              className={`ruggy-wordmark text-5xl ${focusLightClass}`}
            >
              ruggy<span className="text-[var(--ruggy-yellow)]">.</span>
            </Link>
            <p className="mt-4 max-w-sm text-base leading-7 text-white/70">
              Personalizowane dywany z pomysłu, ręki i dużej ilości włóczki.
            </p>
          </div>
          <nav
            aria-label="Stopka"
            className="flex flex-col items-start gap-3 text-sm font-bold"
          >
            <Link
              href="#jak-to-dziala"
              className={`hover:text-[var(--ruggy-yellow)] ${focusLightClass}`}
            >
              Proces
            </Link>
            <Link
              href="#realizacje"
              className={`hover:text-[var(--ruggy-yellow)] ${focusLightClass}`}
            >
              Realizacje
            </Link>
            <Link
              href="#faq"
              className={`hover:text-[var(--ruggy-yellow)] ${focusLightClass}`}
            >
              FAQ
            </Link>
          </nav>
          <div className="flex flex-col items-start gap-3 text-sm font-bold">
            <a
              href="https://www.instagram.com/ruggy.pl/"
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 hover:text-[var(--ruggy-yellow)] ${focusLightClass}`}
            >
              <AtSign className="size-5" aria-hidden="true" />
              Instagram
            </a>
            <span className="text-white/50">Ruggy, Polska</span>
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 pt-6 text-xs text-white/50 lg:flex-row lg:items-center lg:justify-between">
          <span>© 2026 Ruggy. Wszystkie prawa zastrzeżone.</span>
          <nav
            aria-label="Informacje prawne"
            className="flex flex-wrap items-center gap-x-5 gap-y-3 font-bold text-white/70"
          >
            <Link
              href="/polityka-prywatnosci"
              className={`transition-colors hover:text-[var(--ruggy-yellow)] ${focusLightClass}`}
            >
              Polityka prywatności
            </Link>
            <Link
              href="/zwroty"
              className={`transition-colors hover:text-[var(--ruggy-yellow)] ${focusLightClass}`}
            >
              Zwroty
            </Link>
            <Link
              href="/regulamin"
              className={`transition-colors hover:text-[var(--ruggy-yellow)] ${focusLightClass}`}
            >
              Regulamin
            </Link>
          </nav>
          <span>Stworzone ręcznie. Tak jak dywany.</span>
        </div>
      </footer>
    </div>
  );
}
