/**
 * Génère les icônes et l'image de partage (Open Graph) du site à partir du logo officiel.
 * Usage : npm run assets
 *
 * Sources :
 *  - public/brand/logo-al-mactoum.png   logo carré officiel
 *  - public/brand/logo-horizontal.png   logo horizontal à fond transparent
 *  - public/images/hero-cargo.webp      photo de fond de l'image de partage
 *
 * Fichiers produits :
 *  - app/icon.png          icône d'onglet (192×192)
 *  - app/favicon.ico       favicon classique (48×48)
 *  - app/apple-icon.png    icône iPhone / iPad (180×180)
 *  - public/logo.png       logo carré 512×512 (Google, données structurées)
 *  - public/og-image.jpg   image de partage WhatsApp / Facebook / TikTok (1200×630)
 */
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const SQUARE = 'public/brand/logo-al-mactoum.png';
const HORIZONTAL = 'public/brand/logo-horizontal.png';

/** Fichier .ico contenant une image PNG (format accepté par tous les navigateurs). */
function pngToIco(png, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(size >= 256 ? 0 : size, 6);
  header.writeUInt8(size >= 256 ? 0 : size, 7);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  return Buffer.concat([header, png]);
}

// Pour les petites icônes, on recadre au plus près du dessin (voiture + nom) pour qu'il reste lisible
const { width, height } = await sharp(SQUARE).metadata();
const side = Math.round(width * 0.9);
const tight = await sharp(SQUARE)
  .extract({ left: Math.round((width - side) / 2), top: Math.round((height - side) / 2) - Math.round(height * 0.02), width: side, height: side })
  .png()
  .toBuffer();

await sharp(tight).resize(192, 192).png().toFile('app/icon.png');
await sharp(tight).resize(180, 180).png().toFile('app/apple-icon.png');
writeFileSync('app/favicon.ico', pngToIco(await sharp(tight).resize(48, 48).png().toBuffer(), 48));
await sharp(SQUARE).resize(512, 512).png().toFile('public/logo.png');

// Image Open Graph 1200×630 : photo + voile bleu nuit + logo officiel + accroche
const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="v" x1="0" x2="1"><stop offset="0" stop-color="#06132A" stop-opacity="0.97"/><stop offset="0.65" stop-color="#0B1F3A" stop-opacity="0.82"/><stop offset="1" stop-color="#0B1F3A" stop-opacity="0.35"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#v)"/>
  <rect x="0" y="622" width="1200" height="8" fill="#C9A227"/>
  <text x="80" y="300" font-family="Montserrat, Segoe UI, Arial, sans-serif" font-weight="800" font-size="58" fill="#FFFFFF">Votre voiture du Canada</text>
  <text x="80" y="370" font-family="Montserrat, Segoe UI, Arial, sans-serif" font-weight="800" font-size="58" fill="#FFFFFF">livrée à Dakar</text>
  <text x="80" y="438" font-family="Segoe UI, Arial, sans-serif" font-size="30" fill="#E2E8F0">Payez 60 % à la commande, 40 % à l'arrivée.</text>
  <rect x="80" y="485" width="430" height="58" rx="29" fill="#C9A227"/>
  <text x="295" y="523" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="24" fill="#06132A">Wave · Orange Money · Cash</text>
</svg>`;
const logo = await sharp(HORIZONTAL).resize({ height: 150 }).toBuffer();
await sharp('public/images/hero-cargo.webp')
  .resize(1200, 630, { fit: 'cover', position: 'right' })
  .composite([
    { input: Buffer.from(overlay), top: 0, left: 0 },
    { input: logo, top: 60, left: 64 },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/og-image.jpg');

console.log('Icônes et image Open Graph générées.');
