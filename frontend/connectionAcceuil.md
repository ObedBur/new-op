## 🧠 Skill : Intégration Frontend – Page d’accueil dynamique

**Objectif** : Permettre à la page d’accueil de consommer les nouveaux endpoints backend (`/sellers` et `/content/homepage`) afin d’afficher des données dynamiques (slides Hero, boutiques en vedette, étapes "Comment ça marche"). Le skill guide la création et la modification des fichiers nécessaires, en respectant les bonnes pratiques de l’architecture existante.

**Prérequis** :  
- Connaissance de la structure du projet (Next.js App Router, TypeScript, organisation en features).  
- Backend opérationnel avec les endpoints décrits.  
- Variables d’environnement configurées (`NEXT_PUBLIC_API_URL`).

---

### 📁 Fichiers à créer / modifier

| Fichier | Action | Description |
|---------|--------|-------------|
| `src/features/home/services/seller.service.ts` | Création | Service pour appeler `GET /sellers` |
| `src/features/home/services/content.service.ts` | Création (si inexistant) | Service pour appeler `GET /content/homepage` |
| `src/features/home/components/Hero.tsx` | Modification | Adapter pour recevoir les slides en props |
| `src/features/home/components/FeaturedStores.tsx` | Modification | Adapter pour recevoir les vendeurs en props |
| `src/features/home/components/HowItWorks.tsx` | Modification | Adapter pour recevoir les étapes en props |
| `src/app/page.tsx` | Modification | Intégrer le chargement des données et les passer aux composants |
| `next.config.ts` | Modification (si besoin) | Ajouter les domaines d’images distantes pour `next/image` |

---

### 🧩 Consignes détaillées pour chaque fichier

#### 1. `seller.service.ts`
- **Emplacement** : `src/features/home/services/seller.service.ts`
- **Responsabilité** : Exporter une fonction asynchrone `getActiveSellers()` qui interroge `GET /sellers`.
- **Client HTTP** : Utiliser le client déjà existant (par ex. `@/lib/api` pour `fetch` ou `@/lib/axios`). Privilégier un client compatible SSR si la page utilise un composant serveur.
- **Typage** : Définir une interface `Seller` avec les champs :  
  `id: string`, `boutiqueName: string`, `trustScore: number`, `isVerified: boolean`, `avatarUrl?: string`, `productPreviews: string[]`.
- **Gestion d’erreurs** : Envelopper l’appel dans un `try/catch`. En cas d’erreur, logger l’erreur et retourner un tableau vide (`[]`) pour éviter de casser l’UI.
- **Export** : Exporter la fonction nommée.

#### 2. `content.service.ts`
- **Emplacement** : `src/features/home/services/content.service.ts` (si déjà présent, vérifier qu’il correspond aux besoins).
- **Responsabilité** : Exporter une fonction asynchrone `getHomepageContent()` qui interroge `GET /content/homepage`.
- **Typage** : Définir les interfaces `HeroSlide` (id, title, imageUrl, label?) et `HowItWorksStep` (id, icon, title, description). Puis une interface `HomepageContent` regroupant les deux tableaux.
- **Gestion d’erreurs** : Même principe : retourner un objet avec des tableaux vides en cas d’échec.
- **Client HTTP** : Cohérent avec le service précédent.

#### 3. `Hero.tsx` (modification)
- **Props** : Accepter une prop `slides: HeroSlide[]`.
- **Rendu conditionnel** : Si le tableau est vide, afficher un message ou un placeholder (optionnel).
- **Boucle** : Itérer sur `slides` pour générer le HTML. Utiliser `key={slide.id}`.
- **Images** : Si le projet utilise `next/image`, remplacer les balises `<img>` par `<Image>` avec les attributs `width` et `height` appropriés, et s’assurer que les domaines sont autorisés (voir étape 6).

#### 4. `FeaturedStores.tsx` (modification)
- **Props** : Accepter une prop `stores: Seller[]`.
- **Rendu conditionnel** : Si le tableau est vide, afficher un message.
- **Boucle** : Afficher chaque boutique avec son avatar (fallback vers une image par défaut), son nom, son score de confiance, le badge vérifié, et les aperçus produits.
- **Images** : Utiliser `next/image` si possible, avec un placeholder.

#### 5. `HowItWorks.tsx` (modification)
- **Props** : Accepter une prop `steps: HowItWorksStep[]`.
- **Rendu** : Itérer sur les étapes et afficher l’icône (probablement via Material Icons ou une balise `<span>` avec classe), le titre et la description.
- **Gestion des icônes** : Si les icônes sont des noms de Material Icons, s’assurer que la police est chargée (généralement dans `layout.tsx`).

#### 6. `page.tsx` (modification)
- **Choix de l’approche** :
  - **Option A (composant serveur)** : La page est un composant asynchrone par défaut. Appeler `Promise.all([getHomepageContent(), getActiveSellers()])` et passer les données aux composants.  
    *Avantages* : Pas de chargement visible, meilleur SEO, pas de gestion d’état client.  
    *Condition* : Les services utilisés doivent fonctionner en environnement serveur (pas de `window`).  
  - **Option B (client avec React Query)** : Si le projet utilise déjà React Query, créer un composant client qui utilise `useQuery` pour chaque appel.  
    *Avantages* : Gestion fine du cache, états de chargement, revalidation.  
    *Condition* : `QueryClientProvider` doit être installé.
- **Recommandation** : Opter pour l’option A (composant serveur) si les services sont compatibles SSR, car plus simple et performant.
- **Structure** : La page doit rendre le `main` contenant les trois composants avec les props issues des appels.

#### 7. `next.config.ts` (modification conditionnelle)
- Si des images sont chargées depuis des domaines externes (ex: `images.unsplash.com`), ajouter ces domaines dans la configuration `remotePatterns` de `next/image`.
- Exemple de structure :
  ```ts
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // autres domaines
    ],
  }
  ```

---

### ✅ Plan de vérification

1. **Tests automatisés**  
   - Backend : exécuter `npm run test` dans le dossier `backend` pour s’assurer que les endpoints fonctionnent.
   - Frontend : exécuter `npm run lint` pour vérifier la qualité du code.

2. **Vérification manuelle**  
   - Démarrer le backend : `npm run start:dev` (dans `backend/`).  
   - Démarrer le frontend : `npm run dev` (dans `frontend/`).  
   - Ouvrir le navigateur sur l’URL du frontend.  
   - Vérifier que la page affiche correctement les slides Hero, les boutiques en vedette et les étapes.  
   - Ouvrir les outils de développement (F12) :
     - **Onglet Network** : vérifier que les requêtes vers `/sellers` et `/content/homepage` aboutissent (statut 200).  
     - **Console** : s’assurer qu’il n’y a pas d’erreurs (CORS, 404, etc.).  
   - Tester le comportement en cas d’indisponibilité du backend (par exemple en l’arrêtant) : la page doit afficher des contenus vides sans planter.

---

### 📝 Bonnes pratiques supplémentaires

- **Gestion des erreurs** : Les services doivent capturer les erreurs et retourner des valeurs par défaut (tableaux vides) pour garantir un rendu robuste.
- **Typage fort** : Toutes les données échangées doivent être typées (interfaces TypeScript).
- **Séparation des préoccupations** : Les services ne doivent contenir que la logique d’appel API, pas de logique métier.
- **Performance** : Utiliser `Promise.all` pour paralléliser les appels indépendants.
- **Images** : Toujours utiliser `next/image` pour l’optimisation, avec des dimensions explicites.
- **Accessibilité** : Ajouter des attributs `alt` pertinents aux images.

---

### 🎯 Résultat attendu

La page d’accueil devient entièrement dynamique, alimentée par le backend, tout en restant robuste et performante. Les modifications sont minimales et respectent l’architecture existante.

