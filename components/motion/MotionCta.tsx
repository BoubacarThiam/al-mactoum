import { Fragment } from 'react';
import { siteConfig } from '@/config/site';
import type { Dictionary } from '@/lib/i18n';
import { fill, whatsappLink } from '@/lib/utils';
import { ArrowUpRight, CarShape, SUV_IMAGE } from './KitIcons';

interface MotionCtaProps {
  t: Dictionary['motion']['cta'];
  common: Dictionary['common'];
  whatsappMessage: string;
}

/** Appel à l'action final sur fond vert menthe, avec le SUV qui glisse au défilement. */
export function MotionCta({ t, common, whatsappMessage }: MotionCtaProps) {
  const main = siteConfig.phones[0];

  return (
    <section className="am-cta am-page" data-scroll="cta" aria-labelledby="cta-titre">
      <CarShape className="am-cta__deco" />
      <div className="am-wrap am-cta__grid">
        <div>
          <h2 id="cta-titre" className="am-title am-cta__title" data-am="title">
            {t.lines.map((line, i) => (
              <Fragment key={line}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </h2>
          <p className="am-fadeup" data-am="fade">
            {t.text}
          </p>
          <div className="am-cta__btns am-fadeup" data-am="fade" style={{ '--d': '.45s' } as React.CSSProperties}>
            <a className="am-btn am-btn--dark" href={whatsappLink(whatsappMessage)} target="_blank" rel="noopener noreferrer">
              {t.whatsapp} <ArrowUpRight />
              <span className="sr-only">{common.newTab}</span>
            </a>
            <a className="am-btn am-btn--line" href={`tel:${main.tel}`}>
              {fill(t.call, { phone: main.display.replace('+221 ', '') })}
            </a>
          </div>
        </div>
        <div className="am-cta__car">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SUV_IMAGE} alt={t.alt} width={883} height={520} loading="lazy" decoding="async" />
        </div>
      </div>
    </section>
  );
}
