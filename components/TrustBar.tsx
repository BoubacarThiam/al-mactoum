import { Clock, MapPin, ShieldCheck } from 'lucide-react';
import { FlagCA } from '@/components/icons/BrandIcons';
import { siteConfig } from '@/config/site';
import type { Dictionary, Locale } from '@/lib/i18n';
import { fill } from '@/lib/utils';

interface TrustBarProps {
  locale: Locale;
  t: Dictionary['trust'];
}

/**
 * Bandeau de confiance sous le hero : uniquement des faits vérifiables
 * (adresse, téléphone Canada, modèle de paiement, horaires), tirés de /config/site.ts.
 */
export function TrustBar({ locale, t }: TrustBarProps) {
  const canada = siteConfig.phones.find((p) => p.country === 'CA');
  const values = { phone: canada?.display ?? '', hours: siteConfig.hours[locale] };
  const icons = [MapPin, null, ShieldCheck, Clock];

  return (
    // Fond gris clair = continuité avec la section suivante ; seule la carte remonte sur le hero
    <section aria-label={t.label} className="relative z-10 bg-mist">
      <div className="container -mt-14 md:-mt-20">
        <ul className="grid grid-cols-2 overflow-hidden rounded-2xl bg-white shadow-lift ring-1 ring-navy-900/[0.06] lg:grid-cols-4">
          {t.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <li
                key={item.title}
                className="flex flex-col gap-3 border-navy-900/[0.07] p-5 sm:flex-row sm:items-center md:p-6 [&:nth-child(-n+2)]:border-b lg:[&:nth-child(-n+2)]:border-b-0 [&:nth-child(odd)]:border-r lg:[&:not(:last-child)]:border-r"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-gold">
                  {Icon ? (
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <FlagCA className="h-4 w-8 rounded-[2px]" />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block font-heading text-sm font-bold text-navy-900 md:text-base">
                    {fill(item.title, values)}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-600 md:text-sm">
                    {i === 1 && canada ? (
                      <a href={`tel:${canada.tel}`} className="font-medium underline-offset-2 hover:text-navy-900 hover:underline">
                        {values.phone}
                      </a>
                    ) : (
                      fill(item.text, values)
                    )}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
