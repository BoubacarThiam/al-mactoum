import { ContactSection } from '@/components/ContactSection';
import { Hero } from '@/components/Hero';
import { PaymentSection } from '@/components/PaymentSection';
import { Steps } from '@/components/Steps';
import { Testimonials } from '@/components/Testimonials';
import { TrustBar } from '@/components/TrustBar';
import { VehiclesSection } from '@/components/VehiclesSection';
import { VideoGallery } from '@/components/VideoGallery';
import { WhyUs } from '@/components/WhyUs';
import { type Locale, generateLocaleParams, getDictionary } from '@/lib/i18n';

export function generateStaticParams() {
  return generateLocaleParams();
}

/** Page d'accueil : l'essentiel seulement (la FAQ a sa propre page, les réseaux sont dans le pied de page). */
export default function HomePage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);

  return (
    <>
      <Hero locale={locale} t={dict.hero} />
      <TrustBar locale={locale} t={dict.trust} />
      <Steps t={dict.steps} />
      <VehiclesSection t={dict.vehicles} locale={locale} limit={3} />
      <VideoGallery t={dict.videos} locale={locale} />
      <PaymentSection t={dict.payment} />
      <WhyUs t={dict.why} common={dict.common} />
      <Testimonials t={dict.testimonials} />
      <ContactSection locale={locale} t={dict.contact} common={dict.common} />
    </>
  );
}
