'use client';

import { m } from 'framer-motion';

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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </Component>
  );
}
