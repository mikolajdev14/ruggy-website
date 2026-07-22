import { MarketingPageShell } from "@/components/marketing-page-shell";
import { createPageMetadata } from "@/lib/seo";
import heroWorkshop from "@/public/ruggy/hero-workshop.webp";
import rugDog from "@/public/ruggy/rug-dog.webp";
import rugVinyl from "@/public/ruggy/rug-vinyl.webp";
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
      image={rugVinyl}
      imageAlt="Okrągły dywan tuftowany inspirowany płytą winylową"
      sections={[
        {
          title: "Wybrane realizacje Ruggy",
          content: (
            <div className="grid gap-5 sm:grid-cols-2">
              <figure>
                <Image
                  src={rugDog}
                  alt="Personalizowany dywan tuftowany w kształcie pieska"
                  sizes="(min-width: 640px) 30vw, 100vw"
                  className="aspect-square w-full rounded-2xl border-2 border-[var(--ruggy-ink)] object-cover"
                />
                <figcaption className="mt-2 text-sm font-bold text-[var(--ruggy-ink)]">
                  Motyw zwierzaka i nieregularny kontur
                </figcaption>
              </figure>
              <figure>
                <Image
                  src={heroWorkshop}
                  alt="Niebieski dywan tuftowany podczas ręcznego wykańczania"
                  sizes="(min-width: 640px) 30vw, 100vw"
                  className="aspect-square w-full rounded-2xl border-2 border-[var(--ruggy-ink)] object-cover"
                />
                <figcaption className="mt-2 text-sm font-bold text-[var(--ruggy-ink)]">
                  Projekt podczas końcowego docinania
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

