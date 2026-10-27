'use client';

import { m } from 'framer-motion';
import { CarFront, KeyRound, SearchCheck, Ship, Wallet } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Dictionary } from '@/lib/i18n';
import { motionTokens } from '@/lib/motion';

const icons = [CarFront, Wallet, SearchCheck, Ship, KeyRound];

/**
 * Le trajet en 5 étapes, dans l'esprit de la vidéo : fond sombre, tracé pointillé vert menthe
 * qui relie chaque étape (vertical sur mobile, horizontal sur grand écran).
 */
export function Steps({ t }: { t: Dictionary['steps'] }) {
  return (
    <section
      id="etapes"
      className="section relative overflow-hidden bg-ink-950 !pt-16 md:!pt-24"
      aria-labelledby="etapes-titre"
    >
      {/* Trame de points discrète, rappel de la carte du monde de la vidéo */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(163,247,198,0.14)_1px,transparent_0)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        aria-hidden="true"
      />

      <div className="container relative">
        <SectionHeading id="etapes-titre" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} tone="light" />

        <ol className="relative mt-14 grid gap-10 lg:mt-20 lg:grid-cols-5 lg:gap-6">
          {/* Tracé du trajet (horizontal sur grand écran) */}
          <m.span
            aria-hidden="true"
            className="absolute left-[10%] right-[10%] top-7 hidden h-0 origin-left border-t-2 border-dashed border-mint/60 lg:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: motionTokens.duration.slow, ease: 'easeInOut' }}
          />
          {/* Tracé du trajet (vertical sur mobile) */}
          <m.span
            aria-hidden="true"
            className="absolute bottom-7 left-7 top-7 w-0 origin-top border-l-2 border-dashed border-mint/60 lg:hidden"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: motionTokens.duration.slow, ease: 'easeInOut' }}
          />

          {t.items.map((step, i) => {
            const Icon = icons[i];
            const isLast = i === t.items.length - 1;
            return (
              <m.li
                key={step.title}
                className="relative flex gap-5 lg:flex-col lg:items-center lg:text-center"
                initial={{ opacity: 0, y: motionTokens.revealOffset }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: motionTokens.duration.base, delay: 0.1 * i, ease: motionTokens.easeOut }}
              >
                <div
                  className={
                    isLast
                      ? 'relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-mint text-ink-950 shadow-[0_0_30px_-4px_rgba(163,247,198,0.7)]'
                      : 'relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-mint/40 bg-ink-900 text-mint'
                  }
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>

                <div className="flex-1 pt-1 lg:mt-5 lg:pt-0">
                  <p className="font-heading text-xs font-bold tracking-[0.25em] text-mint/80">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-1 font-heading text-lg font-bold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.text}</p>
                </div>
              </m.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
