import { MessageSquareQuote, Quote, Star } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { VideoCard } from '@/components/ui/VideoCard';
import { motionTokens } from '@/lib/motion';
import { testimonials, videoTestimonials } from '@/data/testimonials';
import type { Dictionary, Locale } from '@/lib/i18n';
import { fill } from '@/lib/utils';

/**
 * Témoignages clients — vidéos de livraison et avis écrits, alimentés par /data/testimonials.ts.
 * Aucun faux avis : les emplacements vides ne s'affichent qu'en développement (npm run dev),
 * comme rappel, et seulement tant qu'il n'y a ni vidéo ni vrai avis. Sans contenu réel,
 * la section est masquée sur le site en ligne.
 */
export function Testimonials({ t, locale }: { t: Dictionary['testimonials']; locale: Locale }) {
  const realReviews = testimonials.filter((item) => !item.placeholder);
  const hasRealContent = realReviews.length > 0 || videoTestimonials.length > 0;
  if (!hasRealContent && process.env.NODE_ENV === 'production') return null;
  const items = hasRealContent ? realReviews : testimonials;

  return (
    <section className="section bg-mist" aria-labelledby="temoignages-titre">
      <div className="container">
        <SectionHeading id="temoignages-titre" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

        {videoTestimonials.length > 0 && (
          <ul className="mt-14 flex flex-wrap justify-center gap-6">
            {videoTestimonials.map((video, i) => {
              const title = video.title[locale];
              return (
                <Reveal
                  as="li"
                  key={video.id}
                  delay={motionTokens.stagger * i}
                  className={video.portrait ? 'w-full max-w-[320px]' : 'w-full max-w-xl'}
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
        )}

        {items.length > 0 && (
          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {items.map((item, i) => (
              <Reveal as="li" key={i} delay={motionTokens.stagger * i}>
                {item.placeholder ? (
                  <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink-900/15 bg-white/60 p-8 text-center">
                    <MessageSquareQuote className="h-10 w-10 text-slate-300" aria-hidden="true" />
                    <p className="mt-4 text-sm font-semibold text-slate-500">{item.text}</p>
                  </div>
                ) : (
                  <figure className="card relative flex h-full flex-col p-7">
                    <Quote className="absolute right-6 top-6 h-8 w-8 text-mint/30" aria-hidden="true" />
                    {item.rating && (
                      <div className="flex gap-0.5" role="img" aria-label={`${item.rating}/5`}>
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star
                            key={s}
                            className={s < item.rating! ? 'h-4 w-4 fill-mint-dark text-mint-dark' : 'h-4 w-4 text-slate-300'}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    )}
                    <blockquote className="mt-4 flex-1 text-slate-700">“{item.text}”</blockquote>
                    <figcaption className="mt-6 border-t border-ink-900/[0.07] pt-4">
                      <p className="font-heading font-bold text-ink-900">{item.name}</p>
                      <p className="text-sm text-slate-500">{[item.city, item.vehicle].filter(Boolean).join(' · ')}</p>
                    </figcaption>
                  </figure>
                )}
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
