import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { VideoCard } from '@/components/ui/VideoCard';
import { getPromoVideos } from '@/lib/content-store';
import type { Dictionary, Locale } from '@/lib/i18n';
import { motionTokens } from '@/lib/motion';
import { cn, fill } from '@/lib/utils';

interface PromoVideosProps {
  t: Dictionary['promos'];
  locale: Locale;
}

/**
 * Section « Nos publicités » : vidéos publicitaires (gérées depuis le backoffice /admin), sur fond sombre
 * pour ressortir entre les sections claires. Vidéos verticales ou horizontales, côte à côte dès la tablette.
 */
export async function PromoVideos({ t, locale }: PromoVideosProps) {
  const promoVideos = await getPromoVideos();
  if (promoVideos.length === 0) return null;

  return (
    <section id="publicites" className="section relative overflow-hidden bg-ink-950" aria-labelledby="publicites-titre">
      {/* Halo menthe derrière les vidéos */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="container relative">
        <SectionHeading id="publicites-titre" tone="light" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

        <ul className="mt-12 flex flex-wrap items-center justify-center gap-6 md:mt-14 md:gap-8">
          {promoVideos.map((video, i) => {
            const title = video.title[locale];
            return (
              <Reveal
                as="li"
                key={video.id}
                delay={motionTokens.stagger * i}
                className={cn('w-full', video.portrait ? 'max-w-[340px]' : 'max-w-xl lg:max-w-[calc(50%-1rem)]')}
              >
                <VideoCard
                  src={video.src}
                  poster={video.poster}
                  title={title}
                  caption={video.caption?.[locale]}
                  duration={video.duration}
                  playLabel={fill(t.play, { title })}
                  portrait={video.portrait}
                />
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
