# 0001 · Cena własnego dywanu na podstawie wysokości

**Status**: Assumed
**Date**: 2026-07-22
**Authorized by**: Mikołaj, podczas /develop

## Owed decision

Jak obliczać cenę typu „Inne”, gdy wysokość jest obowiązkowa, a szerokość opcjonalna.

## Assumption built on

Cena wynosi 249 zł opłaty bazowej plus 4,20 zł za każdy centymetr wysokości. Wynik jest zaokrąglany w górę do pełnych 10 zł. Szerokość jest opcjonalną informacją o projekcie i nie wpływa na cenę.

## Code area

`lib/custom-rug-price.ts`, `schema/booking.ts`, `app/zamow/[id]/`

## Requirements

W typie „Inne” wysokość jest obowiązkowa. Szerokość może pozostać pusta. Formularz, walidacja serwera, Stripe i opis rozmiaru stosują tę samą regułę.

## Ratify

Ta decyzja została zapisana przez /develop, bez pełnej analizy. Uruchom `/architect cena własnego dywanu`, aby ją zatwierdzić. Funkcja nie może zostać oznaczona jako ukończona do czasu zatwierdzenia.
