import Image from 'next/image';
import { Globe2, Headset, ShieldCheck, Smartphone } from 'lucide-react';
import { FlagCA, FlagSN } from '@/components/icons/BrandIcons';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { motionTokens } from '@/lib/motion';
import type { Dictionary } from '@/lib/i18n';

const icons = [ShieldCheck, Smartphone, Globe2, Headset];

interface WhyUsProps {
  t: Dictionary['why'];
  common: Dictionary['common'];
}

/** Section "Pourquoi nous choisir" : 4 arguments + photo. */
export function WhyUs({ t, common }: WhyUsProps) {
  return (
    <section className="section relative overflow-hidden bg-ink-950" aria-labelledby="pourquoi-titre">
      <div className="absolute inset-0 opacity-[0.07]" aria-hidden="true">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:28px_28px]" />
      </div>

      <div className="container relative grid items-center gap-14 lg:grid-cols-2">
        <div>
          <SectionHeading
            id="pourquoi-titre"
            eyebrow={t.eyebrow}
            title={t.title}
            subtitle={t.subtitle}
            tone="light"
            align="left"
          />

          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {t.items.map((item, i) => {
              const Icon = icons[i];
              return (
                <Reveal as="li" key={item.title} delay={motionTokens.stagger * i}>
                  <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:border-mint/40 hover:bg-white/[0.07]">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint/15 text-mint transition-colors group-hover:bg-mint group-hover:text-ink-950">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 font-heading text-lg font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>

        <Reveal delay={0.1} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-lift sm:aspect-[4/3] lg:aspect-[4/5]">
            {/* Photo à remplacer dans /public/images/route-voiture.webp */}
            <Image
              src="/images/route-voiture.webp"
              alt={t.imageAlt}
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" aria-hidden="true" />
          </div>
          {/* Carte "Canada ⇄ Dakar" */}
          <div className="absolute -bottom-6 left-4 right-4 flex items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-lift sm:left-8 sm:right-auto sm:min-w-[320px]">
            <div className="flex items-center gap-3">
              <FlagCA className="h-5 w-10 rounded-sm shadow-sm" title={common.canada} />
              <span className="font-heading font-bold text-ink-900">{common.canada}</span>
            </div>
            <span className="flex-1 border-t-2 border-dashed border-mint-dark" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <span className="font-heading font-bold text-ink-900">Dakar</span>
              <FlagSN className="h-5 w-[30px] rounded-sm shadow-sm" title={common.senegal} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
