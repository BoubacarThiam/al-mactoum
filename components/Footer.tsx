import Link from 'next/link';
import { Clock, LockKeyhole, Mail, MapPin } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { PaymentBadges } from '@/components/PaymentBadges';
import { FacebookIcon, FlagCA, FlagSN, TikTokIcon } from '@/components/icons/BrandIcons';
import { isFilled, siteConfig } from '@/config/site';
import { type Dictionary, type Locale, localePath } from '@/lib/i18n';
import { fill } from '@/lib/utils';

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

export function Footer({ locale, dict }: FooterProps) {
  const { footer, nav, common } = dict;

  const links = [
    { href: localePath(locale, '/'), label: nav.home },
    { href: localePath(locale, '/#etapes'), label: nav.steps },
    { href: localePath(locale, '/paiement'), label: nav.payment },
    { href: localePath(locale, '/vehicules'), label: nav.vehicles },
    { href: localePath(locale, '/faq'), label: nav.faq },
    { href: localePath(locale, '/contact'), label: nav.contact },
  ];

  const socials = [
    ...siteConfig.socials.tiktok.map((s) => ({ ...s, label: `TikTok ${s.handle}`, Icon: TikTokIcon })),
    { ...siteConfig.socials.facebook, label: 'Facebook', Icon: FacebookIcon },
  ];

  return (
    <footer className="relative overflow-hidden bg-ink-950 text-slate-300">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mint/60 to-transparent" aria-hidden="true" />

      <div className="container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.3fr_1.2fr]">
        {/* Présentation */}
        <div>
          <Logo className="h-14" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">{footer.description}</p>
          <p className="mt-6 mb-3 text-xs font-bold uppercase tracking-[0.2em] text-mint">{footer.payments}</p>
          <PaymentBadges variant="compact" tone="light" />
        </div>

        {/* Liens rapides */}
        <nav aria-label={footer.quickLinks}>
          <p className="mb-4 font-heading text-sm font-bold uppercase tracking-[0.2em] text-white">{footer.quickLinks}</p>
          <ul className="space-y-1 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-flex min-h-[36px] items-center transition-colors hover:text-mint">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <p className="mb-4 font-heading text-sm font-bold uppercase tracking-[0.2em] text-white">{footer.contact}</p>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-mint" aria-hidden="true" />
              <span>
                {siteConfig.address.street}
                <br />
                {siteConfig.address.landmark}, {siteConfig.address.city}
              </span>
            </li>
            {siteConfig.phones.map((phone) => (
              <li key={phone.tel}>
                <a href={`tel:${phone.tel}`} className="flex min-h-[32px] items-center gap-3 transition-colors hover:text-mint">
                  {phone.country === 'SN' ? (
                    <FlagSN className="h-3 w-[18px] shrink-0 rounded-[2px]" title={common.senegal} />
                  ) : (
                    <FlagCA className="h-3 w-[24px] shrink-0 rounded-[2px]" title={common.canada} />
                  )}
                  {phone.display}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 break-all transition-colors hover:text-mint">
                <Mail className="h-4 w-4 shrink-0 text-mint" aria-hidden="true" />
                {siteConfig.email}
              </a>
            </li>
            {isFilled(siteConfig.hours[locale]) && (
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 shrink-0 text-mint" aria-hidden="true" />
                <span>
                  <span className="sr-only">{dict.contact.info.hours} : </span>
                  {siteConfig.hours[locale]}
                </span>
              </li>
            )}
          </ul>
        </div>

        {/* Réseaux sociaux */}
        <div>
          <p className="mb-4 font-heading text-sm font-bold uppercase tracking-[0.2em] text-white">{footer.follow}</p>
          <ul className="space-y-2.5">
            {socials.map(({ url, label, Icon }) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-sm transition-colors hover:text-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-mint group-hover:text-ink-950">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                  <span className="sr-only">{common.newTab}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-center text-xs text-slate-400 md:flex-row md:text-left">
          <p>{fill(footer.rights, { year: new Date().getFullYear() })}</p>
          <div className="flex items-center gap-4">
            <p>Dakar · Canada</p>
            {/* Accès au backoffice du gérant (gestion des véhicules) */}
            <a
              href="/admin/"
              rel="nofollow"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 font-medium text-slate-300 transition hover:border-mint/60 hover:text-mint"
            >
              <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
              {footer.admin}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
