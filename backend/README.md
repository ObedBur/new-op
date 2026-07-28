# WapiBei — Backend (NestJS + Prisma)

API NestJS (Fastify) du projet WapiBei.

## Prérequis
- Node.js (recommandé : Node 20+)
- pnpm
- Docker (optionnel, recommandé pour PostgreSQL en local)

## Démarrage rapide

### 1) Base de données (PostgreSQL)

Option Docker (recommandé) :
```bash
docker compose up -d
```

Fichier : [docker-compose.yml](file:///C:/Users/hp/Desktop/project/new-op/new-op/backend/docker-compose.yml)

### 2) Variables d’environnement (`backend/.env`)
Le backend charge `.env` puis `.env.local` depuis le dossier `backend/` (voir [main.ts](file:///C:/Users/hp/Desktop/project/new-op/new-op/backend/src/main.ts#L7-L20)).

Variables minimales :
- `DATABASE_URL` (obligatoire)
- `FRONTEND_URL` (ex: `http://localhost:3000` ou liste séparée par des virgules)
- `PORT` (optionnel, par défaut `4000`)

JWT (authentification) :
- `JWT_ACCESS_SECRET` (ou `JWT_SECRET`)
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_EXPIRATION` (optionnel)
- `JWT_REFRESH_EXPIRATION` (optionnel)

Fonctionnalités optionnelles :
- Web Push : `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_EMAIL`
- Email : `BREVO_API_KEY` ou `SMTP_PASSWORD` (+ `BREVO_SENDER_EMAIL` / `SMTP_FROM` / `MAIL_FROM`)
- WhatsApp : `WHATSAPP_API_URL`, `WHATSAPP_API_TOKEN`
- Modération : `SIGHTENGINE_API_USER`, `SIGHTENGINE_API_SECRET`
- Debug : `EXPOSE_ERROR_DEBUG=true` (uniquement hors prod)

Note : ne jamais commiter de secrets dans le dépôt.

### 3) Prisma (generate + migrations + seed)
Depuis la racine du monorepo :
```bash
pnpm --filter backend prisma:generate
pnpm --filter backend prisma:migrate:dev
pnpm --filter backend prisma:seed
```

Scripts disponibles : [backend/package.json](file:///C:/Users/hp/Desktop/project/new-op/new-op/backend/package.json#L7-L27)

### 4) Lancer l’API
Depuis la racine du monorepo :
```bash
pnpm backend:dev
```

Par défaut :
- API : http://localhost:4000
- Préfixe global : `/api` (voir [main.ts](file:///C:/Users/hp/Desktop/project/new-op/new-op/backend/src/main.ts#L48-L51))

## Endpoints de base

- `GET /api` : informations API (voir [app.controller.ts](file:///C:/Users/hp/Desktop/project/new-op/new-op/backend/src/app.controller.ts#L8-L11))
- `GET /api/health` : healthcheck (voir [app.controller.ts](file:///C:/Users/hp/Desktop/project/new-op/new-op/backend/src/app.controller.ts#L13-L16))

Exemple :
```bash
curl http://localhost:4000/api/health
```

## CORS
- En dev, CORS est permissif.
- En prod, les origines sont filtrées via `FRONTEND_URL` et les règles Vercel `*.vercel.app` (voir [main.ts](file:///C:/Users/hp/Desktop/project/new-op/new-op/backend/src/main.ts#L67-L106)).

## Modules principaux
Les modules sont déclarés dans [app.module.ts](file:///C:/Users/hp/Desktop/project/new-op/new-op/backend/src/app.module.ts#L23-L55) (auth, produits, vendeurs, commandes, notifications, etc.).

## Swagger / OpenAPI
Swagger est activé en développement, et désactivé en production par défaut.

### 1) Dépendances
Installer côté backend :
```bash
pnpm --filter backend add @nestjs/swagger@7.4.0 @fastify/swagger @fastify/swagger-ui
```

### 2) Initialisation dans `main.ts`
Configuration dans [main.ts](file:///C:/Users/hp/Desktop/project/new-op/new-op/backend/src/main.ts) :

```ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('WapiBei API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('docs', app, document);
```

### 3) URL
- Swagger UI : `GET /api/docs`

### 4) Production (optionnel)
- Pour activer Swagger en production : définir `SWAGGER_ENABLED=true`

