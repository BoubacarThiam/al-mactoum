'use client';

import { useId, useState } from 'react';
import { m } from 'framer-motion';
import { MessageCircle, Plus } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Dictionary } from '@/lib/i18n';
import { cn, whatsappLink } from '@/lib/utils';

interface FAQProps {
  t: Dictionary['faq'];
  whatsappMessage: string;
  headingAs?: 'h1' | 'h2';
}

/**
 * FAQ en accordéon animé.
 * ⚠️ Les réponses (dans /locales/fr.json et en.json, rubrique "faq") sont génériques :
 *    à VÉRIFIER et ajuster par l'entreprise (délais, garanties, dédouanement…).
 */
export function FAQ({ t, whatsappMessage, headingAs = 'h2' }: FAQProps) {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section bg-mist" aria-labelledby="faq-titre">
      <div className="container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading id="faq-titre" as={headingAs} eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} align="left" />
          <a
            href={whatsappLink(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-8"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            WhatsApp
          </a>
        </div>

        <ul className="space-y-3">
          {t.items.map((item, i) => {
            const isOpen = open === i;
            const buttonId = `${baseId}-q${i}`;
            const panelId = `${baseId}-a${i}`;
            return (
              <li
                key={item.q}
                className={cn(
                  'overflow-hidden rounded-2xl border bg-white transition-all duration-300',
                  isOpen ? 'border-gold/50 shadow-soft' : 'border-navy-900/[0.07]',
                )}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-6"
                  >
                    <span className="font-heading text-base font-bold text-navy-900 md:text-lg">{item.q}</span>
                    <span
                      className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300',
                        isOpen ? 'rotate-45 bg-gold text-navy-950' : 'bg-mist text-navy-900',
                      )}
                      aria-hidden="true"
                    >
                      <Plus className="h-5 w-5" />
                    </span>
                  </button>
                </h3>
                {/* La réponse reste dans le HTML (utile pour Google), elle est seulement repliée */}
                <m.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!isOpen}
                  className="overflow-hidden"
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <p className="px-5 pb-6 leading-relaxed text-slate-600 md:px-6">{item.a}</p>
                </m.div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Données structurées FAQ pour Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: t.items.map((item) => ({
              '@type': 'Question',
              name: item.q,
              acceptedAnswer: { '@type': 'Answer', text: item.a },
            })),
          }).replace(/</g, '\\u003c'),
        }}
      />
    </section>
  );
}
