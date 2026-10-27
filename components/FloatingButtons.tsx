'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/BrandIcons';
import { whatsappLink } from '@/lib/utils';

interface FloatingButtonsProps {
  whatsappLabel: string;
  whatsappMessage: string;
  backToTopLabel: string;
}

/** Bouton WhatsApp flottant (avec pulsation discrète) + bouton "retour en haut". */
export function FloatingButtons({ whatsappLabel, whatsappMessage, backToTopLabel }: FloatingButtonsProps) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-3 md:bottom-7 md:right-7"
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      <AnimatePresence>
        {showTop && (
          <m.button
            type="button"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label={backToTopLabel}
            title={backToTopLabel}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-900 text-white shadow-lift transition-colors hover:bg-gold hover:text-navy-950"
          >
            <ArrowUp className="h-5 w-5" aria-hidden="true" />
          </m.button>
        )}
      </AnimatePresence>

      <a
        href={whatsappLink(whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={whatsappLabel}
        title={whatsappLabel}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lift transition-transform hover:scale-105"
      >
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-whatsapp" aria-hidden="true" />
        <WhatsAppIcon className="relative h-7 w-7" />
      </a>
    </div>
  );
}
