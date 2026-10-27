import Image from 'next/image';
import { CalendarDays, Gauge } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/BrandIcons';
import type { Vehicle } from '@/data/vehicles';
import type { Dictionary } from '@/lib/i18n';
import { fill, formatKm, whatsappLink } from '@/lib/utils';

interface VehicleCardProps {
  vehicle: Vehicle;
  t: Dictionary['vehicles'];
}

/** Carte d'un véhicule du catalogue. */
export function VehicleCard({ vehicle, t }: VehicleCardProps) {
  const name = `${vehicle.brand} ${vehicle.model} ${vehicle.year}`;
  const message = fill(t.whatsappMessage, { vehicle: name });

  return (
    <article className="card group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-mist">
        <Image
          src={vehicle.image}
          alt={vehicle.imageAlt}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-navy-900 shadow-sm">
            {t.types[vehicle.type]}
          </span>
          {vehicle.isExample && (
            <span className="rounded-full bg-gold px-3 py-1 text-[0.7rem] font-extrabold tracking-wider text-navy-950 shadow-sm">
              {t.example}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-dark">{vehicle.brand}</p>
        <h3 className="mt-1 font-heading text-xl font-bold text-navy-900">
          {vehicle.model}
        </h3>

        <dl className="mt-4 grid grid-cols-2 gap-3 border-y border-navy-900/[0.07] py-4 text-sm">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <dt className="sr-only">{t.year}</dt>
            <dd className="font-medium text-navy-900">{vehicle.year}</dd>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <dt className="sr-only">{t.mileage}</dt>
            <dd className="font-medium text-navy-900">{formatKm(vehicle.mileageKm)}</dd>
          </div>
        </dl>

        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-sm text-slate-500">{t.price}</span>
          <span className="font-heading text-lg font-extrabold text-navy-900">{vehicle.price || t.onQuote}</span>
        </div>

        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-navy mt-5 w-full !py-3 text-sm group-hover:bg-whatsapp group-hover:text-navy-950"
          aria-label={`${t.cta} — ${name}`}
        >
          <WhatsAppIcon className="h-4 w-4" />
          {t.cta}
        </a>
      </div>
    </article>
  );
}
