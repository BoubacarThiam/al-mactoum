import { siteConfig } from '@/config/site';
import type { Locale } from '@/lib/i18n';

/**
 * Données structurées schema.org (AutoDealer / LocalBusiness) pour Google.
 * Générées automatiquement à partir de /config/site.ts.
 */
export function JsonLd({ locale, description }: { locale: Locale; description: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': ['AutoDealer', 'LocalBusiness'],
    '@id': `${siteConfig.url}/#entreprise`,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    description,
    url: `${siteConfig.url}/${locale}/`,
    logo: `${siteConfig.url}/logo.png`,
    image: `${siteConfig.url}/og-image.jpg`,
    email: siteConfig.email,
    telephone: siteConfig.phones[0].tel,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${siteConfig.address.street}, ${siteConfig.address.landmark}`,
      addressLocality: siteConfig.address.city,
      addressCountry: siteConfig.address.countryCode,
    },
    contactPoint: siteConfig.phones.map((p) => ({
      '@type': 'ContactPoint',
      telephone: p.tel,
      contactType: 'customer service',
      areaServed: p.country,
      availableLanguage: ['French', 'English'],
    })),
    areaServed: [
      { '@type': 'Country', name: 'Senegal' },
      { '@type': 'Country', name: 'Canada' },
    ],
    sameAs: [...siteConfig.socials.tiktok.map((s) => s.url), siteConfig.socials.facebook.url],
    paymentAccepted: 'Wave, Orange Money, Cash',
    currenciesAccepted: 'XOF',
  };

  return (
    <script
      type="application/ld+json"
      // Le JSON est généré par nous-mêmes à partir de la configuration : aucune donnée visiteur n'y est injectée
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
