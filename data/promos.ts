/**
 * ============================================================
 *  VIDÉOS PUBLICITAIRES (section « Nos publicités » de l'accueil)
 * ============================================================
 *  Les vidéos se gèrent désormais depuis le backoffice : /admin, onglet Vidéos.
 *  Cette liste ne sert que tant que rien n'a été enregistré depuis le backoffice.
 *
 *  Tant que la liste est vide, la section n'apparaît pas sur le site.
 *  Vidéo filmée au téléphone (verticale) : mettez portrait: true.
 * ============================================================
 */

export interface PromoVideo {
  /** Identifiant unique (sans espaces) */
  id: string;
  /** Fichier vidéo, chemin dans /public */
  src: string;
  /** Image affichée avant la lecture, chemin dans /public */
  poster: string;
  /** Titre court, en français et en anglais */
  title: { fr: string; en: string };
  /** Légende facultative, en français et en anglais */
  caption?: { fr: string; en: string };
  /** Durée affichée sur la vignette, ex. "0:30" */
  duration?: string;
  /** Vidéo verticale (format téléphone, 9:16) */
  portrait?: boolean;
}

export const promoVideos: PromoVideo[] = [
  {
    id: 'boubacar-diallo',
    src: '/videos/publicites/pub-boubacar-diallo.mp4',
    poster: '/videos/publicites/pub-boubacar-diallo.jpg',
    title: { fr: 'Boubacar Diallo présente AL MACTOUM', en: 'Boubacar Diallo presents AL MACTOUM' },
    caption: {
      fr: 'De notre bureau au Canada jusqu’à votre voiture.',
      en: 'From our office in Canada to your car.',
    },
    duration: '1:26',
    portrait: true,
  },
  {
    id: 'emission-direct',
    src: '/videos/publicites/pub-emission-direct.mp4',
    poster: '/videos/publicites/pub-emission-direct.jpg',
    title: { fr: 'AL MACTOUM en direct à l’antenne', en: 'AL MACTOUM live on air' },
    caption: {
      fr: 'Notre publicité diffusée en direct.',
      en: 'Our ad, broadcast live.',
    },
    duration: '0:41',
  },
];
