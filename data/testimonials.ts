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
