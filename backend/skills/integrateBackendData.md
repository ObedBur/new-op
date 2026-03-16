## 🧠 Skill : Implémentation Backend – Partie restante

**Objectif** : Finaliser les modules `Sellers` et `Content` pour exposer les endpoints dynamiques.

**Stack** : NestJS + Prisma

**Prérequis** :  
- Schéma Prisma déjà mis à jour avec `avatarUrl`, `coverUrl`, `HeroSlide`, `HowItWorksStep`.  
- Base de données synchronisée (via `prisma db push`).  
- Modules, services et contrôleurs générés avec Nest CLI.  

---

### 📦 Étape 1 – Créer les DTOs

#### `sellers/dto/seller.dto.ts`
```typescript
export class SellerDto {
  id: string;
  boutiqueName: string;
  trustScore: number;
  isVerified: boolean;
  avatarUrl?: string;
  productPreviews: string[];
}
```

#### `content/dto/hero-slide.dto.ts`
```typescript
export class HeroSlideDto {
  id: string;
  title: string;
  imageUrl: string;
  label?: string;
}
```

#### `content/dto/how-it-works-step.dto.ts`
```typescript
export class HowItWorksStepDto {
  id: string;
  icon: string;
  title: string;
  description: string;
}
```

#### `content/dto/homepage-content.dto.ts`
```typescript
import { HeroSlideDto } from './hero-slide.dto';
import { HowItWorksStepDto } from './how-it-works-step.dto';

export class HomepageContentDto {
  heroSlides: HeroSlideDto[];
  howItWorksSteps: HowItWorksStepDto[];
}
```

---

### 🧩 Étape 2 – Implémenter le service Sellers

**Fichier** : `sellers/sellers.service.ts`

- Injecter `PrismaService`.
- Méthode `findActiveVendors()` :
  - Récupérer les utilisateurs avec `role: 'VENDOR'` et `isVerified: true` (ou autre critère d’actif).
  - Inclure les 3 derniers produits avec leurs images.
  - Mapper vers `SellerDto`.

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SellerDto } from './dto/seller.dto';

@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) {}

  async findActiveVendors(): Promise<SellerDto[]> {
    const vendors = await this.prisma.user.findMany({
      where: { role: 'VENDOR', isVerified: true },
      include: {
        products: {
          take: 3,
          orderBy: { createdAt: 'desc' },
          select: { images: true },
        },
      },
    });

    return vendors.map((vendor) => ({
      id: vendor.id,
      boutiqueName: vendor.boutiqueName,
      trustScore: vendor.trustScore,
      isVerified: vendor.isVerified,
      avatarUrl: vendor.avatarUrl,
      productPreviews: vendor.products.flatMap((p) => p.images).slice(0, 3),
    }));
  }
}
```

---

### 🧩 Étape 3 – Implémenter le contrôleur Sellers

**Fichier** : `sellers/sellers.controller.ts`

- Route `GET /sellers` publique.
- Appeler le service.

```typescript
import { Controller, Get } from '@nestjs/common';
import { SellersService } from './sellers.service';

@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Get()
  async getActiveSellers() {
    return this.sellersService.findActiveVendors();
  }
}
```

---

### 🧩 Étape 4 – Implémenter le service Content

**Fichier** : `content/content.service.ts`

- Méthode `getHomepageContent()` :
  - Récupérer toutes les `HeroSlide` triées par `order`.
  - Récupérer toutes les `HowItWorksStep` triées par `order`.
  - Retourner un objet `HomepageContentDto`.

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HomepageContentDto } from './dto/homepage-content.dto';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async getHomepageContent(): Promise<HomepageContentDto> {
    const [heroSlides, steps] = await Promise.all([
      this.prisma.heroSlide.findMany({ orderBy: { order: 'asc' } }),
      this.prisma.howItWorksStep.findMany({ orderBy: { order: 'asc' } }),
    ]);

    return {
      heroSlides: heroSlides.map((s) => ({
        id: s.id,
        title: s.title,
        imageUrl: s.imageUrl,
        label: s.label,
      })),
      howItWorksSteps: steps.map((s) => ({
        id: s.id,
        icon: s.icon,
        title: s.title,
        description: s.description,
      })),
    };
  }
}
```

---

### 🧩 Étape 5 – Implémenter le contrôleur Content

**Fichier** : `content/content.controller.ts`

- Route `GET /content/homepage` publique.
- Appeler le service.

```typescript
import { Controller, Get } from '@nestjs/common';
import { ContentService } from './content.service';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('homepage')
  async getHomepageContent() {
    return this.contentService.getHomepageContent();
  }
}
```

---

### 🧩 Étape 6 – S’assurer que PrismaService est disponible

Si vous n’avez pas encore de `PrismaService`, créez-le dans `src/prisma/prisma.service.ts` et importez-le dans les modules `SellersModule` et `ContentModule`.

---

### ✅ Étape 7 – Tests et validation

1. **Lancer le backend** : `npm run start:dev`
2. **Tester les endpoints** :
   - `GET http://localhost:3000/sellers`
   - `GET http://localhost:3000/content/homepage`
3. **Vérifier** :
   - Les réponses sont au format JSON attendu.
   - Si les tables sont vides, les tableaux sont vides (pas d’erreur).
4. **Gestion d’erreurs** : Ajouter des try/catch dans les contrôleurs si nécessaire (retour 500 avec message).

---

### 🌱 Optionnel – Ajouter des données de test

Si vous souhaitez peupler les tables `HeroSlide` et `HowItWorksStep` avec des données fictives, créez un script de seed utilisant **Faker.js** et exécutez-le.

---

**Fin du skill.** Bonne implémentation !