/**
 * ============================================================
 *  VIDÉOS PUBLICITAIRES (section « Nos publicités » de l'accueil)
 * ============================================================
 *  Pour ajouter une vidéo :
 *   1. Déposez la vidéo (.mp4) et son image d'aperçu (.jpg) dans /public/videos/publicites
 *   2. Copiez un bloc { ... } ci-dessous et modifiez les informations
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

export const promoVideos: PromoVideo[] = [];
