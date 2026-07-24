---
target: strona główna Ruggy
total_score: 22
max_score: 32
na_heuristics: 7,9
p0_count: 0
p1_count: 3
timestamp: 2026-07-24T10-34-27Z
slug: app-public-page-tsx
---
# Impeccable Critique: strona główna Ruggy

## Design Health Score

| # | Heurystyka | Wynik | Kluczowy problem |
|---|---|---:|---|
| 1 | Widoczność stanu systemu | 3/4 | Na statycznej stronie potrzeby statusu są niewielkie; linki i FAQ są czytelne. |
| 2 | Zgodność z językiem użytkownika | 3/4 | Osobisty język działa, ale „tuftowany” nie jest wyjaśniony, a komunikacja ceny rozmija się z procesem. |
| 3 | Kontrola i swoboda użytkownika | 3/4 | Nawigacja sekcyjna i powrót są jasne, Instagram otwiera się bez blokowania strony. |
| 4 | Spójność i standardy | 3/4 | System jest spójny, lecz kilka różnych CTA prowadzi do tej samej ścieżki i sugeruje różne zobowiązania. |
| 5 | Zapobieganie błędom | 2/4 | Strona nie wyjaśnia przed kliknięciem, które dywany mają gotową cenę, a które tylko wycenę orientacyjną. |
| 6 | Rozpoznawanie zamiast przypominania | 3/4 | Proces i FAQ pomagają, ale dwóch modeli zakupu nie da się rozpoznać z głównej narracji. |
| 7 | Elastyczność i efektywność | n/a | Landing page nie ma przepływu dla powracających power userów. |
| 8 | Estetyka i minimalizm | 3/4 | Kierunek jest autorski, ale hero ma za dużo równorzędnych sygnałów i zajmuje około połowy wysokości desktopu samym H1. |
| 9 | Rozpoznawanie i naprawa błędów | n/a | Na ocenianej stronie nie ma formularza ani stanu błędu. |
| 10 | Pomoc i dokumentacja | 2/4 | FAQ nie wyjaśnia wystarczająco płatności, akceptacji projektu i następnego kroku. |
| **Razem** |  | **22/32** | **69% — stan akceptowalny, ale nie gotowy na maksymalizację konwersji** |

## Design Specificity Verdict

### Ocena projektowa

Strona jest wyraźnie zaprojektowana dla Ruggy. Persona „Twój Wuja Dywaniarz”,
język jednej osoby, prawdziwe zdjęcia pracowni oraz zestaw kobaltu, żółci i
ciepłego płótna nie dają się bez zmian przenieść na przypadkowy sklep. Problemem
nie jest brak charakteru, tylko to, że charakter wyprzedza dowody i jasność
oferty. Użytkownik szybciej rozumie osobowość marki niż zasady zakupu.

### Skan deterministyczny

CLI wykrył jedno ostrzeżenie `side-tab` w `app/(public)/page.tsx:189`, ale jest
to fałszywy alarm: akcentowa krawędź należy do akapitu, nie do karty.

Detektor w przeglądarce oznaczył 13 elementów i 19 instancji reguł. Potwierdził:

- zbyt dominujący H1 w hero;
- dwa realne problemy kontrastu: biały na coral `3.7:1` i niebieski na jasnym
  niebieskim `4.2:1`, przy wymaganym `4.5:1`;
- powtarzalne kickery sekcji, kafelki ikon i transformacje obrazów, które
  spłaszczają rytm strony;
- dekoracyjne koło wchodzące w przestrzeń nagłówka na mobilnym `390×844`;
- zbyt małą wysokość części linków stopki na telefonie.

Za fałszywe alarmy uznano `side-tab`, cztery przypadki `nested-cards` w FAQ oraz
`all-caps-body` w krótkim pasku informacyjnym.

### Nakładki wizualne

Iniekcja detektora zadziałała, ale była wykonywana w odizolowanej przeglądarce
headless. Nie ma wiarygodnej, widocznej dla użytkownika zakładki `[Human]` z
nakładkami.

## Overall Impression

Pierwsza reakcja brzmi: „to jest charakterystyczny twórca i fajny produkt”.
Po chwili pojawia się jednak pytanie: „ile naprawdę zapłacę i co stanie się po
kliknięciu?”. Największą szansą jest przesunięcie strony od samej energii marki
w stronę energii popartej konkretnym procesem, ceną i realizacjami.

## What's Working

- Głos marki jest konsekwentny, osobisty i zgodny z modelem jednego twórcy.
- Prawdziwe zdjęcia dywanów i procesu dobrze pokazują fakturę, ręczną pracę oraz
  nieregularność produktu.
- Fundamenty dostępności są solidne: semantyczne sekcje, skip link, opisy
  alternatywne, widoczne focusy i obsługa `prefers-reduced-motion`.

## Priority Issues

### [P1] Dwa modele ceny są ukryte w jednym ogólnym przekazie

**Dlaczego to szkodzi:** FAQ sugeruje uzyskanie dokładnej kwoty podczas
zamawiania, podczas gdy większość projektów dostaje cenę orientacyjną i później
indywidualną wycenę na Instagramie. Użytkownik może poczuć zmianę zasad po
zainwestowaniu czasu.

**Naprawa:** pokaż jeszcze przed galerią dwa krótkie scenariusze: piwodywany i
papadywany z gotową ceną oraz płatnością online, a pozostałe projekty z ceną
orientacyjną i późniejszym potwierdzeniem. Ujednolić z nimi CTA i FAQ.

**Sugerowana komenda:** `$impeccable shape app/(public)/page.tsx`

### [P1] Dowody nie są wystarczająco wiarygodne dla zakupu na zamówienie

**Dlaczego to szkodzi:** pięć gwiazdek sugeruje istniejący system ocen, którego
nie potwierdzają dane produktu. Galeria ma tylko trzy przykłady, powtarza zdjęcie
z hero i nie podaje kontekstu realizacji.

**Naprawa:** usuń gwiazdki, zachowaj potwierdzone „ponad 10 tys. obserwujących”,
połącz galerię z `/realizacje` i dodaj do prac prawdziwe informacje, takie jak
motyw, wymiar albo krótki brief, gdy są dostępne.

**Sugerowana komenda:** `$impeccable clarify app/(public)/page.tsx`

### [P1] Kontrast i dekoracja hero obniżają czytelność

**Dlaczego to szkodzi:** dwa zestawienia kolorów nie osiągają `4.5:1`, a na
telefonie dekoracyjne koło przecina przestrzeń tekstu. To bezpośredni problem
dostępności i jakości pierwszego wrażenia.

**Naprawa:** przyciemnij coral lub zmień kolor tekstu, zwiększ kontrast
niebieskiego na jasnoniebieskim oraz przesuń albo ukryj kolizyjną dekorację na
małych ekranach.

**Sugerowana komenda:** `$impeccable audit app/(public)/page.tsx`

### [P2] Hero nie ma jednego wyraźnego centrum uwagi

**Dlaczego to szkodzi:** pasek, nawigacja, dwa CTA, liczba obserwujących,
gwiazdki, dwa badge, dekoracje i zdjęcie walczą o uwagę. H1 ma `72px` i około
`502px` wysokości na desktopie, czyli sam zajmuje mniej więcej połowę viewportu.

**Naprawa:** zostaw jedno główne CTA, jeden potwierdzony dowód i jedno
uzupełniające działanie. Ogranicz wysokość nagłówka oraz liczbę nakładających się
ozdobników.

**Sugerowana komenda:** `$impeccable distill app/(public)/page.tsx`

### [P2] Ostatni krok nie daje wystarczającego poczucia bezpieczeństwa

**Dlaczego to szkodzi:** „Wyceń swój dywan” nie mówi, czy kliknięcie zobowiązuje
do zakupu, ile zajmie formularz i co wydarzy się później. Strona kończy emocją,
ale nie pewnością.

**Naprawa:** dodaj przy końcowym CTA jedno krótkie, zgodne z prawdą wyjaśnienie
następnego kroku i braku zobowiązania przed potwierdzeniem ceny. Powiększ strefy
dotyku linków stopki do co najmniej 44px.

**Sugerowana komenda:** `$impeccable harden app/(public)/page.tsx`

## Persona Red Flags

**Pierwszy klient spoza Instagrama:** rozumie charakter marki, ale nie wie, czy
jego projekt dostanie cenę od razu, czy będzie dalej ustalany w wiadomościach.
Termin „tuftowany” zakłada wiedzę kategorii.

**Sceptyczny kupujący:** zauważa gwiazdki bez liczby opinii i sprzeczność między
„dokładną kwotą” a wyceną orientacyjną. W tym miejscu może zakwestionować także
resztę obietnic.

**Zabiegany użytkownik telefonu:** widzi kolizję dekoracji z hero, musi długo
scrollować do konkretnego procesu i może zostać wysłany na Instagram zamiast do
wewnętrznych realizacji. Część linków stopki ma zbyt małe strefy dotyku.

## Minor Observations

- „dokładnie taki jaki chcesz” wymaga przecinka: „dokładnie taki, jaki chcesz”.
- CTA „Wyceń”, „Pokaż pomysł” i „Zacznij od pomysłu” prowadzą do tego samego
  miejsca, ale sugerują różne etapy procesu.
- Podstrona `/realizacje` jest praktycznie niewidoczna ze strony głównej.
- Powtarzanie tych samych kickerów, grubych obramowań, rotacji i offsetowych
  cieni zmniejsza wyjątkowość najważniejszych momentów.
- Na desktopie nie ma poziomego overflow; na mobilnym `390px` układ również
  mieści się w viewportcie.

## Questions to Consider

- Czy głównym działaniem zimnego ruchu ma być „Wyceń projekt”, czy „Wybierz
  rodzaj dywanu”?
- Które prawdziwe dane o realizacjach można pokazać bez tworzenia nowych
  obietnic: wymiary, czas wykonania, materiał, brief czy zdjęcia procesu?
- Czy „Twój Wuja Dywaniarz” ma być zrozumiały bez znajomości profilu na
  Instagramie, czy strona zakłada wcześniejszy kontakt z marką?
