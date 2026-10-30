import { Fragment } from 'react';
import type { Dictionary } from '@/lib/i18n';
import { Sparkle } from './KitIcons';

/** Deux bandes croisées qui défilent avec la molette, entre le bandeau de confiance et « Pourquoi nous ». */
export function MotionBands({ t }: { t: Dictionary['motion']['bands'] }) {
  return (
    <div className="am-bands" data-scroll="bands" aria-hidden="true">
      <div className="am-band am-band--mint">
        <Track words={t.places} copies={6} />
      </div>
      <div className="am-band am-band--dark">
        <Track words={t.keywords} copies={6} />
      </div>
    </div>
  );
}

/** La piste répète les mots plusieurs fois pour que la boucle ne laisse jamais de vide. */
function Track({ words, copies }: { words: string[]; copies: number }) {
  return (
    <div className="am-band__track">
      {Array.from({ length: copies }, (_, c) =>
        words.map((word, i) => (
          <Fragment key={`${c}-${i}`}>
            <span>{word}</span>
            <Sparkle />
          </Fragment>
        )),
      )}
    </div>
  );
}
