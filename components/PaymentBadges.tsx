import { Banknote, Smartphone, Waves } from 'lucide-react';
import { type PaymentMethodId, isFilled, siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

/** Couleurs et icônes de chaque moyen de paiement (bleu ciel Wave, orange Orange Money, vert Cash). */
const styles: Record<PaymentMethodId, { icon: typeof Waves; chip: string; ring: string }> = {
  wave: {
    icon: Waves,
    chip: 'bg-wave text-white',
    ring: 'border-wave/30 bg-wave/[0.07] hover:border-wave/60',
  },
  'orange-money': {
    icon: Smartphone,
    chip: 'bg-orange-money text-white',
    ring: 'border-orange-money/30 bg-orange-money/[0.07] hover:border-orange-money/60',
  },
  cash: {
    icon: Banknote,
    chip: 'bg-cash text-white',
    ring: 'border-cash/30 bg-cash/[0.07] hover:border-cash/60',
  },
};

interface PaymentBadgesProps {
  /** Descriptions courtes par moyen de paiement (traduites) */
  descriptions?: Record<PaymentMethodId, string>;
  /** Libellé "Numéro" (traduit) */
  numberLabel?: string;
  /** Grande version (section paiement) ou compacte (footer, formulaire) */
  variant?: 'large' | 'compact';
  tone?: 'light' | 'dark';
}

/**
 * Badges Wave / Orange Money / Cash.
 * Si un logo officiel est défini dans /config/site.ts (champ "logo"), il remplace l'icône.
 * Les numéros de réception ne s'affichent que lorsqu'ils sont renseignés.
 */
export function PaymentBadges({ descriptions, numberLabel, variant = 'large', tone = 'dark' }: PaymentBadgesProps) {
  const methods = siteConfig.payment.methods;

  if (variant === 'compact') {
    return (
      <ul className="flex flex-wrap gap-2">
        {methods.map((method) => {
          const { icon: Icon, chip } = styles[method.id];
          return (
            <li
              key={method.id}
              className={cn(
                'flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-xs font-semibold',
                tone === 'light' ? 'bg-white/10 text-white' : 'bg-mist text-navy-900',
              )}
            >
              <span className={cn('flex h-6 w-6 items-center justify-center rounded-full', chip)}>
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              {method.name}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {methods.map((method) => {
        const { icon: Icon, chip, ring } = styles[method.id];
        return (
          <li
            key={method.id}
            className={cn(
              'flex items-center gap-4 rounded-2xl border-2 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft sm:flex-col sm:items-start sm:gap-3',
              ring,
            )}
          >
            {method.logo ? (
              // Logo officiel déposé dans /public/images/paiement
              // eslint-disable-next-line @next/next/no-img-element
              <img src={method.logo} alt="" className="h-12 w-12 shrink-0 rounded-xl bg-white object-contain p-1" />
            ) : (
              <span className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm', chip)}>
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
            )}
            <div className="min-w-0">
              <p className="font-heading text-lg font-bold text-navy-900">{method.name}</p>
              {descriptions && <p className="text-sm text-slate-600">{descriptions[method.id]}</p>}
              {isFilled(method.receiveNumber) && (
                <p className="mt-0.5 text-sm font-semibold text-navy-900">
                  {numberLabel} : {method.receiveNumber}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
