/**
 * ============================================================
 *  CONFIGURATION CENTRALE DU SITE — AL MACTOUM
 * ============================================================
 *  Toutes les informations de l'entreprise sont ici.
 *  Modifiez ce fichier pour mettre à jour le site partout à la fois.
 *
 *  Les valeurs contenant "[À COMPLÉTER]" ne sont PAS affichées sur le site
 *  tant qu'elles n'ont pas été remplacées par une vraie valeur.
 * ============================================================
 */

/** Marqueur utilisé pour les informations manquantes. */
export const TODO = '[À COMPLÉTER]';

/** Renvoie true si une valeur est réellement renseignée (non vide et sans "[À COMPLÉTER]"). */
export function isFilled(value?: string | null): value is string {
  return !!value && value.trim() !== '' && !value.includes('À COMPLÉTER');
}

export type PaymentMethodId = 'wave' | 'orange-money' | 'cash';

export interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
  /** Numéro de réception des paiements (Wave / Orange Money). Masqué tant qu'il vaut [À COMPLÉTER]. */
  receiveNumber?: string;
  /** Logo officiel optionnel, à déposer dans /public/images/paiement (ex. "/images/paiement/wave.png"). */
  logo?: string;
}

/**
 * Moyens de paiement acceptés.
 * Remplacez [À COMPLÉTER] par le numéro qui reçoit les paiements, ex. "+221 77 000 00 00".
 * Pour afficher un logo officiel, ajoutez par ex. logo: '/images/paiement/wave.png'.
 */
const paymentMethods: PaymentMethod[] = [
  { id: 'wave', name: 'Wave', receiveNumber: TODO },
  { id: 'orange-money', name: 'Orange Money', receiveNumber: TODO },
  { id: 'cash', name: 'Cash' },
];

export const siteConfig = {
  /** Nom légal complet */
  name: 'AL MACTOUM BUSINESS AUTOMOBILE',
  /** Nom court (logo, header) */
  shortName: 'AL MACTOUM',
  tagline: 'BUSINESS AUTOMOBILE',

  /**
   * Adresse publique du site, sans "/" final.
   * À remplacer par votre nom de domaine définitif (utilisée pour le SEO, le sitemap et Open Graph).
   */
  url: 'https://almactoum.vercel.app',

  address: {
    street: "Autoroute de l'Aéroport, Sicap Foire",
    landmark: 'En face de Keur Yoff',
    city: 'Dakar',
    country: 'Sénégal',
    countryCode: 'SN',
    /** Texte utilisé pour la carte Google Maps */
    mapQuery: "Sicap Foire, Autoroute de l'Aéroport, Dakar, Sénégal",
  },

  phones: [
    { country: 'SN' as const, display: '+221 77 146 70 33', tel: '+221771467033' },
    { country: 'SN' as const, display: '+221 77 366 31 98', tel: '+221773663198' },
    { country: 'CA' as const, display: '+1 438 458 7461', tel: '+14384587461' },
  ],

  email: 'almactoume50@gmail.com',

  /** Numéro WhatsApp principal (format international sans "+" ni espaces) */
  whatsapp: '221771467033',

  socials: {
    tiktok: [
      { handle: '@almactoum.busness', url: 'https://www.tiktok.com/@almactoum.busness' },
      { handle: '@al.mactoume', url: 'https://www.tiktok.com/@al.mactoume' },
    ],
    facebook: { handle: 'AL MACTOUM', url: 'https://www.facebook.com/share/1CBQxkTbWU/' },
  },

  /** Horaires d'ouverture de l'agence — masqués tant qu'ils valent [À COMPLÉTER] */
  hours: {
    fr: TODO, // ex. "Lundi – Samedi : 9h – 19h"
    en: TODO, // ex. "Monday – Saturday: 9am – 7pm"
  },

  /** Modèle de paiement */
  payment: {
    depositPercent: 60,
    balancePercent: 40,
    methods: paymentMethods,
  },
};

export type SiteConfig = typeof siteConfig;
