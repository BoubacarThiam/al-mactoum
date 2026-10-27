import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { type Locale, localePath } from '@/lib/i18n';

interface PageHeroProps {
  locale: Locale;
  title: string;
  subtitle: string;
  homeLabel: string;
  breadcrumbLabel: string;
  /** Photo de fond (dans /public/images) */
  image: string;
  imageAlt: string;
}

/** En-tête sombre des pages dédiées, avec fil d'Ariane. */
export function PageHero({ locale, title, subtitle, homeLabel, breadcrumbLabel, image, imageAlt }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 pb-16 pt-32 md:pb-20 md:pt-40">
      <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="-z-20 object-cover opacity-40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/40" aria-hidden="true" />

      <div className="container">
        <nav aria-label={breadcrumbLabel} className="animate-fade-up">
          <ol className="flex items-center gap-1.5 text-sm text-slate-300">
            <li>
              <Link href={localePath(locale, '/')} className="transition-colors hover:text-gold">
                {homeLabel}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-4 w-4" />
            </li>
            <li aria-current="page" className="font-semibold text-gold">
              {title}
            </li>
          </ol>
        </nav>
        <h1
          className="animate-fade-up mt-5 max-w-3xl text-4xl font-extrabold text-white md:text-5xl"
          style={{ animationDelay: '80ms' }}
        >
          {title}
        </h1>
        <p className="animate-fade-up mt-4 max-w-2xl text-lg text-slate-300" style={{ animationDelay: '160ms' }}>
          {subtitle}
        </p>
      </div>
    </section>
  );
}
