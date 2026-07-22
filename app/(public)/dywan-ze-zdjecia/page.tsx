import { MarketingPageShell } from "@/components/marketing-page-shell";
import { createPageMetadata } from "@/lib/seo";
import heroWorkshop from "@/public/ruggy/hero-workshop.webp";

const description =
  "Prześlij zdjęcie zwierzaka, przedmiotu lub grafiki i zamów personalizowany dywan tuftowany na podstawie wybranego motywu.";

export const metadata = createPageMetadata({
  title: "Dywan ze zdjęcia",
  description,
  path: "/dywan-ze-zdjecia",
});

export default function RugFromPhotoPage() {
  return (
    <MarketingPageShell
      path="/dywan-ze-zdjecia"
      eyebrow="Dywan ze zdjęcia"
      title="Zamień zdjęcie w miękki, tuftowany projekt"
      intro="Prześlij fotografię zwierzaka, ulubionego przedmiotu albo własnej grafiki. Zdjęcie stanie się punktem wyjścia do przygotowania czytelnego wzoru dywanu."
      image={heroWorkshop}
      imageAlt="Ręczne wykańczanie niebieskiego dywanu w pracowni Ruggy"
      sections={[
        {
          title: "Jakie zdjęcie wybrać?",
          content: (
            <p>
              Najlepiej działa fotografia z jednym wyraźnym obiektem, dobrym światłem
              i widocznym konturem. Tło nie musi być idealne, ale główny motyw nie
              powinien być zasłonięty ani mocno rozmyty.
            </p>
          ),
          points: [
            "Jeden główny obiekt widoczny w całości",
            "Naturalne światło i możliwie wysoka ostrość",
            "Format JPG, PNG lub WEBP do 5 MB",
          ],
        },
        {
          title: "Zdjęcie nie jest kopiowane piksel po pikselu",
          content: (
            <p>
              Tufting wymaga większych, wyraźnie oddzielonych pól koloru. Drobne
              włosy, refleksy i fotograficzne tekstury są upraszczane, a najważniejsze
              cechy sylwetki oraz charakterystyczne oznaczenia pozostają widoczne.
            </p>
          ),
        },
        {
          title: "Prześlij materiał podczas zamówienia",
          content: (
            <p>
              Zdjęcie dodajesz na końcu konfiguratora. Plik trafia do prywatnego
              magazynu razem z danymi zamówienia i jest dostępny w panelu pracowni po
              zaksięgowaniu płatności.
            </p>
          ),
          points: [
            "Plik nie jest publikowany w galerii automatycznie",
            "Projekt pozostaje połączony z konkretnym zamówieniem",
            "W razie wątpliwości pracownia może poprosić o inne ujęcie",
          ],
        },
      ]}
      ctaTitle="Masz już odpowiednie zdjęcie?"
      ctaText="Dodaj je w konfiguratorze i wybierz rozmiar oraz termin realizacji."
    />
  );
}

