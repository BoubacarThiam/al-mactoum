/**
 * ============================================================
 *  CATALOGUE DES VÉHICULES — CATALOGUE DE DÉPART
 * ============================================================
 *  Les véhicules se gèrent désormais depuis le backoffice : /admin
 *  (ajout, modification, suppression, ordre, photos).
 *  Cette liste ne sert que tant que rien n'a été enregistré depuis le backoffice ;
 *  ensuite, le catalogue enregistré (Vercel Blob) la remplace.
 *
 *  Année, kilométrage et prix sont facultatifs : laissez-les vides s'ils ne sont
 *  pas connus. Ils ne s'afficheront pas (le prix affiche alors « Sur devis »).
 *  Plusieurs photos dans "images" = galerie avec flèches sur la carte.
 * ============================================================
 */

export type VehicleType = 'suv' | 'berline' | 'pickup';

export interface Vehicle {
  /** Identifiant unique (sans espaces) */
  id: string;
  brand: string;
  model: string;
  type: VehicleType;
  /** Couleur, en français et en anglais */
  color?: { fr: string; en: string };
  /** Année du modèle — [À COMPLÉTER] si connue, ex. 2020 */
  year?: number;
  /** Kilométrage en km — [À COMPLÉTER] si connu, ex. 85000 */
  mileageKm?: number;
  /** Photos (la première est la photo principale), chemins dans /public */
  images: string[];
  /** Description de la photo principale (accessibilité / Google) */
  imageAlt: string;
  /** Prix affiché. Laissez vide pour afficher "Sur devis". Ex. "12 500 000 FCFA" */
  price?: string;
  /** true = véhicule d'exemple (affiche un badge EXEMPLE) */
  isExample?: boolean;
}

export const vehicles: Vehicle[] = [
  {
    id: 'mitsubishi-outlander-bleu',
    brand: 'Mitsubishi',
    model: 'Outlander',
    type: 'suv',
    color: { fr: 'Bleu nuit', en: 'Dark blue' },
    images: ['/images/vehicules/mitsubishi-outlander-bleu.webp'],
    imageAlt: 'Mitsubishi Outlander bleu nuit dans un showroom',
  },
  {
    id: 'hyundai-tucson-gris',
    brand: 'Hyundai',
    model: 'Tucson',
    type: 'suv',
    color: { fr: 'Gris', en: 'Grey' },
    images: ['/images/vehicules/hyundai-tucson-gris-1.webp', '/images/vehicules/hyundai-tucson-gris-2.webp'],
    imageAlt: 'Hyundai Tucson gris dans un showroom, vue de trois quarts avant',
  },
  {
    id: 'honda-crv-argent',
    brand: 'Honda',
    model: 'CR-V',
    type: 'suv',
    color: { fr: 'Argent', en: 'Silver' },
    images: ['/images/vehicules/honda-crv-argent.webp'],
    imageAlt: 'Honda CR-V argent dans un showroom',
  },
  {
    id: 'land-rover-discovery-sport-gris',
    brand: 'Land Rover',
    model: 'Discovery Sport',
    type: 'suv',
    color: { fr: 'Gris', en: 'Grey' },
    images: ['/images/vehicules/land-rover-discovery-sport-gris.webp'],
    imageAlt: 'Land Rover Discovery Sport gris sur un parking au Canada',
  },
  {
    id: 'hyundai-tucson-argent',
    brand: 'Hyundai',
    model: 'Tucson',
    type: 'suv',
    color: { fr: 'Argent', en: 'Silver' },
    images: [
      '/images/vehicules/hyundai-tucson-argent-1.webp',
      '/images/vehicules/hyundai-tucson-argent-2.webp',
      '/images/vehicules/hyundai-tucson-argent-3.webp',
    ],
    imageAlt: 'Hyundai Tucson argent garé devant un bâtiment, vue de trois quarts avant',
  },
  {
    id: 'honda-crv-blanc',
    brand: 'Honda',
    model: 'CR-V',
    type: 'suv',
    color: { fr: 'Blanc', en: 'White' },
    images: ['/images/vehicules/honda-crv-blanc.webp'],
    imageAlt: 'Honda CR-V blanc garé devant un entrepôt',
  },
  {
    id: 'hyundai-tucson-gris-2',
    brand: 'Hyundai',
    model: 'Tucson',
    type: 'suv',
    color: { fr: 'Gris', en: 'Grey' },
    images: ['/images/vehicules/hyundai-tucson-gris-garage.webp'],
    imageAlt: 'Hyundai Tucson gris vu de face dans un parking couvert',
  },
];
