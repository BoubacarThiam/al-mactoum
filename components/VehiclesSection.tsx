import Link from 'next/link';
import { Search } from 'lucide-react';
import { VehicleCatalog } from '@/components/VehicleCatalog';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { type Dictionary, type Locale, localePath } from '@/lib/i18n';
import { getVehicles } from '@/lib/vehicle-store';

interface VehiclesSectionProps {
  t: Dictionary['vehicles'];
  locale: Locale;
  /** Nombre de véhicules affichés sur l'accueil */
  limit?: number;
  /** Masque le titre (la page dédiée a déjà son propre en-tête) */
  hideHeading?: boolean;
}

export async function VehiclesSection({ t, locale, limit, hideHeading }: VehiclesSectionProps) {
  // Catalogue géré depuis le backoffice (/admin)
  const vehicles = await getVehicles();

  return (
    <section id="vehicules" className="section bg-white" aria-labelledby="vehicules-titre">
      <div className="container">
        {hideHeading ? (
          // Titre invisible : garde une hiérarchie h1 → h2 → h3 correcte pour l'accessibilité
          <h2 id="vehicules-titre" className="sr-only">
            {t.title}
          </h2>
        ) : (
          <div className="mb-12">
            <SectionHeading id="vehicules-titre" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />
          </div>
        )}

        <VehicleCatalog vehicles={vehicles} t={t} locale={locale} limit={limit} />

        {/* Recherche sur mesure */}
        <Reveal className="mt-14">
          <div className="relative overflow-hidden rounded-3xl bg-ink-900 px-6 py-10 text-center md:px-12 md:text-left">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-mint/10" aria-hidden="true" />
            <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-white/[0.03]" aria-hidden="true" />
            <div className="relative flex flex-col items-center gap-6 md:flex-row md:justify-between">
              <div className="max-w-xl">
                <h3 className="font-heading text-2xl font-extrabold text-white">{t.customTitle}</h3>
                <p className="mt-2 text-slate-300">{t.customText}</p>
              </div>
              <Link href={localePath(locale, '/#contact')} className="btn-mint shrink-0">
                <Search className="h-4 w-4" aria-hidden="true" />
                {t.customCta}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
