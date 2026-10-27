import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { type Locale, getDictionary } from '@/lib/i18n';

/**
 * Métadonnées SEO d'une page dédiée (titre, description, canonical, versions FR/EN, Open Graph).
 * @param path chemin sans langue, ex. "/vehicules"
 */
export function pageMetadata(locale: Locale, path: string, title: string, description: string): Metadata {
  const { meta } = getDictionary(locale);
  const url = `/${locale}${path}/`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { fr: `/fr${path}/`, en: `/en${path}/`, 'x-default': `/fr${path}/` },
    },
    // Ces blocs remplacent ceux du layout : on reprend donc tous les champs
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      locale: locale === 'fr' ? 'fr_SN' : 'en_CA',
      title: `${title} | AL MACTOUM`,
      description,
      url,
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: meta.ogAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | AL MACTOUM`,
      description,
      images: ['/og-image.jpg'],
    },
  };
}
