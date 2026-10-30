import type { Dictionary } from '@/lib/i18n';
import { fill } from '@/lib/utils';
import { SUV_IMAGE } from './KitIcons';

/**
 * Voitures qui défilent, dans cet ordre. Photos détourées (fond transparent, 883 px de large)
 * dans /public/animations : ajoutez ou retirez une ligne pour changer la sélection.
 */
const cars = [
  { name: 'Mitsubishi Outlander', src: SUV_IMAGE },
  { name: 'Hyundai Tucson', src: '/animations/cars/tucson.webp' },
  { name: 'Hyundai Elantra', src: '/animations/cars/elantra.webp' },
  { name: 'Range Rover Evoque', src: '/animations/cars/evoque.webp' },
];

const pad = (n: number) => String(n).padStart(2, '0');

/** Section épinglée : les voitures entrent puis se succèdent au rythme du défilement, puis les étapes clés apparaissent. */
export function MotionDrive({ t }: { t: Dictionary['motion']['drive'] }) {
  return (
    <section
      className="am-drive am-drive--multi am-page"
      data-scroll="drive"
      aria-label={t.label}
      style={{ '--am-cars': cars.length } as React.CSSProperties}
    >
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
          <p className="am-drive__counter" aria-hidden="true">
            <b data-car-num="">01</b>/ {pad(cars.length)} · <span data-car-name="">{cars[0].name}</span>
          </p>
          {cars.map((car) => (
            <div key={car.src} className="am-drive__car" data-name={car.name}>
              {/* eslint-disable-next-line @next/next/no-img-element -- photos détourées déjà optimisées (≈ 55 Ko) */}
              <img
                className="am-drive__img"
                src={car.src}
                alt={fill(t.alt, { name: car.name })}
                width={883}
                loading="lazy"
                decoding="async"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="am-drive__refl" src={car.src} alt="" aria-hidden="true" loading="lazy" decoding="async" />
              <span className="am-drive__shine" aria-hidden="true" />
            </div>
          ))}
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
