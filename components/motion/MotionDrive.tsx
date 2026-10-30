import type { Dictionary } from '@/lib/i18n';
import { SUV_IMAGE } from './KitIcons';

/** Section épinglée : le SUV entre à l'écran au rythme du défilement, puis les étapes clés apparaissent. */
export function MotionDrive({ t }: { t: Dictionary['motion']['drive'] }) {
  return (
    <section className="am-drive am-page" data-scroll="drive" aria-label={t.label}>
      <div className="am-drive__sticky">
        <div className="am-drive__bg" aria-hidden="true">
          <span>Canada · Canada ·</span>
          <span>Dakar · Dakar ·</span>
        </div>
        <div className="am-drive__lines" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="am-wrap am-drive__head">
          <p className="am-eyebrow">{t.eyebrow}</p>
          <h2 className="am-drive__title">
            <span>
              <b>{t.line1}</b>
            </span>
            <span>
              <b>{t.line2}</b>
            </span>
          </h2>
        </div>
        <div className="am-drive__stage">
          <div className="am-drive__car">
            {/* eslint-disable-next-line @next/next/no-img-element -- image détourée déjà optimisée (65 Ko) */}
            <img className="am-drive__img" src={SUV_IMAGE} alt={t.alt} width={883} height={520} loading="lazy" decoding="async" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="am-drive__refl" src={SUV_IMAGE} alt="" aria-hidden="true" loading="lazy" decoding="async" />
            <span className="am-drive__shine" aria-hidden="true" />
          </div>
        </div>
        <ul className="am-wrap am-drive__chips">
          {t.chips.map((chip, k) => (
            <li key={chip} style={{ '--k': k } as React.CSSProperties}>
              {chip}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
