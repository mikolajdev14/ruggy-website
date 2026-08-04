# Zdjęcia podrodzajów dywanów

Status: Accepted

## Summary

Rozszerzamy istniejący mechanizm zdjęć katalogowych tak, aby zdjęcia mogły należeć zarówno do głównego rodzaju dywanu, jak i do jego podrodzaju. W panelu administratora przy tworzeniu podrodzaju administrator będzie mógł wybrać zdjęcia, ustawić zdjęcie okładkowe, a po zapisaniu zarządzać nimi tak samo jak zdjęciami rodzaju głównego.

## Context

Obecnie tabela `rug_photos` wiąże każde zdjęcie wyłącznie z `rug_types`. Oznacza to, że podrodzaj może korzystać tylko ze wspólnej galerii rodzaju nadrzędnego. Potrzebujemy zachować istniejące zdjęcia i dotychczasowe zachowanie, a jednocześnie umożliwić osobną galerię dla podrodzaju.

## Requirements

### AC-1 — model danych

- `rug_photos` obsługuje dokładnie jednego właściciela: `rug_type_id` albo `rug_variant_id`.
- Dotychczasowe zdjęcia rodzajów głównych pozostają bez zmian.
- Dla każdego właściciela może istnieć najwyżej jedno zdjęcie z `is_cover = true`.
- Usunięcie podrodzaju usuwa jego rekordy zdjęć z bazy; pliki w Storage są również sprzątane przez akcję administracyjną.

### AC-2 — kreator tworzenia podrodzaju

- Formularz tworzenia podrodzaju pozwala wybrać wiele zdjęć.
- Administrator może wskazać zdjęcie okładkowe przed zapisaniem formularza.
- Po utworzeniu podrodzaju zdjęcia są przesyłane i przypisywane do nowego `rug_variant_id`.
- Błąd przesyłania jest pokazany administratorowi i nie powoduje cichego sukcesu.

### AC-3 — zarządzanie istniejącym podrodzajem

- Edycja podrodzaju pozwala dodawać, ustawiać jako okładkę i usuwać zdjęcia.
- Gdy podrodzaj nie ma własnych zdjęć, panel pokazuje informację o galerii odziedziczonej po rodzaju nadrzędnym.
- Zdjęcia rodzaju głównego pozostają zarządzane niezależnie.

### AC-4 — karta podrodzaju

- Karta podrodzaju korzysta z własnej okładki, jeśli istnieje.
- Bez własnych zdjęć karta korzysta z okładki rodzaju nadrzędnego, a następnie z dotychczasowego statycznego fallbacku.

### AC-5 — publiczna strona podrodzaju i produktu

- Publiczna lista podrodzajów oraz widok wybranego podrodzaju pokazują własne zdjęcia podrodzaju.
- Jeśli własna galeria jest pusta, wyświetlana jest galeria rodzaju nadrzędnego, zgodnie z dotychczasowym fallbackiem.
- Zmiana galerii podrodzaju nie zmienia galerii rodzaju głównego.

### AC-6 — bezpieczeństwo i walidacja

- Odczyt publiczny obejmuje wyłącznie aktywne rodzaje i aktywne podrodzaje.
- Zapis, zmiana okładki i usuwanie pozostają dostępne wyłącznie przez autoryzowane akcje serwerowe administratora.
- Obowiązują dotychczasowe limity rozmiaru, MIME type i rozszerzeń obrazów.

## Options considered

1. Rozszerzyć `rug_photos` o opcjonalnego właściciela `rug_variant_id` — wybrana opcja.
2. Utworzyć osobną tabelę `rug_variant_photos` — oznaczałoby duplikację modelu, polityk RLS i logiki Storage.
3. Zapisywać zdjęcia w danych JSON podrodzaju — utrudniłoby zapytania, indeksowanie, RLS i sprzątanie plików.

## Decision

Wybieramy rozszerzenie istniejącej tabeli `rug_photos`. `rug_type_id` staje się nullable, dodajemy `rug_variant_id` z kluczem obcym do `rug_variants` oraz constraint wymagający dokładnie jednego właściciela. Logika uploadu otrzymuje jawny obiekt właściciela, dzięki czemu nie można przypadkowo przypisać zdjęcia jednocześnie do rodzaju i podrodzaju.

## Rationale

Jedna tabela utrzymuje wspólne reguły walidacji, kolejności, okładki i usuwania. Migracja jest addytywna i zachowuje wszystkie istniejące rekordy. Fallback po stronie aplikacji pozwala wdrożyć osobne zdjęcia bez regresji dla katalogu, który jeszcze ich nie posiada.

## Feature design

### Data model

Istniejące pola `rug_photos` pozostają bez zmian. Dodajemy:

- `rug_variant_id bigint references public.rug_variants(id) on delete cascade`;
- indeks `(rug_variant_id, display_order)`;
- częściowy indeks unikalny jednego covera na `rug_variant_id`;
- constraint `num_nonnulls(rug_type_id, rug_variant_id) = 1`.

Dotychczasowy indeks jednego covera dla `rug_type_id` pozostaje.

### API and actions

- `createRugVariant` zwraca także identyfikator utworzonego podrodzaju.
- `uploadRugPhoto({ rugTypeId, rugVariantId }, file, makeCover)` wymaga dokładnie jednego identyfikatora właściciela.
- `setRugPhotoCover(photoId)` działa w obrębie właściciela zdjęcia.
- `deleteRugPhoto(photoId)` usuwa rekord i plik Storage, a po usunięciu covera wybiera następne zdjęcie tego samego właściciela.
- `deleteRugVariant` sprząta pliki zdjęć podrodzaju przed usunięciem rekordu podrodzaju.

### Value sourcing and fallback

Warstwa `lib/rug-photos.ts` dostarcza wspólny resolver galerii:

1. własne zdjęcia podrodzaju;
2. zdjęcia rodzaju nadrzędnego;
3. istniejące statyczne zdjęcia kategorii.

Resolver wybiera cover oznaczony przez administratora albo pierwsze zdjęcie według `display_order`, a pozostałe zdjęcia przekazuje do galerii realizacji.

### Admin UX

Formularz nowego podrodzaju buforuje wybrane pliki lokalnie, pokazuje podglądy i pozwala zmienić cover przed wysłaniem. Po utworzeniu rekordu pliki są przesyłane do przestrzeni `variants/{rugVariantId}/...`. Formularz edycji korzysta z tego samego komponentu zarządzania zdjęciami co rodzaj główny, z właścicielem ustawionym na `rug_variant_id`.

### Public UX

Karta podrodzaju otrzymuje resolved cover. Widok podrodzaju pobiera zdjęcia podrodzaju oraz zdjęcia rodzaju nadrzędnego i przekazuje resolved gallery do istniejącego komponentu realizacji.

### Invariants and security

- Publiczne zapytania filtrują aktywny rodzaj nadrzędny i aktywny podrodzaj.
- Polityka SELECT dla `rug_photos` pozwala na zdjęcie rodzaju aktywnego albo zdjęcie podrodzaju aktywnego pod aktywnym rodzajem.
- Operacje zapisu używają istniejącego `getAuthorizedAdminClient` i nie są wykonywane przez klienta z publicznym kluczem.

### Test scenarios

- Utworzenie podrodzaju bez zdjęć zachowuje fallback rodzica.
- Utworzenie podrodzaju z trzema zdjęciami zapisuje je pod właściwym `rug_variant_id`, a wskazany cover jest jedyny.
- Ustawienie nowego covera zdejmuje poprzedni cover tylko z tego podrodzaju.
- Usunięcie zdjęcia cover wybiera następne zdjęcie podrodzaju.
- Usunięcie podrodzaju nie pozostawia jego rekordów ani plików zdjęć.
- Podrodzaj z własną galerią nie zmienia galerii rodzaju nadrzędnego.
- Nieaktywne podrodzaje nie ujawniają zdjęć publicznie.

## Build plan

1. Dodać migrację rozszerzającą `rug_photos` i politykę RLS.
2. Rozszerzyć typy oraz resolver fallbacku galerii.
3. Rozszerzyć akcje serwerowe i zapytania panelu administratora.
4. Dodać obsługę zdjęć w kreatorze i edycji podrodzajów.
5. Podłączyć resolved cover i galerię w publicznych widokach.
6. Uruchomić testy, lint i build oraz sprawdzić regresję istniejącej galerii rodzajów.

## Consequences

Dodajemy jeden typ zdjęcia i jeden zestaw operacji administracyjnych do istniejącego modelu. Publiczne odczyty wykonują dodatkowe pobranie zdjęć podrodzajów, ale resolver utrzymuje prostą i przewidywalną hierarchię fallbacku. Migrację należy zastosować przed wdrożeniem kodu korzystającego z `rug_variant_id`.

## Migration plan

Migracja jest bezpieczna dla istniejących danych: najpierw dodaje nullable FK i indeksy, a następnie constraint, który wszystkie obecne rekordy kategorii spełniają. Wdrożenie powinno przebiegać w kolejności: migracja bazy, deploy aplikacji. Przy rollbacku kodu można pozostawić nowe kolumny i indeksy; usuwanie ich nie jest potrzebne do przywrócenia poprzedniej wersji aplikacji.
