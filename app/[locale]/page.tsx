import { ContactSection } from '@/components/ContactSection';
import { FAQ } from '@/components/FAQ';
import { Hero } from '@/components/Hero';
import { PaymentSection } from '@/components/PaymentSection';
import { Services } from '@/components/Services';
import { SocialSection } from '@/components/SocialSection';
import { Steps } from '@/components/Steps';
import { Testimonials } from '@/components/Testimonials';
import { VehiclesSection } from '@/components/VehiclesSection';
import { WhyUs } from '@/components/WhyUs';
import { type Locale, generateLocaleParams, getDictionary } from '@/lib/i18n';

export function generateStaticParams() {
  return generateLocaleParams();
}

/** Page d'accueil : toutes les sections à la suite. */
export default function HomePage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);

  return (
    <>
      <Hero locale={locale} t={dict.hero} />
      <Steps t={dict.steps} />
      <PaymentSection t={dict.payment} />
      <Services t={dict.services} />
      <VehiclesSection t={dict.vehicles} locale={locale} limit={6} />
      <WhyUs t={dict.why} common={dict.common} />
      <Testimonials t={dict.testimonials} />
      <SocialSection t={dict.social} newTab={dict.common.newTab} />
      <FAQ t={dict.faq} whatsappMessage={dict.hero.whatsappMessage} />
      <ContactSection locale={locale} t={dict.contact} common={dict.common} />
    </>
  );
}
