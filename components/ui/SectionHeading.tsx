import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  tone?: 'light' | 'dark';
  align?: 'center' | 'left';
  /** Niveau du titre (h2 sur l'accueil, h1 possible sur une page dédiée) */
  as?: 'h1' | 'h2';
  id?: string;
}

/** Filet à losange repris du logo (◆——) */
export function Ornament({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <span className={cn('flex items-center', flip && 'flex-row-reverse', className)} aria-hidden="true">
      <span className="h-1.5 w-1.5 rotate-45 bg-current" />
      <span className="h-px w-8 bg-current" />
    </span>
  );
}

/** Titre de section standard : sur-titre espacé façon logo, titre, sous-titre. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  tone = 'dark',
  align = 'center',
  as: Tag = 'h2',
  id,
}: SectionHeadingProps) {
  const accent = tone === 'light' ? 'text-mint' : 'text-mint-dark';
  return (
    <Reveal className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
      <p
        className={cn(
          'mb-4 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.32em]',
          accent,
        )}
      >
        <Ornament />
        <span>{eyebrow}</span>
        {align === 'center' && <Ornament flip />}
      </p>
      <Tag
        id={id}
        className={cn(
          'text-balance text-3xl font-extrabold leading-tight md:text-[2.6rem]',
          tone === 'light' ? 'text-white' : 'text-ink-900',
        )}
      >
        {title}
      </Tag>
      {subtitle && (
        <p className={cn('mt-4 text-base md:text-lg', tone === 'light' ? 'text-slate-300' : 'text-slate-600')}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
