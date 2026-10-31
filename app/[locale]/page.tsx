import Script from 'next/script';
import { ContactSection } from '@/components/ContactSection';
import { Hero } from '@/components/Hero';
import { PromoVideos } from '@/components/PromoVideos';
import { Testimonials } from '@/components/Testimonials';
import { TrustBar } from '@/components/TrustBar';
import { AnimatedMarqueeHero } from '@/components/ui/hero-3';
import { VehiclesSection } from '@/components/VehiclesSection';
import { VideoGallery } from '@/components/VideoGallery';
import { CarSprite } from '@/components/motion/KitIcons';
import { MotionBands } from '@/components/motion/MotionBands';
import { MotionBento } from '@/components/motion/MotionBento';
import { MotionCta } from '@/components/motion/MotionCta';
import { MotionDrive } from '@/components/motion/MotionDrive';
import { MotionPay } from '@/components/motion/MotionPay';
import { MotionServices } from '@/components/motion/MotionServices';
import { MotionStory } from '@/components/motion/MotionStory';
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

/**
 * Page d'accueil : l'essentiel seulement (la FAQ a sa propre page, les réseaux sont dans le pied de page).
 * Les sections components/motion/* sont animées au défilement par public/animations/am-motion.js
 * (styles : app/am-motion.css). Sans JavaScript, leur contenu reste entièrement visible.
 */
export default function HomePage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const { motion } = dict;

  return (
    <>
      <CarSprite />
      <Hero locale={locale} t={dict.hero} />
      <TrustBar locale={locale} t={dict.trust} />
      <MotionBands t={motion.bands} />
      <MotionBento t={motion.bento} common={dict.common} whatsappMessage={dict.hero.whatsappMessage} />
      <PromoVideos t={dict.promos} locale={locale} />
      <MotionDrive t={motion.drive} />
      <MotionStory t={motion.story} />
      <VideoGallery t={dict.videos} locale={locale} />
      <VehiclesSection t={dict.vehicles} locale={locale} limit={3} />
      <MotionPay locale={locale} t={motion.pay} common={dict.common} />
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
      <MotionServices t={motion.services} />
      <Testimonials t={dict.testimonials} locale={locale} />
      <MotionCta t={motion.cta} common={dict.common} whatsappMessage={dict.hero.whatsappMessage} />
      <ContactSection locale={locale} t={dict.contact} common={dict.common} />

      {/* Après l'hydratation : le script découpe certains titres en mots */}
      <Script src="/animations/am-motion.js" strategy="afterInteractive" />
    </>
  );
}
