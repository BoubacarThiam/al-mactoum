/**
 * ============================================================
 *  AVIS CLIENTS
 * ============================================================
 *  N'ajoutez ici QUE de vrais avis clients (avec leur accord).
 *
 *  Pour ajouter un avis : remplacez un bloc "placeholder" par un vrai avis, par ex. :
 *   {
 *     name: 'Prénom N.',
 *     city: 'Dakar',
 *     vehicle: 'Toyota RAV4 2019',
 *     text: "Le texte de l'avis du client…",
 *     rating: 5,
 *   },
 *
 *  Les blocs avec placeholder: true s'affichent comme emplacements vides.
 *  Supprimez-les quand vous avez de vrais avis.
 *
 *  Vidéos de livraison (plus bas, videoTestimonials) : déposez la vidéo (.mp4) et
 *  son image d'aperçu (.jpg) dans /public/videos/temoignages, puis copiez un bloc.
 * ============================================================
 */

export interface Testimonial {
  name: string;
  city?: string;
  vehicle?: string;
  text: string;
  /** Note sur 5 (facultatif) */
  rating?: number;
  /** true = emplacement vide, à remplacer par un vrai avis */
  placeholder?: boolean;
}

const PLACEHOLDER = '[À REMPLACER PAR UN VRAI AVIS CLIENT]';

export const testimonials: Testimonial[] = [
  { name: PLACEHOLDER, text: PLACEHOLDER, placeholder: true },
  { name: PLACEHOLDER, text: PLACEHOLDER, placeholder: true },
  { name: PLACEHOLDER, text: PLACEHOLDER, placeholder: true },
];

export interface VideoTestimonial {
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
  /** Durée affichée sur la vignette, ex. "1:15" */
  duration?: string;
  /** true = vidéo filmée à la verticale (téléphone) */
  portrait?: boolean;
}

export const videoTestimonials: VideoTestimonial[] = [
  {
    id: 'livraison-tucson',
    src: '/videos/temoignages/livraison-tucson.mp4',
    poster: '/videos/temoignages/livraison-tucson.jpg',
    title: { fr: 'Livraison d’un Hyundai Tucson', en: 'Hyundai Tucson delivery' },
    caption: {
      fr: 'Remise du véhicule à une cliente à Dakar.',
      en: 'Vehicle handed over to a customer in Dakar.',
    },
    duration: '1:15',
    portrait: true,
  },
  {
    id: 'livraison-bmw-saint-louis',
    src: '/videos/temoignages/livraison-bmw-saint-louis.mp4',
    poster: '/videos/temoignages/livraison-bmw-saint-louis.jpg',
    title: { fr: 'Livraison d’une BMW', en: 'BMW delivery' },
    caption: {
      fr: 'Véhicule livré à son client à Saint-Louis (Ndar).',
      en: 'Vehicle delivered to its owner in Saint-Louis (Ndar).',
    },
    duration: '0:36',
    portrait: true,
  },
  {
    id: 'livraison-tucson-gris',
    src: '/videos/temoignages/livraison-tucson-gris.mp4',
    poster: '/videos/temoignages/livraison-tucson-gris.jpg',
    title: { fr: 'Remise des clés : Hyundai Tucson', en: 'Handover: Hyundai Tucson' },
    caption: {
      fr: 'Un autre Tucson livré à son propriétaire.',
      en: 'Another Tucson delivered to its owner.',
    },
    duration: '0:27',
    portrait: true,
  },
];
