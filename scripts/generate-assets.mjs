/**
 * Génère les icônes et l'image de partage (Open Graph) du site.
 * Usage : npm run assets
 *
 * Fichiers produits :
 *  - app/icon.svg          favicon vectoriel (navigateurs modernes)
 *  - app/favicon.ico       favicon classique
 *  - app/apple-icon.png    icône iPhone / iPad (180×180)
 *  - public/logo.png       logo carré 512×512 (Google, données structurées)
 *  - public/og-image.jpg   image de partage WhatsApp / Facebook / TikTok (1200×630)
 *
 * Pour changer la photo de l'image de partage, remplacez public/images/hero-cargo.webp puis relancez.
 */
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const MAPLE =
  'M12 1.5l1.6 3.3 1.8-.9-.5 4.7 2.7-2.4.7 1.6 2.9-.6-1 3.1 1.5.9-4.9 4.1.6 1.8-4.8-.7V22h-1.2v-5.6l-4.8.7.6-1.8-4.9-4.1 1.5-.9-1-3.1 2.9.6.7-1.6 2.7 2.4-.5-4.7 1.8.9z';
const STAR = 'M0 -1L.235 -.324L.951 -.309L.38 .124L.588 .809L0 .4L-.588 .809L-.38 .124L-.951 -.309L-.235 -.324Z';

// Emblème : feuille d'érable reliée à une étoile, sur fond doré (identique au composant Logo)
const mark = (rx = 12) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E2C25A"/><stop offset="1" stop-color="#B38D1A"/></linearGradient></defs>
  <rect width="48" height="48" rx="${rx}" fill="url(#g)"/>
  <path d="M15 30.5C19 19 27 14.5 34.5 14" fill="none" stroke="#0B1F3A" stroke-width="2" stroke-linecap="round" stroke-dasharray="0.1 4"/>
  <path d="${MAPLE}" transform="translate(4.5 24.5) scale(0.72)" fill="#0B1F3A"/>
  <path d="${STAR}" transform="translate(36 13.5) scale(7.2)" fill="#0B1F3A"/>
</svg>`;

/** Fichier .ico contenant une image PNG (format accepté par tous les navigateurs). */
function pngToIco(png, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(size >= 256 ? 0 : size, 6);
  header.writeUInt8(size >= 256 ? 0 : size, 7);
  header.writeUInt8(0, 8);
  header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  return Buffer.concat([header, png]);
}

writeFileSync('app/icon.svg', mark());
const png48 = await sharp(Buffer.from(mark())).resize(48, 48).png().toBuffer();
writeFileSync('app/favicon.ico', pngToIco(png48, 48));
await sharp(Buffer.from(mark(0))).resize(180, 180).png().toFile('app/apple-icon.png');
await sharp(Buffer.from(mark())).resize(512, 512).png().toFile('public/logo.png');

// Image Open Graph 1200×630 : photo + voile bleu nuit + logo + accroche
const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="v" x1="0" x2="1"><stop offset="0" stop-color="#06132A" stop-opacity="0.97"/><stop offset="0.65" stop-color="#0B1F3A" stop-opacity="0.82"/><stop offset="1" stop-color="#0B1F3A" stop-opacity="0.35"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#v)"/>
  <rect x="0" y="622" width="1200" height="8" fill="#C9A227"/>
  <text x="170" y="122" font-family="Montserrat, Segoe UI, Arial, sans-serif" font-weight="800" font-size="40" letter-spacing="3" fill="#FFFFFF">AL MACTOUM</text>
  <text x="172" y="152" font-family="Montserrat, Segoe UI, Arial, sans-serif" font-weight="700" font-size="16" letter-spacing="6" fill="#C9A227">BUSINESS AUTOMOBILE</text>
  <text x="80" y="285" font-family="Montserrat, Segoe UI, Arial, sans-serif" font-weight="800" font-size="58" fill="#FFFFFF">Votre voiture du Canada</text>
  <text x="80" y="355" font-family="Montserrat, Segoe UI, Arial, sans-serif" font-weight="800" font-size="58" fill="#FFFFFF">livrée à Dakar</text>
  <text x="80" y="425" font-family="Segoe UI, Arial, sans-serif" font-size="30" fill="#E2E8F0">Payez 60 % à la commande, 40 % à l'arrivée.</text>
  <rect x="80" y="475" width="430" height="58" rx="29" fill="#C9A227"/>
  <text x="295" y="513" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="24" fill="#06132A">Wave · Orange Money · Cash</text>
</svg>`;
const logo = await sharp(Buffer.from(mark())).resize(72, 72).png().toBuffer();
await sharp('public/images/hero-cargo.webp')
  .resize(1200, 630, { fit: 'cover', position: 'right' })
  .composite([
    { input: Buffer.from(overlay), top: 0, left: 0 },
    { input: logo, top: 84, left: 80 },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/og-image.jpg');

console.log('Icônes et image Open Graph générées.');
