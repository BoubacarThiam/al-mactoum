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

/** Titre de section standard : sur-titre doré, titre, sous-titre. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  tone = 'dark',
  align = 'center',
  as: Tag = 'h2',
  id,
}: SectionHeadingProps) {
  return (
    <Reveal className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
      <p className="mb-3 inline-flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-[0.22em] text-gold-dark">
        <span className="h-px w-6 bg-gold" aria-hidden="true" />
        <span className={tone === 'light' ? 'text-gold' : undefined}>{eyebrow}</span>
      </p>
      <Tag
        id={id}
        className={cn(
          'text-balance text-3xl font-extrabold leading-tight md:text-4xl',
          tone === 'light' ? 'text-white' : 'text-navy-900',
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
