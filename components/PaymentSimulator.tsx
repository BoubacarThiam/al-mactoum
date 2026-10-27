'use client';

import { useId, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { Calculator, Info } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/BrandIcons';
import { siteConfig } from '@/config/site';
import type { Dictionary } from '@/lib/i18n';
import { fill, formatFCFA, whatsappLink } from '@/lib/utils';

/** Montant maximum accepté (évite les saisies absurdes) : 10 milliards FCFA. */
const MAX_AMOUNT = 10_000_000_000;

/**
 * Simulateur 60/40 : le client saisit le prix total en FCFA,
 * l'acompte et le solde sont calculés automatiquement.
 */
export function PaymentSimulator({ t }: { t: Dictionary['payment']['simulator'] }) {
  const inputId = useId();
  const hintId = useId();
  const [raw, setRaw] = useState('');

  const total = Math.min(Number(raw) || 0, MAX_AMOUNT);
  const deposit = (total * siteConfig.payment.depositPercent) / 100;
  const balance = total - deposit;
  const hasAmount = total > 0;

  // Affiche le montant saisi avec des espaces : 10000000 → "10 000 000"
  const display = raw ? raw.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '';

  const message = fill(t.whatsappMessage, { amount: formatFCFA(deposit) });

  return (
    <div className="card relative overflow-hidden p-6 md:p-8">
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-mint/10" aria-hidden="true" />

      <div className="relative flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-900 text-mint">
          <Calculator className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-heading text-xl font-bold text-ink-900">{t.title}</h3>
          <p className="text-sm text-slate-600">{t.subtitle}</p>
        </div>
      </div>

      <label htmlFor={inputId} className="field-label relative mt-6">
        {t.label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder={t.placeholder}
          value={display}
          onChange={(e) => setRaw(e.target.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 11))}
          aria-describedby={hintId}
          className="field pr-20 font-heading text-lg font-bold"
        />
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-slate-500">
          FCFA
        </span>
      </div>

      {/* Résultats */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2" aria-live="polite">
        <div className="rounded-xl bg-ink-900 p-4 text-white">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-300">{t.deposit}</p>
          <AnimatePresence mode="popLayout" initial={false}>
            <m.p
              key={deposit}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-1 font-heading text-xl font-extrabold tabular-nums text-mint md:text-2xl"
            >
              {formatFCFA(deposit)}
            </m.p>
          </AnimatePresence>
        </div>
        <div className="rounded-xl border-2 border-dashed border-ink-900/15 bg-mist p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-600">{t.balance}</p>
          <AnimatePresence mode="popLayout" initial={false}>
            <m.p
              key={balance}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-1 font-heading text-xl font-extrabold tabular-nums text-ink-900 md:text-2xl"
            >
              {formatFCFA(balance)}
            </m.p>
          </AnimatePresence>
        </div>
      </div>

      <p id={hintId} className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
        <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {t.disclaimer}
      </p>

      {hasAmount ? (
        <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp mt-6 w-full">
          <WhatsAppIcon className="h-5 w-5" />
          {t.cta}
        </a>
      ) : (
        <button type="button" disabled className="btn-whatsapp mt-6 w-full" title={t.ctaHint}>
          <WhatsAppIcon className="h-5 w-5" />
          {t.cta}
        </button>
      )}
      {!hasAmount && <p className="mt-2 text-center text-xs text-slate-500">{t.ctaHint}</p>}
    </div>
  );
}
