import { ArrowUpRight } from 'lucide-react';
import { FacebookIcon, TikTokIcon } from '@/components/icons/BrandIcons';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { siteConfig } from '@/config/site';
import type { Dictionary } from '@/lib/i18n';

interface SocialSectionProps {
  t: Dictionary['social'];
  newTab: string;
}

/** Bloc "Suivez-nous" : 2 comptes TikTok + Facebook, en grandes cartes cliquables. */
export function SocialSection({ t, newTab }: SocialSectionProps) {
  const cards = [
    ...siteConfig.socials.tiktok.map((account) => ({
      url: account.url,
      network: t.tiktok,
      handle: account.handle,
      Icon: TikTokIcon,
      style: 'bg-navy-950 text-white',
      iconStyle: 'bg-white text-navy-950',
    })),
    {
      url: siteConfig.socials.facebook.url,
      network: t.facebook,
      handle: siteConfig.socials.facebook.handle,
      Icon: FacebookIcon,
      style: 'bg-[#1877F2] text-white',
      iconStyle: 'bg-white text-[#1877F2]',
    },
  ];

  return (
    <section className="section" aria-labelledby="reseaux-titre">
      <div className="container">
        <SectionHeading id="reseaux-titre" eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {cards.map(({ url, network, handle, Icon, style, iconStyle }, i) => (
            <Reveal as="li" key={url} delay={0.08 * i}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex h-full items-center gap-5 overflow-hidden rounded-3xl p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift md:flex-col md:items-start md:p-8 ${style}`}
              >
                <span className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/[0.06] transition-transform duration-500 group-hover:scale-125" aria-hidden="true" />
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${iconStyle}`}>
                  <Icon className="h-7 w-7" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium opacity-80">{network}</span>
                  <span className="block truncate font-heading text-lg font-bold md:text-xl">{handle}</span>
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold md:mt-4">
                  <span className="hidden md:inline">{t.follow}</span>
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
                <span className="sr-only">{newTab}</span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
