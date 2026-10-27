import { MAPLE_LEAF_PATH, STAR_PATH } from '@/components/icons/BrandIcons';
import { cn } from '@/lib/utils';

/**
 * Emblème AL MACTOUM : une feuille d'érable (Canada) reliée par une route
 * en pointillés à une étoile (Sénégal), sur fond doré.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="logo-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E2C25A" />
          <stop offset="1" stopColor="#B38D1A" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#logo-gold)" />
      <path
        d="M15 30.5C19 19 27 14.5 34.5 14"
        fill="none"
        stroke="#0B1F3A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="0.1 4"
      />
      <path d={MAPLE_LEAF_PATH} transform="translate(4.5 24.5) scale(0.72)" fill="#0B1F3A" />
      <path d={STAR_PATH} transform="translate(36 13.5) scale(7.2)" fill="#0B1F3A" />
    </svg>
  );
}

interface LogoProps {
  /** "light" = texte blanc (sur fond sombre), "dark" = texte bleu nuit (sur fond clair) */
  tone?: 'light' | 'dark';
  className?: string;
}

export function Logo({ tone = 'dark', className }: LogoProps) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark className="h-10 w-10 shrink-0 drop-shadow-sm" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-heading text-lg font-extrabold tracking-[0.08em] transition-colors',
            tone === 'light' ? 'text-white' : 'text-navy-900',
          )}
        >
          AL MACTOUM
        </span>
        <span className="mt-1 whitespace-nowrap font-heading text-[0.55rem] font-semibold tracking-[0.2em] text-gold sm:tracking-[0.28em]">
          BUSINESS AUTOMOBILE
        </span>
      </span>
    </span>
  );
}
