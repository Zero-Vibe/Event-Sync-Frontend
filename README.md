# EventSync - Frontend Application

Ce projet est l'application cliente d'**EventSync**, une interface web moderne et interactive permettant aux participants de visualiser le programme d'une conférence, d'interagir en direct avec les intervenants et de gérer l'organisation de l'événement. Elle est construite avec **Next.js (App Router)**, **TypeScript**, et **Tailwind CSS**.

## 🚀 Fonctionnalités Applicatives

* **Tableau de bord de l'événement** : Consultation fluide de la liste des événements, des détails des sessions planifiées, du planning horaire, et tri par salle de conférence.
* **Espace Intervenants & Salles** : Fiches dédiées pour chaque intervenant (biographie, réseaux sociaux, sessions rattachées) et répertoire des salles disponibles.
* **Interaction interactive en direct (WebSockets)** : Flux de questions-réponses en direct intégré aux sessions, permettant de soumettre des questions anonymement ou sous son profil, et de voter pour faire remonter les questions les plus pertinentes.
* **Authentification unifiée** : Formulaires d'inscription et de connexion ergonomiques avec persistance sécurisée du Token JWT dans le `localStorage`.
* **Design Fluide & Réactif** : Interface entièrement adaptative (Mobile/Desktop) construite avec Tailwind CSS v4, agrémentée d'animations fluides (`tw-animate-css`) et d'icônes dynamiques (`lucide-react`).

---

## 🛠️ Stack Technique

* **Framework** : Next.js 16+ (App Router)
* **Bibliothèque Core** : React 19
* **Gestion d'État** : Zustand
* **Styles & Animations** : Tailwind CSS v4, clsx, tailwind-merge, tw-animate-css
* **Communication Real-time** : `@stomp/stompjs` & `sockjs-client`
* **Icônes** : Lucide React

---

## 📋 Prérequis & Configuration

Avant de démarrer le frontend, veillez à configurer l'URL de connexion vers votre API Backend EventSync.

### Fichier d'environnement
Créez un fichier `.env.local` à la racine de ce dossier :

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## 🔧 Commandes pour Lancer le Projet

Assurez-vous d'avoir installé Node.js et votre gestionnaire de paquets favori (`npm`, `pnpm`, `yarn` ou `bun`).

### 1. Installation des dépendances
```bash
npm install
# ou
pnpm install
# ou
yarn install
```

### 2. Lancement du serveur de développement
Pour démarrer l'application avec rechargement à chaud (Hot-Reload) :
```bash
npm run dev
# ou
pnpm dev
# ou
yarn dev
# ou
bun dev
```
L'application sera lancée sur [http://localhost:3000](http://localhost:3000).

### 3. Build pour la production
Pour générer une version de production optimisée :
```bash
npm run build
```

### 4. Lancer la version de production buildée
```bash
npm run start
```

### 5. Vérification du code (Linter)
```bash
npm run lint
```

---

## 📁 Architecture du Code Source Front-end

* `src/api/` : Contient les clients de fetch et les fonctions d'appels asynchrones typées vers l'API Spring Boot (`auth.ts`, `client.ts`, etc.).
* `src/app/` : Structure des pages et layouts de l'application via le système d'App Router de Next.js (comprend le layout global, l'agenda et les vues dynamiques).
* `src/components/` : Composants UI réutilisables (En-tête, Pied de page, Cartes d'événements, Toasts de notification).
* `src/types/` : Définitions et interfaces TypeScript reflétant les modèles de données (Requests, Responses, Erreurs API).
* `src/utils/` : Utilitaires de formatage (gestion de l'affichage des dates et plages horaires).
