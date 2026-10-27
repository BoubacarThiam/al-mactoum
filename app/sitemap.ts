import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { locales } from '@/lib/i18n';

export const dynamic = 'force-static';

/** Pages du site (sans la langue). Ajoutez ici toute nouvelle page. */
const pages = ['', '/vehicules', '/paiement', '/faq', '/contact'];

/** Génère /sitemap.xml avec les versions FR et EN de chaque page. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return pages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${siteConfig.url}/${locale}${page}/`,
      lastModified,
      changeFrequency: page === '/vehicules' ? ('weekly' as const) : ('monthly' as const),
      priority: page === '' ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteConfig.url}/${l}${page}/`])),
      },
    })),
  );
}
