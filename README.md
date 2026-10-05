# Kyocera productonboarding

Onboarding-webapplicatie voor nieuwe verkopers van Kyocera: per product productinformatie, een uitlegvideo en een mini-quiz. Gebouwd met React, Vite, TypeScript en Tailwind CSS. Alle teksten staan in het Nederlands; er is geen backend.

> De productinhoud is **fictieve placeholder-inhoud**. Vervang die door de echte productinformatie (zie [Een product toevoegen of aanpassen](#een-product-toevoegen-of-aanpassen)).

## Installeren en starten

Je hebt [Node.js](https://nodejs.org) 20 of nieuwer nodig.

```bash
npm install
npm run dev
```

Open daarna het adres dat in de terminal verschijnt (meestal http://localhost:5173/Onboardingapp-Kyocera/).

Overige commando's:

| Commando | Doel |
| --- | --- |
| `npm run build` | Productiebuild in `dist/` (inclusief typecontrole) |
| `npm run preview` | Bekijk de productiebuild lokaal |
| `npm run lint` | ESLint |
| `npm test` | Tests (Vitest + Testing Library) |

## Testen op je eigen telefoon

Zorg dat je telefoon en computer op hetzelfde wifi-netwerk zitten en start:

```bash
npm run dev -- --host
```

Open op je telefoon het `Network`-adres uit de terminal (bijvoorbeeld `http://192.168.1.20:5173/Onboardingapp-Kyocera/`).

## Online zetten via GitHub Pages

1. Push de code naar de standaardbranch (`main`) van de repo.
2. Ga in GitHub naar **Settings → Pages** en kies bij **Source** voor **GitHub Actions**. Dit hoef je maar één keer te doen.
3. De workflow in `.github/workflows/deploy.yml` controleert (lint en tests), bouwt en publiceert de site bij elke push naar `main`. Voortgang zie je onder het tabblad **Actions**.

De site staat daarna op: **https://hugogernaat04.github.io/Onboardingapp-Kyocera/**

De routes werken met een hash-router (`#/product/...`), dus herladen en directe links werken op GitHub Pages. Heet de repo anders? Pas dan `base` aan in `vite.config.ts`.

## Een product toevoegen of aanpassen

Alle productdata staat in [`src/data/products.ts`](src/data/products.ts). Bovenaan dat bestand staat een uitleg. Kort:

1. Kopieer een bestaand product in de lijst `products` en geef het een unieke `id` (bv. `a3-kleuren-mfp`).
2. Vul naam, categorie, omschrijvingen, kenmerken, doelgroep en verkoopargumenten in.
3. Voeg precies 5 quizvragen toe met elk 4 opties. `juisteAntwoord` is het nummer van de juiste optie, beginnend bij 0. De volgorde van de opties wordt bij elke poging automatisch geschud.

Het categoriefilter, de voortgangsteller ("3 van 8") en de volgende/vorige-knoppen passen zich vanzelf aan. Een quiz is gehaald bij minimaal 4 van 5 goed (`PASS_SCORE` in `src/lib/progress.ts`).

## Een afbeelding vervangen

1. Zet de nieuwe afbeelding (jpg, png, webp of svg, bij voorkeur 4:3, ca. 1200 x 900 px) in `public/images/`.
2. Pas bij het product in `products.ts` het veld `afbeelding` aan, bv. `afbeelding: 'mijn-product.jpg'`.

De huidige SVG-placeholders worden gemaakt door `node scripts/generate-images.mjs`.

## Een eigen video toevoegen

Het veld `video` in `products.ts` accepteert drie dingen; de speler herkent zelf welke:

- **YouTube-link**: `video: 'https://www.youtube.com/watch?v=XXXXXXXXXXX'` (ook `youtu.be`-links werken).
- **Eigen mp4**: zet het bestand in `public/videos/` en vul de bestandsnaam in: `video: 'uitleg-mfp.mp4'`. Gebruik H.264/AAC voor de beste ondersteuning op iPhone en Android.
- **Leeg** (`video: ''`): er verschijnt een nette placeholder "Video volgt binnenkort".

Nu gebruiken alle producten dezelfde YouTube-dummyvideo (`DUMMY_VIDEO` bovenaan in `products.ts`).

## Het officiële logo plaatsen

Het Kyocera-logo staat al in **`public/brand/kyocera-logo.svg`** (afkomstig van Wikimedia Commons). Heb je een eigen officieel bestand, overschrijf het dan (ook `kyocera-logo.png` werkt). Het wordt automatisch gebruikt in de header, de footer en als favicon. Zonder bestand toont de site de tekst "KYOCERA" in de merkkleur.

## Huisstijl aanpassen

Kleuren en lettertypen staan als design tokens in [`tailwind.config.ts`](tailwind.config.ts). Het primaire Kyocera-rood is `kyocera.red`. De hexwaarde (`#E31A2F`) komt uit het logobestand; controleer hem aan de hand van de officiële huisstijlgids.

## Mappenstructuur

```
src/components/  herbruikbare onderdelen (Header, ProductCard, VideoPlayer, ...)
src/pages/       pagina's (Home, Product, Quiz, NotFound)
src/data/        productdata (products.ts)
src/lib/         quizlogica, voortgang (localStorage) en mediahulpjes, met tests
public/          afbeeldingen, video's en logo
```
