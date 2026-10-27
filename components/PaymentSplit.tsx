'use client';

import { m } from 'framer-motion';
import { CircleCheck, Clock3 } from 'lucide-react';
import { siteConfig } from '@/config/site';
import type { Dictionary } from '@/lib/i18n';
import { motionTokens } from '@/lib/motion';

/** Visuel 60 % / 40 % avec barre de progression animée. */
export function PaymentSplit({ t }: { t: Dictionary['payment'] }) {
  const { depositPercent, balancePercent } = siteConfig.payment;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl bg-navy-900 p-6 text-white shadow-lift">
          <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-gold/15" aria-hidden="true" />
          <CircleCheck className="h-6 w-6 text-gold" aria-hidden="true" />
          <p className="mt-4 font-heading text-5xl font-extrabold text-gold md:text-6xl">{depositPercent} %</p>
          <p className="mt-2 font-heading text-lg font-bold">{t.depositLabel}</p>
          <p className="mt-1 text-sm text-slate-300">{t.depositText}</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl border-2 border-gold/40 bg-white p-6 shadow-soft">
          <Clock3 className="h-6 w-6 text-gold-dark" aria-hidden="true" />
          <p className="mt-4 font-heading text-5xl font-extrabold text-navy-900 md:text-6xl">{balancePercent} %</p>
          <p className="mt-2 font-heading text-lg font-bold text-navy-900">{t.balanceLabel}</p>
          <p className="mt-1 text-sm text-slate-600">{t.balanceText}</p>
        </div>
      </div>

      {/* Barre de progression 60 / 40 */}
      <div
        className="mt-6 flex h-4 overflow-hidden rounded-full bg-navy-900/10"
        role="img"
        aria-label={t.progressLabel}
      >
        <m.div
          className="h-full rounded-l-full bg-gradient-to-r from-navy-900 to-navy-700"
          initial={{ width: 0 }}
          whileInView={{ width: `${depositPercent}%` }}
          viewport={{ once: true }}
          transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easeOut }}
        />
        <m.div
          className="h-full rounded-r-full bg-gradient-to-r from-gold to-gold-light"
          initial={{ width: 0 }}
          whileInView={{ width: `${balancePercent}%` }}
          viewport={{ once: true }}
          transition={{ duration: motionTokens.duration.base, delay: motionTokens.duration.slow, ease: motionTokens.easeOut }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs font-semibold text-slate-600" aria-hidden="true">
        <span>
          {depositPercent} % · {t.depositLabel}
        </span>
        <span>
          {balancePercent} % · {t.balanceLabel}
        </span>
      </div>
    </div>
  );
}
