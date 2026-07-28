# Monorepo

## Structure
```text
new-op/
├── backend/          # API NestJS (Prisma)
├── frontend/         # Web App Next.js
├── pnpm-workspace.yaml
└── package.json
```

## Prérequis
- Node.js (recommandé : Node 20+)
- pnpm (le projet est configuré pour `pnpm@10.30.3`, voir `packageManager` dans `package.json`)
- Docker (optionnel, recommandé pour lancer PostgreSQL en local)

## Configuration (.env)

### Frontend
Copier le fichier d’exemple puis adapter les valeurs :
```bash
cp frontend/.env.example frontend/.env.local
```

Variables importantes (voir [frontend/.env.example](file:///C:/Users/hp/Desktop/project/new-op/new-op/frontend/.env.example)) :
- `NEXT_PUBLIC_API_URL` (ex: `http://127.0.0.1:4000/api`)
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` (doit correspondre à `VAPID_PUBLIC_KEY` côté backend si Web Push activé)

### Backend
Créer un fichier `backend/.env` (ou `backend/.env.local`) avec au minimum :
- `DATABASE_URL` (obligatoire, sinon le backend refuse de démarrer)
- `FRONTEND_URL` (ex: `http://localhost:3000`)
- Auth JWT
  - `JWT_ACCESS_SECRET` (ou `JWT_SECRET`) et `JWT_REFRESH_SECRET`
  - `JWT_ACCESS_EXPIRATION` (optionnel) et `JWT_REFRESH_EXPIRATION` (optionnel)

Variables optionnelles (selon les fonctionnalités activées) :
- Web Push : `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_EMAIL`
- Email : `BREVO_API_KEY` ou `SMTP_PASSWORD` (+ `BREVO_SENDER_EMAIL` / `SMTP_FROM` / `MAIL_FROM`)
- WhatsApp : `WHATSAPP_API_URL`, `WHATSAPP_API_TOKEN`
- Modération : `SIGHTENGINE_API_USER`, `SIGHTENGINE_API_SECRET`
- Debug : `EXPOSE_ERROR_DEBUG=true` (uniquement en environnement non prod)

## Base de données (PostgreSQL)

### Option Docker (recommandé en local)
Dans le dossier `backend/` :
```bash
docker compose up -d
```

### Prisma (migrations + seed)
Après avoir défini `DATABASE_URL` :
```bash
pnpm --filter backend prisma:generate
pnpm --filter backend prisma:migrate:dev
pnpm --filter backend prisma:seed
```

## Quick Start

### Install dependencies
```bash
pnpm install
```

### Development

Run all services in parallel:
```bash
pnpm dev
```

Or run individually:
```bash
pnpm backend:dev    # Start NestJS server
pnpm frontend:dev   # Start Next.js dev server
```

### Build

Build all packages:
```bash
pnpm build
```

Or specific packages:
```bash
pnpm backend:build    # Build NestJS
pnpm frontend:build   # Build Next.js
```

### Testing

```bash
pnpm test           # Run all tests
pnpm test:e2e       # Run e2e tests
```

### Linting & Formatting

```bash
pnpm lint           # Lint all packages
pnpm format         # Format all packages
```

### URLs locales (par défaut)
- Frontend : http://localhost:3000
- Backend : http://localhost:4000/api

## Dépannage
- `ERR_PNPM_JSON_PARSE` : supprimer `node_modules`, exécuter `pnpm store prune`, puis `pnpm install --force`
- Backend ne démarre pas et affiche “DATABASE_URL est absente” : vérifier `backend/.env` et la valeur `DATABASE_URL`

## Scripts Documentation

| Script | Description |
|--------|-------------|
| `pnpm dev` | Run all services in development mode |
| `pnpm build` | Build all packages |
| `pnpm start` | Start all services |
| `pnpm test` | Run tests across workspace |
| `pnpm lint` | Lint all packages |
| `pnpm format` | Format code in all packages |
| `pnpm backend:dev` | Start only backend development server |
| `pnpm frontend:dev` | Start only frontend development server |

## Key Directories

- **backend/src** - NestJS application source code
- **frontend/src** - Next.js application source code
- **backend/prisma** - Database schema and migrations
- **frontend/prisma** - Frontend Prisma schema (if needed)

## Technologies

- **Backend**: NestJS, Prisma, PostgreSQL
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Package Manager**: pnpm
