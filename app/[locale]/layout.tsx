import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { Inter, Montserrat } from 'next/font/google';
import { FloatingButtons } from '@/components/FloatingButtons';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { IntroLogo, introOnceScript } from '@/components/IntroLogo';
import { JsonLd } from '@/components/JsonLd';
import { MotionProvider } from '@/components/MotionProvider';
import { siteConfig } from '@/config/site';
import { type Locale, getDictionary, isLocale, locales } from '@/lib/i18n';
import '../globals.css';
import '../am-motion.css';
import '../intro.css';

// Polices Google auto-hébergées par Next.js (aucune requête vers Google côté visiteur)
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'], // 900 : grands titres animés de l'accueil
  style: ['normal', 'italic'], // italique : titre du hero, comme le logo
  variable: '--font-montserrat',
  display: 'swap',
});
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

/** Génère les versions /fr et /en du site lors de l'export statique. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#0E1210',
  width: 'device-width',
  initialScale: 1,
};

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const { meta } = getDictionary(params.locale);
  const locale = params.locale;

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: meta.title, template: meta.titleTemplate },
    description: meta.description,
    keywords: meta.keywords,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name }],
    alternates: {
      canonical: `/${locale}/`,
      languages: { fr: '/fr/', en: '/en/', 'x-default': '/fr/' },
    },
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      title: meta.title,
      description: meta.description,
      url: `/${locale}/`,
      locale: locale === 'fr' ? 'fr_SN' : 'en_CA',
      alternateLocale: locale === 'fr' ? ['en_CA'] : ['fr_SN'],
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: meta.ogAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: ['/og-image.jpg'],
    },
    formatDetection: { telephone: false },
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = getDictionary(locale);

  // suppressHydrationWarning : les scripts d'animation ajoutent des classes sur <html> avant React
  return (
    <html lang={locale} className={`${montserrat.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Avant tout affichage : l'intro du logo ne se joue qu'une fois par visite */}
        <script dangerouslySetInnerHTML={{ __html: introOnceScript }} />
      </head>
      <body>
        <IntroLogo />
        <MotionProvider>
          <Header
            locale={locale}
            nav={dict.nav}
            whatsappMessage={dict.hero.whatsappMessage}
            skipLabel={dict.common.skipToContent}
            navLabels={{ main: dict.common.mainNav, mobile: dict.common.mobileNav }}
          />
          <main id="contenu">{children}</main>
          <Footer locale={locale} dict={dict} />
          <FloatingButtons
            whatsappLabel={dict.common.whatsappFloat}
            whatsappMessage={dict.hero.whatsappMessage}
            backToTopLabel={dict.common.backToTop}
          />
        </MotionProvider>
        <JsonLd locale={locale} description={dict.meta.description} />
      </body>
    </html>
  );
}
