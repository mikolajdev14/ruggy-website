import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal-document-page";

export const metadata: Metadata = {
  title: "Zwroty i reklamacje",
  description: "Informacje dotyczące zwrotów i reklamacji w Ruggy.",
  alternates: { canonical: "/zwroty" },
};

const documentContent = `§1. Prawo do odstąpienia od umowy
Klient będący konsumentem ma prawo odstąpić od umowy zawartej na odległość bez podawania przyczyny w terminie 14 dni od dnia otrzymania produktu (art. 27 Ustawy z dnia 30 maja 2014 r. o prawach konsumenta).
Termin 14 dni liczony jest od dnia, w którym Klient (lub wskazana przez niego osoba inna niż przewoźnik) objął produkt w posiadanie. Dla zamówień obejmujących wiele produktów dostarczanych osobno — od objęcia w posiadanie ostatniego produktu.
Do zachowania terminu wystarczy wysłanie oświadczenia o odstąpieniu przed jego upływem.
§2. Wyłączenia — produkty na zamówienie
Zgodnie z art. 38 pkt 3 Ustawy o prawach konsumenta, prawo odstąpienia NIE przysługuje w odniesieniu do produktów wykonanych według specyfikacji Konsumenta lub wyraźnie spersonalizowanych — dotyczy to dywanów tworzonych na indywidualne zamówienie (custom).
Prawo odstąpienia nie przysługuje również w przypadku biletów na warsztaty z oznaczonym terminem (świadczenie usługi w określonym dniu — art. 38 pkt 12 Ustawy).
Produkty gotowe, dostępne w sklepie „od ręki” (nie personalizowane), podlegają standardowemu prawu zwrotu opisanemu w §1.
W razie wątpliwości, czy dany produkt podlega zwrotowi, prosimy o kontakt przed złożeniem zamówienia: kontakt@rugsly.eu.
§3. Jak dokonać zwrotu — krok po kroku
Poinformuj nas o decyzji o odstąpieniu, wysyłając wiadomość na adres kontakt@rugsly.eu. Możesz skorzystać ze wzoru formularza zamieszczonego na końcu tej strony (nie jest to obowiązkowe).
W zgłoszeniu podaj numer zamówienia, datę otrzymania produktu oraz numer rachunku bankowego do zwrotu płatności.
Otrzymasz od nas potwierdzenie zgłoszenia oraz adres, na który należy odesłać produkt.
Zapakuj produkt w sposób zabezpieczający go przed uszkodzeniem w transporcie i odeślij go w ciągu 14 dni od złożenia oświadczenia o odstąpieniu.
§4. Koszty zwrotu
Bezpośrednie koszty odesłania produktu (przesyłka zwrotna) ponosi Klient.
Sprzedawca zwraca koszt najtańszej oferowanej przez siebie metody dostawy. Jeżeli Klient wybrał metodę droższą niż najtańsza dostępna — dodatkowa różnica nie podlega zwrotowi.
Prosimy nie odsyłać przesyłek za pobraniem — takie przesyłki nie będą odbierane.
§5. Zwrot płatności
Sprzedawca zwraca wszystkie otrzymane od Klienta płatności (w tym koszt najtańszej dostawy) niezwłocznie, nie później niż w terminie 14 dni od dnia otrzymania oświadczenia o odstąpieniu.
Sprzedawca może wstrzymać się ze zwrotem płatności do chwili otrzymania produktu z powrotem lub dostarczenia przez Klienta dowodu jego odesłania — w zależności od tego, które zdarzenie nastąpi wcześniej.
Zwrot płatności następuje przy użyciu tej samej metody płatności, której użył Klient, chyba że wyraźnie zgodzi się on na inne rozwiązanie. Zwrot nie wiąże się z żadnymi dodatkowymi kosztami po stronie Klienta.
§6. Stan zwracanego produktu
Klient ponosi odpowiedzialność za zmniejszenie wartości produktu wynikające z korzystania z niego w sposób wykraczający poza konieczny do stwierdzenia charakteru, cech i funkcjonowania produktu.
Produkt powinien zostać zwrócony w stanie kompletnym, bez śladów użytkowania wykraczających poza zwykłe sprawdzenie.
Dywany rzemieślnicze mogą wykazywać nieznaczne różnice kolorystyczne i wymiarowe względem zdjęć — nie stanowi to wady ani podstawy do reklamacji.
§7. Reklamacje (wady produktu)
Zwrot z tytułu odstąpienia od umowy to nie to samo co reklamacja. Jeżeli produkt ma wadę, Klientowi przysługują uprawnienia z tytułu rękojmi. Szczegółowe zasady reklamacji opisane są w Regulaminie sklepu. Reklamacje przyjmujemy na adres: kontakt@rugsly.eu.

`;

export default function ReturnsPage() {
  return (
    <LegalDocumentPage title="Zwroty i reklamacje" content={documentContent} />
  );
}
