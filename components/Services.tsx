import { FileCheck2, KeyRound, Search, ShieldCheck, Ship, SearchCheck } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { motionTokens } from '@/lib/motion';
import type { Dictionary } from '@/lib/i18n';

// Une icône par service, dans le même ordre que dans /locales
const icons = [Search, SearchCheck, ShieldCheck, Ship, FileCheck2, KeyRound];

export function Services({ t }: { t: Dictionary['services'] }) {
  return (
    <section id="services" className="section" aria-labelledby="services-titre">
      <div className="container">
        <SectionHeading id="services-titre" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.items.map((service, i) => {
            const Icon = icons[i];
            return (
              <Reveal as="li" key={service.title} delay={motionTokens.stagger * i}>
                <article className="card group relative h-full overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1 hover:border-mint/40 hover:shadow-lift">
                  <span
                    className="absolute right-6 top-5 font-heading text-5xl font-extrabold text-ink-900/[0.05] transition-colors group-hover:text-mint/20"
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mist text-ink-900 transition-colors duration-300 group-hover:bg-ink-900 group-hover:text-mint">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 font-heading text-lg font-bold text-ink-900">{service.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-600">{service.text}</p>
                  <span
                    className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-mint to-mint-light transition-transform duration-500 group-hover:scale-x-100"
                    aria-hidden="true"
                  />
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
