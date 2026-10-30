import { CAR_SHAPE_PATH } from '@/components/motion/car-shape';
import { siteConfig } from '@/config/site';

/**
 * Introduction animée du logo, à l'arrivée sur le site (une fois par visite).
 * Animation 100 % CSS (app/intro.css) : elle démarre dès le premier affichage, sans attendre
 * le JavaScript, et se retire seule. Le script ci-dessous permet seulement de la passer
 * (clic, toucher ou touche Échap) et la retire du rendu une fois terminée.
 */
const skipScript = `(function(){var d=document.documentElement,el=document.getElementById('am-intro');if(!el)return;
function off(){d.classList.add('am-intro-off');removeEventListener('keydown',key);}
function skip(){if(!d.classList.contains('am-intro-skip'))d.classList.add('am-intro-skip');}
function key(e){if(e.key==='Escape'||e.key==='Enter'||e.key===' ')skip();}
el.addEventListener('click',skip);addEventListener('keydown',key);
el.addEventListener('animationend',function(e){if(e.target===el&&e.animationName==='am-intro-wipe')off();});})();`;

/** À placer dans <head> : ne rejoue pas l'intro pendant la même visite (avant tout affichage). */
export const introOnceScript = `try{if(sessionStorage.getItem('am-intro'))document.documentElement.classList.add('am-intro-off');else sessionStorage.setItem('am-intro','1');}catch(e){}`;

export function IntroLogo() {
  const canada = siteConfig.phones.find((p) => p.country === 'CA')?.display.replace('+1 ', '');
  const dakar = siteConfig.phones[0].display.replace('+221 ', '');

  return (
    <>
      <div id="am-intro" className="am-intro" aria-hidden="true">
        <div className="am-intro__glow" />
        <div className="am-intro__logo">
          <svg className="am-intro__car" viewBox="0 0 265 84">
            <path pathLength={1} fillRule="evenodd" d={CAR_SHAPE_PATH} />
          </svg>
          <div className="am-intro__word" data-text={siteConfig.shortName}>
            {siteConfig.shortName}
          </div>
          <div className="am-intro__sub">{siteConfig.tagline}</div>
          <div className="am-intro__rule">
            <i />
            <span>
              {canada}
              <br />
              {dakar}
            </span>
            <i />
          </div>
        </div>
        <div className="am-intro__bar">
          <i />
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: skipScript }} />
    </>
  );
}
