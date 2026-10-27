/**
 * Réglages d'animation partagés (durées en secondes).
 * Animations sobres et courtes : le site doit inspirer confiance, pas impressionner.
 * Le réglage « réduire les animations » du visiteur est respecté (voir MotionProvider).
 */
export const motionTokens = {
  duration: {
    /** Retour d'interaction (survol, changement d'état) */
    fast: 0.2,
    /** Apparition d'un bloc à l'écran */
    base: 0.45,
    /** Barres et lignes de progression */
    slow: 0.9,
  },
  /** Décélération à l'arrivée */
  easeOut: [0.2, 0.7, 0.2, 1] as const,
  /** Distance de glissement à l'apparition (px) */
  revealOffset: 16,
  /** Décalage entre deux éléments d'une liste */
  stagger: 0.06,
};
