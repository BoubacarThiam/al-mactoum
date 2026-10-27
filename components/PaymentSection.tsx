import { ShieldCheck } from 'lucide-react';
import { PaymentBadges } from '@/components/PaymentBadges';
import { PaymentSimulator } from '@/components/PaymentSimulator';
import { PaymentSplit } from '@/components/PaymentSplit';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Dictionary } from '@/lib/i18n';

interface PaymentSectionProps {
  t: Dictionary['payment'];
  /** Titre principal de la page (h1) sur la page dédiée /paiement */
  headingAs?: 'h1' | 'h2';
}

/** Section Paiement : modèle 60/40, moyens de paiement et simulateur. */
export function PaymentSection({ t, headingAs = 'h2' }: PaymentSectionProps) {
  return (
    <section id="paiement" className="section relative overflow-hidden" aria-labelledby="paiement-titre">
      <div
        className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-mint/[0.07] to-transparent"
        aria-hidden="true"
      />
      <div className="container">
        <SectionHeading id="paiement-titre" as={headingAs} eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <Reveal>
            <PaymentSplit t={t} />

            <div className="mt-10">
              <h3 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold text-ink-900">
                <ShieldCheck className="h-5 w-5 text-mint-dark" aria-hidden="true" />
                {t.methodsTitle}
              </h3>
              <PaymentBadges descriptions={t.methods} numberLabel={t.receiveNumber} />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <PaymentSimulator t={t.simulator} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
