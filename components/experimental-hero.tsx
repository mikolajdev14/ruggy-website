"use client";

import {
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import heroRug from "@/public/ruggy/kategorie/custom/biale-tlo/hero1 - bez tla.png";

const focusClass =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ruggy-ink)]";

export function ExperimentalHero() {
  const heroRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const motionEnabledRef = useRef(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");

    const updateMotionPreference = () => {
      motionEnabledRef.current = !reducedMotion.matches && finePointer.matches;
    };

    updateMotionPreference();
    reducedMotion.addEventListener("change", updateMotionPreference);
    finePointer.addEventListener("change", updateMotionPreference);

    return () => {
      reducedMotion.removeEventListener("change", updateMotionPreference);
      finePointer.removeEventListener("change", updateMotionPreference);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const paintPointerPosition = () => {
    frameRef.current = null;
    const hero = heroRef.current;

    if (!hero) {
      return;
    }

    const { x, y } = pointerRef.current;
    hero.style.setProperty("--letter-x", `${x * 18}px`);
    hero.style.setProperty("--letter-y", `${y * 12}px`);
    hero.style.setProperty("--letter-x-reverse", `${x * -12}px`);
    hero.style.setProperty("--letter-y-reverse", `${y * -8}px`);
    hero.style.setProperty("--rug-x", `${x * -28}px`);
    hero.style.setProperty("--rug-y", `${y * -18}px`);
    hero.style.setProperty("--rug-rotate-x", `${y * -2.5}deg`);
    hero.style.setProperty("--rug-rotate-y", `${x * 3.5}deg`);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!motionEnabledRef.current) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: (event.clientX - bounds.left) / bounds.width - 0.5,
      y: (event.clientY - bounds.top) / bounds.height - 0.5,
    };

    if (frameRef.current === null) {
      frameRef.current = requestAnimationFrame(paintPointerPosition);
    }
  };

  const resetPointerPosition = () => {
    pointerRef.current = { x: 0, y: 0 };
    if (frameRef.current === null) {
      frameRef.current = requestAnimationFrame(paintPointerPosition);
    }
  };

  return (
    <section
      ref={heroRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointerPosition}
      className="ruggy-experimental-hero relative isolate border-b-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-canvas)] font-copy"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-0 h-[400px] overflow-hidden text-[var(--ruggy-ink)] sm:h-[560px] lg:h-[700px]"
      >
        <div className="ruggy-thread-bg absolute inset-0 opacity-70" />
        <div className="ruggy-thread-bg absolute bottom-0 left-1/2 h-[74%] w-[min(82vw,600px)] -translate-x-1/2 rounded-t-full border-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-blue-soft)] shadow-[10px_-10px_0_var(--ruggy-blue-soft-strong)]" />
      </div>

      <div className="relative z-40 mx-auto w-full max-w-[90rem]">
        <div className="relative h-[400px] overflow-hidden sm:h-[560px] lg:h-[700px] lg:overflow-visible">
          <div className="absolute inset-0 overflow-hidden">
            <h1
              className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-full max-w-[72rem] -translate-x-1/2"
              aria-label="Ruggy"
            >
              <span className="sr-only">Ruggy</span>
              <span
                aria-hidden="true"
                className="ruggy-experimental-letter absolute -left-1 top-5"
              >
                <span className="ruggy-experimental-letter-face block -rotate-6 font-editorial text-[clamp(5rem,15vw,16rem)] uppercase leading-none text-[var(--ruggy-blue)] [animation-delay:0ms] [text-shadow:0.045em_0.055em_0_var(--ruggy-ink)]">
                  R
                </span>
              </span>
              <span
                aria-hidden="true"
                className="ruggy-experimental-letter ruggy-experimental-letter-reverse absolute left-[18%] top-12 sm:top-16 lg:top-20"
              >
                <span className="ruggy-experimental-letter-face block rotate-3 font-editorial text-[clamp(5rem,15vw,16rem)] uppercase leading-none text-[var(--ruggy-coral)] [animation-delay:70ms] [text-shadow:0.045em_0.055em_0_var(--ruggy-ink)]">
                  U
                </span>
              </span>
              <span
                aria-hidden="true"
                className="ruggy-experimental-letter absolute left-[40%] -top-2 sm:top-1 lg:-top-5"
              >
                <span className="ruggy-experimental-letter-face block -rotate-2 font-editorial text-[clamp(5rem,15vw,16rem)] uppercase leading-none text-[var(--ruggy-yellow)] [animation-delay:140ms] [text-shadow:0.045em_0.055em_0_var(--ruggy-ink)]">
                  G
                </span>
              </span>
              <span
                aria-hidden="true"
                className="ruggy-experimental-letter ruggy-experimental-letter-reverse absolute left-[62%] top-14 sm:top-20 lg:top-24"
              >
                <span className="ruggy-experimental-letter-face block rotate-5 font-editorial text-[clamp(5rem,15vw,16rem)] uppercase leading-none text-[var(--ruggy-blue)] [animation-delay:210ms] [text-shadow:0.045em_0.055em_0_var(--ruggy-ink)]">
                  G
                </span>
              </span>
              <span
                aria-hidden="true"
                className="ruggy-experimental-letter absolute -right-2 top-1 sm:top-4 lg:top-2"
              >
                <span className="ruggy-experimental-letter-face block -rotate-6 font-editorial text-[clamp(5rem,15vw,16rem)] uppercase leading-none text-[var(--ruggy-coral)] [animation-delay:280ms] [text-shadow:0.045em_0.055em_0_var(--ruggy-ink)]">
                  Y
                </span>
              </span>
            </h1>
          </div>

          <div className="ruggy-experimental-product pointer-events-none absolute left-1/2 top-16 z-30 h-[520px] w-[430px] max-w-none -translate-x-1/2 sm:top-20 sm:h-[720px] sm:w-[590px] lg:top-16 lg:h-[850px] lg:w-[700px]">
            <div className="ruggy-experimental-product-reveal relative size-full">
              <Image
                src={heroRug}
                alt="Ręcznie tuftowany dywan Ruggy przedstawiający siedzącą postać"
                fill
                priority
                quality={88}
                sizes="(min-width: 1280px) 48vw, (min-width: 1024px) 58vw, (min-width: 640px) 76vw, 112vw"
                className="scale-[1.08] object-contain drop-shadow-[0_30px_20px_rgba(20,32,51,0.32)]"
              />
            </div>
          </div>
        </div>

        <div className="relative z-30 grid gap-7 px-5 pb-10 sm:px-8 lg:absolute lg:inset-x-0 lg:bottom-24 lg:grid-cols-12 lg:items-end lg:px-10 lg:pb-0">
          <div className="max-w-[30rem] lg:col-span-5">
            <p className="text-pretty text-[1.9rem] font-extrabold leading-[1.16] tracking-[-0.02em] sm:text-[2.3rem] lg:text-[2.35rem]">
              <span className="lg:whitespace-nowrap">
                Twój{" "}
                <span className="font-lobster text-[1.22em] font-normal leading-none tracking-normal text-[var(--ruggy-blue)]">
                  Wuja&nbsp;Dywaniarz
                </span>
              </span>{" "}
              stworzy dla Ciebie{" "}
              <span className="whitespace-nowrap">
                <span className="relative inline-block">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-[-0.12em] bottom-[0.05em] top-[0.5em] -rotate-[1.4deg] rounded-[0.18em] bg-[var(--ruggy-yellow)]"
                  />
                  <span className="relative">wymarzony dywan</span>
                </span>
                ,
              </span>{" "}
              dokładnie taki jaki chcesz.
            </p>
          </div>

          <div className="flex flex-col items-stretch gap-5 sm:flex-row sm:items-center lg:col-start-10 lg:col-span-3 lg:flex-col lg:items-stretch">
            <Link
              href="/zamow"
              className={`inline-flex min-h-16 items-center justify-center gap-3 rounded-xl bg-[var(--ruggy-yellow)] px-6 text-base font-extrabold text-[var(--ruggy-ink)] shadow-[0_7px_0_var(--ruggy-ink)] transition-transform hover:-translate-y-1 hover:shadow-[0_11px_0_var(--ruggy-ink)] ${focusClass}`}
            >
              Pokaż mi swój pomysł
              <ArrowRight className="size-5 shrink-0" aria-hidden="true" />
            </Link>
            <Link
              href="#realizacje"
              className={`inline-flex min-h-11 items-center justify-center gap-2 text-base font-bold underline decoration-2 underline-offset-4 transition-opacity hover:opacity-60 ${focusClass}`}
            >
              Zobacz realizacje
              <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-30 border-t-2 border-[var(--ruggy-ink)] bg-[var(--ruggy-ink)] text-[var(--ruggy-canvas)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-5 text-sm font-bold sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 lg:px-10">
          <span className="lg:max-w-[22rem]">
            <strong className="me-2 text-xl font-black text-[var(--ruggy-yellow)]">
              10K+
            </strong>
            osób obserwuje moje realizacje
          </span>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 lg:flex-col lg:items-end lg:gap-1 lg:text-right">
            <span>
              Każdy projekt tworzę indywidualnie:
              <strong className="ms-2 text-xl font-black text-[var(--ruggy-yellow)]">
                1/1
              </strong>
            </span>
            <span>Ręcznie tuftowane w Polsce</span>
          </div>
        </div>
      </div>
    </section>
  );
}
