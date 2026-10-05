/**
 * PRODUCTDATA – het enige bestand dat je hoeft aan te passen voor de inhoud.
 *
 * Een product toevoegen:
 *   1. Kopieer een bestaand object in de lijst `products` onderaan en plak het eronder.
 *   2. Geef het een unieke `id` (kleine letters, koppeltekens, bv. "a3-kleuren-mfp").
 *      De id komt in de URL: #/product/<id>.
 *   3. Vul de velden in. De `categorie` mag een nieuwe naam zijn; het filter
 *      op de homepagina past zich vanzelf aan.
 *   4. Geef het product precies 5 quizvragen met elk 4 opties.
 *      `juisteAntwoord` is het nummer van de juiste optie, beginnend bij 0
 *      (0 = eerste optie, 3 = vierde optie).
 *
 * Een product aanpassen: wijzig gewoon de teksten hieronder.
 * Een product verwijderen: verwijder het hele object (de voortgang van
 * verwijderde producten wordt genegeerd).
 *
 * Afbeelding: bestandsnaam in public/images/ (bv. "mijn-product.jpg").
 * Video: laat leeg ("") voor de placeholder "Video volgt binnenkort", of vul in:
 *   - een YouTube-link:   "https://www.youtube.com/watch?v=XXXXXXXXXXX"
 *   - een eigen mp4:      "mijn-video.mp4" (bestand in public/videos/)
 *
 * Alle productnamen en -teksten hieronder zijn fictieve placeholders.
 */

export interface QuizQuestion {
  vraag: string
  /** Precies 4 antwoordopties */
  opties: string[]
  /** Index (0-3) van de juiste optie */
  juisteAntwoord: number
  uitleg: string
}

export interface Product {
  id: string
  naam: string
  categorie: string
  korteOmschrijving: string
  omschrijving: string
  kenmerken: string[]
  doelgroep: string
  verkoopargumenten: string[]
  /** Bestandsnaam in public/images/ */
  afbeelding: string
  /** YouTube-link, mp4-bestandsnaam in public/videos/, of "" */
  video: string
  quiz: QuizQuestion[]
}

/** Gedeelde dummy-video voor alle producten (vervang per product door een eigen video). */
const DUMMY_VIDEO = 'https://www.youtube.com/watch?v=aqz-KE-bpKQ'

export const products: Product[] = [
  {
    id: 'a3-kleuren-mfp',
    naam: 'KX-5500ci',
    categorie: 'Multifunctionals',
    korteOmschrijving: 'Snelle A3-kleuren-MFP voor drukke werkgroepen.',
    omschrijving:
      'De KX-5500ci is een A3-kleurenmultifunctional die printen, kopiëren, scannen en faxen combineert in één compact systeem. Dankzij het grote aanraakscherm en de snelle verwerking is hij ontworpen voor werkgroepen die dagelijks veel documenten verwerken.',
    kenmerken: [
      'Afdruksnelheid tot 55 pagina’s per minuut in kleur en zwart-wit',
      '10,1 inch aanraakscherm met app-achtige bediening',
      'Standaard duplex en dubbelzijdige automatische documentinvoer',
      'Papiercapaciteit uitbreidbaar tot 7.150 vel',
      'Beveiligd printen met pincode en kaartlezer',
    ],
    doelgroep:
      'Middelgrote tot grote kantoren, afdelingen en werkgroepen van 15 tot 50 gebruikers met een hoog en gevarieerd printvolume.',
    verkoopargumenten: [
      'Lage totale kosten per pagina door langdurige onderdelen',
      'Minder stilstand dankzij lange levensduur van trommel en ontwikkelaar',
      'Eenvoudig te koppelen aan bestaande documentworkflows',
      'Sterke beveiliging voor gevoelige documenten',
    ],
    afbeelding: 'a3-kleuren-mfp.svg',
    video: DUMMY_VIDEO,
    quiz: [
      {
        vraag: 'Welk papierformaat verwerkt de KX-5500ci?',
        opties: ['Alleen A4', 'A3 en kleiner', 'Alleen A5', 'Uitsluitend rollen papier'],
        juisteAntwoord: 1,
        uitleg: 'Het is een A3-systeem en verwerkt dus ook A4 en kleinere formaten.',
      },
      {
        vraag: 'Wat is de maximale afdruksnelheid van de KX-5500ci?',
        opties: ['25 ppm', '40 ppm', '55 ppm', '90 ppm'],
        juisteAntwoord: 2,
        uitleg: 'De KX-5500ci print tot 55 pagina’s per minuut, zowel in kleur als zwart-wit.',
      },
      {
        vraag: 'Voor welke klant is dit product het meest geschikt?',
        opties: [
          'Thuisgebruiker met enkele pagina’s per week',
          'Werkgroep van 15 tot 50 gebruikers',
          'Drukkerij met oplages van duizenden exemplaren',
          'Wie alleen foto’s wil printen',
        ],
        juisteAntwoord: 1,
        uitleg: 'De KX-5500ci is gebouwd voor werkgroepen met een hoog en gevarieerd volume.',
      },
      {
        vraag: 'Hoe kan een gebruiker vertrouwelijke documenten beveiligd printen?',
        opties: ['Met een pincode of kaartlezer', 'Dat kan niet', 'Alleen via fax', 'Met een USB-stick van de leverancier'],
        juisteAntwoord: 0,
        uitleg: 'Beveiligd printen met pincode of kaartlezer houdt documenten in de wachtrij tot de gebruiker zich identificeert.',
      },
      {
        vraag: 'Welk verkoopargument past bij de lange levensduur van onderdelen?',
        opties: ['Hogere aanschafprijs', 'Lagere kosten per pagina', 'Meer papierstoringen', 'Meer energieverbruik'],
        juisteAntwoord: 1,
        uitleg: 'Langdurige onderdelen betekenen minder vervanging en dus lagere kosten per pagina.',
      },
    ],
  },
  {
    id: 'a4-mono-mfp',
    naam: 'KX-MA4500x',
    categorie: 'Multifunctionals',
    korteOmschrijving: 'Compacte A4-zwart-wit-MFP voor kleine teams.',
    omschrijving:
      'De KX-MA4500x is een compacte A4-multifunctional in zwart-wit voor kleine teams en balies. Hij combineert snel printen en scannen met een voordelige toner en een eenvoudige bediening.',
    kenmerken: [
      'Afdruksnelheid tot 45 pagina’s per minuut',
      'Dubbelzijdig printen en scannen standaard',
      'Toner voor tot 20.000 pagina’s',
      'Wifi, Ethernet en mobiel printen',
      'Compacte behuizing van slechts 40 cm breed',
    ],
    doelgroep: 'Kleine kantoren, praktijken, winkels en afdelingen van 3 tot 10 gebruikers.',
    verkoopargumenten: [
      'Voordelige aanschaf en zeer lage afdrukkosten',
      'Past op elk bureau of elke balie',
      'Snelle installatie zonder IT-specialist',
      'Zuinig in stand-by dankzij energiebesparende modus',
    ],
    afbeelding: 'a4-mono-mfp.svg',
    video: DUMMY_VIDEO,
    quiz: [
      {
        vraag: 'Welk kleurenbereik print de KX-MA4500x?',
        opties: ['Volledig kleur', 'Alleen zwart-wit', 'Alleen blauw', 'Alleen grijstinten met rood'],
        juisteAntwoord: 1,
        uitleg: 'De "M" staat voor mono: dit model print uitsluitend in zwart-wit.',
      },
      {
        vraag: 'Hoeveel pagina’s gaat de meegeleverde toner mee?',
        opties: ['Tot 2.000', 'Tot 5.000', 'Tot 20.000', 'Tot 200.000'],
        juisteAntwoord: 2,
        uitleg: 'De toner gaat tot 20.000 pagina’s mee, wat de kosten per pagina laag houdt.',
      },
      {
        vraag: 'Voor welk team is dit model het meest geschikt?',
        opties: ['3 tot 10 gebruikers', '200 gebruikers', 'Een drukkerij', 'Een grafisch ontwerpbureau'],
        juisteAntwoord: 0,
        uitleg: 'De compacte MFP is gemaakt voor kleine teams en balies.',
      },
      {
        vraag: 'Welke aansluiting wordt NIET genoemd bij de KX-MA4500x?',
        opties: ['Wifi', 'Ethernet', 'Mobiel printen', 'Aansluiting op een offsetpers'],
        juisteAntwoord: 3,
        uitleg: 'Aansluiting op een offsetpers hoort niet bij een kantoor-MFP; de overige opties wel.',
      },
      {
        vraag: 'Wat is een sterk verkoopargument voor kleine kantoren?',
        opties: ['Past op elk bureau', 'Vraagt een eigen serverruimte', 'Alleen te gebruiken met speciaal papier', 'Vereist een vaste IT-beheerder'],
        juisteAntwoord: 0,
        uitleg: 'De compacte afmetingen en eenvoudige installatie maken hem ideaal voor kleine kantoren.',
      },
    ],
  },
  {
    id: 'a4-kleuren-laser',
    naam: 'KX-PA3500cx',
    categorie: 'Laserprinters',
    korteOmschrijving: 'A4-kleurenlaserprinter met scherpe afdrukken en lage kosten.',
    omschrijving:
      'De KX-PA3500cx is een betrouwbare A4-kleurenlaserprinter voor kantoren die professioneel ogende documenten willen printen zonder hoge kosten. Hij levert levendige kleuren en scherpe tekst.',
    kenmerken: [
      'Tot 35 pagina’s per minuut in kleur',
      'Resolutie 1200 x 1200 dpi',
      'Automatisch dubbelzijdig printen',
      'Papierlade van 500 vel, uitbreidbaar tot 1.600 vel',
      'Eerste pagina klaar in minder dan 6 seconden',
    ],
    doelgroep: 'Kantoren, scholen en zorginstellingen die veel presentaties, brieven en rapporten in kleur printen.',
    verkoopargumenten: [
      'Professionele kleurkwaliteit tegen een lage prijs per pagina',
      'Betrouwbaar bij hoge volumes',
      'Eenvoudig beheer via webbrowser',
      'Compacte omvang met veel papiercapaciteit',
    ],
    afbeelding: 'a4-kleuren-laser.svg',
    video: DUMMY_VIDEO,
    quiz: [
      {
        vraag: 'Welk type printer is de KX-PA3500cx?',
        opties: ['Inkjetprinter', 'Kleurenlaserprinter', 'Matrixprinter', 'Thermische labelprinter'],
        juisteAntwoord: 1,
        uitleg: 'Het is een A4-kleurenlaserprinter.',
      },
      {
        vraag: 'Wat is de resolutie van de KX-PA3500cx?',
        opties: ['300 dpi', '600 dpi', '1200 x 1200 dpi', '4800 x 4800 dpi'],
        juisteAntwoord: 2,
        uitleg: 'Met 1200 x 1200 dpi levert hij scherpe tekst en gedetailleerde afbeeldingen.',
      },
      {
        vraag: 'Hoeveel vel past er maximaal in de uitgebreide papierhuishouding?',
        opties: ['250', '500', '1.600', '10.000'],
        juisteAntwoord: 2,
        uitleg: 'De standaardlade is 500 vel; uitgebreid kan het tot 1.600 vel.',
      },
      {
        vraag: 'Welke klant past het beste bij dit model?',
        opties: ['Een school die veel kleurendocumenten print', 'Een krantendrukkerij', 'Een architect met A0-tekeningen', 'Iemand die alleen etiketten print'],
        juisteAntwoord: 0,
        uitleg: 'Scholen, kantoren en zorginstellingen met veel kleurendocumenten zijn de kerndoelgroep.',
      },
      {
        vraag: 'Hoe beheert een IT-beheerder dit apparaat gemakkelijk?',
        opties: ['Via een webbrowser', 'Alleen met een speciale kabel', 'Alleen ter plaatse met een sleutel', 'Dat kan niet'],
        juisteAntwoord: 0,
        uitleg: 'Beheer verloopt via de ingebouwde webinterface in de browser.',
      },
    ],
  },
  {
    id: 'a4-mono-laser',
    naam: 'KX-PA5000x',
    categorie: 'Laserprinters',
    korteOmschrijving: 'Snelle en robuuste zwart-wit-laserprinter voor hoge volumes.',
    omschrijving:
      'De KX-PA5000x is een robuuste A4-zwart-wit-laserprinter voor intensief gebruik. Hij is gebouwd om jarenlang betrouwbaar grote hoeveelheden documenten te verwerken tegen minimale kosten.',
    kenmerken: [
      'Tot 50 pagina’s per minuut',
      'Maandcapaciteit tot 200.000 pagina’s',
      'Duplex standaard',
      'Lange levensduur van de trommel',
      'Ondersteunt PDF-direct printen via USB',
    ],
    doelgroep: 'Administratieve afdelingen, call centers en bedrijven met veel standaard zwart-wit-documenten.',
    verkoopargumenten: [
      'Zeer lage kosten per pagina',
      'Bewezen betrouwbaarheid bij hoge volumes',
      'Weinig onderhoud nodig',
      'Ook geschikt voor beveiligd printen in grotere organisaties',
    ],
    afbeelding: 'a4-mono-laser.svg',
    video: DUMMY_VIDEO,
    quiz: [
      {
        vraag: 'Wat is de maximale snelheid van de KX-PA5000x?',
        opties: ['20 ppm', '35 ppm', '50 ppm', '120 ppm'],
        juisteAntwoord: 2,
        uitleg: 'De printer haalt tot 50 pagina’s per minuut.',
      },
      {
        vraag: 'Welke maandcapaciteit heeft hij maximaal?',
        opties: ['Tot 2.000 pagina’s', 'Tot 20.000 pagina’s', 'Tot 200.000 pagina’s', 'Onbeperkt'],
        juisteAntwoord: 2,
        uitleg: 'De maximale maandcapaciteit is 200.000 pagina’s.',
      },
      {
        vraag: 'Welk verkoopargument past het best bij dit model?',
        opties: ['Zeer lage kosten per pagina', 'Fotoprints van galeriekwaliteit', 'Printen op textiel', 'Printen in 3D'],
        juisteAntwoord: 0,
        uitleg: 'Bij hoge volumes zijn lage kosten per pagina het sterkste argument.',
      },
      {
        vraag: 'Voor welke klant is dit het meest geschikt?',
        opties: ['Een call center met veel zwart-wit-documenten', 'Een fotograaf', 'Een thuisgebruiker', 'Een tekenbureau voor posters'],
        juisteAntwoord: 0,
        uitleg: 'Administratieve afdelingen en call centers printen veel standaardwerk in zwart-wit.',
      },
      {
        vraag: 'Hoe kun je direct een PDF printen zonder computer?',
        opties: ['Via een USB-stick', 'Via een cassette', 'Dat kan niet', 'Via een diskette'],
        juisteAntwoord: 0,
        uitleg: 'PDF-direct printen via USB is standaard ondersteund.',
      },
    ],
  },
  {
    id: 'productieprinter',
    naam: 'KX-Pro 15000c',
    categorie: 'Productieprinters',
    korteOmschrijving: 'Kleurenproductieprinter voor drukwerk in eigen beheer.',
    omschrijving:
      'De KX-Pro 15000c is een kleurenproductieprinter voor in-house drukwerk en kleine drukkerijen. Hij levert constante kleurkwaliteit op een groot aantal papiersoorten en formaten, ook op zwaar papier.',
    kenmerken: [
      'Tot 150 pagina’s per minuut',
      'Papiergewicht tot 400 g/m²',
      'Inline afwerking: nieten, vouwen en boekjes maken',
      'Automatische kleurkalibratie',
      'Banners tot 1.260 mm lang',
    ],
    doelgroep: 'Drukkerijen, reprocentra en grote organisaties die brochures, mailings en rapporten zelf produceren.',
    verkoopargumenten: [
      'Eigen drukwerk produceren in plaats van uitbesteden',
      'Constante kleur zonder handmatig bijstellen',
      'Veel afwerkopties in één workflow',
      'Korte doorlooptijd voor kleine oplages',
    ],
    afbeelding: 'productieprinter.svg',
    video: DUMMY_VIDEO,
    quiz: [
      {
        vraag: 'Wat is het zwaarste papier dat de KX-Pro 15000c aankan?',
        opties: ['80 g/m²', '120 g/m²', '250 g/m²', '400 g/m²'],
        juisteAntwoord: 3,
        uitleg: 'Het systeem verwerkt papier tot 400 g/m², handig voor omslagen en kaarten.',
      },
      {
        vraag: 'Welke afwerking kan inline worden toegevoegd?',
        opties: ['Nieten en vouwen', 'Inbinden in leer', 'Lamineren in 3D', 'Geen enkele'],
        juisteAntwoord: 0,
        uitleg: 'Inline afwerking omvat onder meer nieten, vouwen en boekjes maken.',
      },
      {
        vraag: 'Wat is een belangrijk verkoopargument richting een drukkerij?',
        opties: ['Constante kleurkwaliteit via automatische kalibratie', 'Printen op glas', 'Geen onderhoud ooit', 'Werkt alleen met A5'],
        juisteAntwoord: 0,
        uitleg: 'Automatische kleurkalibratie zorgt voor constante kleur zonder handmatige correcties.',
      },
      {
        vraag: 'Wat is de maximale snelheid?',
        opties: ['15 ppm', '50 ppm', '150 ppm', '1.500 ppm'],
        juisteAntwoord: 2,
        uitleg: 'De KX-Pro 15000c print tot 150 pagina’s per minuut.',
      },
      {
        vraag: 'Welke klant past het best bij dit product?',
        opties: ['Een reprocentrum', 'Een eenmanszaak met 2 pagina’s per dag', 'Een thuiswerker', 'Een kiosk met alleen kassabonnen'],
        juisteAntwoord: 0,
        uitleg: 'Reprocentra, drukkerijen en grote organisaties met veel drukwerk zijn de doelgroep.',
      },
    ],
  },
  {
    id: 'grootformaat-printer',
    naam: 'KX-Wide 7000',
    categorie: 'Productieprinters',
    korteOmschrijving: 'Grootformaat printer voor tekeningen en posters.',
    omschrijving:
      'De KX-Wide 7000 is een grootformaatprinter voor technische tekeningen, plattegronden en posters. Hij print tot 36 inch breed met scherpe lijnen en een snelle eerste afdruk.',
    kenmerken: [
      'Printbreedte tot 36 inch (914 mm)',
      'A1-tekening in 25 seconden',
      'Twee rollen met automatische wisseling',
      'Geïntegreerde scanner optioneel',
      'Cloudprinten vanaf laptop en tablet',
    ],
    doelgroep: 'Architecten, ingenieursbureaus, bouwbedrijven en gemeenten die regelmatig grote tekeningen printen.',
    verkoopargumenten: [
      'Scherpe lijnen, ook bij kleine details',
      'Tekeningen direct op de bouwplaats of kantoor',
      'Besparing op uitbesteed plotwerk',
      'Eenvoudig delen vanuit de cloud',
    ],
    afbeelding: 'grootformaat-printer.svg',
    video: DUMMY_VIDEO,
    quiz: [
      {
        vraag: 'Hoe breed kan de KX-Wide 7000 maximaal printen?',
        opties: ['A4', 'A3', '24 inch', '36 inch'],
        juisteAntwoord: 3,
        uitleg: 'De maximale printbreedte is 36 inch (914 mm).',
      },
      {
        vraag: 'Wie is de typische klant?',
        opties: ['Een architectenbureau', 'Een basisschool voor werkbladen', 'Een koffiehuis', 'Een thuisgebruiker'],
        juisteAntwoord: 0,
        uitleg: 'Architecten en ingenieursbureaus printen regelmatig grote tekeningen.',
      },
      {
        vraag: 'Waar dient de optionele geïntegreerde scanner voor?',
        opties: ['Grote tekeningen digitaliseren', 'Foto’s maken van personen', 'Stickers uitprinten', 'Niets'],
        juisteAntwoord: 0,
        uitleg: 'Met de scanner digitaliseer je grote papieren tekeningen.',
      },
      {
        vraag: 'Wat is een belangrijk voordeel van de twee rollen?',
        opties: ['Automatisch wisselen tussen papiersoorten', 'Dubbele energiekosten', 'Alleen kleurprints', 'Minder snelheid'],
        juisteAntwoord: 0,
        uitleg: 'De printer wisselt automatisch tussen rollen, zodat er geen handmatig werk nodig is.',
      },
      {
        vraag: 'Welk argument past bij uitbesteed plotwerk?',
        opties: ['Besparing door zelf printen', 'Hogere kosten', 'Langere levertijd', 'Minder controle'],
        juisteAntwoord: 0,
        uitleg: 'Zelf printen bespaart kosten en levertijd ten opzichte van uitbesteden.',
      },
    ],
  },
  {
    id: 'document-capture',
    naam: 'KX Capture Cloud',
    categorie: 'Documentbeheer',
    korteOmschrijving: 'Software die papieren documenten automatisch digitaliseert en sorteert.',
    omschrijving:
      'KX Capture Cloud scant papieren documenten, herkent de inhoud en stuurt ze automatisch naar de juiste map of het juiste systeem. Zo verdwijnt handmatig sorteren en overtypen.',
    kenmerken: [
      'Tekstherkenning (OCR) in meer dan 40 talen',
      'Automatisch indexeren op basis van inhoud',
      'Koppelingen met veelgebruikte administratiesystemen',
      'Direct scannen vanaf het MFP-scherm',
      'Versleutelde opslag in Europese datacenters',
    ],
    doelgroep: 'Administratieve afdelingen, boekhoudkantoren, gemeenten en zorginstellingen met veel papieren post.',
    verkoopargumenten: [
      'Minder handmatig werk en minder fouten',
      'Documenten sneller terugvinden',
      'Voldoet aan AVG-eisen met Europese opslag',
      'Werkt direct met bestaande Kyocera-MFP’s',
    ],
    afbeelding: 'document-capture.svg',
    video: DUMMY_VIDEO,
    quiz: [
      {
        vraag: 'Wat doet OCR in KX Capture Cloud?',
        opties: ['Herkent tekst in gescande documenten', 'Print documenten sneller', 'Verwijdert virussen', 'Maakt papier'],
        juisteAntwoord: 0,
        uitleg: 'OCR (optical character recognition) zet gescande beelden om in doorzoekbare tekst.',
      },
      {
        vraag: 'Waar worden documenten opgeslagen?',
        opties: ['In Europese datacenters', 'Op een USB-stick', 'Op het MFP zelf, onversleuteld', 'Nergens'],
        juisteAntwoord: 0,
        uitleg: 'Opslag gebeurt versleuteld in Europese datacenters, wat helpt bij AVG-naleving.',
      },
      {
        vraag: 'Welke klant heeft het meeste baat bij deze software?',
        opties: ['Een boekhoudkantoor met veel papieren post', 'Een fotograaf', 'Een tuincentrum zonder administratie', 'Een bakkerij'],
        juisteAntwoord: 0,
        uitleg: 'Organisaties met veel papieren post halen de meeste winst uit automatisch indexeren.',
      },
      {
        vraag: 'Hoe start een gebruiker een scan?',
        opties: ['Direct op het MFP-scherm', 'Alleen via fax', 'Alleen via een speciale scanner van een ander merk', 'Dat kan niet'],
        juisteAntwoord: 0,
        uitleg: 'Scannen kan direct vanaf het scherm van een Kyocera-MFP.',
      },
      {
        vraag: 'Wat is een belangrijk verkoopargument?',
        opties: ['Minder handmatig werk en minder fouten', 'Meer papier nodig', 'Langere zoektijd', 'Hogere printkosten'],
        juisteAntwoord: 0,
        uitleg: 'Automatisch sorteren en indexeren bespaart tijd en voorkomt typefouten.',
      },
    ],
  },
  {
    id: 'fleet-manager',
    naam: 'KX Fleet Manager',
    categorie: 'Documentbeheer',
    korteOmschrijving: 'Beheer en monitor al je printers en MFP’s vanuit één dashboard.',
    omschrijving:
      'KX Fleet Manager geeft IT-beheerders één overzicht van alle printers en MFP’s in de organisatie: status, tonerniveau, gebruik en kosten. Storingen worden vroegtijdig gemeld en toner kan automatisch worden nabesteld.',
    kenmerken: [
      'Eén dashboard voor alle apparaten, ook op meerdere locaties',
      'Automatische meldingen bij storing of lage toner',
      'Rapportage op gebruik en kosten per afdeling',
      'Beleid centraal instellen, zoals standaard dubbelzijdig',
      'Werkt met apparaten van verschillende merken',
    ],
    doelgroep: 'IT-afdelingen en facilitair managers van organisaties met meerdere printers en locaties.',
    verkoopargumenten: [
      'Inzicht in en controle over printkosten',
      'Minder storingen en minder bezoeken van de servicemonteur',
      'Minder werk voor de IT-afdeling',
      'Duurzamer printen door gericht beleid',
    ],
    afbeelding: 'fleet-manager.svg',
    video: DUMMY_VIDEO,
    quiz: [
      {
        vraag: 'Wat toont het dashboard van KX Fleet Manager?',
        opties: ['Status, tonerniveau, gebruik en kosten', 'Alleen het weer', 'Alleen de papiersoort', 'Niets'],
        juisteAntwoord: 0,
        uitleg: 'Het dashboard geeft een totaaloverzicht van status, toner, gebruik en kosten.',
      },
      {
        vraag: 'Wat gebeurt er bij lage toner?',
        opties: ['Er komt een automatische melding', 'De printer stopt zonder melding', 'Niets', 'De printer wordt verwijderd'],
        juisteAntwoord: 0,
        uitleg: 'Meldingen bij lage toner of storing voorkomen onverwachte stilstand.',
      },
      {
        vraag: 'Voor wie is deze software vooral bedoeld?',
        opties: ['IT-afdelingen met meerdere printers', 'Thuisgebruikers met één printer', 'Fotografen', 'Studenten'],
        juisteAntwoord: 0,
        uitleg: 'Het product is ontworpen voor organisaties met meerdere apparaten en locaties.',
      },
      {
        vraag: 'Met welke apparaten werkt KX Fleet Manager?',
        opties: ['Ook met andere merken', 'Alleen met één modelnummer', 'Alleen met faxen', 'Alleen met kopieerpapier'],
        juisteAntwoord: 0,
        uitleg: 'De software ondersteunt apparaten van verschillende merken in één omgeving.',
      },
      {
        vraag: 'Welk argument past bij facilitair managers?',
        opties: ['Inzicht in en controle over printkosten', 'Meer papier gebruiken', 'Hogere energiekosten', 'Minder overzicht'],
        juisteAntwoord: 0,
        uitleg: 'Rapportage per afdeling geeft facilitair managers grip op de kosten.',
      },
    ],
  },
]

export const getProduct = (id: string | undefined): Product | undefined =>
  products.find((p) => p.id === id)

export const categories: string[] = Array.from(new Set(products.map((p) => p.categorie)))
