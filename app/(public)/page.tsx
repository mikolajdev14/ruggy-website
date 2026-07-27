import {
  ArrowRight,
  AtSign,
  Camera,
  CreditCard,
  Heart,
  PackageCheck,
  Palette,
  Scissors,
  Shapes,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { RugMarquee } from "@/components/rug-marquee";
import { ExperimentalHero } from "@/components/experimental-hero";
import { FaqAccordion } from "@/components/faq-accordion";
import { HomeScrollReveal } from "@/components/home-scroll-reveal";
import { MagneticCta } from "@/components/magnetic-cta";
import { OrganizationJsonLd } from "@/components/organization-json-ld";
import { ProcessRail } from "@/components/process-rail";
import { TuftedField } from "@/components/tufted-field";
import { allRugPhotos } from "@/lib/gallery";

const benefits = [
  {
    icon: Heart,
    title: "Prezent, którego nie da się powtórzyć",
    description:
      "Twój pomysł zamieniam w coś, co wywoła zazdrość wśród Twoich znajomych",
  },
  {
    icon: Palette,
    title: "Projekt taki jak chcesz",
    description:
      "Wszystko wyszyte konkretnie pod Twoje widzimisię - bez kompromisów",
  },
  {
    icon: Scissors,
    title: "Ręczna robota od początku do końca",
    description:
      " Każdy proces, od tworzenia projektu, po szycie i obróbkę robię ja - Tomek ",
  },
];

const steps = [
  {
    number: "01",
    icon: Shapes,
    title: "Wybierz bazę pod pomysł",
    description:
      "Otwórz zamówienie i wybierz wariant dywanu, na którym zbuduję Twój projekt.",
  },
  {
    number: "02",
    icon: Camera,
    title: "Dodaj zdjęcie i szczegóły",
    description:
      "W jednym formularzu wgrywasz zdjęcie lub opis inspiracji i ustawiasz rozmiar, termin oraz dostawę.",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Zapłać online albo ustal cenę",
    description:
      "Gotowe warianty opłacasz od razu i rezerwujesz termin. Projekty na wymiar zapisuję, a ostateczną cenę dogadujemy na Instagramie.",
  },
  {
    number: "04",
    icon: PackageCheck,
    title: "Tuftuję ręcznie i wysyłam",
    description:
      "Wuja Dywaniarz zabiera się do roboty - Wykonuję Twój dywan od zera, przenoszę projekt na płótno, wyszywam detale, a na koniec obrabiam je maszynką.",
  },
];

const faqs = [
  {
    question: "Ile kosztuje taki customowy dywan?",
    answer:
      "Cena zależy głównie od dwóch czynników: wielkość dywanu i stopień skomplikowania wzoru. Najprościej będzie jeśli podeślesz mi jakieś zdjęcie lub grafikę, zobacze co da się z tym zrobić",
  },
  {
    question: "Co jeśli nie mam gotowego projektu?",
    answer:
      "Wystarczy inspiracja, zdjęcie albo krótki opis. Pomogę Ci ogarnąć wszystko po kolei, aby efekt finalny był więcej niż zadowalający ",
  },
  {
    question: "Czy mogę zamówić dowolny kształt?",
    answer:
      "Tak. Nieregularne formy są jak najbardziej ok, ale ostateczny kształt zależy od możliwości wykonania konkretnego wzoru.",
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
      className="overflow-x-clip bg-[var(--ruggy-canvas)] text-[var(--ruggy-ink)]"
    >
      <HomeScrollReveal />
      <ProcessRail />
      <FaqAccordion />
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
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--ruggy-blue)] px-5 text-sm font-black text-white transition-transform hover:-translate-y-0.5 ${focusClass}`}
          >
            Zamów dywan
            <ArrowRight className="size-4" aria-hidden="true" />
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

            <div data-scroll-reveal className="mt-12">
              <RugMarquee photos={allRugPhotos} />
            </div>
          </div>
        </section>

        <section
          id="jak-to-dziala"
          className="scroll-mt-24 bg-[var(--ruggy-canvas)]"
        >
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-10 xl:gap-20">
            <div
              data-scroll-reveal
              className="lg:sticky lg:top-28 lg:min-w-0 lg:self-start"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--ruggy-blue)]">
                  Cztery kroki
                </p>
                <p
                  data-process-counter
                  aria-hidden="true"
                  className="ruggy-rail-counter flex shrink-0 items-baseline gap-1 font-black leading-none tracking-[-0.05em]"
                >
                  <span className="ruggy-rail-counter-window text-[var(--ruggy-blue)]">
                    <span className="ruggy-rail-counter-track">
                      {steps.map((step) => (
                        <span key={step.number}>{step.number}</span>
                      ))}
                    </span>
                  </span>
                  <span className="text-sm text-[var(--ruggy-muted)]">
                    / {steps.length.toString().padStart(2, "0")}
                  </span>
                </p>
              </div>
              <h2 className="mt-4 text-4xl font-black leading-[1.06] tracking-[-0.05em] sm:text-5xl lg:text-[clamp(2.5rem,3.6vw,3.5rem)]">
                Od{" "}
                <span className="relative inline-block whitespace-nowrap text-[var(--ruggy-blue)]">
                  <span
                    className="absolute inset-x-0 bottom-0 h-3 -rotate-2 rounded-full bg-[var(--ruggy-yellow)] sm:h-4"
                    aria-hidden="true"
                  />
                  <span className="relative">„hej, mam pomysł”</span>
                </span>
                <span className="my-3 block text-[var(--ruggy-body)] sm:my-4">
                  do
                </span>
                {/* Ten cytat jest za długi na jedną linię, więc zamiast paska
                    pozycjonowanego absolutnie używamy tła klonowanego na każdy
                    wiersz — zawija się bez rozjeżdżania podkreślenia. */}
                <span className="bg-[linear-gradient(to_top,var(--ruggy-blue-soft-strong)_0.75rem,transparent_0.75rem)] text-[var(--ruggy-ink)] [-webkit-box-decoration-break:clone] [box-decoration-break:clone] sm:bg-[linear-gradient(to_top,var(--ruggy-blue-soft-strong)_1rem,transparent_1rem)]">
                  „Siema, dostałem dywan - zaje***ty!”
                </span>
              </h2>
              <p className="mt-6 text-lg leading-8 text-[var(--ruggy-body)]">
                <span className="block xl:whitespace-nowrap">
                  Formularz zajmie chwilę. Ręczne wykonanie trochę dłużej.
                </span>
                <span className="block">Warto.</span>
              </p>
              <Link
                href="/zamow"
                className={`mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--ruggy-blue)] px-6 font-black text-white transition-transform hover:-translate-y-0.5 ${focusClass}`}
              >
                Zacznij od pomysłu
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </div>

            <div
              data-process-rail
              data-scroll-reveal
              className="ruggy-rail relative"
            >
              <span className="ruggy-rail-thread" aria-hidden="true">
                <span className="ruggy-rail-yarn" />
                <span className="ruggy-rail-knot" />
              </span>

              <ol className="ruggy-rail-list space-y-4">
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <li
                      key={step.number}
                      data-rail-step
                      className="ruggy-rail-card relative grid gap-5 rounded-[2rem] border-2 p-6 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-7"
                    >
                      <span className="ruggy-rail-stitch" aria-hidden="true" />
                      <span className="ruggy-rail-number text-5xl font-black tracking-[-0.07em] sm:text-7xl">
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
                      <span className="ruggy-rail-icon flex size-12 items-center justify-center rounded-2xl">
                        <Icon className="size-6" aria-hidden="true" />
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
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

            <div data-faq-accordion data-scroll-stagger className="space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  data-faq-item
                  data-scroll-reveal
                  className="ruggy-faq-item rounded-2xl border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-surface)]"
                >
                  <summary
                    className={`flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-lg font-black [&::-webkit-details-marker]:hidden ${focusClass}`}
                  >
                    {faq.question}
                    <span
                      className="ruggy-faq-icon flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--ruggy-ink)] text-white"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <div data-faq-panel className="ruggy-faq-panel">
                    <div>
                      <p className="ruggy-faq-answer max-w-2xl px-5 pb-5 text-base leading-7 text-[var(--ruggy-body)]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--ruggy-blue-soft)] px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
          <MagneticCta
            title="Masz zdjęcie, pomysł albo bardzo konkretną fazę?"
            subtitle="Super. To dokładnie tyle, ile potrzebuję, żeby zacząć."
            ctaLabel="Zamów swój dywan"
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
