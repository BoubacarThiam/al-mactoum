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

/** Section Paiement : modèle 60/40 et simulateur. */
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
          </Reveal>

          <Reveal delay={0.15}>
            <PaymentSimulator t={t.simulator} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
