'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { operationVideos } from '@/data/videos';
import type { Dictionary, Locale } from '@/lib/i18n';
import { motionTokens } from '@/lib/motion';
import { cn, fill } from '@/lib/utils';

interface VideoGalleryProps {
  t: Dictionary['videos'];
  locale: Locale;
}

/**
 * Section « En vidéo » : vraies vidéos de nos opérations (liste dans /data/videos.ts).
 * Rien n'est téléchargé avant le clic (image d'aperçu seulement) ; une seule vidéo joue à la fois.
 */
export function VideoGallery({ t, locale }: VideoGalleryProps) {
  const [active, setActive] = useState<string | null>(null);
  if (operationVideos.length === 0) return null;

  // Grille adaptée au nombre de vidéos : pas de colonne vide avec 1 ou 2 vidéos
  const count = operationVideos.length;
  const layout =
    count === 1
      ? 'mx-auto max-w-3xl'
      : count === 2 || count === 4
        ? 'mx-auto max-w-5xl sm:grid-cols-2'
        : 'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section id="videos" className="section bg-mist" aria-labelledby="videos-titre">
      <div className="container">
        <SectionHeading id="videos-titre" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

        <ul className={cn('mt-12 grid gap-6', layout)}>
          {operationVideos.map((video, i) => {
            const title = video.title[locale];
            const isActive = active === video.id;
            return (
              <Reveal as="li" key={video.id} delay={motionTokens.stagger * i}>
                <figure className="card h-full overflow-hidden">
                  <div className="relative aspect-video bg-ink-950">
                    {isActive ? (
                      <video
                        className="h-full w-full"
                        src={video.src}
                        poster={video.poster}
                        controls
                        autoPlay
                        playsInline
                        onEnded={() => setActive(null)}
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActive(video.id)}
                        className="group absolute inset-0 h-full w-full"
                        aria-label={fill(t.play, { title })}
                      >
                        {/* Simple <img> : l'aperçu est hors de /images, il n'a pas de versions redimensionnées */}
                        <img
                          src={video.poster}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <span className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/10 to-transparent" aria-hidden="true" />
                        <span
                          className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-mint text-ink-950 shadow-[0_0_40px_-6px_rgba(163,247,198,0.8)] transition-transform duration-300 group-hover:scale-110"
                          aria-hidden="true"
                        >
                          <Play className="ml-1 h-7 w-7 fill-current" />
                        </span>
                        {video.duration && (
                          <span className="absolute bottom-3 right-3 rounded-md bg-ink-950/75 px-2 py-0.5 text-xs font-semibold tabular-nums text-white">
                            {video.duration}
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                  <figcaption className="p-5">
                    <h3 className="font-heading text-base font-bold text-ink-900 md:text-lg">{title}</h3>
                    {video.caption && <p className="mt-1 text-sm text-slate-600">{video.caption[locale]}</p>}
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
