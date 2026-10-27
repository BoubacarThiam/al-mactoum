import fr from '@/locales/fr.json';
import en from '@/locales/en.json';

/** Langues disponibles. Le français est la langue par défaut. */
export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

/** Le fichier français sert de référence : en.json doit avoir exactement les mêmes clés. */
export type Dictionary = typeof fr;

const dictionaries: Record<Locale, Dictionary> = { fr, en };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

/** Construit un lien interne pour une langue donnée : localePath('en', '/vehicules') → "/en/vehicules/". */
export function localePath(locale: Locale, path = '/') {
  const clean = path === '/' ? '' : path.replace(/\/$/, '');
  const [pathname, hash] = clean.split('#');
  return `/${locale}${pathname}/${hash ? `#${hash}` : ''}`;
}

/** Paramètres de langue à générer lors de l'export statique (à exporter dans chaque page sous [locale]). */
export function generateLocaleParams() {
  return locales.map((locale) => ({ locale }));
}
