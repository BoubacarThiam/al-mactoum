import { CAR_SHAPE_PATH } from './car-shape';

/**
 * Éléments graphiques partagés par les sections animées (classes am-* de app/am-motion.css).
 * La silhouette du logo est déclarée une seule fois (CarSprite) puis réutilisée avec <use>.
 */

/** Déclare la silhouette de la voiture, à placer une fois en haut de la page. */
export function CarSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <path id="am-car-shape" fillRule="evenodd" d={CAR_SHAPE_PATH} />
      </defs>
    </svg>
  );
}

export function CarShape({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 265 84" aria-hidden="true">
      <use href="#am-car-shape" />
    </svg>
  );
}

export function ArrowUpRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

/** Étoile à 4 branches qui sépare les mots des bandes défilantes. */
export function Sparkle() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 0C11 7 13 9 20 10 13 11 11 13 10 20 9 13 7 11 0 10 7 9 9 7 10 0Z" />
    </svg>
  );
}

export function KitFlagCA({ label }: { label: string }) {
  return (
    <svg className="am-flag" viewBox="0 0 32 24" role="img" aria-label={label}>
      <rect width="32" height="24" fill="#fff" />
      <rect width="8" height="24" fill="#D52B1E" />
      <rect x="24" width="8" height="24" fill="#D52B1E" />
      <polygon
        points="16.00,2.40 17.40,5.20 19.00,4.40 18.40,8.40 20.80,6.40 21.40,7.60 23.60,7.00 22.80,9.60 24.00,10.20 20.80,12.80 21.40,14.00 16.80,13.60 16.90,17.80 15.10,17.80 15.20,13.60 10.60,14.00 11.20,12.80 8.00,10.20 9.20,9.60 8.40,7.00 10.60,7.60 11.20,6.40 13.60,8.40 13.00,4.40 14.60,5.20"
        fill="#D52B1E"
      />
    </svg>
  );
}

export function KitFlagSN({ label }: { label: string }) {
  return (
    <svg className="am-flag" viewBox="0 0 32 24" role="img" aria-label={label}>
      <rect width="10.7" height="24" fill="#00853F" />
      <rect x="10.6" width="10.8" height="24" fill="#FDEF42" />
      <rect x="21.3" width="10.7" height="24" fill="#E31B23" />
      <polygon
        points="16.00,8.20 17.00,11.02 19.99,11.10 17.62,12.93 18.47,15.80 16.00,14.10 13.53,15.80 14.38,12.93 12.01,11.10 15.00,11.02"
        fill="#00853F"
      />
    </svg>
  );
}

/** Image du SUV détouré (883 × 520, fond transparent). */
export const SUV_IMAGE = '/animations/suv.webp';
