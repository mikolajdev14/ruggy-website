import { MarketingPageShell } from "@/components/marketing-page-shell";
import { createPageMetadata } from "@/lib/seo";
import rugHero from "@/public/ruggy/kategorie/dywanyzwierzaki/biale-tlo/IMG_0857-white-bg.jpg";
import rugAnimal from "@/public/ruggy/kategorie/dywanyzwierzaki/biale-tlo/IMG_4803-white-bg.jpg";
import rugCustom from "@/public/ruggy/kategorie/custom/biale-tlo/IMG_3628-white-bg.jpg";
import Image from "next/image";

const description =
  "Zobacz przykładowe realizacje ręcznie tuftowanych dywanów Ruggy: nieregularne kształty, personalizowane motywy i projekty ze zdjęć.";

export const metadata = createPageMetadata({
  title: "Realizacje dywanów tuftowanych",
  description,
  path: "/realizacje",
});

export default function PortfolioPage() {
  return (
    <MarketingPageShell
      path="/realizacje"
      eyebrow="Realizacje"
      title="Pomysły, które stały się dywanami"
      intro="Każda realizacja zaczyna się od innego materiału: zdjęcia, symbolu, ilustracji albo luźnego pomysłu. Łączy je ręczne wykonanie i wyrazisty kształt."
      image={rugHero}
      imageAlt="Ręcznie tuftowany dywan Ruggy z motywem zwierzaka"
      sections={[
        {
          title: "Wybrane realizacje Ruggy",
          content: (
            <div className="grid gap-5 sm:grid-cols-2">
              <figure>
                <Image
                  src={rugAnimal}
                  alt="Personalizowany dywan tuftowany z motywem zwierzaka"
                  sizes="(min-width: 640px) 30vw, 100vw"
                  className="aspect-square w-full rounded-2xl border-2 border-[var(--ruggy-ink)] object-cover"
                />
                <figcaption className="mt-2 text-sm font-bold text-[var(--ruggy-ink)]">
                  Motyw zwierzaka i nieregularny kontur
                </figcaption>
              </figure>
              <figure>
                <Image
                  src={rugCustom}
                  alt="Autorski dywan tuftowany na zamówienie"
                  sizes="(min-width: 640px) 30vw, 100vw"
                  className="aspect-square w-full rounded-2xl border-2 border-[var(--ruggy-ink)] object-cover"
                />
                <figcaption className="mt-2 text-sm font-bold text-[var(--ruggy-ink)]">
                  Projekt custom podczas końcowego wykończenia
                </figcaption>
              </figure>
            </div>
          ),
        },
        {
          title: "Różne motywy, ta sama metoda",
          content: (
            <p>
              Okrągłe formy, sylwetki zwierząt i abstrakcyjne kształty wymagają
              innego prowadzenia konturu, ale zawsze przechodzą przez tuftowanie,
              klejenie, docinanie i ręczne wykończenie powierzchni.
            </p>
          ),
          points: [
            "Projekty dekoracyjne i użytkowe",
            "Kształt dopasowany do motywu",
            "Wyraźne kontury i mocne pola koloru",
          ],
        },
      ]}
    />
  );
}

