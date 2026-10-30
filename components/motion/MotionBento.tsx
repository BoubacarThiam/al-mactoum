import type { Dictionary } from '@/lib/i18n';
import { whatsappLink } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { CarShape, KitFlagCA, KitFlagSN } from './KitIcons';

interface MotionBentoProps {
  t: Dictionary['motion']['bento'];
  common: Dictionary['common'];
  whatsappMessage: string;
}

const phone = (country: 'SN' | 'CA') => siteConfig.phones.filter((p) => p.country === country);

/** « Pourquoi AL MACTOUM » : grille de cartes animées (jauge 60/40, suivi, inspection, WhatsApp). */
export function MotionBento({ t, common, whatsappMessage }: MotionBentoProps) {
  const canada = phone('CA')[0];
  const dakar = phone('SN').map((p) => p.display.replace('+221 ', '')).join(' · ');

  return (
    <section className="am-sec am-sec--light am-page" id="pourquoi" aria-labelledby="pourquoi-titre">
      <div className="am-wrap">
        <div className="am-sec__head">
          <div>
            <p className="am-eyebrow">{t.eyebrow}</p>
            <h2 id="pourquoi-titre" className="am-title am-h2" data-am="title">
              {t.title}
              <br />
              <span className="am-accent">{t.titleAccent}</span>
            </h2>
          </div>
          <p className="am-sec__lead am-fadeup" data-am="fade">
            {t.lead}
          </p>
        </div>

        <div className="am-bento" data-am="bento">
          <article className="am-card am-card--dark am-card--gauge">
            <div>
              <h3 className="am-card__title">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                  <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
                </svg>
                {t.gauge.title}
              </h3>
              <p>{t.gauge.text}</p>
            </div>
            <div className="am-gauge" data-am="gauge" data-caps={t.gauge.captions} aria-hidden="true">
              <svg viewBox="0 0 200 200">
                <circle className="am-gauge__ticks" cx="100" cy="100" r="92" pathLength={300} />
                <circle className="am-gauge__track" cx="100" cy="100" r="74" />
                <circle className="am-gauge__a" cx="100" cy="100" r="74" pathLength={100} strokeDasharray="60 100" strokeDashoffset="0" transform="rotate(-90 100 100)" />
                <circle className="am-gauge__b" cx="100" cy="100" r="74" pathLength={100} strokeDasharray="40 100" strokeDashoffset="0" transform="rotate(126 100 100)" />
              </svg>
              <div className="am-gauge__center">
                <span className="am-gauge__num">60/40</span>
                <span className="am-gauge__cap">{t.gauge.captions.split('|')[2]}</span>
              </div>
            </div>
          </article>

          <article className="am-card am-card--track">
            <h3 className="am-card__title">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="6" cy="19" r="3" />
                <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
                <circle cx="18" cy="5" r="3" />
              </svg>
              {t.track.title}
            </h3>
            <p>{t.track.text}</p>
            <div className="am-mini" aria-hidden="true">
              <CarShape className="am-mini__car" />
              <div className="am-mini__line">
                <i />
              </div>
              <div className="am-mini__stops">
                {t.track.stops.map((stop, k) => (
                  <span key={stop} className="am-mini__stop" style={{ '--k': k } as React.CSSProperties}>
                    <b />
                    {stop}
                  </span>
                ))}
              </div>
            </div>
          </article>

          <article className="am-card am-card--checks">
            <h3 className="am-card__title">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              {t.checks.title}
            </h3>
            <p>{t.checks.text}</p>
            <ul className="am-check" data-am="checks">
              {t.checks.items.map((item) => (
                <li key={item}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10.5" />
                    <path pathLength={1} d="m7.5 12.3 3 3 6-6.3" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="am-card am-card--dark am-card--chat">
            <h3 className="am-card__title">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
              </svg>
              {t.chat.title}
            </h3>
            <p>{t.chat.text}</p>
            <div className="am-chat" data-am="chat" role="group" aria-label={t.chat.label}>
              {t.chat.messages.map((msg) => (
                <div key={msg.text} className={`am-chat__msg am-chat__msg--${msg.from}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <a className="am-chat__link" href={whatsappLink(whatsappMessage)} target="_blank" rel="noopener noreferrer">
              {t.chat.link} <span aria-hidden="true">↗</span>
              <span className="sr-only">{common.newTab}</span>
            </a>
          </article>

          <article className="am-card am-card--wide">
            <div className="am-country">
              <KitFlagCA label={common.canada} />
              <div>
                <strong>{common.canada}</strong>
                <span>{canada?.display}</span>
              </div>
            </div>
            <div className="am-link" aria-hidden="true">
              <svg viewBox="0 0 300 54" preserveAspectRatio="none">
                <path id="am-link-p" className="am-link__path" d="M4 44C80 -8 220 -8 296 44" />
                <circle className="am-link__dot" r="5">
                  <animateMotion dur="3.2s" repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines=".65 0 .35 1">
                    <mpath href="#am-link-p" />
                  </animateMotion>
                </circle>
              </svg>
            </div>
            <div className="am-country">
              <div>
                <strong>Dakar</strong>
                <span>{dakar}</span>
              </div>
              <KitFlagSN label={common.senegal} />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
