# 🚀 Guide de Déploiement sur Render

## Prérequis
- Compte GitHub (votre repo doit être public ou vous donner accès)
- Compte Render (render.com)
- PostgreSQL database (gratuit sur Render ou externe)

## Étapes

### 1️⃣ Préparer votre repo GitHub
```bash
# Assurez-vous que le Dockerfile est à la racine de `backend/`
# Committez tous les changements
git add .
git commit -m "Add Docker configuration for deployment"
git push
```

### 2️⃣ Créer une Database PostgreSQL sur Render

1. Allez sur **render.com** → Sign In
2. Dashboard → **New +** → **PostgreSQL**
3. Configurez :
   - **Name**: `new-op-db`
   - **Database name**: `new_op_db`
   - **User**: `postgres` (ou autre)
   - **Region**: Choisissez la plus proche
   - **Plan**: Free (ou payant pour la prod)
4. Cliquez **Create Database**
5. Attendez quelques minutes, puis copiez la **Internal Database URL** (commence par `postgresql://`)

### 3️⃣ Créer un Web Service sur Render

1. Dashboard → **New +** → **Web Service**
2. Sélectionnez votre repo GitHub `new-op`
3. Configurez :
   - **Name**: `new-op-backend`
   - **Environment**: `Docker`
   - **Region**: Même région que la DB
   - **Branch**: `main` (ou votre branche)

### 4️⃣ Configurez les Variables d'Environnement

Dans Render, allez à **Environment**:

```
DATABASE_URL=postgresql://user:password@host:port/new_op_db
JWT_SECRET=your-very-secret-random-key-here-min-32chars
JWT_EXPIRATION=7d
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
BREVO_API_KEY=votre-api-key-brevo
BREVO_SENDER_EMAIL=noreply@your-domain.com
```

**Copier la DATABASE_URL depuis votre PostgreSQL créée à l'étape 2**

### 5️⃣ Build & Deploy

1. Cliquez **Create Web Service**
2. Render va commencer le build (logs visibles en direct)
3. Attendre ~5-10 min pour la compilation
4. Une fois déployé, vous verrez l'URL du service

### 6️⃣ Tester l'API

```bash
curl https://your-service.onrender.com/api/health
```

## Troubleshooting

### Build échoue
```
Error: EMFILE: too many open files
```
→ Vérifier le `.dockerignore` inclut `node_modules`

### Migrations échouent
```
Error: Could not connect to database
```
→ Vérifier que `DATABASE_URL` est correcte dans les env vars

### Port bind error
→ Render expose le port 3000 automatiquement via la variable `PORT`

## Redeploiement Automatique

Activez **Auto-Deploy** sur Render :
- Settings → Redeploy → **Auto-Deploy**: `Yes`
- À chaque push sur votre branch, Render redéploiera automatiquement

## Domaine Personnalisé (optionnel)

1. Settings → **Custom Domains**
2. Ajoutez votre domaine (+$7/mois)
3. Pointez les DNS vers Render

## Performance & Scaling

- **Free plan**: Arrêt après 15 min d'inactivité
- **Paid plan**: Instances toujours actives, auto-scaling
- Considérez un upgrade si accès fréquent

---

**Besoin d'aide locale ?** Test en local d'abord :
```bash
docker build -f backend/Dockerfile -t new-op-backend .
docker run -p 3000:3000 -e DATABASE_URL="postgresql://..." new-op-backend
```
