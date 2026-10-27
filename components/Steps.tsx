'use client';

import { m } from 'framer-motion';
import { CarFront, KeyRound, SearchCheck, Ship, Wallet } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Dictionary } from '@/lib/i18n';

const icons = [CarFront, Wallet, SearchCheck, Ship, KeyRound];

/** Timeline animée en 5 étapes : verticale sur mobile, horizontale sur grand écran. */
export function Steps({ t }: { t: Dictionary['steps'] }) {
  return (
    <section id="etapes" className="section relative overflow-hidden bg-mist" aria-labelledby="etapes-titre">
      <div className="container">
        <SectionHeading id="etapes-titre" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

        <ol className="relative mt-14 grid gap-8 lg:mt-20 lg:grid-cols-5 lg:gap-6">
          {/* Ligne de progression (horizontale sur grand écran) */}
          <m.span
            aria-hidden="true"
            className="absolute left-[10%] right-[10%] top-8 hidden h-0.5 origin-left bg-gradient-to-r from-gold via-gold to-navy-900 lg:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
          />
          {/* Ligne de progression (verticale sur mobile) */}
          <m.span
            aria-hidden="true"
            className="absolute bottom-8 left-8 top-8 w-0.5 origin-top bg-gradient-to-b from-gold to-navy-900 lg:hidden"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
          />

          {t.items.map((step, i) => {
            const Icon = icons[i];
            const isLast = i === t.items.length - 1;
            return (
              <m.li
                key={step.title}
                className="relative flex gap-5 lg:flex-col lg:items-center lg:text-center"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: 0.15 * i }}
              >
                <div className="relative z-10 shrink-0">
                  <div
                    className={
                      isLast
                        ? 'flex h-16 w-16 items-center justify-center rounded-2xl bg-gold text-navy-950 shadow-lift'
                        : 'flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-900 text-gold shadow-lift'
                    }
                  >
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-mist bg-white font-heading text-xs font-extrabold text-navy-900 shadow-sm">
                    {i + 1}
                  </span>
                </div>

                <div className="card flex-1 p-5 lg:mt-6 lg:w-full lg:bg-white/80 lg:p-5">
                  <h3 className="font-heading text-base font-bold text-navy-900 md:text-lg">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.text}</p>
                </div>
              </m.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
