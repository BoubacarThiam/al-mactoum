# AL MACTOUM BUSINESS AUTOMOBILE — Site vitrine

Site officiel d'**AL MACTOUM BUSINESS AUTOMOBILE** : achat et livraison de voitures du Canada vers le Sénégal (Dakar), avec paiement **60 % à la commande, 40 % à l'arrivée**.

- Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion
- Bilingue : français (par défaut) `/fr/` et anglais `/en/`
- Export 100 % statique : pas de serveur, hébergement gratuit sur Vercel
- Formulaire de devis, simulateur de paiement et boutons « Ce véhicule m'intéresse » : tout s'envoie sur **WhatsApp** (`wa.me`)

---

## 1. Lancer le site sur votre ordinateur

Prérequis : [Node.js](https://nodejs.org) version 18 ou plus récente.

```bash
npm install      # installe les dépendances (une seule fois)
npm run dev      # lance le site sur http://localhost:3000
```

Pour tester la version finale, exactement comme en ligne :

```bash
npm run build    # crée le site dans le dossier "out"
npm start        # l'affiche sur http://localhost:3000
```

---

## 2. Où modifier quoi ?

| Je veux modifier…                                         | Fichier                                  |
| --------------------------------------------------------- | ---------------------------------------- |
| Téléphones, email, adresse, WhatsApp, réseaux, horaires   | `config/site.ts`                         |
| Numéros Wave / Orange Money                               | `config/site.ts`                         |
| Les textes du site (FR / EN)                              | `locales/fr.json` et `locales/en.json`   |
| Les véhicules                                             | `data/vehicles.ts`                       |
| Les avis clients                                          | `data/testimonials.ts`                   |
| Les photos                                                | `public/images/`                         |
| Les logos Wave / Orange Money                             | `public/images/paiement/`                |
| Le logo AL MACTOUM                                        | `public/brand/`                          |

> Toute valeur contenant `[À COMPLÉTER]` est **automatiquement masquée** sur le site tant que vous ne l'avez pas remplacée.

---

## 3. Changer les photos

Les photos de véhicules sont les vôtres. Les autres photos (bannière, en-têtes de pages) sont des images libres de droits (Unsplash). Pour les remplacer :

1. Déposez votre photo dans `public/images/` **en gardant le même nom de fichier** (par ex. `hero-cargo.webp`).
   Les formats `.webp`, `.jpg` et `.png` sont acceptés. Si vous changez l'extension, mettez à jour le chemin dans le composant indiqué ci-dessous.
2. C'est tout : les versions légères pour téléphone sont créées automatiquement au prochain `npm run dev` ou `npm run build`.

| Photo                       | Où elle apparaît                          |
| --------------------------- | ----------------------------------------- |
| `hero-cargo.webp`           | Grande bannière d'accueil                 |
| `route-voiture.webp`        | Section « Pourquoi nous choisir »         |
| `canada-paysage.webp`       | En-tête de la page Véhicules              |
| `port-conteneurs.webp`      | En-tête de la page Paiement               |
| `port-aerien.webp`          | En-tête de la page FAQ                    |
| `canada-ville.webp`         | En-tête de la page Contact                |
| `vehicules/*.webp`          | Photos du catalogue (voir section 4)      |

Conseils : photos horizontales, 1600 px de large environ, moins de 500 Ko.

Le logo se trouve dans `public/brand/` : `logo-al-mactoum.png` est le logo carré officiel, `logo-horizontal.png` / `.webp` la version du header à fond transparent.
L'image de partage (aperçu WhatsApp / Facebook) et les icônes se régénèrent à partir du logo avec :

```bash
npm run assets
```

---

## 4. Ajouter un véhicule

Ouvrez `data/vehicles.ts` et copiez un bloc existant :

```ts
{
  id: 'toyota-rav4-gris',               // identifiant unique, sans espaces
  brand: 'Toyota',
  model: 'RAV4',
  type: 'suv',                          // 'suv' | 'berline' | 'pickup'
  color: { fr: 'Gris', en: 'Grey' },
  year: 2020,                           // facultatif
  mileageKm: 65000,                     // facultatif
  images: [                             // 1 ou plusieurs photos (galerie avec flèches)
    '/images/vehicules/toyota-rav4-1.webp',
    '/images/vehicules/toyota-rav4-2.webp',
  ],
  imageAlt: 'Toyota RAV4 gris, vue de trois quarts',
  price: '',                            // vide = « Sur devis », ou ex. '12 500 000 FCFA'
},
```

1. Mettez les photos dans `public/images/vehicules/` (.webp, .jpg ou .png).
2. L'année, le kilométrage et le prix sont facultatifs : s'ils sont absents, ils ne s'affichent pas.
3. Pour retirer un véhicule vendu, supprimez simplement son bloc.

Les filtres se mettent à jour automatiquement (le filtre par type n'apparaît que s'il y a au moins deux types de véhicules).

---

## 5. Ajouter un avis client

Ouvrez `data/testimonials.ts` et remplacez un emplacement vide par un **vrai** avis (avec l'accord du client) :

```ts
{
  name: 'Awa N.',
  city: 'Dakar',
  vehicle: 'Toyota RAV4 2019',
  text: "Le texte exact de l'avis du client…",
  rating: 5,
},
```

Supprimez les blocs `placeholder: true` restants. N'inventez jamais d'avis ni de chiffres.

> Tant qu'il n'y a aucun vrai avis, la section « Témoignages » est **masquée sur le site en ligne** (des cases vides nuiraient à la confiance). Elle reste visible avec `npm run dev`, pour vous rappeler de la compléter.

---

## 6. Ajouter les numéros Wave / Orange Money

Dans `config/site.ts`, remplacez `TODO` par le numéro :

```ts
const paymentMethods: PaymentMethod[] = [
  { id: 'wave', name: 'Wave', receiveNumber: '+221 77 000 00 00' },
  { id: 'orange-money', name: 'Orange Money', receiveNumber: '+221 77 000 00 00' },
  { id: 'cash', name: 'Cash' },
];
```

Les numéros s'affichent alors automatiquement sous les badges de paiement.

**Logos officiels** : déposez par ex. `wave.png` dans `public/images/paiement/`, puis ajoutez `logo: '/images/paiement/wave.png'` au moyen de paiement correspondant.

**Horaires** : dans `config/site.ts` (`hours`), actuellement « 8h – 20h ». Vous pouvez préciser les jours, ex. `{ fr: 'Lundi – Samedi : 8h – 20h', en: 'Monday – Saturday: 8am – 8pm' }`.

---

## 7. À vérifier avant la mise en ligne

- [ ] Les réponses de la **FAQ** (`locales/fr.json` et `en.json`, rubrique `faq`) : elles sont génériques, à ajuster (délais, garanties, dédouanement).
- [ ] Les numéros Wave / Orange Money (`config/site.ts`).
- [ ] L'adresse du site `url` dans `config/site.ts` : mettez votre adresse Vercel ou votre nom de domaine (utilisée pour Google et les aperçus de partage).
- [ ] Compléter l'année, le kilométrage et le prix des véhicules si souhaité, et ajouter de vrais avis clients.

---

## 8. Mettre le site en ligne gratuitement sur Vercel

1. Créez un compte gratuit sur [vercel.com](https://vercel.com) avec votre compte GitHub.
2. Cliquez sur **Add New… → Project**, puis choisissez le dépôt `al-mactoum`.
3. Laissez les réglages par défaut (Vercel détecte Next.js) et cliquez sur **Deploy**.
4. Au bout de 1 à 2 minutes, le site est en ligne (adresse du type `al-mactoum.vercel.app`).
5. Reportez cette adresse dans `config/site.ts` (`url`), puis enregistrez et poussez sur GitHub : Vercel remet le site à jour tout seul.

**Nom de domaine** (ex. `almactoum.sn`) : dans Vercel, ouvrez **Settings → Domains**, ajoutez votre domaine et suivez les instructions DNS.

Ensuite, à chaque modification poussée sur GitHub, le site se met à jour automatiquement.

---

## 9. Organisation du code

```
app/
  [locale]/            pages FR et EN (accueil, vehicules, paiement, faq, contact)
  (redirection)/       page « / » qui redirige vers /fr/ ou /en/
  sitemap.ts, robots.ts
components/            tous les blocs du site (Header, Hero, Steps, PaymentSection…)
config/site.ts         informations de l'entreprise (un seul endroit)
data/                  véhicules et avis clients
locales/               textes FR et EN
lib/                   outils (langues, WhatsApp, formatage FCFA, images)
public/images/         photos
scripts/               génération des images optimisées, icônes et page 404
```
