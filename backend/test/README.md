# 🧪 Infrastructure de Tests Backend

## 📁 Structure

```
backend/
├── test/
│   ├── setup.ts                    # Configuration globale des tests
│   ├── mocks/                      # Mocks réutilisables
│   │   ├── prisma.mock.ts         # Mock de PrismaService
│   │   ├── email.mock.ts          # Mock d'EmailService
│   │   ├── jwt.mock.ts            # Mock de JwtService
│   │   └── index.ts               # Barrel export
│   ├── helpers/                    # Utilitaires de test
│   │   ├── test-data.factory.ts   # Factory pour données de test
│   │   ├── test-utils.ts          # Fonctions utilitaires
│   │   └── index.ts               # Barrel export
│   └── jest-e2e.json              # Config Jest E2E
└── src/
    └── **/*.spec.ts               # Tests unitaires à côté du code
```

## 🚀 Utilisation

### Lancer les tests

```bash
# Tous les tests
pnpm test

# En mode watch (redémarre automatiquement)
pnpm test:watch

# Avec couverture de code
pnpm test:cov

# Tests E2E
pnpm test:e2e
```

### Créer un nouveau test

1. **Créer le fichier de test** à côté du fichier source :
   ```
   src/auth/auth.service.ts
   src/auth/auth.service.spec.ts  ← Créer ici
   ```

2. **Importer les mocks et helpers** :
   ```typescript
   import { Test, TestingModule } from '@nestjs/testing';
   import { AuthService } from './auth.service';
   import { 
     createMockPrismaService, 
     createMockEmailService 
   } from '../../test/mocks';
   import { TestDataFactory } from '../../test/helpers';
   ```

3. **Écrire le test** :
   ```typescript
   describe('AuthService', () => {
     let service: AuthService;
     let prisma: any;
     let emailService: any;

     beforeEach(async () => {
       const mockPrisma = createMockPrismaService();
       const mockEmail = createMockEmailService();

       const module: TestingModule = await Test.createTestingModule({
         providers: [
           AuthService,
           { provide: PrismaService, useValue: mockPrisma },
           { provide: EmailService, useValue: mockEmail },
         ],
       }).compile();

       service = module.get<AuthService>(AuthService);
       prisma = mockPrisma;
       emailService = mockEmail;
     });

     it('should register a new user', async () => {
       const dto = TestDataFactory.createRegisterDto();
       prisma.user.findFirst.mockResolvedValue(null);
       prisma.user.create.mockResolvedValue(await TestDataFactory.createUser());

       const result = await service.register(dto);

       expect(result.success).toBe(true);
       expect(emailService.sendOtp).toHaveBeenCalled();
     });
   });
   ```

## 📚 Mocks Disponibles

### PrismaService Mock

```typescript
import { createMockPrismaService } from '../../test/mocks';

const mockPrisma = createMockPrismaService();

// Configurer le comportement
mockPrisma.user.findUnique.mockResolvedValue(mockUser);
mockPrisma.user.create.mockResolvedValue(newUser);
```

### EmailService Mock

```typescript
import { createMockEmailService } from '../../test/mocks';

const mockEmail = createMockEmailService();

// Vérifier les appels
expect(mockEmail.sendOtp).toHaveBeenCalledWith(email, otp);
```

### JwtService Mock

```typescript
import { createMockJwtService } from '../../test/mocks';

const mockJwt = createMockJwtService();

// Retourne automatiquement : `mock.jwt.token.${userId}`
const token = await mockJwt.signAsync(payload);
```

## 🏭 Test Data Factory

### Créer des utilisateurs de test

```typescript
import { TestDataFactory } from '../../test/helpers';

// Utilisateur CLIENT par défaut
const user = await TestDataFactory.createUser();

// Vendeur PENDING
const vendor = await TestDataFactory.createVendor();

// Vendeur APPROVED
const approvedVendor = await TestDataFactory.createApprovedVendor();

// Utilisateur vérifié
const verifiedUser = await TestDataFactory.createVerifiedUser();

// Admin
const admin = await TestDataFactory.createAdmin();

// Avec overrides personnalisés
const customUser = await TestDataFactory.createUser({
  email: 'custom@test.com',
  phone: '+243123456789',
});
```

### Créer des DTOs de test

```typescript
// DTO pour CLIENT
const clientDto = TestDataFactory.createRegisterDto('CLIENT');

// DTO pour VENDOR (avec boutiqueName)
const vendorDto = TestDataFactory.createRegisterDto('VENDOR');

// OTP de test
const otp = TestDataFactory.createOtp(); // '123456'

// Token de reset
const resetToken = TestDataFactory.createResetToken();
```

## 🛠️ Utilitaires de Test

```typescript
import { TestUtils } from '../../test/helpers';

// Attendre un délai
await TestUtils.wait(100);

// Générer un token de test
const token = TestUtils.generateTestToken('user-123', 'CLIENT');

// Vérifier qu'une date est récente
const isRecent = TestUtils.isRecentDate(new Date(), 10); // 10 secondes max

// Mock de Request/Response Express
const req = TestUtils.createMockRequest({ user: { id: '123' } });
const res = TestUtils.createMockResponse();
```

## ✅ Bonnes Pratiques

1. **Un test = une assertion principale**
   ```typescript
   it('should reject duplicate email', async () => {
     // Arrange
     prisma.user.findFirst.mockResolvedValue(existingUser);
     
     // Act & Assert
     await expect(service.register(dto)).rejects.toThrow('User already exists');
   });
   ```

2. **Nettoyer les mocks après chaque test**
   ```typescript
   afterEach(() => {
     jest.clearAllMocks();
   });
   ```

3. **Tester les cas limites (edge cases)**
   - Valeurs nulles/undefined
   - Données invalides
   - Cas d'erreur
   - Limites (3 tentatives max, etc.)

4. **Nommer clairement les tests**
   ```typescript
   // ✅ BON
   it('should reject registration with duplicate email')
   
   // ❌ MAUVAIS
   it('test 1')
   ```

5. **Utiliser describe pour grouper**
   ```typescript
   describe('AuthService', () => {
     describe('register', () => {
       it('should create CLIENT with NOT_REQUIRED KYC')
       it('should create VENDOR with PENDING KYC')
       it('should reject duplicate email')
     });
     
     describe('login', () => {
       it('should login verified user')
       it('should reject unverified user')
     });
   });
   ```

## 📊 Couverture de Code

Objectif : **80%+ de couverture** sur le code métier

```bash
# Générer le rapport de couverture
pnpm test:cov

# Voir le rapport HTML
open coverage/lcov-report/index.html
```

### Fichiers à exclure de la couverture

- `*.spec.ts` - Fichiers de test
- `main.ts` - Point d'entrée
- `*.module.ts` - Modules simples
- `*.dto.ts` - DTOs simples
- Fichiers de configuration

## 🐛 Debugging des Tests

### Mode debug

```bash
pnpm test:debug

# Ouvrir chrome://inspect dans Chrome
# Cliquer sur "inspect" pour débugger
```

### Lancer un seul test

```bash
# Par nom de fichier
pnpm test auth.service.spec

# Par nom de test
pnpm test -t "should register a new user"
```

### Voir les logs

Par défaut, console.log est mocké. Pour voir les logs :

```typescript
// Temporairement dans le test
console.error = console._error; // Restaurer le vrai console

// Ou dans setup.ts, commenter les mocks
```

## 📖 Ressources

- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Faker.js](https://fakerjs.dev/guide/)

## ✨ État Actuel

- ✅ Configuration Jest
- ✅ Mocks (Prisma, Email, JWT)
- ✅ Factory functions
- ✅ Test utilities
- ✅ Premier test exemple (app.service.spec.ts)
- ⏳ Tests AuthService (Task 1.2)
- ⏳ Tests E2E (Task 1.10)

**Date de création** : 2026-02-07  
**Dernière mise à jour** : 2026-02-07
