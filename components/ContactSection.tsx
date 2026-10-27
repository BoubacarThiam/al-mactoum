import { Clock, Mail, MapPin, Navigation, Phone } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';
import { FlagCA, FlagSN } from '@/components/icons/BrandIcons';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { isFilled, siteConfig } from '@/config/site';
import type { Dictionary, Locale } from '@/lib/i18n';

interface ContactSectionProps {
  locale: Locale;
  t: Dictionary['contact'];
  common: Dictionary['common'];
  headingAs?: 'h1' | 'h2';
}

/** Section Contact / Devis : formulaire + coordonnées + carte Google Maps. */
export function ContactSection({ locale, t, common, headingAs = 'h2' }: ContactSectionProps) {
  const { address } = siteConfig;
  const hours = siteConfig.hours[locale];
  const mapQuery = encodeURIComponent(address.mapQuery);

  return (
    <section id="contact" className="section" aria-labelledby="contact-titre">
      <div className="container">
        <SectionHeading id="contact-titre" as={headingAs} eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-[1.35fr_1fr]">
          <Reveal>
            <ContactForm t={t.form} />
          </Reveal>

          <Reveal delay={0.1} className="space-y-6">
            <div className="rounded-2xl bg-navy-900 p-6 text-white shadow-lift md:p-8">
              <h3 className="font-heading text-xl font-bold">{t.info.title}</h3>

              <dl className="mt-6 space-y-6 text-sm">
                <div className="flex gap-4">
                  <dt className="sr-only">{t.info.address}</dt>
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                  <dd>
                    <address className="not-italic leading-relaxed text-slate-200">
                      {address.street}
                      <br />
                      {address.landmark}
                      <br />
                      {address.city}, {address.country}
                    </address>
                  </dd>
                </div>

                <div className="flex gap-4">
                  <dt className="sr-only">{t.info.phones}</dt>
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                  <dd className="space-y-2.5">
                    {siteConfig.phones.map((phone) => (
                      <a
                        key={phone.tel}
                        href={`tel:${phone.tel}`}
                        className="flex items-center gap-3 font-semibold text-white transition-colors hover:text-gold"
                      >
                        {phone.country === 'SN' ? (
                          <FlagSN className="h-4 w-6 shrink-0 rounded-[2px]" title={common.senegal} />
                        ) : (
                          <FlagCA className="h-4 w-8 shrink-0 rounded-[2px]" title={common.canada} />
                        )}
                        {phone.display}
                      </a>
                    ))}
                  </dd>
                </div>

                <div className="flex gap-4">
                  <dt className="sr-only">{t.info.email}</dt>
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                  <dd>
                    <a href={`mailto:${siteConfig.email}`} className="break-all font-semibold transition-colors hover:text-gold">
                      {siteConfig.email}
                    </a>
                  </dd>
                </div>

                {/* Horaires : affichés seulement une fois renseignés dans /config/site.ts */}
                {isFilled(hours) && (
                  <div className="flex gap-4">
                    <dt className="sr-only">{t.info.hours}</dt>
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                    <dd className="text-slate-200">{hours}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Carte Google Maps (chargée seulement quand elle arrive à l'écran) */}
            <div className="overflow-hidden rounded-2xl border border-navy-900/10 shadow-soft">
              <iframe
                title={t.info.mapTitle}
                src={`https://maps.google.com/maps?q=${mapQuery}&z=15&hl=${locale}&output=embed`}
                className="block h-72 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white py-3 text-sm font-semibold text-navy-900 transition-colors hover:bg-mist"
              >
                <Navigation className="h-4 w-4 text-gold-dark" aria-hidden="true" />
                {t.info.directions}
                <span className="sr-only">{common.newTab}</span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
