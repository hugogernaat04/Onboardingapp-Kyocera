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
 * Talen: de hoofdtekst staat in het Nederlands. Elk product heeft een blok `en`
 * met de Engelse vertaling van alle teksten (zelfde volgorde bij kenmerken,
 * opties en vragen; `juisteAntwoord` wordt van het Nederlandse origineel overgenomen).
 * Ontbreekt `en`, dan toont de site voor dat product de Nederlandse tekst.
 * Een taal toevoegen: zie ook src/i18n/translations.ts.
 *
 * Alle productnamen en -teksten hieronder zijn fictieve placeholders.
 */

export const talen = ['nl', 'en'] as const
export type Taal = (typeof talen)[number]

export interface QuizQuestion {
  vraag: string
  /** Precies 4 antwoordopties */
  opties: string[]
  /** Index (0-3) van de juiste optie */
  juisteAntwoord: number
  uitleg: string
}

/** Vertaalbare tekst van één quizvraag (het juiste antwoord staat bij de Nederlandse vraag). */
export interface QuizQuestionText {
  vraag: string
  opties: string[]
  uitleg: string
}

export interface ProductTranslation {
  categorie: string
  korteOmschrijving: string
  omschrijving: string
  kenmerken: string[]
  doelgroep: string
  verkoopargumenten: string[]
  quiz: QuizQuestionText[]
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
  /** Engelse vertaling van alle teksten hierboven */
  en?: ProductTranslation
}

/** Een product in één taal, klaar om te tonen. `categorieId` is de vaste (Nederlandse) sleutel voor het filter. */
export type LocalizedProduct = Omit<Product, 'en'> & { categorieId: string }

export function localizeProduct(product: Product, taal: Taal): LocalizedProduct {
  const { en, ...base } = product
  const tekst = taal === 'en' ? en : undefined
  if (!tekst) return { ...base, categorieId: product.categorie }
  return {
    ...base,
    ...tekst,
    categorieId: product.categorie,
    quiz: product.quiz.map((q, i) => ({ ...q, ...tekst.quiz[i] })),
  }
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
    en: {
      "categorie": "Multifunctionals",
      "korteOmschrijving": "Fast A3 colour MFP for busy workgroups.",
      "omschrijving": "The KX-5500ci is an A3 colour multifunctional that combines printing, copying, scanning and faxing in one compact system. Thanks to the large touchscreen and fast processing, it is designed for workgroups that handle many documents every day.",
      "kenmerken": [
        "Print speed of up to 55 pages per minute in colour and black and white",
        "10.1-inch touchscreen with app-like operation",
        "Duplex and dual-sided automatic document feeder as standard",
        "Paper capacity expandable to 7,150 sheets",
        "Secure printing with PIN code and card reader"
      ],
      "doelgroep": "Medium to large offices, departments and workgroups of 15 to 50 users with a high and varied print volume.",
      "verkoopargumenten": [
        "Low total cost per page thanks to long-life parts",
        "Less downtime thanks to the long life of the drum and developer",
        "Easy to connect to existing document workflows",
        "Strong security for sensitive documents"
      ],
      "quiz": [
        {
          "vraag": "Which paper size does the KX-5500ci handle?",
          "opties": [
            "A4 only",
            "A3 and smaller",
            "A5 only",
            "Paper rolls only"
          ],
          "uitleg": "It is an A3 system and therefore also handles A4 and smaller sizes."
        },
        {
          "vraag": "What is the maximum print speed of the KX-5500ci?",
          "opties": [
            "25 ppm",
            "40 ppm",
            "55 ppm",
            "90 ppm"
          ],
          "uitleg": "The KX-5500ci prints up to 55 pages per minute, in both colour and black and white."
        },
        {
          "vraag": "Which customer is this product best suited for?",
          "opties": [
            "Home user with a few pages a week",
            "Workgroup of 15 to 50 users",
            "Print shop with runs of thousands of copies",
            "Anyone who only wants to print photos"
          ],
          "uitleg": "The KX-5500ci is built for workgroups with a high and varied volume."
        },
        {
          "vraag": "How can a user print confidential documents securely?",
          "opties": [
            "With a PIN code or card reader",
            "That is not possible",
            "Only by fax",
            "With a USB stick from the supplier"
          ],
          "uitleg": "Secure printing with a PIN code or card reader holds documents in the queue until the user identifies themselves."
        },
        {
          "vraag": "Which selling point fits the long life of the parts?",
          "opties": [
            "Higher purchase price",
            "Lower cost per page",
            "More paper jams",
            "Higher energy use"
          ],
          "uitleg": "Long-life parts mean fewer replacements and therefore a lower cost per page."
        }
      ]
    },
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
    en: {
      "categorie": "Multifunctionals",
      "korteOmschrijving": "Compact A4 black-and-white MFP for small teams.",
      "omschrijving": "The KX-MA4500x is a compact A4 black-and-white multifunctional for small teams and front desks. It combines fast printing and scanning with affordable toner and simple operation.",
      "kenmerken": [
        "Print speed of up to 45 pages per minute",
        "Duplex printing and scanning as standard",
        "Toner for up to 20,000 pages",
        "Wi-Fi, Ethernet and mobile printing",
        "Compact housing only 40 cm wide"
      ],
      "doelgroep": "Small offices, practices, shops and departments of 3 to 10 users.",
      "verkoopargumenten": [
        "Affordable to buy and very low running costs",
        "Fits on any desk or front desk",
        "Quick setup without an IT specialist",
        "Economical on standby thanks to energy-saving mode"
      ],
      "quiz": [
        {
          "vraag": "Which colour range does the KX-MA4500x print?",
          "opties": [
            "Full colour",
            "Black and white only",
            "Blue only",
            "Greyscale with red only"
          ],
          "uitleg": "The \"M\" stands for mono: this model prints in black and white only."
        },
        {
          "vraag": "How many pages does the supplied toner last?",
          "opties": [
            "Up to 2,000",
            "Up to 5,000",
            "Up to 20,000",
            "Up to 200,000"
          ],
          "uitleg": "The toner lasts up to 20,000 pages, which keeps the cost per page low."
        },
        {
          "vraag": "Which team is this model best suited for?",
          "opties": [
            "3 to 10 users",
            "200 users",
            "A print shop",
            "A graphic design agency"
          ],
          "uitleg": "The compact MFP is made for small teams and front desks."
        },
        {
          "vraag": "Which connection is NOT mentioned for the KX-MA4500x?",
          "opties": [
            "Wi-Fi",
            "Ethernet",
            "Mobile printing",
            "Connection to an offset press"
          ],
          "uitleg": "Connecting to an offset press does not belong with an office MFP; the other options do."
        },
        {
          "vraag": "What is a strong selling point for small offices?",
          "opties": [
            "Fits on any desk",
            "Needs its own server room",
            "Only works with special paper",
            "Requires a dedicated IT administrator"
          ],
          "uitleg": "The compact size and simple installation make it ideal for small offices."
        }
      ]
    },
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
    en: {
      "categorie": "Laser printers",
      "korteOmschrijving": "A4 colour laser printer with sharp output and low costs.",
      "omschrijving": "The KX-PA3500cx is a reliable A4 colour laser printer for offices that want professional-looking documents without high costs. It delivers vivid colours and sharp text.",
      "kenmerken": [
        "Up to 35 pages per minute in colour",
        "Resolution 1200 x 1200 dpi",
        "Automatic duplex printing",
        "500-sheet paper tray, expandable to 1,600 sheets",
        "First page ready in under 6 seconds"
      ],
      "doelgroep": "Offices, schools and healthcare organisations that print many presentations, letters and reports in colour.",
      "verkoopargumenten": [
        "Professional colour quality at a low price per page",
        "Reliable at high volumes",
        "Easy management via a web browser",
        "Compact size with plenty of paper capacity"
      ],
      "quiz": [
        {
          "vraag": "What type of printer is the KX-PA3500cx?",
          "opties": [
            "Inkjet printer",
            "Colour laser printer",
            "Dot matrix printer",
            "Thermal label printer"
          ],
          "uitleg": "It is an A4 colour laser printer."
        },
        {
          "vraag": "What is the resolution of the KX-PA3500cx?",
          "opties": [
            "300 dpi",
            "600 dpi",
            "1200 x 1200 dpi",
            "4800 x 4800 dpi"
          ],
          "uitleg": "At 1200 x 1200 dpi it delivers sharp text and detailed images."
        },
        {
          "vraag": "How many sheets fit in the expanded paper capacity?",
          "opties": [
            "250",
            "500",
            "1,600",
            "10,000"
          ],
          "uitleg": "The standard tray holds 500 sheets; expanded it can reach 1,600 sheets."
        },
        {
          "vraag": "Which customer fits this model best?",
          "opties": [
            "A school that prints many colour documents",
            "A newspaper printer",
            "An architect with A0 drawings",
            "Someone who only prints labels"
          ],
          "uitleg": "Schools, offices and healthcare organisations with many colour documents are the core target group."
        },
        {
          "vraag": "How does an IT administrator manage this device easily?",
          "opties": [
            "Via a web browser",
            "Only with a special cable",
            "Only on site with a key",
            "That is not possible"
          ],
          "uitleg": "Management runs through the built-in web interface in the browser."
        }
      ]
    },
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
    en: {
      "categorie": "Laser printers",
      "korteOmschrijving": "Fast and robust black-and-white laser printer for high volumes.",
      "omschrijving": "The KX-PA5000x is a robust A4 black-and-white laser printer for intensive use. It is built to reliably process large quantities of documents for years at minimal cost.",
      "kenmerken": [
        "Up to 50 pages per minute",
        "Monthly capacity of up to 200,000 pages",
        "Duplex as standard",
        "Long drum life",
        "Supports direct PDF printing via USB"
      ],
      "doelgroep": "Administrative departments, call centres and companies with many standard black-and-white documents.",
      "verkoopargumenten": [
        "Very low cost per page",
        "Proven reliability at high volumes",
        "Little maintenance needed",
        "Also suited for secure printing in larger organisations"
      ],
      "quiz": [
        {
          "vraag": "What is the maximum speed of the KX-PA5000x?",
          "opties": [
            "20 ppm",
            "35 ppm",
            "50 ppm",
            "120 ppm"
          ],
          "uitleg": "The printer reaches up to 50 pages per minute."
        },
        {
          "vraag": "What is its maximum monthly capacity?",
          "opties": [
            "Up to 2,000 pages",
            "Up to 20,000 pages",
            "Up to 200,000 pages",
            "Unlimited"
          ],
          "uitleg": "The maximum monthly capacity is 200,000 pages."
        },
        {
          "vraag": "Which selling point fits this model best?",
          "opties": [
            "Very low cost per page",
            "Gallery-quality photo prints",
            "Printing on textiles",
            "3D printing"
          ],
          "uitleg": "At high volumes, a low cost per page is the strongest argument."
        },
        {
          "vraag": "Which customer is this most suitable for?",
          "opties": [
            "A call centre with many black-and-white documents",
            "A photographer",
            "A home user",
            "A poster design studio"
          ],
          "uitleg": "Administrative departments and call centres print a lot of standard work in black and white."
        },
        {
          "vraag": "How can you print a PDF directly without a computer?",
          "opties": [
            "Via a USB stick",
            "Via a cassette",
            "That is not possible",
            "Via a floppy disk"
          ],
          "uitleg": "Direct PDF printing via USB is supported as standard."
        }
      ]
    },
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
    en: {
      "categorie": "Production printers",
      "korteOmschrijving": "Colour production printer for in-house print work.",
      "omschrijving": "The KX-Pro 15000c is a colour production printer for in-house print work and small print shops. It delivers consistent colour quality on a wide range of paper types and sizes, including heavy paper.",
      "kenmerken": [
        "Up to 150 pages per minute",
        "Paper weight up to 400 g/m²",
        "Inline finishing: stapling, folding and booklet making",
        "Automatic colour calibration",
        "Banners up to 1,260 mm long"
      ],
      "doelgroep": "Print shops, reprographic centres and large organisations that produce brochures, mailings and reports themselves.",
      "verkoopargumenten": [
        "Produce print work yourself instead of outsourcing",
        "Consistent colour without manual adjustment",
        "Many finishing options in one workflow",
        "Short turnaround for small runs"
      ],
      "quiz": [
        {
          "vraag": "What is the heaviest paper the KX-Pro 15000c can handle?",
          "opties": [
            "80 g/m²",
            "120 g/m²",
            "250 g/m²",
            "400 g/m²"
          ],
          "uitleg": "The system handles paper up to 400 g/m², useful for covers and cards."
        },
        {
          "vraag": "Which finishing can be added inline?",
          "opties": [
            "Stapling and folding",
            "Leather binding",
            "3D lamination",
            "None"
          ],
          "uitleg": "Inline finishing includes stapling, folding and booklet making."
        },
        {
          "vraag": "What is an important selling point towards a print shop?",
          "opties": [
            "Consistent colour quality through automatic calibration",
            "Printing on glass",
            "Never needs maintenance",
            "Only works with A5"
          ],
          "uitleg": "Automatic colour calibration ensures consistent colour without manual corrections."
        },
        {
          "vraag": "What is the maximum speed?",
          "opties": [
            "15 ppm",
            "50 ppm",
            "150 ppm",
            "1,500 ppm"
          ],
          "uitleg": "The KX-Pro 15000c prints up to 150 pages per minute."
        },
        {
          "vraag": "Which customer fits this product best?",
          "opties": [
            "A reprographic centre",
            "A sole trader with 2 pages a day",
            "A home worker",
            "A kiosk that only prints receipts"
          ],
          "uitleg": "Reprographic centres, print shops and large organisations with a lot of print work are the target group."
        }
      ]
    },
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
    en: {
      "categorie": "Production printers",
      "korteOmschrijving": "Large-format printer for drawings and posters.",
      "omschrijving": "The KX-Wide 7000 is a large-format printer for technical drawings, floor plans and posters. It prints up to 36 inches wide with sharp lines and a fast first print.",
      "kenmerken": [
        "Print width up to 36 inches (914 mm)",
        "A1 drawing in 25 seconds",
        "Two rolls with automatic switching",
        "Integrated scanner optional",
        "Cloud printing from laptop and tablet"
      ],
      "doelgroep": "Architects, engineering firms, construction companies and municipalities that regularly print large drawings.",
      "verkoopargumenten": [
        "Sharp lines, even in small details",
        "Drawings straight at the building site or office",
        "Savings on outsourced plotting",
        "Easy sharing from the cloud"
      ],
      "quiz": [
        {
          "vraag": "How wide can the KX-Wide 7000 print at most?",
          "opties": [
            "A4",
            "A3",
            "24 inch",
            "36 inch"
          ],
          "uitleg": "The maximum print width is 36 inches (914 mm)."
        },
        {
          "vraag": "Who is the typical customer?",
          "opties": [
            "An architecture firm",
            "A primary school for worksheets",
            "A coffee shop",
            "A home user"
          ],
          "uitleg": "Architects and engineering firms regularly print large drawings."
        },
        {
          "vraag": "What is the optional integrated scanner for?",
          "opties": [
            "Digitising large drawings",
            "Taking photos of people",
            "Printing stickers",
            "Nothing"
          ],
          "uitleg": "With the scanner you digitise large paper drawings."
        },
        {
          "vraag": "What is an important advantage of the two rolls?",
          "opties": [
            "Automatic switching between paper types",
            "Double energy costs",
            "Colour prints only",
            "Less speed"
          ],
          "uitleg": "The printer switches automatically between rolls, so no manual work is needed."
        },
        {
          "vraag": "Which argument fits outsourced plotting?",
          "opties": [
            "Savings by printing in-house",
            "Higher costs",
            "Longer delivery time",
            "Less control"
          ],
          "uitleg": "Printing in-house saves costs and delivery time compared with outsourcing."
        }
      ]
    },
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
    en: {
      "categorie": "Document management",
      "korteOmschrijving": "Software that automatically digitises and sorts paper documents.",
      "omschrijving": "KX Capture Cloud scans paper documents, recognises their content and automatically sends them to the right folder or system. This removes manual sorting and retyping.",
      "kenmerken": [
        "Text recognition (OCR) in more than 40 languages",
        "Automatic indexing based on content",
        "Integrations with common accounting systems",
        "Scan directly from the MFP screen",
        "Encrypted storage in European data centres"
      ],
      "doelgroep": "Administrative departments, accounting firms, municipalities and healthcare organisations with a lot of paper mail.",
      "verkoopargumenten": [
        "Less manual work and fewer errors",
        "Find documents faster",
        "Meets GDPR requirements with European storage",
        "Works directly with existing Kyocera MFPs"
      ],
      "quiz": [
        {
          "vraag": "What does OCR do in KX Capture Cloud?",
          "opties": [
            "Recognises text in scanned documents",
            "Prints documents faster",
            "Removes viruses",
            "Makes paper"
          ],
          "uitleg": "OCR (optical character recognition) converts scanned images into searchable text."
        },
        {
          "vraag": "Where are documents stored?",
          "opties": [
            "In European data centres",
            "On a USB stick",
            "On the MFP itself, unencrypted",
            "Nowhere"
          ],
          "uitleg": "Storage is encrypted in European data centres, which helps with GDPR compliance."
        },
        {
          "vraag": "Which customer benefits most from this software?",
          "opties": [
            "An accounting firm with a lot of paper mail",
            "A photographer",
            "A garden centre without administration",
            "A bakery"
          ],
          "uitleg": "Organisations with a lot of paper mail gain the most from automatic indexing."
        },
        {
          "vraag": "How does a user start a scan?",
          "opties": [
            "Directly on the MFP screen",
            "Only by fax",
            "Only via a special scanner from another brand",
            "That is not possible"
          ],
          "uitleg": "Scanning can be done directly from the screen of a Kyocera MFP."
        },
        {
          "vraag": "What is an important selling point?",
          "opties": [
            "Less manual work and fewer errors",
            "More paper needed",
            "Longer search time",
            "Higher printing costs"
          ],
          "uitleg": "Automatic sorting and indexing saves time and prevents typing errors."
        }
      ]
    },
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
    en: {
      "categorie": "Document management",
      "korteOmschrijving": "Manage and monitor all your printers and MFPs from one dashboard.",
      "omschrijving": "KX Fleet Manager gives IT administrators a single overview of all printers and MFPs in the organisation: status, toner level, usage and costs. Faults are reported early and toner can be reordered automatically.",
      "kenmerken": [
        "One dashboard for all devices, across multiple locations",
        "Automatic alerts for faults or low toner",
        "Reporting on usage and costs per department",
        "Set policy centrally, such as duplex by default",
        "Works with devices from different brands"
      ],
      "doelgroep": "IT departments and facility managers of organisations with multiple printers and locations.",
      "verkoopargumenten": [
        "Insight into and control over print costs",
        "Fewer faults and fewer service technician visits",
        "Less work for the IT department",
        "More sustainable printing through targeted policy"
      ],
      "quiz": [
        {
          "vraag": "What does the KX Fleet Manager dashboard show?",
          "opties": [
            "Status, toner level, usage and costs",
            "Only the weather",
            "Only the paper type",
            "Nothing"
          ],
          "uitleg": "The dashboard gives a complete overview of status, toner, usage and costs."
        },
        {
          "vraag": "What happens when toner is low?",
          "opties": [
            "An automatic alert is sent",
            "The printer stops without notice",
            "Nothing",
            "The printer is removed"
          ],
          "uitleg": "Alerts for low toner or faults prevent unexpected downtime."
        },
        {
          "vraag": "Who is this software mainly intended for?",
          "opties": [
            "IT departments with multiple printers",
            "Home users with one printer",
            "Photographers",
            "Students"
          ],
          "uitleg": "The product is designed for organisations with multiple devices and locations."
        },
        {
          "vraag": "Which devices does KX Fleet Manager work with?",
          "opties": [
            "Other brands too",
            "Only one model number",
            "Only fax machines",
            "Only copy paper"
          ],
          "uitleg": "The software supports devices from different brands in one environment."
        },
        {
          "vraag": "Which argument fits facility managers?",
          "opties": [
            "Insight into and control over print costs",
            "Using more paper",
            "Higher energy costs",
            "Less overview"
          ],
          "uitleg": "Reporting per department gives facility managers a grip on costs."
        }
      ]
    },
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

/** Alle categorieën in de oorspronkelijke (Nederlandse) schrijfwijze. */
export const categories: string[] = Array.from(new Set(products.map((p) => p.categorie)))
