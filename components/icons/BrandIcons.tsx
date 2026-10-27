/**
 * Icônes de marques (TikTok, Facebook, WhatsApp) et drapeaux en SVG.
 * lucide-react ne fournit pas ces logos, ils sont donc dessinés ici.
 */
type IconProps = { className?: string; title?: string };

function a11y(title?: string) {
  return title ? { role: 'img' as const, 'aria-label': title } : { 'aria-hidden': true as const };
}

export function TikTokIcon({ className, title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...a11y(title)}>
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48Z" />
    </svg>
  );
}

export function FacebookIcon({ className, title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...a11y(title)}>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.49h-2.8V24C19.62 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

export function WhatsAppIcon({ className, title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...a11y(title)}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.07-.13-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.43 9.88-9.89 9.88m8.41-18.3A11.81 11.81 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.48-8.41" />
    </svg>
  );
}

/** Feuille d'érable stylisée (repère 24×24) */
export const MAPLE_LEAF_PATH =
  'M12 1.5l1.6 3.3 1.8-.9-.5 4.7 2.7-2.4.7 1.6 2.9-.6-1 3.1 1.5.9-4.9 4.1.6 1.8-4.8-.7V22h-1.2v-5.6l-4.8.7.6-1.8-4.9-4.1 1.5-.9-1-3.1 2.9.6.7-1.6 2.7 2.4-.5-4.7 1.8.9z';

/** Étoile à 5 branches centrée en (0,0), rayon 1 */
export const STAR_PATH =
  'M0 -1L.235 -.324L.951 -.309L.38 .124L.588 .809L0 .4L-.588 .809L-.38 .124L-.951 -.309L-.235 -.324Z';

export function FlagSN({ className, title }: IconProps) {
  return (
    <svg viewBox="0 0 30 20" className={className} {...a11y(title)}>
      <rect width="10" height="20" fill="#00853F" />
      <rect x="10" width="10" height="20" fill="#FDEF42" />
      <rect x="20" width="10" height="20" fill="#E31B23" />
      <path d={STAR_PATH} transform="translate(15 10.4) scale(3.6)" fill="#00853F" />
    </svg>
  );
}

export function FlagCA({ className, title }: IconProps) {
  return (
    <svg viewBox="0 0 40 20" className={className} {...a11y(title)}>
      <rect width="40" height="20" fill="#FFFFFF" />
      <rect width="10" height="20" fill="#D52B1E" />
      <rect x="30" width="10" height="20" fill="#D52B1E" />
      <path d={MAPLE_LEAF_PATH} transform="translate(13.6 3.2) scale(0.57)" fill="#D52B1E" />
    </svg>
  );
}
