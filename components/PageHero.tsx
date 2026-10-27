import Image from 'next/image';

interface PageHeroProps {
  /** Sur-titre doré (ex. « Paiement sécurisé ») */
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
    <section className="relative isolate overflow-hidden bg-navy-950 pb-16 pt-32 md:pb-20 md:pt-40">
      {/* Photo assombrie : une version légère suffit sur mobile */}
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="(max-width: 767px) 640px, 100vw"
        className="-z-20 object-cover opacity-40"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/40" aria-hidden="true" />

      <div className="container">
        <p className="inline-flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-[0.22em] text-gold">
          <span className="h-px w-6 bg-gold" aria-hidden="true" />
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl text-balance text-4xl font-extrabold text-white md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">{subtitle}</p>
      </div>
    </section>
  );
}
