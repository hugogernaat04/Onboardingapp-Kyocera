// Genereert de placeholder-SVG's in public/images/. Draai: node scripts/generate-images.mjs
import { writeFileSync } from 'node:fs'

const RED = '#E31A2F'
const W = 800
const H = 600

const frame = (name, _cat, art) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${name}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7F7F8"/><stop offset="1" stop-color="#E3E3E5"/></linearGradient>
    <linearGradient id="body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D9D9DC"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="0" y="0" width="14" height="${H}" fill="${RED}"/>
  <ellipse cx="420" cy="470" rx="250" ry="22" fill="#111" opacity=".12"/>
  ${art}
  <text x="56" y="96" font-family="Barlow Semi Condensed, Arial, sans-serif" font-size="48" font-weight="700" fill="#111">${name}</text>
</svg>
`

const box = (x, y, w, h, fill = 'url(#body)', r = 10) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="#B9B9BD" stroke-width="2"/>`
const screen = (x, y, w, h) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="#111"/><rect x="${x + 6}" y="${y + 6}" width="${w * 0.4}" height="${h - 12}" rx="3" fill="${RED}"/>`
const paper = (x, y, w) => `<rect x="${x}" y="${y}" width="${w}" height="14" fill="#fff" stroke="#B9B9BD" stroke-width="2"/>`

const mfp = (big) => `
  ${paper(300, 190, 220)}
  ${box(230, 215, 380, 70)}
  ${screen(250, 232, 110, 36)}
  ${box(210, 285, 420, big ? 170 : 150)}
  <rect x="235" y="${big ? 420 : 400}" width="370" height="6" fill="#B9B9BD"/>
  <rect x="235" y="${big ? 438 : 418}" width="370" height="6" fill="#B9B9BD"/>
  <rect x="560" y="305" width="48" height="10" rx="5" fill="${RED}"/>
  ${paper(350, 330, 130)}`

const printer = () => `
  ${paper(310, 195, 200)}
  ${box(220, 220, 400, 230)}
  <rect x="245" y="245" width="350" height="70" rx="6" fill="#111"/>
  <rect x="260" y="262" width="80" height="36" rx="4" fill="${RED}"/>
  <rect x="245" y="380" width="350" height="50" rx="6" fill="#ECECEE" stroke="#B9B9BD" stroke-width="2"/>
  ${paper(300, 340, 240)}`

const production = () => `
  ${box(150, 210, 250, 245)}
  ${box(400, 240, 260, 215)}
  ${screen(180, 235, 120, 40)}
  <rect x="425" y="265" width="210" height="14" rx="7" fill="${RED}"/>
  <rect x="425" y="300" width="210" height="8" rx="4" fill="#B9B9BD"/>
  <rect x="425" y="320" width="210" height="8" rx="4" fill="#B9B9BD"/>
  ${paper(560, 440, 120)}
  <rect x="180" y="300" width="190" height="130" rx="6" fill="#ECECEE" stroke="#B9B9BD" stroke-width="2"/>`

const wide = () => `
  <rect x="170" y="200" width="480" height="40" rx="20" fill="#3A3A3C"/>
  <circle cx="190" cy="220" r="34" fill="#fff" stroke="#B9B9BD" stroke-width="2"/>
  ${box(170, 240, 480, 90)}
  <rect x="200" y="262" width="150" height="26" rx="4" fill="${RED}"/>
  <rect x="190" y="330" width="440" height="110" fill="#fff" stroke="#B9B9BD" stroke-width="2"/>
  <path d="M215 360h390M215 385h300M215 410h350" stroke="#B9B9BD" stroke-width="3"/>
  <path d="M215 360h110" stroke="${RED}" stroke-width="3"/>`

const windowChrome = `
  ${box(190, 190, 440, 270, '#fff', 14)}
  <rect x="190" y="190" width="440" height="40" rx="14" fill="#111"/>
  <circle cx="214" cy="210" r="6" fill="${RED}"/><circle cx="236" cy="210" r="6" fill="#B9B9BD"/><circle cx="258" cy="210" r="6" fill="#B9B9BD"/>`

const capture = () => `${windowChrome}
  <rect x="215" y="255" width="150" height="180" rx="6" fill="#F3F3F4" stroke="#B9B9BD" stroke-width="2"/>
  <path d="M232 280h116M232 302h90M232 324h116M232 346h70" stroke="#8A8A8E" stroke-width="5" stroke-linecap="round"/>
  <path d="M390 345h60" stroke="${RED}" stroke-width="6" stroke-linecap="round"/><path d="M440 330l16 15-16 15" fill="none" stroke="${RED}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="480" y="255" width="125" height="52" rx="6" fill="${RED}"/><rect x="480" y="319" width="125" height="52" rx="6" fill="#E3E3E5"/><rect x="480" y="383" width="125" height="52" rx="6" fill="#E3E3E5"/>`

const fleet = () => `${windowChrome}
  <rect x="215" y="255" width="120" height="75" rx="6" fill="#F3F3F4" stroke="#B9B9BD" stroke-width="2"/>
  <rect x="350" y="255" width="120" height="75" rx="6" fill="#F3F3F4" stroke="#B9B9BD" stroke-width="2"/>
  <rect x="485" y="255" width="120" height="75" rx="6" fill="${RED}"/>
  <path d="M215 430l60-50 50 25 70-70 60 30 80-55" fill="none" stroke="${RED}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="230" y="270" width="70" height="8" rx="4" fill="#8A8A8E"/><rect x="365" y="270" width="70" height="8" rx="4" fill="#8A8A8E"/><rect x="500" y="270" width="70" height="8" rx="4" fill="#fff"/>`

const items = [
  ['a3-kleuren-mfp', 'KX-5500ci', 'Multifunctionals', mfp(true)],
  ['a4-mono-mfp', 'KX-MA4500x', 'Multifunctionals', mfp(false)],
  ['a4-kleuren-laser', 'KX-PA3500cx', 'Laserprinters', printer()],
  ['a4-mono-laser', 'KX-PA5000x', 'Laserprinters', printer()],
  ['productieprinter', 'KX-Pro 15000c', 'Productieprinters', production()],
  ['grootformaat-printer', 'KX-Wide 7000', 'Productieprinters', wide()],
  ['document-capture', 'KX Capture Cloud', 'Documentbeheer', capture()],
  ['fleet-manager', 'KX Fleet Manager', 'Documentbeheer', fleet()],
]
for (const [id, name, cat, art] of items) {
  writeFileSync(new URL(`../public/images/${id}.svg`, import.meta.url), frame(name, cat, art))
}
console.log(`${items.length} afbeeldingen geschreven`)
