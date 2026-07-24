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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { HomeScrollReveal } from "@/components/home-scroll-reveal";
import { OrganizationJsonLd } from "@/components/organization-json-ld";
import heroWorkshop from "@/public/ruggy/hero-workshop.webp";
import heroRug from "@/public/ruggy/kategorie/dywanyzwierzaki/biale-tlo/IMG_7749-white-bg.jpg";
import rugDog from "@/public/ruggy/rug-dog.webp";
import rugVinyl from "@/public/ruggy/rug-vinyl.webp";

const benefits = [
  {
    icon: Heart,
    title: "Prezent, którego nie da się powtórzyć",
    description: "Twój pomysł zamieniam w miękki obiekt z własnym charakterem.",
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
    title: "Pokaż mi pomysł",
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
    title: "Wchodzę do pracowni",
    description: "Tuftuję, docinam i wykańczam każdy detal ręcznie.",
  },
  {
    number: "04",
    icon: PackageCheck,
    title: "Ruggy rusza w drogę",
    description: "Gotowy dywan wysyłam do paczkomatu albo prosto pod Twoje drzwi.",
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

      <div className="ruggy-thread-bg border-b border-[var(--ruggy-ink)] bg-[var(--ruggy-yellow)] px-4 py-2.5 text-center text-xs font-bold uppercase tracking-[0.16em] sm:text-sm">
        Darmowa wycena pomysłu <span aria-hidden="true">✦</span> Ręczna robota w Polsce
      </div>

      <header className="bg-[var(--ruggy-canvas)]">
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
        <section className="relative isolate overflow-hidden border-b-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-canvas)]">
          <div className="mx-auto w-full max-w-7xl px-5 pb-8 pt-2 sm:px-8 sm:pb-10 lg:px-10">
            <div className="relative grid items-end gap-x-8 gap-y-6 pb-9 pt-3 sm:pt-5 lg:min-h-[520px] lg:grid-cols-12 lg:pb-12">
              <h1
                aria-label="Ruggy — Twój Wuja Dywaniarz"
                className="pointer-events-none relative z-0 col-span-full row-start-1 select-none text-center text-[5rem] font-black uppercase leading-none text-[var(--ruggy-ink)] sm:text-[8rem] lg:absolute lg:inset-x-0 lg:top-4 lg:text-[12rem] xl:text-[14rem]"
              >
                Ruggy
              </h1>

              <div className="ruggy-enter-up relative z-20 col-span-full row-start-1 mx-auto mt-16 h-[270px] w-full max-w-[250px] sm:mt-24 sm:h-[340px] sm:max-w-[310px] lg:col-start-5 lg:col-span-4 lg:mt-16 lg:h-[470px] lg:max-w-[400px]">
                <Image
                  src={heroRug}
                  alt="Ręcznie tuftowany dywan Ruggy przedstawiający kota na wrotkach"
                  fill
                  priority
                  sizes="(min-width: 1024px) 34vw, (min-width: 640px) 44vw, 74vw"
                  className="object-contain mix-blend-multiply drop-shadow-[0_18px_14px_rgba(29,29,35,0.22)]"
                />
              </div>

              <div className="ruggy-enter-up relative z-30 col-span-full max-w-md lg:col-start-1 lg:col-span-4 lg:row-start-1 lg:mb-10">
                <p className="text-2xl font-black leading-tight sm:text-3xl">
                  Twój Wuja Dywaniarz stworzy dla Ciebie wymarzony dywan,
                  dokładnie taki jaki chcesz.
                </p>
                <p className="mt-4 max-w-sm text-base leading-7 text-[var(--ruggy-body)]">
                  Zamieniam Twoje zdjęcia, historie i dziwne pomysły w ręcznie
                  tuftowane dywany. Bez gotowców. Bez nudy.
                </p>
              </div>

              <div className="ruggy-enter-right relative z-30 col-span-full flex flex-col items-stretch gap-4 sm:flex-row sm:items-center lg:col-start-10 lg:col-span-3 lg:row-start-1 lg:mb-10 lg:items-stretch">
                <Link
                  href="/zamow"
                  className={`inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-[var(--ruggy-blue)] px-6 text-base font-black text-white shadow-[0_6px_0_var(--ruggy-ink)] transition-transform hover:-translate-y-1 hover:shadow-[0_9px_0_var(--ruggy-ink)] lg:w-full ${focusClass}`}
                >
                  Pokaż mi swój pomysł
                  <ArrowRight className="size-5 shrink-0" aria-hidden="true" />
                </Link>
                <Link
                  href="#realizacje"
                  className={`inline-flex min-h-11 items-center justify-center gap-2 font-bold underline decoration-2 underline-offset-4 transition-opacity hover:opacity-60 lg:w-full ${focusClass}`}
                >
                  Zobacz realizacje
                  <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <dl className="grid border-t-2 border-[var(--ruggy-ink)] sm:grid-cols-3">
              <div className="flex items-center gap-4 border-b border-[var(--ruggy-border-strong)] py-5 sm:border-b-0 sm:border-e sm:pe-6">
                <dt className="order-2 text-sm font-bold leading-5 text-[var(--ruggy-body)]">
                  osób obserwuje moje realizacje
                </dt>
                <dd className="text-3xl font-black">10K+</dd>
              </div>
              <div className="flex items-center gap-4 border-b border-[var(--ruggy-border-strong)] py-5 sm:border-b-0 sm:border-e sm:px-6">
                <dt className="order-2 text-sm font-bold leading-5 text-[var(--ruggy-body)]">
                  każdy projekt tworzę indywidualnie
                </dt>
                <dd className="text-3xl font-black">1/1</dd>
              </div>
              <div className="flex items-center gap-4 py-5 sm:ps-6">
                <dt className="order-2 text-sm font-bold leading-5 text-[var(--ruggy-body)]">
                  ręcznie tuftowane w Polsce
                </dt>
                <dd className="text-3xl font-black">PL</dd>
              </div>
            </dl>
          </div>
        </section>

        <section id="dlaczego" className="scroll-mt-24 border-y-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-blue-soft)]">
          <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
            <div data-scroll-reveal className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--ruggy-blue)]">Więcej niż dekoracja</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-6xl">Kawałek Ciebie, tylko bardziej miękki.</h2>
            </div>

            <ul data-scroll-stagger className="mt-12 grid gap-5 lg:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <li
                    key={benefit.title}
                    data-scroll-reveal
                    className="rounded-[2rem] border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-surface)] p-7 shadow-[6px_6px_0_var(--ruggy-ink)]"
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
            <div data-scroll-reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
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

            <ul data-scroll-stagger className="mt-12 grid gap-7 sm:grid-cols-3 sm:gap-5">
              {gallery.map((item) => (
                <li
                  key={item.label}
                  data-scroll-reveal
                  className={item.className}
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
            <div data-scroll-reveal className="lg:sticky lg:top-28 lg:self-start">
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

            <ol data-scroll-stagger className="space-y-4">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <li
                    key={step.number}
                    data-scroll-reveal="right"
                    className="group grid gap-5 rounded-[2rem] border-2 border-[var(--ruggy-border-strong)] bg-[var(--ruggy-surface)] p-6 transition-colors hover:border-[var(--ruggy-ink)] sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-7"
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
            <div data-scroll-reveal>
              <p className="text-sm font-black uppercase tracking-[0.18em]">Zanim zapytasz na DM</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-6xl">Pytania mają miękkie lądowanie.</h2>
            </div>

            <div data-scroll-stagger className="space-y-3">
              {faqs.map((faq) => (
                <details key={faq.question} data-scroll-reveal className="group rounded-2xl border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-surface)] open:shadow-[5px_5px_0_var(--ruggy-ink)]">
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
          <div data-scroll-reveal="scale" className="ruggy-thread-bg mx-auto flex w-full max-w-7xl flex-col items-center rounded-[2.5rem] border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-blue)] px-6 py-14 text-center text-white shadow-[10px_12px_0_var(--ruggy-ink)] sm:px-12 sm:py-20">
            <span className="flex size-14 items-center justify-center rounded-full bg-[var(--ruggy-yellow)] text-[var(--ruggy-ink)]">
              <Sparkles className="size-7" aria-hidden="true" />
            </span>
            <h2 className="mt-7 max-w-4xl text-4xl font-black tracking-[-0.04em] sm:text-6xl">Masz zdjęcie, pomysł albo bardzo konkretną fazę?</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">Super. To dokładnie tyle, ile potrzebuję, żeby zacząć.</p>
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
        <div data-scroll-reveal className="mx-auto grid w-full max-w-7xl gap-10 border-b border-white/20 pb-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
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
