"use client";

import ColorBends from "@/components/ColorBends";
import OrbitImages from "@/components/OrbitImages";
import FloatingLines from "@/components/FloatingLines";
import Link from "next/link";
import Image from "next/image";
import porsheGradient from "@/public/porshe-gradient.png";
import { motion } from "motion/react";
export default function HomePage() {
  const images = [
    porsheGradient.src,
    porsheGradient.src,
    porsheGradient.src,
    porsheGradient.src,
  ];

  return (
    <div className="overflow-x-hidden">
      <section className="relative min-h-screen overflow-hidden bg-radial-[at_50%_40%] from-[#ffe44c] via-[#fcd202] to-[#9e880d]">
        <FloatingLines
          enabledWaves={["top", "middle", "bottom"]}
          // Array - specify line count per wave; Number - same count for all waves
          lineCount={[30]}
          // Array - specify line distance per wave; Number - same distance for all waves
          lineDistance={[31]}
          bendRadius={5.5}
          bendStrength={-0.5}
          interactive
          parallax={true}
          animationSpeed={1}
          linesGradient={["#ffe44c", "#fcd202", "#ffffff"]}
        />
        <nav className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-8 py-6 lg:px-14">
          <Link
            href="/"
            className="font-lobster text-3xl text-neutral-900 drop-shadow-sm transition-transform hover:scale-105"
          >
            Carpetiem
          </Link>

          <ul className="hidden items-center gap-10 md:flex">
            {[
              { label: "O mnie", href: "#o-mnie" },
              { label: "Moje projekty", href: "#projekty" },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="group relative text-l font-medium tracking-wide text-neutral-900/80 transition-colors hover:text-neutral-900"
                >
                  {item.label}
                  <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 bg-neutral-900 transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/zamow"
            className="rounded-full bg-neutral-900 px-7 py-2.5 text-sm font-semibold text-[#fcd202] shadow-lg shadow-black/20 transition-all hover:scale-105 hover:bg-neutral-800"
          >
            Zamów
          </Link>
        </nav>

        <div className="pointer-events-none absolute inset-0 z-10 select-none">
          <motion.span
            initial={{ x: -120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="absolute left-[5%] top-[10%] font-lobster text-7xl text-neutral-900 drop-shadow-md md:text-8xl"
          >
            Cześć,
          </motion.span>

          <motion.span
            initial={{ x: -120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
            className="absolute left-[8%] top-[24%] text-2xl font-light tracking-[0.3em] text-neutral-900/70 uppercase md:text-3xl"
          >
            jestem
          </motion.span>

          <motion.span
            initial={{ x: -120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="absolute left-[6%] top-[32%] -rotate-3 font-lobster text-8xl text-neutral-900 drop-shadow-lg md:text-[9rem]"
          >
            Daria
          </motion.span>

          <motion.span
            initial={{ x: -120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
            className="absolute left-[10%] top-[50%] max-w-xs text-lg leading-snug font-medium text-neutral-900/80 md:text-xl"
          >
            z wielką chęcią wykonam
            <br />
            dla Ciebie
          </motion.span>
        </div>

        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.75 }}
          className="absolute top-1/2 left-[60%] z-20 -translate-x-1/2 -translate-y-1/2 w-[2000px] h-300"
        >
          <Image
            height={1200}
            width={2000}
            alt="Porsche z dywanem Carpetiem"
            src={porsheGradient}
            priority
          />
        </motion.div>

        <motion.span
          initial={{ x: -120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.75 }}
          className="pointer-events-none absolute top-[60%] left-[4%] z-30 -rotate-3 font-lobster text-8xl text-white [text-shadow:0_2px_4px_rgb(0_0_0/45%),0_8px_24px_rgb(0_0_0/55%)] md:text-[10rem]"
        >
          Dywanik!
        </motion.span>
      </section>
      <section className="relative min-h-screen overflow-hidden bg-white">
        <motion.div
          initial={{ y: -700, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-1/3 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 w-full"
        >
          <OrbitImages
            images={images}
            shape="ellipse"
            radiusX={440}
            radiusY={200}
            rotation={-180}
            duration={30}
            itemSize={600}
            responsive={true}
            radius={80}
            direction="normal"
            fill
            showPath={false}
            paused={false}
          />
        </motion.div>
      </section>
    </div>
  );
}
