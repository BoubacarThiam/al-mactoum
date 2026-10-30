import type { Dictionary } from '@/lib/i18n';
import { SUV_IMAGE } from './KitIcons';

const pad = (n: number) => String(n).padStart(2, '0');

/** « Comment ça marche » en section épinglée : une étape par écran, avec la carte de suivi à droite. */
export function MotionStory({ t }: { t: Dictionary['motion']['story'] }) {
  const { card } = t;

  return (
    <section className="am-story am-page" id="etapes" data-scroll="story" data-step="1" aria-labelledby="etapes-titre">
      <div className="am-story__sticky">
        <span className="am-story__big" aria-hidden="true">
          01
        </span>
        <div className="am-wrap am-story__grid">
          <div className="am-story__left">
            <p className="am-eyebrow">{t.eyebrow}</p>
            <h2 id="etapes-titre" className="am-story__h">
              {t.title}
              <br />
              <span>{t.titleAccent}</span>
            </h2>
            <div className="am-story__steps">
              <ol>
                {t.steps.map((step, i) => (
                  <li key={step.title} className={`am-story__step ${i === 0 ? 'is-active' : 'is-next'}`}>
                    <span className="am-story__n">
                      {t.stepLabel} {pad(i + 1)}
                    </span>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </li>
                ))}
              </ol>
              <div className="am-story__dots" aria-hidden="true">
                {t.steps.map((step) => (
                  <i key={step.title} />
                ))}
                <b className="am-story__fill" />
              </div>
            </div>
          </div>

          <div className="am-story__right" aria-hidden="true">
            <div className="am-trackcard">
              <div className="am-trackcard__top">
                <span>{card.title}</span>
                <span className="am-trackcard__chip">
                  {card.chips.map((chip, i) => (
                    <span key={chip} data-s={i + 1} hidden={i !== 0}>
                      {chip}
                    </span>
                  ))}
                </span>
              </div>
              <div className="am-trackcard__car">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={SUV_IMAGE} alt="" width={883} height={520} loading="lazy" decoding="async" />
                <div>
                  <strong>{card.car}</strong>
                  <small>{card.route}</small>
                </div>
              </div>
              <ul>
                {card.items.map((item, i) => (
                  <li key={item} data-k={i + 1}>
                    <i />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="am-trackcard__pay">
                <div>
                  <small>{card.deposit}</small>
                  <b>60 %</b>
                  <em data-on="2">{card.depositWhen}</em>
                </div>
                <div>
                  <small>{card.balance}</small>
                  <b>40 %</b>
                  <em data-on="5">{card.balanceWhen}</em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
