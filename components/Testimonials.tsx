import { MessageSquareQuote, Quote, Star } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { motionTokens } from '@/lib/motion';
import { testimonials } from '@/data/testimonials';
import type { Dictionary } from '@/lib/i18n';

/**
 * Témoignages clients — alimentés par /data/testimonials.ts.
 * Aucun faux avis : tant qu'il n'y a que des emplacements vides, la section est masquée
 * sur le site en ligne (des cases « à remplacer » nuiraient à la confiance) et ne reste
 * visible qu'en développement (npm run dev), comme rappel.
 */
export function Testimonials({ t }: { t: Dictionary['testimonials'] }) {
  const hasRealReviews = testimonials.some((item) => !item.placeholder);
  if (!hasRealReviews && process.env.NODE_ENV === 'production') return null;
  // En ligne, seuls les vrais avis sont affichés
  const items = process.env.NODE_ENV === 'production' ? testimonials.filter((item) => !item.placeholder) : testimonials;

  return (
    <section className="section bg-mist" aria-labelledby="temoignages-titre">
      <div className="container">
        <SectionHeading id="temoignages-titre" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

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
      </div>
    </section>
  );
}
