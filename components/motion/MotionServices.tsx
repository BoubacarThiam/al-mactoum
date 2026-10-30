import type { Dictionary } from '@/lib/i18n';

const pad = (n: number) => String(n).padStart(2, '0');

// Une icône par panneau, dans le même ordre que dans /locales (rubrique motion.services.panels)
const icons = [
  ['m21 21-4.34-4.34', 'circle:11,11,8'],
  [
    'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
    'm9 12 2 2 4-4',
  ],
  [
    'M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z',
    'circle:16.5,7.5,.5',
  ],
  [
    'M12 2v2',
    'M12 9.189V13',
    'M19 12V6a2 2 0 00-2-2H7a2 2 0 00-2 2v6',
    'M19.38 19A11.6 11.6 0 0021 13l-8.188-3.639a2 2 0 00-1.624 0L3 13.001a11.6 11.6 0 002.81 7.76',
    'M2 20c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1',
  ],
  [
    'M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z',
    'M14 2v5a1 1 0 0 0 1 1h5',
    'm9 15 2 2 4-4',
  ],
];

function PanelIcon({ shapes }: { shapes: string[] }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {shapes.map((s) => {
        if (s.startsWith('circle:')) {
          const [cx, cy, r] = s.slice(7).split(',');
          return <circle key={s} cx={cx} cy={cy} r={r} pathLength={1} />;
        }
        return <path key={s} d={s} pathLength={1} />;
      })}
    </svg>
  );
}

/** Services en panneaux qui s'ouvrent au défilement (ou au survol / au toucher), puis les chiffres clés. */
export function MotionServices({ t }: { t: Dictionary['motion']['services'] }) {
  return (
    <section className="am-sec am-sec--light am-page" id="services" aria-labelledby="services-titre">
      <div className="am-wrap">
        <div className="am-sec__head">
          <div>
            <p className="am-eyebrow">{t.eyebrow}</p>
            <h2 id="services-titre" className="am-title am-h2" data-am="title">
              {t.title}
              <br />
              <span className="am-accent">{t.titleAccent}</span>
            </h2>
          </div>
          <p className="am-sec__lead am-fadeup" data-am="fade">
            {t.hint}
          </p>
        </div>

        <div className="am-panels" data-scroll="panels">
          {t.panels.map((panel, i) => (
            <article
              key={panel.title}
              className={`am-panel am-panel--${i + 1}`}
              tabIndex={0}
              role="button"
              aria-expanded={i === 0}
              aria-label={panel.title}
            >
              <span className="am-panel__num" aria-hidden="true">
                {pad(i + 1)}
              </span>
              <span className="am-panel__label" aria-hidden="true">
                {panel.label}
              </span>
              <div className="am-panel__body">
                <span className="am-panel__ico">
                  <PanelIcon shapes={icons[i]} />
                </span>
                <strong>{panel.title}</strong>
                <p>{panel.text}</p>
              </div>
              <span className="am-panel__big" aria-hidden="true">
                {pad(i + 1)}
              </span>
            </article>
          ))}
        </div>

        <div className="am-stats" data-am="stats">
          {t.stats.map((stat) => (
            <div key={stat.text} className="am-stat">
              <b>
                <span data-count={stat.value}>{stat.value}</span>
                {stat.suffix && <small>{stat.suffix}</small>}
              </b>
              <p>{stat.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
