/**
 * Loader next/image pour l'export statique : renvoie la version redimensionnée
 * créée par scripts/optimize-images.mjs (dossier /public/_img).
 * Les images hors de /images (ex. logos de paiement) sont servies telles quelles.
 */

// ⚠️ Doit rester identique à WIDTHS dans scripts/optimize-images.mjs
const WIDTHS = [640, 960, 1280, 1920];

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith('/images/')) return src;
  const size = WIDTHS.find((w) => w >= width) ?? WIDTHS[WIDTHS.length - 1];
  return `/_img/${size}${src.slice('/images'.length).replace(/\.(jpe?g|png|webp|avif)$/i, '')}.webp`;
}
