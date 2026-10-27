import { PageHero } from '@/components/PageHero';
import { VehiclesSection } from '@/components/VehiclesSection';
import { type Locale, generateLocaleParams, getDictionary } from '@/lib/i18n';
import { pageMetadata } from '@/lib/page-metadata';

export function generateStaticParams() {
  return generateLocaleParams();
}

export function generateMetadata({ params }: { params: { locale: Locale } }) {
  const { pages } = getDictionary(params.locale);
  return pageMetadata(params.locale, '/vehicules', pages.vehicles.title, pages.vehicles.subtitle);
}

/** Page catalogue complet : /fr/vehicules et /en/vehicules */
export default function VehiclesPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        locale={locale}
        title={dict.pages.vehicles.title}
        subtitle={dict.pages.vehicles.subtitle}
        homeLabel={dict.common.home}
        breadcrumbLabel={dict.common.breadcrumb}
        image="/images/canada-paysage.webp"
        imageAlt={dict.pages.vehicles.imageAlt}
      />
      <VehiclesSection t={dict.vehicles} locale={locale} hideHeading />
    </>
  );
}
