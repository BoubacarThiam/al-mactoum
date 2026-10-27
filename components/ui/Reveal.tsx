'use client';

import { m } from 'framer-motion';
import { motionTokens } from '@/lib/motion';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Délai en secondes (pour décaler les éléments d'une liste) */
  delay?: number;
  as?: 'div' | 'li' | 'article';
}

/** Fait apparaître son contenu en douceur quand il entre dans l'écran. */
export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const Component = m[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: motionTokens.revealOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: motionTokens.duration.base, delay, ease: motionTokens.easeOut }}
    >
      {children}
    </Component>
  );
}
