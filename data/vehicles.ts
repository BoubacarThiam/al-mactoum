/**
 * ============================================================
 *  CATALOGUE DES VÉHICULES
 * ============================================================
 *  Pour ajouter un véhicule :
 *   1. Déposez sa photo dans /public/images/vehicules (format .webp ou .jpg, idéalement 900 px de large)
 *   2. Copiez un bloc { ... } ci-dessous et modifiez les informations
 *   3. Mettez isExample: false pour un vrai véhicule
 *
 *  Les 6 véhicules ci-dessous sont des EXEMPLES (affichés avec un badge "EXEMPLE").
 *  Remplacez-les par vos vrais véhicules.
 * ============================================================
 */

export type VehicleType = 'suv' | 'berline' | 'pickup';

export interface Vehicle {
  /** Identifiant unique (sans espaces) */
  id: string;
  brand: string;
  model: string;
  year: number;
  /** Kilométrage en km */
  mileageKm: number;
  type: VehicleType;
  /** Chemin de la photo dans /public */
  image: string;
  /** Texte alternatif de la photo (accessibilité / SEO) */
  imageAlt: string;
  /** Prix affiché. Laissez vide pour afficher "Sur devis". Ex. "12 500 000 FCFA" */
  price?: string;
  /** true = véhicule d'exemple (affiche un badge EXEMPLE) */
  isExample: boolean;
}

export const vehicles: Vehicle[] = [
  {
    id: 'toyota-tacoma-2019',
    brand: 'Toyota',
    model: 'Tacoma TRD',
    year: 2019,
    mileageKm: 82000,
    type: 'pickup',
    image: '/images/vehicules/toyota-tacoma.webp',
    imageAlt: 'Pick-up Toyota Tacoma beige garé sur un chemin de terre',
    isExample: true,
  },
  {
    id: 'honda-crv-2018',
    brand: 'Honda',
    model: 'CR-V',
    year: 2018,
    mileageKm: 95000,
    type: 'suv',
    image: '/images/vehicules/honda-crv.webp',
    imageAlt: 'SUV Honda CR-V blanc sur une route enneigée',
    isExample: true,
  },
  {
    id: 'ford-expedition-2020',
    brand: 'Ford',
    model: 'Expedition',
    year: 2020,
    mileageKm: 68000,
    type: 'suv',
    image: '/images/vehicules/ford-expedition.webp',
    imageAlt: 'Grand SUV Ford Expedition blanc sur une route de désert',
    isExample: true,
  },
  {
    id: 'bmw-serie5-2019',
    brand: 'BMW',
    model: 'Série 5',
    year: 2019,
    mileageKm: 74000,
    type: 'berline',
    image: '/images/vehicules/bmw-serie5.webp',
    imageAlt: 'Berline BMW gris clair roulant sur une avenue bordée de palmiers',
    isExample: true,
  },
  {
    id: 'audi-a6-2018',
    brand: 'Audi',
    model: 'A6',
    year: 2018,
    mileageKm: 88000,
    type: 'berline',
    image: '/images/vehicules/audi-a6.webp',
    imageAlt: 'Audi noire vue de face, phares allumés',
    isExample: true,
  },
  {
    id: 'nissan-juke-2021',
    brand: 'Nissan',
    model: 'Juke',
    year: 2021,
    mileageKm: 41000,
    type: 'suv',
    image: '/images/vehicules/nissan-juke.webp',
    imageAlt: 'SUV compact Nissan Juke gris, phares allumés',
    isExample: true,
  },
];
