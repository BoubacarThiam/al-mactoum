import Link from 'next/link';
import { ArrowRight, MapPin, ShieldCheck, Wallet } from 'lucide-react';
import { HeroVideo } from '@/components/HeroVideo';
import { Ornament } from '@/components/ui/SectionHeading';
import { WhatsAppIcon } from '@/components/icons/BrandIcons';
import { type Dictionary, type Locale, localePath } from '@/lib/i18n';
import { whatsappLink } from '@/lib/utils';

interface HeroProps {
  locale: Locale;
  t: Dictionary['hero'];
}

const badgeIcons = [ShieldCheck, Wallet, MapPin];

/**
 * Grande bannière d'accueil.
 * Le titre et le sous-titre s'affichent sans animation (affichage le plus rapide possible sur mobile) ;
 * boutons et badges apparaissent ensuite en douceur, en CSS pur.
 */
export function Hero({ locale, t }: HeroProps) {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink-950">
      {/* Vidéo de fond — fichier dans /public/videos/al-mactoum-intro.mp4 */}
      <HeroVideo t={t.video} />
      {/* Voile sombre pour la lisibilité du texte ; plus léger à droite pour laisser voir la vidéo */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/80 via-ink-950/65 to-ink-950/95 md:bg-gradient-to-r md:from-ink-950/95 md:via-ink-950/60 md:to-ink-950/10"
        aria-hidden="true"
      />
      {/* Fondu sous le menu : les titres de la vidéo ne gênent pas la navigation */}
      <div
        className="absolute inset-x-0 top-0 -z-10 h-36 bg-gradient-to-b from-ink-950 via-ink-950/70 to-transparent"
        aria-hidden="true"
      />

      {/* Marge basse : laisse la place au bandeau de confiance qui chevauche le hero */}
      <div className="container pb-24 pt-28 md:pb-36 md:pt-32">
        <div className="max-w-3xl">
          <p className="animate-fade-up mb-6 inline-flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-mint sm:text-xs sm:tracking-[0.32em]">
            <Ornament />
            {t.eyebrow}
          </p>

          <h1 className="text-balance text-[2.15rem] font-extrabold italic leading-[1.08] text-white sm:text-5xl lg:text-[4rem]">
            {t.title}
          </h1>

          <p className="mt-6 max-w-xl text-lg text-slate-200 md:text-xl">
            {t.subtitle}
          </p>

          {/* Un seul bouton principal (devis) ; WhatsApp en bouton secondaire */}
          <div
            className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: '240ms' }}
          >
            <Link href={localePath(locale, '/#contact')} className="btn-mint group text-base">
              {t.ctaQuote}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <a
              href={whatsappLink(t.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-light text-base"
            >
              <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
              {t.ctaWhatsapp}
            </a>
          </div>

          {/* Badges de confiance */}
          <ul
            className="animate-fade-up mt-10 flex flex-wrap gap-2.5 md:mt-12"
            style={{ animationDelay: '320ms' }}
          >
            {t.badges.map((badge, i) => {
              const Icon = badgeIcons[i % badgeIcons.length];
              return (
                <li
                  key={badge}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-ink-950/40 px-3.5 py-2 text-sm font-medium text-slate-200 backdrop-blur-md"
                >
                  <Icon className="h-4 w-4 text-mint" aria-hidden="true" />
                  {badge}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
