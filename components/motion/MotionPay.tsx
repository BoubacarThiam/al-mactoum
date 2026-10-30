import Link from 'next/link';
import { type Dictionary, type Locale, localePath } from '@/lib/i18n';
import { CarShape, KitFlagCA, KitFlagSN } from './KitIcons';

interface MotionPayProps {
  locale: Locale;
  t: Dictionary['motion']['pay'];
  common: Dictionary['common'];
}

/**
 * Paiement 60/40 en section épinglée : la voiture traverse de Montréal à Dakar
 * pendant que le compteur passe de 0 à 60 % puis à 100 %.
 */
export function MotionPay({ locale, t, common }: MotionPayProps) {
  return (
    <section className="am-pay am-page" id="paiement" data-scroll="pay" data-phase="0" aria-labelledby="paiement-titre">
      <div className="am-pay__sticky">
        <div className="am-wrap am-pay__inner">
          <div className="am-pay__top">
            <div>
              <p className="am-eyebrow">{t.eyebrow}</p>
              <h2 id="paiement-titre" className="am-pay__title">
                <span>{t.line1}</span>
                <span>{t.line2}</span>
              </h2>
              <p className="am-pay__lead">{t.lead}</p>
            </div>
            <div className="am-pay__meter" aria-hidden="true">
              <div className="am-pay__paid">
                <span data-paid="">0</span>
                <small>%</small>
              </div>
              <div className="am-pay__paidcap">{t.paid}</div>
            </div>
          </div>

          <div className="am-pay__journey">
            <div className="am-pay__ends">
              <span>
                <KitFlagCA label={common.canada} />
                Montréal
              </span>
              <span>
                Dakar
                <KitFlagSN label={common.senegal} />
              </span>
            </div>
            <div className="am-pay__road" aria-hidden="true">
              <i className="am-pay__sea" />
              <i className="am-pay__done" />
              <div className="am-pay__ports">
                <i />
                <i />
              </div>
              <div className="am-pay__car">
                <CarShape />
              </div>
            </div>
            <div className="am-pay__status" aria-hidden="true">
              {t.status.map((status, s) => (
                <span key={status} data-s={s} hidden={s !== 0}>
                  {status}
                </span>
              ))}
            </div>
            <span className="am-pay__badge" aria-hidden="true">
              {t.badge}
            </span>
          </div>

          <div className="am-pay__bar">
            <div className="am-pay__seg am-pay__seg--a">
              <i />
              <b>60 %</b>
              <small>{t.deposit}</small>
            </div>
            <div className="am-pay__seg am-pay__seg--b">
              <i />
              <b>40 %</b>
              <small>{t.balance}</small>
            </div>
          </div>

          <Link className="am-pay__more" href={localePath(locale, '/paiement')}>
            {t.simulator} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
