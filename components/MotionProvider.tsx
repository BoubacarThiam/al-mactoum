'use client';

import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';

/**
 * Charge Framer Motion en version allégée (LazyMotion) et respecte
 * le réglage "réduire les animations" du téléphone / ordinateur du visiteur.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
