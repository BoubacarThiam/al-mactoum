import { ContactSection } from '@/components/ContactSection';
import { PageHero } from '@/components/PageHero';
import { type Locale, generateLocaleParams, getDictionary } from '@/lib/i18n';
import { pageMetadata } from '@/lib/page-metadata';

export function generateStaticParams() {
  return generateLocaleParams();
}

export function generateMetadata({ params }: { params: { locale: Locale } }) {
  const { pages } = getDictionary(params.locale);
  return pageMetadata(params.locale, '/contact', pages.contact.title, pages.contact.subtitle);
}

/** Page contact & devis : /fr/contact et /en/contact */
export default function ContactPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        eyebrow={dict.contact.eyebrow}
        title={dict.pages.contact.title}
        subtitle={dict.pages.contact.subtitle}
        image="/images/canada-ville.webp"
        imageAlt={dict.pages.contact.imageAlt}
      />
      <ContactSection locale={locale} t={dict.contact} common={dict.common} />
    </>
  );
}
