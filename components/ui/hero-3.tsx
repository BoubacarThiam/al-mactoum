'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { Ornament } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';

export interface MarqueeImage {
  src: string;
  alt: string;
}

interface AnimatedMarqueeHeroProps {
  tagline: string;
  title: React.ReactNode;
  description: string;
  ctaText: string;
  ctaHref: string;
  images: MarqueeImage[];
  /** Libellés du bouton pause / lecture du défilement */
  pauseLabel: string;
  playLabel: string;
  className?: string;
}

/**
 * Bandeau texte + défilement d'images en continu (adapté du composant « hero-3 »).
 * Défilement en CSS pur : léger, en pause au survol ou avec le bouton, figé si le visiteur réduit les animations.
 */
export function AnimatedMarqueeHero({
  tagline,
  title,
  description,
  ctaText,
  ctaHref,
  images,
  pauseLabel,
  playLabel,
  className,
}: AnimatedMarqueeHeroProps) {
  const [paused, setPaused] = useState(false);
  // La liste est répétée pour remplir les grands écrans ; la 2e moitié est une copie exacte
  // de la 1re, ce qui rend la boucle (-50 % → 0) invisible
  const half = images.length < 8 ? [...images, ...images] : images;
  const track = [...half, ...half];

  return (
    <section className={cn('relative overflow-hidden bg-ink-950 py-20 md:py-28', className)}>
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(163,247,198,0.12),transparent_60%)]"
        aria-hidden="true"
      />

      <Reveal className="container relative flex flex-col items-center text-center">
        <p className="mb-5 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-mint">
          <Ornament />
          {tagline}
          <Ornament flip />
        </p>
        <h2 className="max-w-3xl text-balance text-4xl font-extrabold italic leading-[1.1] text-white md:text-6xl">
          {title}
        </h2>
        <p className="mt-6 max-w-xl text-lg text-slate-300">{description}</p>
        <Link href={ctaHref} className="btn-mint group mt-9 text-base">
          {ctaText}
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </Reveal>

      {/* Défilement d'images (fondu sur les bords) */}
      <div className="relative mt-14 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] md:mt-20">
        <ul
          className={cn(
            'flex w-max animate-marquee gap-5 py-4 hover:[animation-play-state:paused]',
            paused && '[animation-play-state:paused]',
          )}
        >
          {track.map((image, i) => (
            <li
              key={i}
              // Seule la 1re série est lue par les lecteurs d'écran
              aria-hidden={i >= images.length || undefined}
              className={cn(
                'relative aspect-[3/4] h-56 shrink-0 overflow-hidden rounded-2xl shadow-lift ring-1 ring-white/10 md:h-72',
                i % 2 === 0 ? '-rotate-2' : 'rotate-2',
              )}
            >
              <Image
                src={image.src}
                alt={i >= images.length ? '' : image.alt}
                fill
                sizes="(min-width: 768px) 216px, 168px"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Tout défilement de plus de 5 s doit pouvoir être arrêté (le survol ne suffit pas sur mobile) */}
      {/* Centré : à droite, il serait masqué par les boutons flottants sur mobile */}
      <div className="container relative mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-mint hover:text-mint"
          aria-label={paused ? playLabel : pauseLabel}
        >
          {paused ? <Play className="h-5 w-5" aria-hidden="true" /> : <Pause className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>
    </section>
  );
}
