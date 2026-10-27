'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { Phone } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { WhatsAppIcon } from '@/components/icons/BrandIcons';
import { siteConfig } from '@/config/site';
import { type Dictionary, type Locale, localePath } from '@/lib/i18n';
import { cn, whatsappLink } from '@/lib/utils';

interface HeaderProps {
  locale: Locale;
  nav: Dictionary['nav'];
  whatsappMessage: string;
  skipLabel: string;
  navLabels: { main: string; mobile: string };
}

export function Header({ locale, nav, whatsappMessage, skipLabel, navLabels }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Header transparent en haut de page, opaque dès que l'on fait défiler
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Menu mobile : bloque le défilement de la page et se ferme avec la touche Échap
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Ferme le menu lors d'un changement de page
  useEffect(() => setOpen(false), [pathname]);

  const links = [
    { href: localePath(locale, '/'), label: nav.home },
    { href: localePath(locale, '/#services'), label: nav.services },
    { href: localePath(locale, '/#etapes'), label: nav.steps },
    { href: localePath(locale, '/#paiement'), label: nav.payment },
    { href: localePath(locale, '/vehicules'), label: nav.vehicles },
    { href: localePath(locale, '/#faq'), label: nav.faq },
    { href: localePath(locale, '/#contact'), label: nav.contact },
  ];

  // Même page, dans l'autre langue
  const otherLocale: Locale = locale === 'fr' ? 'en' : 'fr';
  const switchHref = (pathname || `/${locale}/`).replace(/^\/(fr|en)(?=\/|$)/, `/${otherLocale}`);

  const solid = scrolled || open;

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          solid ? 'bg-white/95 shadow-soft backdrop-blur-md' : 'bg-transparent',
        )}
      >
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-navy-950"
        >
          {skipLabel}
        </a>

        <div className={cn('container flex items-center justify-between transition-all', solid ? 'h-16' : 'h-20')}>
          <Link href={localePath(locale, '/')} aria-label={`${siteConfig.name} — ${nav.home}`} className="relative z-10">
            <Logo tone={solid ? 'dark' : 'light'} />
          </Link>

          {/* Navigation ordinateur */}
          <nav aria-label={navLabels.main} className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'group relative rounded-full px-3 py-2 text-sm font-medium transition-colors',
                      solid ? 'text-navy-900 hover:text-gold-dark' : 'text-white/90 hover:text-white',
                    )}
                  >
                    {link.label}
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-gold transition-transform duration-300 group-hover:scale-x-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={switchHref}
              hrefLang={otherLocale}
              title={nav.switchLanguage}
              className={cn(
                'flex h-10 items-center rounded-full border px-1 text-xs font-bold tracking-wider transition-colors',
                solid ? 'border-navy-900/15' : 'border-white/30',
              )}
            >
              {(['fr', 'en'] as const).map((l) => (
                <span
                  key={l}
                  className={cn(
                    'rounded-full px-2.5 py-1.5 uppercase transition-colors',
                    l === locale ? 'bg-gold text-navy-950' : solid ? 'text-navy-900/70' : 'text-white/80',
                  )}
                >
                  {l}
                </span>
              ))}
              <span className="sr-only">{nav.switchLanguage}</span>
            </Link>

            <Link href={localePath(locale, '/#contact')} className="btn-gold hidden !px-5 !py-2.5 text-sm md:inline-flex">
              {nav.quote}
            </Link>

            {/* Bouton burger animé (mobile / tablette) */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? nav.closeMenu : nav.openMenu}
              className={cn(
                'relative z-10 flex h-11 w-11 items-center justify-center rounded-full transition-colors xl:hidden',
                solid ? 'text-navy-900 hover:bg-mist' : 'text-white hover:bg-white/10',
              )}
            >
              <span className="relative block h-4 w-6" aria-hidden="true">
                <span
                  className={cn(
                    'absolute left-0 top-0 h-0.5 w-6 rounded-full bg-current transition-all duration-300',
                    open && 'top-[7px] rotate-45',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-[7px] h-0.5 w-6 rounded-full bg-current transition-all duration-300',
                    open && 'opacity-0',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-[14px] h-0.5 w-6 rounded-full bg-current transition-all duration-300',
                    open && 'top-[7px] -rotate-45',
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile plein écran — placé hors du <header> : son flou d'arrière-plan
          (backdrop-blur) empêcherait le panneau "fixed" d'occuper tout l'écran */}
      <AnimatePresence>
        {open && (
          <m.div
            id="menu-mobile"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-x-0 bottom-0 top-16 z-[45] overflow-y-auto bg-white xl:hidden"
          >
            <nav aria-label={navLabels.mobile} className="container flex min-h-full flex-col py-6">
              <ul className="flex flex-col">
                {links.map((link, i) => (
                  <m.li
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between border-b border-navy-900/[0.07] py-4 font-heading text-xl font-bold text-navy-900"
                    >
                      {link.label}
                      <span className="text-gold" aria-hidden="true">→</span>
                    </Link>
                  </m.li>
                ))}
              </ul>

              <div className="mt-8 grid gap-3">
                <Link href={localePath(locale, '/#contact')} onClick={() => setOpen(false)} className="btn-gold w-full">
                  {nav.quote}
                </Link>
                <a href={whatsappLink(whatsappMessage)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full">
                  <WhatsAppIcon className="h-5 w-5" />
                  WhatsApp
                </a>
                <a href={`tel:${siteConfig.phones[0].tel}`} className="btn-outline w-full">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {siteConfig.phones[0].display}
                </a>
              </div>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
