'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CalendarDays, ChevronLeft, ChevronRight, Gauge, Palette } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/BrandIcons';
import type { Vehicle } from '@/data/vehicles';
import type { Dictionary, Locale } from '@/lib/i18n';
import { cn, fill, formatKm, whatsappLink } from '@/lib/utils';

interface VehicleCardProps {
  vehicle: Vehicle;
  t: Dictionary['vehicles'];
  locale: Locale;
}

/** Carte d'un véhicule du catalogue (avec galerie si plusieurs photos). */
export function VehicleCard({ vehicle, t, locale }: VehicleCardProps) {
  const [index, setIndex] = useState(0);
  const count = vehicle.images.length;
  const color = vehicle.color?.[locale];

  // Nom utilisé dans le message WhatsApp, ex. "Hyundai Tucson gris 2021"
  const name = [vehicle.brand, vehicle.model, color?.toLowerCase(), vehicle.year].filter(Boolean).join(' ');
  const message = fill(t.whatsappMessage, { vehicle: name });

  const specs = [
    vehicle.year && { icon: CalendarDays, label: t.year, value: String(vehicle.year) },
    vehicle.mileageKm && { icon: Gauge, label: t.mileage, value: formatKm(vehicle.mileageKm) },
    color && { icon: Palette, label: t.color, value: color },
  ].filter(Boolean) as Array<{ icon: typeof Gauge; label: string; value: string }>;

  const go = (step: number) => setIndex((i) => (i + step + count) % count);

  return (
    <article className="card group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-mist">
        {/* Seule la photo affichée est chargée */}
        <Image
          key={vehicle.images[index]}
          src={vehicle.images[index]}
          alt={index === 0 ? vehicle.imageAlt : `${vehicle.brand} ${vehicle.model} — ${t.photo} ${index + 1}/${count}`}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="animate-fade-in object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-ink-900 shadow-sm">
            {t.types[vehicle.type]}
          </span>
          {vehicle.isExample && (
            <span className="rounded-full bg-mint px-3 py-1 text-[0.7rem] font-extrabold tracking-wider text-ink-950 shadow-sm">
              {t.example}
            </span>
          )}
        </div>

        {/* Galerie : flèches et points (seulement s'il y a plusieurs photos) */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={t.previousPhoto}
              className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow-sm transition hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={t.nextPhoto}
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow-sm transition hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-hidden="true">
              {vehicle.images.map((src, i) => (
                <span
                  key={src}
                  className={cn('h-1.5 rounded-full bg-white shadow transition-all', i === index ? 'w-5' : 'w-1.5 opacity-60')}
                />
              ))}
            </div>
            <span className="sr-only" aria-live="polite">
              {t.photo} {index + 1}/{count}
            </span>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark">{vehicle.brand}</p>
        <h3 className="mt-1 font-heading text-xl font-bold text-ink-900">{vehicle.model}</h3>

        {specs.length > 0 && (
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-y border-ink-900/[0.07] py-4 text-sm">
            {specs.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <dt className="sr-only">{label}</dt>
                <dd className="font-medium text-ink-900">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-auto flex items-baseline justify-between pt-4">
          <span className="text-sm text-slate-500">{t.price}</span>
          <span className="font-heading text-lg font-extrabold text-ink-900">{vehicle.price || t.onQuote}</span>
        </div>

        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ink mt-5 w-full !py-3 text-sm group-hover:bg-whatsapp group-hover:text-ink-950"
        >
          <WhatsAppIcon className="h-4 w-4" />
          {t.cta}
          <span className="sr-only">— {name}</span>
        </a>
      </div>
    </article>
  );
}
