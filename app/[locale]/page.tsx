import { ContactSection } from '@/components/ContactSection';
import { Hero } from '@/components/Hero';
import { PaymentSection } from '@/components/PaymentSection';
import { Steps } from '@/components/Steps';
import { Testimonials } from '@/components/Testimonials';
import { TrustBar } from '@/components/TrustBar';
import { AnimatedMarqueeHero } from '@/components/ui/hero-3';
import { VehiclesSection } from '@/components/VehiclesSection';
import { VideoGallery } from '@/components/VideoGallery';
import { WhyUs } from '@/components/WhyUs';
import { type Locale, generateLocaleParams, getDictionary, localePath } from '@/lib/i18n';

// Photos du bandeau défilant (textes alternatifs dans /locales, rubrique "gallery", même ordre)
const galleryImages = [
  '/images/galerie/dechargement-conteneur.webp',
  '/images/galerie/port-logistique.webp',
  '/images/galerie/vehicules-alignes.webp',
  '/images/galerie/conteneur-canada.webp',
  '/images/galerie/port-cargos.webp',
];

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
      <AnimatedMarqueeHero
        tagline={dict.gallery.tagline}
        title={dict.gallery.title}
        description={dict.gallery.description}
        ctaText={dict.gallery.cta}
        ctaHref={localePath(locale, '/#contact')}
        images={galleryImages.map((src, i) => ({ src, alt: dict.gallery.images[i] }))}
        pauseLabel={dict.gallery.pause}
        playLabel={dict.gallery.play}
      />
      <PaymentSection t={dict.payment} />
      <WhyUs t={dict.why} common={dict.common} />
      <Testimonials t={dict.testimonials} />
      <ContactSection locale={locale} t={dict.contact} common={dict.common} />
    </>
  );
}
