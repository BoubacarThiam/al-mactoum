/**
 * ============================================================
 *  VIDÉOS DE NOS OPÉRATIONS (section « En vidéo » de l'accueil)
 * ============================================================
 *  Pour ajouter une vidéo :
 *   1. Déposez la vidéo (.mp4) et son image d'aperçu (.jpg) dans /public/videos/operations
 *   2. Copiez un bloc { ... } ci-dessous et modifiez les informations
 *
 *  Les vidéos s'affichent dans l'ordre de la liste. Format conseillé : horizontal (16:9),
 *  moins de 30 secondes, moins de 10 Mo.
 * ============================================================
 */

export interface OperationVideo {
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
  /** Durée affichée sur la vignette, ex. "0:13" */
  duration?: string;
}

export const operationVideos: OperationVideo[] = [
  {
    id: 'chargement-hyundai',
    src: '/videos/operations/chargement-hyundai.mp4',
    poster: '/videos/operations/chargement-hyundai.jpg',
    title: { fr: 'Chargement d’un véhicule', en: 'Loading a vehicle' },
    caption: {
      fr: 'Un SUV Hyundai chargé sur remorque pour son transport.',
      en: 'A Hyundai SUV loaded onto a trailer for transport.',
    },
    duration: '0:13',
  },
  {
    id: 'arrivee-dakar-conteneur',
    src: '/videos/operations/arrivee-dakar-conteneur.mp4',
    poster: '/videos/operations/arrivee-dakar-conteneur.jpg',
    title: { fr: 'Arrivée à Dakar', en: 'Arrival in Dakar' },
    caption: {
      fr: 'Un SUV Hyundai sorti de son conteneur à Dakar.',
      en: 'A Hyundai SUV unloaded from its container in Dakar.',
    },
    duration: '0:30',
  },
];
