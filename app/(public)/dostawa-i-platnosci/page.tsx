import { MarketingPageShell } from "@/components/marketing-page-shell";
import { createPageMetadata } from "@/lib/seo";
import rugVinyl from "@/public/ruggy/rug-vinyl.webp";

const description =
  "Sprawdź dostępne metody dostawy dywanów Ruggy, sposób rezerwacji terminu oraz zasady bezpiecznej płatności online przez Stripe.";

export const metadata = createPageMetadata({
  title: "Dostawa i płatności",
  description,
  path: "/dostawa-i-platnosci",
});

export default function DeliveryAndPaymentsPage() {
  return (
    <MarketingPageShell
      path="/dostawa-i-platnosci"
      eyebrow="Dostawa i płatności"
      title="Jasna rezerwacja, bezpieczna płatność i wygodna dostawa"
      intro="Przed płatnością widzisz cenę projektu, wybierasz termin realizacji oraz sposób, w jaki gotowy dywan ma do Ciebie dotrzeć."
      image={rugVinyl}
      imageAlt="Gotowy okrągły dywan Ruggy inspirowany płytą winylową"
      sections={[
        {
          title: "Paczkomat InPost albo kurier",
          content: (
            <p>
              W konfiguratorze wybierasz odbiór w paczkomacie i podajesz jego kod
              albo wpisujesz pełny adres dla przesyłki kurierskiej. Wybrana metoda
              zostaje zapisana razem z zamówieniem.
            </p>
          ),
          points: [
            "Paczkomat InPost wskazany przez klienta",
            "Dostawa kurierska pod podany adres",
            "Dane dostawy widoczne w panelu realizacji",
          ],
        },
        {
          title: "Płatność potwierdza rezerwację",
          content: (
            <p>
              Płatność jest obsługiwana przez Stripe. Zamówienie trafia do systemu
              dopiero po potwierdzeniu opłacenia sesji, dzięki czemu termin nie jest
              zajmowany przez niedokończony formularz.
            </p>
          ),
          points: [
            "Cena prezentowana przed przejściem do Stripe",
            "Rezerwacja zapisywana po potwierdzonej płatności",
            "Automatyczne powiązanie płatności z zamówieniem",
          ],
        },
        {
          title: "Termin wybierasz w kalendarzu",
          content: (
            <p>
              Kalendarz nie pozwala wybrać minionych, ręcznie zablokowanych ani
              najbliższych pięciu dni. Pozostawia to pracowni czas na przygotowanie
              materiałów i ogranicza ryzyko przyjęcia nierealnego terminu.
            </p>
          ),
        },
      ]}
    />
  );
}

