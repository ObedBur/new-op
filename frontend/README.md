# WapiBei — Frontend (Next.js)

Application web Next.js (App Router) du projet WapiBei.

## Prérequis
- Node.js (recommandé : Node 20+)
- pnpm

## Démarrage rapide

### 1) Variables d’environnement
Copier le fichier d’exemple puis adapter les valeurs :
```bash
cp .env.example .env.local
```

Variables importantes :
- `NEXT_PUBLIC_API_URL` : URL du backend (ex: `http://127.0.0.1:4000/api`)
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` : clé publique Web Push (si activé côté backend)
- `ALLOWED_ORIGINS` et `ALLOWED_DEV_ORIGINS` : origines autorisées (utile si vous testez sur mobile/lan)

### 2) Lancer le frontend
Depuis la racine du monorepo :
```bash
pnpm frontend:dev
```

Ou directement dans `frontend/` :
```bash
pnpm dev
```

URL locale (par défaut) : http://localhost:3000

## Scripts utiles
- Dev : `pnpm dev` (ou `pnpm dev:turbo`)
- Build : `pnpm build`
- Start : `pnpm start`
- Lint : `pnpm lint` (obligatoire avant PR)
- Tests : `pnpm test` / `pnpm test:watch`

## Structure (repères)
- `src/app` : routes (App Router) et pages (ex: dashboard vendeur)
- `src/components` : composants UI
- `src/lib` : helpers, clients API, hooks

## Notes API
- Le frontend consomme le backend via `NEXT_PUBLIC_API_URL`.
- Si l’API locale est sur `http://127.0.0.1:4000/api`, la plupart des appels partent de cette base URL.

## Ressources Next.js
- Documentation : https://nextjs.org/docs
