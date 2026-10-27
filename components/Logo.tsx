import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  /** Charge le logo en priorité (header, visible dès l'arrivée sur la page) */
  priority?: boolean;
}

/**
 * Logo officiel AL MACTOUM (version horizontale, fond transparent).
 * Fichier : /public/brand/logo-horizontal.webp — conçu pour un fond sombre.
 * Le logo carré d'origine est dans /public/brand/logo-al-mactoum.png.
 */
export function Logo({ className, priority }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/logo-horizontal.webp"
      alt="AL MACTOUM BUSINESS AUTOMOBILE"
      width={380}
      height={130}
      fetchPriority={priority ? 'high' : undefined}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={cn('h-11 w-auto', className)}
    />
  );
}
