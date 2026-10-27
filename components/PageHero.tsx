import Image from 'next/image';
import { Ornament } from '@/components/ui/SectionHeading';

interface PageHeroProps {
  /** Sur-titre vert menthe (ex. « Paiement sécurisé ») */
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Photo de fond (dans /public/images) */
  image: string;
  imageAlt: string;
}

/**
 * En-tête sombre des pages dédiées.
 * Pas de fil d'Ariane : le site n'a qu'un niveau de pages, le logo et le menu suffisent pour revenir à l'accueil.
 */
export function PageHero({ eyebrow, title, subtitle, image, imageAlt }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-950 pb-16 pt-32 md:pb-20 md:pt-40">
      {/* Photo assombrie : une version légère suffit sur mobile */}
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="(max-width: 767px) 640px, 100vw"
        className="-z-20 object-cover opacity-40"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40" aria-hidden="true" />

      <div className="container">
        <p className="inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-mint">
          <Ornament />
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl text-balance text-4xl font-extrabold italic text-white md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">{subtitle}</p>
      </div>
    </section>
  );
}
