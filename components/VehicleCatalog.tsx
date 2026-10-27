'use client';

import { useId, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowRight, SearchX } from 'lucide-react';
import { VehicleCard } from '@/components/VehicleCard';
import { type Vehicle, type VehicleType } from '@/data/vehicles';
import { type Dictionary, type Locale, localePath } from '@/lib/i18n';
import { cn, fill } from '@/lib/utils';

interface VehicleCatalogProps {
  vehicles: Vehicle[];
  t: Dictionary['vehicles'];
  locale: Locale;
  /** Nombre maximum de véhicules affichés (accueil). Sans limite sur la page /vehicules. */
  limit?: number;
}

const TYPES: VehicleType[] = ['suv', 'berline', 'pickup'];

/** Grille de véhicules avec filtres par marque et par type. */
export function VehicleCatalog({ vehicles, t, locale, limit }: VehicleCatalogProps) {
  const brandSelectId = useId();
  const [brand, setBrand] = useState('');
  const [type, setType] = useState<VehicleType | ''>('');

  const brands = useMemo(() => Array.from(new Set(vehicles.map((v) => v.brand))).sort(), [vehicles]);
  // Seuls les types présents dans le catalogue sont proposés ; le filtre est masqué s'il n'y en a qu'un
  const types = useMemo(() => TYPES.filter((type) => vehicles.some((v) => v.type === type)), [vehicles]);

  const filtered = vehicles.filter((v) => (!brand || v.brand === brand) && (!type || v.type === type));
  const shown = limit ? filtered.slice(0, limit) : filtered;

  return (
    <div>
      {/* Filtres : seulement sur la page /vehicules (inutiles pour la sélection courte de l'accueil) */}
      {!limit && (
        <div className="flex flex-col gap-4 rounded-2xl bg-mist p-4 md:flex-row md:items-center md:justify-between md:p-5">
          {types.length > 1 ? (
            <div role="group" aria-label={t.filterType} className="flex flex-wrap gap-2">
              {(['', ...types] as const).map((value) => (
                <button
                  key={value || 'all'}
                  type="button"
                  onClick={() => setType(value)}
                  aria-pressed={type === value}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                    type === value
                      ? 'bg-ink-900 text-white shadow-soft'
                      : 'bg-white text-ink-900 hover:bg-ink-900/5',
                  )}
                >
                  {value ? t.types[value] : t.all}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm font-semibold text-ink-900">{fill(t.resultCount, { count: filtered.length })}</p>
          )}

          <div className="flex items-center gap-3">
            <label htmlFor={brandSelectId} className="text-sm font-medium text-slate-600">
              {t.filterBrand}
            </label>
            <select
              id={brandSelectId}
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="field !w-auto min-w-[180px] !py-2"
            >
              <option value="">{t.allBrands}</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Nombre de résultats (déjà affiché dans la barre de filtres quand le filtre par type est masqué) */}
      {!limit && (
        <p className={cn('mt-4 text-sm text-slate-500', types.length <= 1 && 'sr-only')} aria-live="polite">
          {fill(t.resultCount, { count: filtered.length })}
        </p>
      )}

      {/* Grille */}
      {shown.length > 0 ? (
        <m.ul layout className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((vehicle) => (
              <m.li
                key={vehicle.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
              >
                <VehicleCard vehicle={vehicle} t={t} locale={locale} />
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>
      ) : (
        <div className="mt-4 flex flex-col items-center rounded-2xl border-2 border-dashed border-ink-900/10 py-14 text-center">
          <SearchX className="h-10 w-10 text-slate-300" aria-hidden="true" />
          <p className="mt-3 text-slate-600">{t.empty}</p>
        </div>
      )}

      {limit && filtered.length > limit && (
        <div className="mt-10 text-center">
          <Link href={localePath(locale, '/vehicules')} className="btn-outline group">
            {t.seeAll}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}
