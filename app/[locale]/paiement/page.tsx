import { PageHero } from '@/components/PageHero';
import { PaymentSection } from '@/components/PaymentSection';
import { Steps } from '@/components/Steps';
import { type Locale, generateLocaleParams, getDictionary } from '@/lib/i18n';
import { pageMetadata } from '@/lib/page-metadata';

export function generateStaticParams() {
  return generateLocaleParams();
}

export function generateMetadata({ params }: { params: { locale: Locale } }) {
  const { pages } = getDictionary(params.locale);
  return pageMetadata(params.locale, '/paiement', pages.payment.title, pages.payment.subtitle);
}

/** Page paiement 60/40 : /fr/paiement et /en/paiement */
export default function PaymentPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        locale={locale}
        title={dict.pages.payment.title}
        subtitle={dict.pages.payment.subtitle}
        homeLabel={dict.common.home}
        breadcrumbLabel={dict.common.breadcrumb}
        image="/images/port-conteneurs.webp"
        imageAlt={dict.pages.payment.imageAlt}
      />
      <PaymentSection t={dict.payment} />
      <Steps t={dict.steps} />
    </>
  );
}
