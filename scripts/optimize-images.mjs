/**
 * Crée des versions redimensionnées (WebP) de toutes les photos de /public/images,
 * pour que les téléphones téléchargent des images légères.
 *
 * Lancé automatiquement avant "npm run dev" et "npm run build" (donc aussi sur Vercel).
 * Vous n'avez rien à faire : déposez simplement vos photos dans /public/images.
 *
 * Résultat : /public/_img/<largeur>/<chemin>.webp  (ex. /public/_img/960/hero-cargo.webp)
 */
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import sharp from 'sharp';

// ⚠️ Ces largeurs doivent rester identiques à celles de lib/image-loader.ts et next.config.mjs
const WIDTHS = [640, 960, 1280, 1920];
const SOURCE = 'public/images';
const OUTPUT = 'public/_img';

function listImages(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return listImages(path);
    return /\.(jpe?g|png|webp|avif)$/i.test(name) ? [path] : [];
  });
}

let created = 0;
for (const file of listImages(SOURCE)) {
  const rel = relative(SOURCE, file).replace(/\.[^.]+$/, '.webp');
  const sourceTime = statSync(file).mtimeMs;
  for (const width of WIDTHS) {
    const out = join(OUTPUT, String(width), rel);
    // Déjà à jour : on ne refait pas le travail
    if (existsSync(out) && statSync(out).mtimeMs >= sourceTime) continue;
    mkdirSync(dirname(out), { recursive: true });
    await sharp(file)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: width <= 960 ? 62 : 70 })
      .toFile(out);
    created++;
  }
}
console.log(`Images optimisées : ${created} fichier(s) créé(s).`);
