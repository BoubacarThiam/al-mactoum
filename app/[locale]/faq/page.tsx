import { FAQ } from '@/components/FAQ';
import { PageHero } from '@/components/PageHero';
import { type Locale, generateLocaleParams, getDictionary } from '@/lib/i18n';
import { pageMetadata } from '@/lib/page-metadata';

export function generateStaticParams() {
  return generateLocaleParams();
}

export function generateMetadata({ params }: { params: { locale: Locale } }) {
  const { pages } = getDictionary(params.locale);
  return pageMetadata(params.locale, '/faq', pages.faq.title, pages.faq.subtitle);
}

/** Page FAQ : /fr/faq et /en/faq */
export default function FaqPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        locale={locale}
        title={dict.pages.faq.title}
        subtitle={dict.pages.faq.subtitle}
        homeLabel={dict.common.home}
        breadcrumbLabel={dict.common.breadcrumb}
        image="/images/port-aerien.webp"
        imageAlt={dict.pages.faq.imageAlt}
      />
      <FAQ t={dict.faq} whatsappMessage={dict.hero.whatsappMessage} />
    </>
  );
}
