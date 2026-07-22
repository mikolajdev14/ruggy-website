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
  Sparkles,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { OrganizationJsonLd } from "@/components/organization-json-ld";
import heroWorkshop from "@/public/ruggy/hero-workshop.webp";
import rugDog from "@/public/ruggy/rug-dog.webp";
import rugVinyl from "@/public/ruggy/rug-vinyl.webp";

const benefits = [
  {
    icon: Heart,
    title: "Prezent, którego nie da się powtórzyć",
    description: "Twój pomysł zamieniamy w miękki obiekt z własnym charakterem.",
  },
  {
    icon: Palette,
    title: "Projekt w Twoim stylu",
    description: "Kolor, forma i detal powstają wokół tego, co naprawdę lubisz.",
  },
  {
    icon: Scissors,
    title: "Ręczna robota od początku do końca",
    description: "Każdy fragment przechodzi przez prawdziwą pracownię, nie taśmę produkcyjną.",
  },
];

const steps = [
  {
    number: "01",
    icon: Camera,
    title: "Pokaż nam pomysł",
    description: "Wyślij zdjęcie, szkic albo opisz motyw, który chodzi Ci po głowie.",
  },
  {
    number: "02",
    icon: Ruler,
    title: "Wybierz wariant",
    description: "Dobierz rozmiar, termin i sposób dostawy w prostym formularzu.",
  },
  {
    number: "03",
    icon: Scissors,
    title: "Wchodzimy do pracowni",
    description: "Tuftujemy, docinamy i wykańczamy każdy detal ręcznie.",
  },
  {
    number: "04",
    icon: PackageCheck,
    title: "Ruggy rusza w drogę",
    description: "Gotowy dywan wysyłamy do paczkomatu albo prosto pod Twoje drzwi.",
  },
];

const gallery = [
  {
    image: rugDog,
    alt: "Kremowy ręcznie tuftowany dywan w kształcie pieska z niebieskim uchem",
    label: "Twój pupil",
    className: "sm:rotate-[-1.5deg]",
  },
  {
    image: rugVinyl,
    alt: "Okrągły ręcznie tuftowany dywan inspirowany płytą winylową",
    label: "Twój klimat",
    className: "sm:translate-y-8 sm:rotate-[1.5deg]",
  },
  {
    image: heroWorkshop,
    alt: "Niebieski dywan o nieregularnym kształcie podczas ręcznego wykańczania",
    label: "Twój pomysł",
    className: "sm:rotate-[-0.75deg]",
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
      "Wystarczy inspiracja, zdjęcie albo krótki opis. Pomożemy przełożyć pomysł na formę, która dobrze zadziała jako dywan.",
  },
  {
    question: "Czy mogę zamówić dowolny kształt?",
    answer:
      "Tak. Lubimy nieregularne formy, ale ostateczny kształt zależy od możliwości wykonania konkretnego wzoru.",
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
    <div className="overflow-x-hidden bg-[var(--ruggy-canvas)] text-[var(--ruggy-ink)]">
      <OrganizationJsonLd />
      <a
        href="#main-content"
        className="sr-only z-50 rounded-full bg-[var(--ruggy-ink)] px-5 py-3 text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
      >
        Przejdź do treści
      </a>

      <div className="ruggy-thread-bg border-b border-[var(--ruggy-ink)] bg-[var(--ruggy-yellow)] px-4 py-2.5 text-center text-xs font-bold uppercase tracking-[0.16em] sm:text-sm">
        Darmowa wycena pomysłu <span aria-hidden="true">✦</span> Ręczna robota w Polsce
      </div>

      <header className="border-b border-[var(--ruggy-border)] bg-[var(--ruggy-canvas)] backdrop-blur">
        <nav
          aria-label="Główna nawigacja"
          className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-5 px-5 sm:px-8 lg:px-10"
        >
          <Link href="/" className={`ruggy-wordmark text-4xl ${focusClass}`}>
            ruggy<span className="text-[var(--ruggy-blue)]">.</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-bold md:flex">
            <Link className={`transition-opacity hover:opacity-60 ${focusClass}`} href="#jak-to-dziala">
              Proces
            </Link>
            <Link className={`transition-opacity hover:opacity-60 ${focusClass}`} href="#realizacje">
              Realizacje
            </Link>
            <Link className={`transition-opacity hover:opacity-60 ${focusClass}`} href="#faq">
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
        <section className="relative isolate overflow-hidden pb-16 pt-10 sm:pb-24 sm:pt-16 lg:pb-28 lg:pt-20">
          <div className="ruggy-blob ruggy-blob-blue absolute -end-20 top-12 -z-10 size-72 sm:size-96" aria-hidden="true" />
          <div className="ruggy-blob ruggy-blob-yellow absolute -start-24 bottom-2 -z-10 size-56" aria-hidden="true" />

          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16 lg:px-10">
            <div className="ruggy-enter-up max-w-2xl">
              <div className="mb-6 inline-flex rotate-[-2deg] items-center gap-2 rounded-full border-2 border-[var(--ruggy-ink)] bg-white px-4 py-2 text-sm font-bold shadow-[4px_4px_0_var(--ruggy-ink)]">
                <Sparkles className="size-4 text-[var(--ruggy-coral)]" aria-hidden="true" />
                Dywan dokładnie taki jak chcesz
              </div>

              <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
                Ręcznie tuftowane
                <span className="mt-1 block text-[var(--ruggy-blue)]">dywany</span>
                <span className="ruggy-underline relative inline-block">na zamówienie.</span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-[var(--ruggy-body)] sm:text-xl">
                Wujek Dywaniarz zamienia Twoje zdjęcia, historie i dziwne pomysły
                w ręcznie tuftowane dywany. Bez gotowców. Bez nudy.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/zamow"
                  className={`inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[var(--ruggy-blue)] px-7 text-base font-black text-white shadow-[0_8px_0_var(--ruggy-ink)] transition-transform hover:-translate-y-1 hover:shadow-[0_12px_0_var(--ruggy-ink)] ${focusClass}`}
                >
                  Pokaż nam swój pomysł
                  <ArrowRight className="size-5" aria-hidden="true" />
                </Link>
                <Link
                  href="#realizacje"
                  className={`inline-flex min-h-14 items-center justify-center rounded-full border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-surface)] px-7 text-base font-black transition-colors hover:bg-[var(--ruggy-yellow)] ${focusClass}`}
                >
                  Zobacz realizacje
                </Link>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-bold text-[var(--ruggy-body)]">
                <span className="flex items-center gap-2">
                  <span className="flex -space-x-2" aria-hidden="true">
                    <span className="size-8 rounded-full border-2 border-[var(--ruggy-canvas)] bg-[var(--ruggy-blue)]" />
                    <span className="size-8 rounded-full border-2 border-[var(--ruggy-canvas)] bg-[var(--ruggy-coral)]" />
                    <span className="size-8 rounded-full border-2 border-[var(--ruggy-canvas)] bg-[var(--ruggy-yellow)]" />
                  </span>
                  Ponad 10 tys. osób śledzi Ruggy
                </span>
                <span className="flex items-center gap-1 text-[var(--ruggy-ink)]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="size-4 fill-[var(--ruggy-yellow)]" aria-hidden="true" />
                  ))}
                  <span className="sr-only">Pięć gwiazdek</span>
                </span>
              </div>
            </div>

            <div className="ruggy-enter-right relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-blue-soft)] p-2 shadow-[12px_14px_0_var(--ruggy-ink)] sm:p-3">
                <Image
                  src={heroWorkshop}
                  alt="Ręczne wykańczanie niebieskiego dywanu Ruggy w pracowni"
                  fill
                  priority
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  className="rounded-[2rem] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -start-3 rotate-[-5deg] rounded-2xl border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-yellow)] px-5 py-3 text-sm font-black shadow-[5px_5px_0_var(--ruggy-ink)] sm:start-8 sm:text-base">
                <span className="block text-xs font-bold uppercase tracking-widest">Aktualnie</span>
                Tuftujemy marzenia
              </div>
              <div className="absolute -end-3 -top-6 flex size-24 rotate-[8deg] items-center justify-center rounded-full border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-coral)] p-3 text-center text-xs font-black uppercase leading-tight text-white shadow-[4px_4px_0_var(--ruggy-ink)] sm:size-28">
                Jeden jedyny egzemplarz
              </div>
            </div>
          </div>
        </section>

        <section id="dlaczego" className="scroll-mt-24 border-y-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-blue-soft)]">
          <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--ruggy-blue)]">Więcej niż dekoracja</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-6xl">Kawałek Ciebie, tylko bardziej miękki.</h2>
            </div>

            <ul className="mt-12 grid gap-5 lg:grid-cols-3">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <li
                    key={benefit.title}
                    className="ruggy-reveal-up rounded-[2rem] border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-surface)] p-7 shadow-[6px_6px_0_var(--ruggy-ink)]"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-[var(--ruggy-yellow)]">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-7 text-2xl font-black tracking-tight">{benefit.title}</h3>
                    <p className="mt-3 text-base leading-7 text-[var(--ruggy-body)]">{benefit.description}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section id="realizacje" className="scroll-mt-24 bg-[var(--ruggy-ink)] text-white">
          <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--ruggy-yellow)]">Pomysł nie zna kształtu</p>
                <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-6xl">Galeria rzeczy, które nie chciały być zwykłe.</h2>
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

            <ul className="mt-12 grid gap-7 sm:grid-cols-3 sm:gap-5">
              {gallery.map((item, index) => (
                <li
                  key={item.label}
                  className={`ruggy-reveal-up ${item.className}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <figure className="overflow-hidden rounded-[2rem] border-2 border-white/80 bg-[var(--ruggy-canvas)] p-2 text-[var(--ruggy-ink)]">
                    <div className="relative aspect-square overflow-hidden rounded-[1.5rem]">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="(min-width: 640px) 33vw, 100vw"
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <figcaption className="flex items-center justify-between gap-3 px-3 py-3 text-base font-black">
                      {item.label}
                      <span className="text-[var(--ruggy-blue)]" aria-hidden="true">✦</span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="jak-to-dziala" className="scroll-mt-24 bg-[var(--ruggy-canvas)]">
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 lg:px-10">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--ruggy-blue)]">Cztery kroki</p>
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

            <ol className="space-y-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <li
                    key={step.number}
                    className="ruggy-reveal-right group grid gap-5 rounded-[2rem] border-2 border-[var(--ruggy-border-strong)] bg-[var(--ruggy-surface)] p-6 transition-colors hover:border-[var(--ruggy-ink)] sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-7"
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    <span className="text-5xl font-black tracking-[-0.07em] text-[var(--ruggy-blue-soft-strong)] group-hover:text-[var(--ruggy-yellow)] sm:text-7xl">{step.number}</span>
                    <div>
                      <h3 className="text-2xl font-black tracking-tight">{step.title}</h3>
                      <p className="mt-2 max-w-xl text-base leading-7 text-[var(--ruggy-body)]">{step.description}</p>
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

        <section id="faq" className="scroll-mt-24 border-y-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-yellow)]">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20 lg:px-10">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em]">Zanim zapytasz na DM</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-6xl">Pytania mają miękkie lądowanie.</h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-surface)] open:shadow-[5px_5px_0_var(--ruggy-ink)]">
                  <summary className={`flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-lg font-black [&::-webkit-details-marker]:hidden ${focusClass}`}>
                    {faq.question}
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--ruggy-ink)] text-white transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="max-w-2xl px-5 pb-5 text-base leading-7 text-[var(--ruggy-body)]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--ruggy-blue-soft)] px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
          <div className="ruggy-reveal-scale ruggy-thread-bg mx-auto flex w-full max-w-7xl flex-col items-center rounded-[2.5rem] border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-blue)] px-6 py-14 text-center text-white shadow-[10px_12px_0_var(--ruggy-ink)] sm:px-12 sm:py-20">
            <span className="flex size-14 items-center justify-center rounded-full bg-[var(--ruggy-yellow)] text-[var(--ruggy-ink)]">
              <Sparkles className="size-7" aria-hidden="true" />
            </span>
            <h2 className="mt-7 max-w-4xl text-4xl font-black tracking-[-0.04em] sm:text-6xl">Masz zdjęcie, pomysł albo bardzo konkretną fazę?</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">Super. To dokładnie tyle, ile potrzebujemy, żeby zacząć.</p>
            <Link
              href="/zamow"
              className={`mt-8 inline-flex min-h-14 items-center gap-3 rounded-full bg-[var(--ruggy-yellow)] px-7 text-base font-black text-[var(--ruggy-ink)] transition-transform hover:-translate-y-1 ${focusClass}`}
            >
              Wyceń swój dywan
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[var(--ruggy-ink)] px-5 py-10 text-white sm:px-8 lg:px-10">
        <div className="mx-auto grid w-full max-w-7xl gap-10 border-b border-white/20 pb-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <Link href="/" className={`ruggy-wordmark text-5xl ${focusLightClass}`}>
              ruggy<span className="text-[var(--ruggy-yellow)]">.</span>
            </Link>
            <p className="mt-4 max-w-sm text-base leading-7 text-white/70">Personalizowane dywany z pomysłu, ręki i dużej ilości włóczki.</p>
          </div>
          <nav aria-label="Stopka" className="flex flex-col items-start gap-3 text-sm font-bold">
            <Link href="#jak-to-dziala" className={`hover:text-[var(--ruggy-yellow)] ${focusLightClass}`}>Proces</Link>
            <Link href="#realizacje" className={`hover:text-[var(--ruggy-yellow)] ${focusLightClass}`}>Realizacje</Link>
            <Link href="#faq" className={`hover:text-[var(--ruggy-yellow)] ${focusLightClass}`}>FAQ</Link>
          </nav>
          <div className="flex flex-col items-start gap-3 text-sm font-bold">
            <a href="https://www.instagram.com/ruggy.pl/" target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 hover:text-[var(--ruggy-yellow)] ${focusLightClass}`}>
              <AtSign className="size-5" aria-hidden="true" />
              Instagram
            </a>
            <span className="text-white/50">Ruggy, Polska</span>
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Ruggy. Wszystkie prawa zastrzeżone.</span>
          <span>Stworzone ręcznie. Tak jak dywany.</span>
        </div>
      </footer>
    </div>
  );
}
