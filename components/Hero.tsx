import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, ShieldCheck, Wallet } from 'lucide-react';
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
 * Animations en CSS pur (pas de JavaScript) pour un affichage immédiat sur mobile.
 */
export function Hero({ locale, t }: HeroProps) {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-navy-950">
      {/* Photo de fond — à remplacer dans /public/images/hero-cargo.webp */}
      <Image
        src="/images/hero-cargo.webp"
        alt={t.imageAlt}
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      {/* Voile sombre pour la lisibilité du texte */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-950/85 via-navy-950/70 to-navy-950/95 md:bg-gradient-to-r md:from-navy-950/95 md:via-navy-950/75 md:to-navy-950/30"
        aria-hidden="true"
      />

      <div className="container pb-16 pt-28 md:pb-24 md:pt-32">
        <div className="max-w-3xl">
          <p className="animate-fade-up mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold-light backdrop-blur">
            {t.eyebrow}
          </p>

          <h1
            className="animate-fade-up text-balance text-[2.15rem] font-extrabold leading-[1.1] text-white sm:text-5xl lg:text-6xl"
            style={{ animationDelay: '80ms' }}
          >
            {t.title}
          </h1>

          <p
            className="animate-fade-up mt-6 max-w-xl text-lg text-slate-200 md:text-xl"
            style={{ animationDelay: '160ms' }}
          >
            {t.subtitle}
          </p>

          <div
            className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: '240ms' }}
          >
            <Link href={localePath(locale, '/#contact')} className="btn-gold group text-base">
              {t.ctaQuote}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <a
              href={whatsappLink(t.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-base"
            >
              <WhatsAppIcon className="h-5 w-5" />
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
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-sm font-medium text-white backdrop-blur-md"
                >
                  <Icon className="h-4 w-4 text-gold" aria-hidden="true" />
                  {badge}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Indicateur de défilement */}
      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block" aria-hidden="true">
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/40 pt-2">
          <span className="h-2 w-1 animate-bounce rounded-full bg-gold" />
        </div>
      </div>
    </section>
  );
}
