# Ruggy

Aplikacja do zamawiania ręcznie tuftowanych dywanów. Klient wybiera wariant,
rozmiar, termin i dostawę, przesyła zdjęcie referencyjne i opłaca zamówienie
przez Stripe. Panel administracyjny służy do obsługi zamówień i kalendarza.

## Uruchomienie

```bash
npm install
npm run dev
```

Aplikacja będzie dostępna pod adresem [http://localhost:3000](http://localhost:3000).

## Adres produkcyjny

Na Vercelu ustaw zmienną:

```env
NEXT_PUBLIC_SITE_URL=https://twoja-domena.pl
```

Adres jest używany w canonicalach, Open Graph, danych strukturalnych,
`robots.txt` i `sitemap.xml`. Bez tej zmiennej aplikacja użyje produkcyjnego
adresu projektu Vercel, a lokalnie `NEXT_PUBLIC_APP_URL` lub
`http://localhost:3000`.

## Kontrola jakości

```bash
npm run lint
npm run build
npm run start
```

Lighthouse uruchamiaj na produkcyjnym serwerze `http://localhost:3000`, który
startuje ostatnia komenda. Nie mierz `npm run dev`, ponieważ tryb deweloperski
dołącza DevTools, HMR i rozwojowe wersje Reacta, które nie trafiają na produkcję.

Po wdrożeniu sprawdź:

- `/robots.txt` i `/sitemap.xml`,
- podgląd linku w Facebook Sharing Debugger,
- dane strukturalne w Google Rich Results Test,
- wydajność mobilną w Google PageSpeed Insights,
- indeksowanie i przesłanie sitemap w Google Search Console.

Panel `/admin`, konfiguratory `/zamow/[id]` oraz strony wyniku płatności mają
ustawione `noindex` i celowo nie występują w sitemapie.
