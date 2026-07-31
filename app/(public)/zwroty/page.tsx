import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal-document-page";

export const metadata: Metadata = {
  title: "Zwroty i reklamacje",
  description: "Informacje dotyczące zwrotów i reklamacji w Ruggy.",
  alternates: { canonical: "/zwroty" },
};

const documentContent = `Rolę Sprzedawcy pełni RUGGY Tomasz Krasowski, Dorohucza 26A, 21-044 Trawniki, NIP: 7123482342. Sprawy zwrotów i reklamacji prowadzimy mailowo pod adresem sklep@ruggy.pl.

§1. Uprawnienie do odstąpienia od umowy
Klientowi będącemu konsumentem wolno odstąpić od umowy zawartej na odległość bez podawania przyczyny w ciągu 14 dni od otrzymania produktu (art. 27 Ustawy z dnia 30 maja 2014 r. o prawach konsumenta).
Bieg czternastu dni rozpoczyna się w dniu, w którym Klient — albo wskazana przez niego osoba inna niż przewoźnik — objął produkt w posiadanie. Gdy zamówienie obejmuje kilka produktów dostarczanych osobno, liczy się objęcie w posiadanie ostatniego z nich.
Termin uznaje się za dotrzymany, jeśli oświadczenie o odstąpieniu zostanie wysłane przed jego upływem.
§2. Kiedy zwrot nie przysługuje — produkty na zamówienie
Stosownie do art. 38 pkt 3 Ustawy o prawach konsumenta odstąpienie NIE obejmuje produktów wytworzonych według specyfikacji Konsumenta bądź wyraźnie spersonalizowanych — a więc dywanów powstających na indywidualne zamówienie (custom).
Produkty gotowe, dostępne w sklepie „od ręki” (bez personalizacji), objęte są standardowym prawem zwrotu opisanym w §1.
Jeśli nie masz pewności, czy dany produkt można zwrócić, napisz do nas przed złożeniem zamówienia: sklep@ruggy.pl.
§3. Zwrot krok po kroku
Przekaż nam informację o odstąpieniu, pisząc na adres sklep@ruggy.pl. Oświadczenie nie musi mieć konkretnej formy ani opierać się na wzorze — liczy się jednoznaczny komunikat, że odstępujesz od umowy.
W zgłoszeniu wskaż numer zamówienia, datę odbioru produktu oraz numer rachunku bankowego, na który mamy zwrócić płatność.
Odeślemy Ci potwierdzenie zgłoszenia razem z adresem, pod który należy odesłać produkt.
Zabezpiecz produkt opakowaniem chroniącym go przed uszkodzeniem w transporcie i nadaj przesyłkę w ciągu 14 dni od złożenia oświadczenia o odstąpieniu.
§4. Kto ponosi koszty zwrotu
Bezpośrednie koszty odesłania produktu (przesyłka zwrotna) obciążają Klienta.
Sprzedawca oddaje równowartość najtańszej metody dostawy, jaką sam oferuje. Jeżeli Klient sięgnął po metodę droższą od najtańszej dostępnej, powstałej różnicy nie zwracamy.
Prosimy nie nadawać przesyłek za pobraniem — takich paczek nie odbieramy.
§5. Oddanie pieniędzy
Wszystkie otrzymane od Klienta płatności (łącznie z kosztem najtańszej dostawy) Sprzedawca oddaje bezzwłocznie, najpóźniej w ciągu 14 dni od dnia otrzymania oświadczenia o odstąpieniu.
Do chwili otrzymania produktu z powrotem albo przedstawienia przez Klienta dowodu jego odesłania — zależnie od tego, co nastąpi wcześniej — Sprzedawca może wstrzymać się ze zwrotem płatności.
Płatność wraca tą samą metodą, którą posłużył się Klient, chyba że wyraźnie zgodzi się on na inne rozwiązanie. Zwrot nie generuje po stronie Klienta żadnych dodatkowych kosztów.
§6. W jakim stanie odesłać produkt
Klient odpowiada za spadek wartości produktu spowodowany korzystaniem z niego ponad to, co konieczne do stwierdzenia jego charakteru, cech i funkcjonowania.
Produkt należy odesłać kompletny, bez śladów używania wykraczających poza zwykłe sprawdzenie.
Dywany rzemieślnicze mogą różnić się nieznacznie kolorem i wymiarami od zdjęć — nie jest to wada ani podstawa do reklamacji.
§7. Reklamacja wadliwego produktu
Zwrot wynikający z odstąpienia od umowy to co innego niż reklamacja. Gdy produkt ma wadę, Klient korzysta z uprawnień z tytułu rękojmi. Dokładne zasady reklamacji znajdziesz w Regulaminie sklepu. Reklamacje przyjmujemy pod adresem: sklep@ruggy.pl.

`;

export default function ReturnsPage() {
  return (
    <LegalDocumentPage title="Zwroty i reklamacje" content={documentContent} />
  );
}
