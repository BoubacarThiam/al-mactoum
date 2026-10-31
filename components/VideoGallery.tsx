import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { VideoCard } from '@/components/ui/VideoCard';
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
  if (operationVideos.length === 0) return null;

  // Grille adaptée au nombre de vidéos : pas de colonne vide avec 1 ou 2 vidéos
  const count = operationVideos.length;
  const layout =
    count === 1
      ? 'mx-auto max-w-3xl'
      : count === 2 || count === 4
        ? 'mx-auto max-w-5xl sm:grid-cols-2'
        : 'grid-center-orphan sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section id="videos" className="section bg-mist" aria-labelledby="videos-titre">
      <div className="container">
        <SectionHeading id="videos-titre" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

        <ul className={cn('mt-12 grid gap-6', layout)}>
          {operationVideos.map((video, i) => {
            const title = video.title[locale];
            return (
              <Reveal as="li" key={video.id} delay={motionTokens.stagger * i}>
                <VideoCard
                  src={video.src}
                  poster={video.poster}
                  title={title}
                  caption={video.caption?.[locale]}
                  duration={video.duration}
                  playLabel={fill(t.play, { title })}
                />
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
