import { siteConfig } from '@/config/site';

/** Concatène des classes CSS en ignorant les valeurs vides. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

/** Lien WhatsApp (wa.me) avec un message pré-rempli. */
export function whatsappLink(message?: string) {
  const base = `https://wa.me/${siteConfig.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Formate un montant en FCFA : 6000000 → "6 000 000 FCFA". */
export function formatFCFA(amount: number) {
  // Espaces classiques (et non insécables fines) pour un rendu identique partout, y compris dans WhatsApp
  const n = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${n} FCFA`;
}

/** Formate un kilométrage : 85000 → "85 000 km". */
export function formatKm(km: number) {
  return `${km.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} km`;
}

/** Remplace les variables {cle} d'un texte traduit. */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? `{${key}}`));
}
