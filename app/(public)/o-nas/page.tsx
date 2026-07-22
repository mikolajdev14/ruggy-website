import { MarketingPageShell } from "@/components/marketing-page-shell";
import { createPageMetadata } from "@/lib/seo";
import heroWorkshop from "@/public/ruggy/hero-workshop.webp";

const description =
  "Poznaj Ruggy, niezależną polską pracownię tworzącą ręcznie tuftowane dywany na podstawie zdjęć, ilustracji i pomysłów klientów.";

export const metadata = createPageMetadata({
  title: "O pracowni Ruggy",
  description,
  path: "/o-nas",
});

export default function AboutPage() {
  return (
    <MarketingPageShell
      path="/o-nas"
      eyebrow="O pracowni"
      title="Ruggy to mała pracownia od dużych pomysłów"
      intro="Tworzymy ręcznie tuftowane dywany, które zaczynają się od historii klienta, a nie od numeru produktu w katalogu."
      image={heroWorkshop}
      imageAlt="Praca nad ręcznie tuftowanym dywanem w polskiej pracowni Ruggy"
      sections={[
        {
          title: "Ręczna praca od pierwszej linii",
          content: (
            <p>
              Każdy dywan przechodzi przez przygotowanie wzoru, dobór kolorów,
              tuftowanie, zabezpieczenie spodu i dokładne docinanie runa. To proces,
              w którym o efekcie decydują nie tylko narzędzia, ale też czas i ręczne
              poprawki.
            </p>
          ),
        },
        {
          title: "Po co powstał konfigurator?",
          content: (
            <p>
              Zamówienia prowadzone wyłącznie w wiadomościach łatwo tracą kontekst.
              Formularz Ruggy zbiera w jednym miejscu wariant, rozmiar, zdjęcie,
              termin, dane klienta i sposób dostawy. Dzięki temu pracownia może
              skupić się na wykonaniu zamiast odtwarzaniu ustaleń z wielu rozmów.
            </p>
          ),
        },
        {
          title: "Kontakt i nowe realizacje",
          content: (
            <p>
              Bieżące projekty i materiały z pracowni publikujemy na Instagramie
              <a
                href="https://www.instagram.com/ruggy.pl/"
                target="_blank"
                rel="noreferrer"
                className="ms-1 font-black text-[var(--ruggy-blue)] underline underline-offset-4"
              >
                @ruggy.pl
              </a>
              . Zamówienie możesz rozpocząć bezpośrednio na stronie.
            </p>
          ),
        },
      ]}
    />
  );
}

