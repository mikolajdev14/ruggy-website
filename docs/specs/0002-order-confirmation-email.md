# 0002 · Potwierdzenie zamówienia email

**Status**: Assumed
**Date**: 2026-07-30
**Authorized by**: Mikołaj, podczas /develop

## Owed decision

Kiedy wysyłać potwierdzenie zamówienia, jakie dane ma zawierać i jak
zabezpieczyć wysyłkę przed powtórzeniem po ponownym wywołaniu obsługi Stripe.

## Assumption built on

Po potwierdzeniu płatności standardowego zamówienia i zapisaniu go w Supabase
aplikacja wysyła klientowi transakcyjne potwierdzenie przez Resend API.
Wiadomość zawiera numer zamówienia, produkt, wariant, rozmiar, termin, sposób
dostawy i opłaconą kwotę. Błąd dostawcy poczty nie cofa opłaconego zamówienia.
Wysyłka korzysta z klucza idempotencji opartego na identyfikatorze sesji
Stripe. Opcjonalny odbiorca testowy pozwala sprawdzić integrację bez wysyłania
wiadomości do klienta.

## Code area

`lib/order-confirmation-email.ts`, `lib/fulfill-checkout.ts`, `README.md`

## Requirements

Po opłaceniu standardowego zamówienia klient otrzymuje czytelne potwierdzenie.
Klucz Resend pozostaje wyłącznie po stronie serwera. Powtórne wywołanie obsługi
tej samej płatności w krótkim czasie nie wysyła drugiego maila. Brak
konfiguracji lub chwilowy błąd Resend nie blokuje zapisu opłaconego zamówienia.

## Ratify

Ta decyzja została zapisana przez /develop, bez pełnej analizy. Uruchom
`/architect potwierdzenie zamówienia email`, aby ją zatwierdzić. Funkcja nie
może zostać oznaczona jako ukończona do czasu zatwierdzenia.
