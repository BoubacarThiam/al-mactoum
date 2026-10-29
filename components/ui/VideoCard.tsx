'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoCardProps {
  src: string;
  poster: string;
  title: string;
  caption?: string;
  /** Durée affichée sur la vignette, ex. "0:13" */
  duration?: string;
  /** Libellé du bouton de lecture (accessibilité) */
  playLabel: string;
  /** Vidéo verticale (téléphone) : vignette 9:16 au lieu de 16:9 */
  portrait?: boolean;
}

/**
 * Carte vidéo : image d'aperçu + bouton lecture ; la vidéo n'est téléchargée qu'au clic.
 * Lancer une vidéo met en pause les autres cartes vidéo de la page (pas la vidéo de fond du hero).
 */
export function VideoCard({ src, poster, title, caption, duration, playLabel, portrait }: VideoCardProps) {
  const [playing, setPlaying] = useState(false);

  function pauseOthers(current: HTMLVideoElement) {
    document.querySelectorAll<HTMLVideoElement>('video[data-video-card]').forEach((video) => {
      if (video !== current) video.pause();
    });
  }

  return (
    <figure className="card h-full overflow-hidden">
      <div className={cn('relative bg-ink-950', portrait ? 'aspect-[9/16]' : 'aspect-video')}>
        {playing ? (
          <video
            data-video-card
            className="h-full w-full"
            src={src}
            poster={poster}
            controls
            autoPlay
            playsInline
            onPlay={(e) => pauseOthers(e.currentTarget)}
            onEnded={() => setPlaying(false)}
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 h-full w-full" aria-label={playLabel}>
            {/* Simple <img> : l'aperçu est hors de /images, il n'a pas de versions redimensionnées */}
            <img
              src={poster}
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
            {duration && (
              <span className="absolute bottom-3 right-3 rounded-md bg-ink-950/75 px-2 py-0.5 text-xs font-semibold tabular-nums text-white">
                {duration}
              </span>
            )}
          </button>
        )}
      </div>
      <figcaption className="p-5">
        <h3 className="font-heading text-base font-bold text-ink-900 md:text-lg">{title}</h3>
        {caption && <p className="mt-1 text-sm text-slate-600">{caption}</p>}
      </figcaption>
    </figure>
  );
}
