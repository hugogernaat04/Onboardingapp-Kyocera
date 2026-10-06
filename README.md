# Kyocera productonboarding

Onboarding-webapplicatie voor nieuwe verkopers van Kyocera: per product productinformatie, een uitlegvideo en een mini-quiz. Gebouwd met React, Vite, TypeScript en Tailwind CSS, met [Supabase](https://supabase.com) voor inloggen, de database en bestandsopslag. De interface is beschikbaar in het Nederlands (standaard) en Engels.

- **Verkopers** loggen in, lezen de productinfo, bekijken de video en maken de quiz. Hun voortgang staat in hun account.
- **Admins** beheren onder **Beheer** (`#/admin`) producten, afbeeldingen, video's, quizvragen en gebruikers, zonder code aan te passen.
- Er is geen openbare registratie: nieuwe mensen worden uitgenodigd.

> De productinhoud die er standaard in staat is **fictieve placeholder-inhoud**. Vervang die door de echte productinformatie via het beheerscherm.

## Inhoud

1. [Een Supabase-project aanmaken](#1-een-supabase-project-aanmaken-en-de-url-en-anon-key-vinden)
2. [De migraties en de seed uitvoeren](#2-de-migraties-en-de-seed-uitvoeren)
3. [Het .env-bestand invullen en lokaal testen](#3-het-env-bestand-invullen-en-lokaal-testen)
4. [Jezelf de eerste admin maken](#4-jezelf-de-eerste-admin-maken)
5. [Openbaar registreren uitzetten en gebruikers uitnodigen](#5-openbaar-registreren-uitzetten-en-gebruikers-uitnodigen)
6. [Site URL en Redirect URLs instellen](#6-site-url-en-redirect-urls-instellen)
7. [De GitHub-secrets toevoegen](#7-de-github-secrets-toevoegen)
8. [Als admin een product toevoegen](#8-als-admin-een-product-toevoegen)

Daarna: [commando's](#commandos), [testen op je telefoon](#testen-op-je-eigen-telefoon), [online zetten](#online-zetten-via-github-pages), [talen](#talen-nederlands-en-engels), [logo en huisstijl](#logo-en-huisstijl) en [mappenstructuur](#mappenstructuur).

## 1. Een Supabase-project aanmaken en de URL en anon key vinden

1. Maak een gratis account op [supabase.com](https://supabase.com) en klik op **New project**.
2. Kies een naam, een sterk databasewachtwoord (bewaar dat in je wachtwoordmanager) en een regio dicht bij je gebruikers (bijvoorbeeld *West EU*).
3. Wacht tot het project klaar is. Ga dan naar **Project Settings → API** (of **Connect**).
4. Noteer twee waarden:
   - **Project URL**, bijvoorbeeld `https://abcdefgh.supabase.co`
   - de **anon** key (ook "publishable key" genoemd). Die mag in de frontend.

> Gebruik **nooit** de `service_role` key in deze app of in GitHub-secrets voor de frontend. Die omzeilt alle beveiliging.

## 2. De migraties en de seed uitvoeren

De database-instellingen staan in [`supabase/migrations/`](supabase/migrations/):

| Bestand | Inhoud |
| --- | --- |
| `20260101000001_schema_en_beveiliging.sql` | Tabellen (`profiles`, `products`, `quiz_questions`, `quiz_results`), de functie `is_admin()`, triggers, Row Level Security en de opslagbucket `product-media` |
| `20260101000002_seed_producten.sql` | De 8 oorspronkelijke producten en hun quizvragen (met Engelse vertaling) |

**Via de SQL Editor (het makkelijkst):**

1. Open in Supabase **SQL Editor → New query**.
2. Plak de volledige inhoud van `20260101000001_schema_en_beveiliging.sql` en klik **Run**.
3. Doe hetzelfde met `20260101000002_seed_producten.sql`. Deze seed kun je veilig opnieuw uitvoeren; bestaande producten worden overgeslagen.

**Of via de Supabase CLI:**

```bash
npx supabase login
npx supabase link --project-ref <je-project-ref>
npx supabase db push
```

De beveiliging zit in de database zelf (Row Level Security). Ook als iemand de frontend omzeilt, weigert de database admin-acties van gewone gebruikers.

## 3. Het .env-bestand invullen en lokaal testen

Je hebt [Node.js](https://nodejs.org) 20 of nieuwer nodig.

```bash
cp .env.example .env
```

Vul in `.env` de waarden uit stap 1 in:

```
VITE_SUPABASE_URL=https://abcdefgh.supabase.co
VITE_SUPABASE_ANON_KEY=jouw-anon-key
```

`.env` staat in `.gitignore` en komt dus niet in git. Start daarna de app:

```bash
npm install
npm run dev
```

Open het adres dat in de terminal verschijnt (meestal http://localhost:5173/Onboardingapp-Kyocera/).

## 4. Jezelf de eerste admin maken

Er is nog niemand admin, dus de eerste doe je met een SQL-query. Eerst moet je zelf een account hebben:

1. Ga in Supabase naar **Authentication → Users → Add user → Create new user**.
2. Vul je e-mailadres en een wachtwoord in en zet **Auto Confirm User** aan. Maak het account aan.
3. Open de **SQL Editor** en voer uit (vervang het e-mailadres):

```sql
update public.profiles
set rol = 'admin'
where email = 'jouw@emailadres.nl';
```

Log daarna in op de app. In de header verschijnt nu **Beheer**. Alle volgende admins maak je in de app zelf, onder **Beheer → Gebruikers**.

## 5. Openbaar registreren uitzetten en gebruikers uitnodigen

**Registratie uitzetten:** ga naar **Authentication → Sign In / Providers** (soms onder **Settings**), zet **Allow new users to sign up** uit. De app heeft zelf geen registratiepagina; zo kan ook niemand via de API een account maken.

**Iemand uitnodigen:**

1. Ga naar **Authentication → Users → Invite user**.
2. Vul het e-mailadres in. De persoon krijgt een e-mail met een link.
3. Via die link komt de persoon in de app op **Kies je wachtwoord**, vult zijn of haar naam en een wachtwoord in en is daarna ingelogd. De rol is automatisch `gebruiker`; maak iemand admin onder **Beheer → Gebruikers**.

**Wachtwoord vergeten:** op de inlogpagina staat **Wachtwoord vergeten?**. De persoon krijgt een link om een nieuw wachtwoord te kiezen.

### De e-mailtemplates aanpassen (eenmalig, belangrijk)

Deze app gebruikt een `#` in de URL (HashRouter), en de standaardlinks van Supabase werken daar slecht mee. Pas daarom twee templates aan onder **Authentication → Email Templates**. Vervang in beide de link door de hieronder genoemde.

**Invite user** (let op: `{{ .SiteURL }}` moet eindigen op een `/`, zie stap 6):

```html
<h2>Je bent uitgenodigd</h2>
<p>Je bent uitgenodigd voor de Kyocera productonboarding.</p>
<p><a href="{{ .SiteURL }}#/auth/bevestigen?token_hash={{ .TokenHash }}&type=invite">Kies je wachtwoord</a></p>
```

**Reset password:**

```html
<h2>Wachtwoord opnieuw instellen</h2>
<p><a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=recovery">Kies een nieuw wachtwoord</a></p>
```

De reset-link gebruikt `{{ .RedirectTo }}`, dat de app zelf meegeeft. Daardoor werkt dezelfde template zowel lokaal als op GitHub Pages.

## 6. Site URL en Redirect URLs instellen

Ga naar **Authentication → URL Configuration**:

- **Site URL**: `https://hugogernaat04.github.io/Onboardingapp-Kyocera/` (met slash aan het eind)
- **Redirect URLs** (voeg beide toe):
  - `https://hugogernaat04.github.io/Onboardingapp-Kyocera/**`
  - `http://localhost:5173/**`

Zonder deze lijst weigert Supabase de redirect van de resetlink. Uitnodigingen gebruiken altijd de Site URL, ook als je lokaal test; test uitnodigen dus bij voorkeur op de echte site.

## 7. De GitHub-secrets toevoegen

De build op GitHub heeft de Supabase-gegevens nodig. Die komen uit repository secrets, niet uit de code.

1. Ga op GitHub naar de repository → **Settings → Secrets and variables → Actions**.
2. Klik **New repository secret** en voeg twee secrets toe:
   - `VITE_SUPABASE_URL`: de Project URL
   - `VITE_SUPABASE_ANON_KEY`: de anon key
3. Zet onder **Settings → Pages → Source** de bron op **GitHub Actions** (eenmalig).
4. Push naar `main`. De workflow in `.github/workflows/deploy.yml` controleert (lint en tests), bouwt met de secrets en publiceert. Voortgang zie je onder **Actions**.

De site staat daarna op **https://hugogernaat04.github.io/Onboardingapp-Kyocera/**. Heet de repo anders? Pas dan `base` aan in `vite.config.ts` en de URL's in stap 6.

> De anon key komt in de gebouwde site terecht en is dus voor iedereen zichtbaar. Dat is de bedoeling: de beveiliging zit in de database (Row Level Security), niet in het geheimhouden van die key.

## 8. Als admin een product toevoegen

1. Log in en klik in de header op **Beheer**. Je ziet alle producten.
2. Klik op **Nieuw product** en vul het formulier in:
   - Naam, categorie, korte omschrijving (max. 160 tekens), omschrijving en doelgroep. De slug (het stuk in de URL) wordt automatisch gemaakt.
   - **Kenmerken** en **verkoopargumenten** zijn lijsten: voeg regels toe, verwijder ze of verplaats ze met de pijltjes.
   - **Afbeelding**: kies *Afbeelding uploaden* (JPG, PNG, WebP of SVG, max. 5 MB, bij voorkeur 4:3). Je ziet meteen een voorbeeld.
   - **Video**: kies *YouTube-link* en plak de link, of *Eigen video (mp4)* en upload een bestand (max. 50 MB, H.264/AAC werkt het best op telefoons). Je ziet een voorbeeld en tijdens het uploaden een voortgangsbalk.
   - Zet **Gepubliceerd** aan als verkopers het product mogen zien. Een concept is alleen voor admins zichtbaar.
3. Klik **Voorbeeld** om te zien hoe de productpagina eruitziet, en **Product aanmaken** om op te slaan.
4. Na het opslaan verschijnt onderaan **Quizvragen**: voeg per vraag de tekst, vier antwoordopties (kies met de radioknop de juiste) en de uitleg toe. De quiz werkt met 5 vragen; bij minder krijg je een melding. Klik **Quizvragen opslaan**.
5. In het overzicht pas je de volgorde aan met de pijltjes, en kun je producten verbergen, publiceren en verwijderen.
6. Onder **Beheer → Gebruikers** zie je wie welke quizzen heeft gehaald en pas je rollen aan. Je kunt je eigen rol niet wijzigen, zodat er altijd een admin overblijft.

**Let op bij Engelse teksten.** De Engelse vertaling van de 8 oorspronkelijke producten staat in de database, maar het beheerscherm bewerkt alleen de Nederlandse tekst. Wijzig je een Nederlandse tekst, dan blijft de oude Engelse tekst staan. Pas je de quizvragen aan, dan vervalt de Engelse quiz en toont de site daarvoor de Nederlandse. Nieuwe producten hebben geen Engelse tekst en tonen dus altijd Nederlands.

## Commando's

| Commando | Doel |
| --- | --- |
| `npm run dev` | Ontwikkelserver |
| `npm run build` | Productiebuild in `dist/` (inclusief typecontrole) |
| `npm run preview` | Bekijk de productiebuild lokaal |
| `npm run lint` | ESLint |
| `npm test` | Tests (Vitest + Testing Library, Supabase is daarin gemockt) |

## Testen op je eigen telefoon

Zorg dat je telefoon en computer op hetzelfde wifi-netwerk zitten en start:

```bash
npm run dev -- --host
```

Open op je telefoon het `Network`-adres uit de terminal (bijvoorbeeld `http://192.168.1.20:5173/Onboardingapp-Kyocera/`).

## Online zetten via GitHub Pages

Zie [stap 7](#7-de-github-secrets-toevoegen). De routes werken met een hash-router (`#/product/...`), dus herladen en directe links werken op GitHub Pages.

## Talen (Nederlands en Engels)

- **Interfaceteksten** (knoppen, koppen, quizmeldingen, inlogscherm) staan per taal in [`src/i18n/translations.ts`](src/i18n/translations.ts). Het beheerscherm is alleen in het Nederlands.
- **Producttekst** komt uit de database. Zie de opmerking over Engelse teksten bij [stap 8](#8-als-admin-een-product-toevoegen).
- De gekozen taal wordt in de browser onthouden.

## Logo en huisstijl

Het Kyocera-logo staat in `public/brand/kyocera-logo.svg` (ook `kyocera-logo.png` werkt) en wordt gebruikt in de header, de footer en als favicon. Kleuren en lettertypen (Geist) staan als design tokens in [`tailwind.config.ts`](tailwind.config.ts). Het primaire Kyocera-rood is `kyocera.red` (`#E31A2F`); controleer dat aan de hand van de officiële huisstijlgids.

## Mappenstructuur

```
supabase/migrations/  database: schema, beveiliging en seed (SQL)
src/components/       herbruikbare onderdelen (Header, ProductView, route-beveiliging, ...)
src/components/admin/ onderdelen van het beheer (formuliervelden, uploads, quizbeheer)
src/context/          sessie, catalogus en voortgang
src/pages/            pagina's (Home, Product, Quiz) met auth/ en admin/
src/lib/              Supabase-client, API's, validatie, quizlogica en mediahulpjes, met tests
src/data/products.ts  alleen nog de bron voor de seed en de tests; de app leest uit Supabase
public/               afbeeldingen van de seed-producten, video's en logo
```
