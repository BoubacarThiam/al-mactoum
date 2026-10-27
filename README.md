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

> Toute valeur contenant `[À COMPLÉTER]` est **automatiquement masquée** sur le site tant que vous ne l'avez pas remplacée.

---

## 3. Changer les photos

Les photos actuelles sont des images libres de droits (Unsplash). Pour mettre les vôtres :

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
| `vehicules/*.webp`          | Photos du catalogue                       |

Conseils : photos horizontales, 1600 px de large environ, moins de 500 Ko.

L'image de partage (aperçu WhatsApp / Facebook) et les icônes se régénèrent avec :

```bash
npm run assets
```

---

## 4. Ajouter un véhicule

Ouvrez `data/vehicles.ts` et copiez un bloc existant :

```ts
{
  id: 'toyota-rav4-2020',              // identifiant unique, sans espaces
  brand: 'Toyota',
  model: 'RAV4',
  year: 2020,
  mileageKm: 65000,
  type: 'suv',                          // 'suv' | 'berline' | 'pickup'
  image: '/images/vehicules/toyota-rav4.webp',
  imageAlt: 'Toyota RAV4 gris, vue de trois quarts',
  price: '',                            // vide = « Sur devis », ou ex. '12 500 000 FCFA'
  isExample: false,                     // false = vrai véhicule (pas de badge EXEMPLE)
},
```

1. Mettez la photo dans `public/images/vehicules/`.
2. Supprimez les 6 véhicules d'exemple (`isExample: true`) quand vous avez les vôtres.

Les filtres par marque et par type se mettent à jour automatiquement.

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

**Horaires** : dans `config/site.ts`, remplacez `hours: { fr: TODO, en: TODO }` par par ex. `{ fr: 'Lundi – Samedi : 9h – 19h', en: 'Monday – Saturday: 9am – 7pm' }`.

---

## 7. À vérifier avant la mise en ligne

- [ ] Les réponses de la **FAQ** (`locales/fr.json` et `en.json`, rubrique `faq`) : elles sont génériques, à ajuster (délais, garanties, dédouanement).
- [ ] Les numéros Wave / Orange Money et les horaires (`config/site.ts`).
- [ ] L'adresse du site `url` dans `config/site.ts` : mettez votre adresse Vercel ou votre nom de domaine (utilisée pour Google et les aperçus de partage).
- [ ] Remplacer les véhicules d'exemple et ajouter de vrais avis clients.

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
