import { MarketingPageShell } from "@/components/marketing-page-shell";
import { createPageMetadata } from "@/lib/seo";
import rugDog from "@/public/ruggy/rug-dog.webp";

const description =
  "Zamów ręcznie tuftowany dywan dopasowany do Twojego pomysłu, wnętrza i wybranego rozmiaru. Każdy egzemplarz Ruggy powstaje indywidualnie.";

export const metadata = createPageMetadata({
  title: "Dywany tuftowane na zamówienie",
  description,
  path: "/dywany-na-zamowienie",
});

export default function CustomRugsPage() {
  return (
    <MarketingPageShell
      path="/dywany-na-zamowienie"
      eyebrow="Dywany na zamówienie"
      title="Dywan zaprojektowany wokół Twojego pomysłu"
      intro="Wybierasz motyw, rozmiar i kierunek kolorystyczny. My przekładamy je na ręcznie tuftowany dywan, który nie wygląda jak kolejny produkt z katalogu."
      image={rugDog}
      imageAlt="Ręcznie tuftowany dywan Ruggy w kształcie pieska"
      sections={[
        {
          title: "Jeden projekt, jeden charakter",
          content: (
            <p>
              Personalizowany dywan może nawiązywać do ilustracji, logo, zwierzaka,
              muzyki albo konkretnego zestawu kolorów. Przed wykonaniem oceniamy,
              które elementy warto zachować, a które uprościć, aby wzór był czytelny
              również po przeniesieniu na włóczkę.
            </p>
          ),
          points: [
            "Dowolny motyw zamiast gotowego wzoru z magazynu",
            "Gotowe rozmiary albo własna wysokość projektu",
            "Kolory i kształt dopasowane do charakteru pomysłu",
          ],
        },
        {
          title: "Od formularza do pracowni",
          content: (
            <p>
              Zamówienie składasz online. Wybierasz wariant i termin, przesyłasz
              materiał referencyjny, podajesz sposób dostawy i opłacasz projekt przez
              Stripe. Po potwierdzeniu płatności zlecenie trafia do kalendarza
              pracowni.
            </p>
          ),
          points: [
            "Czytelna cena przed przejściem do płatności",
            "Wybór paczkomatu InPost albo dostawy kurierskiej",
            "Bezpieczna płatność online i rezerwacja terminu",
          ],
        },
        {
          title: "Dla wnętrza albo na prezent",
          content: (
            <p>
              Taki dywan sprawdza się jako centralny element pokoju, dekoracja
              pracowni lub prezent z osobistym znaczeniem. Najlepszy efekt daje
              prosty, rozpoznawalny motyw i wyraźny kontrast pomiędzy kolorami.
            </p>
          ),
        },
      ]}
    />
  );
}

