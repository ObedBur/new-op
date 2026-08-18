import { PrismaClient, UserRole, KycStatus, ProductAvailability, Market } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { fakerFR as faker } from '@faker-js/faker';
import { fakerEN } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { Logger } from '@nestjs/common';

const logger = new Logger('Seeder');

// 1. Configuration de l'environnement
const envPath = path.join(__dirname, '../.env');
dotenv.config({ path: envPath });

const databaseUrl = process.env.DATABASE_URL || '';
const isAccelerate = databaseUrl.startsWith('prisma://') || databaseUrl.startsWith('prisma+');

const prisma = isAccelerate
  ? new PrismaClient({ accelerateUrl: databaseUrl } as any)
  : new PrismaClient({
      adapter: new PrismaPg(
        new Pool({
          connectionString: databaseUrl,
        }) as any,
      ),
    });

async function main() {
  logger.log('🚀 Démarrage du Seeding (150 produits)...');

  // Nettoyage des données existantes (Parallèle pour éviter le timeout)
  logger.log('🧹 Nettoyage de la base de données...');
  try {
    // Le TRUNCATE CASCADE est beaucoup plus rapide et évite les timeouts liés aux grosses requêtes de suppression sur Neon/Prisma Accelerate
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Notification", "Order", "RefreshToken", "Follow", "PushSubscription", "Product", "Category", "User", "HeroSlide", "HowItWorksStep" CASCADE;`);
    logger.log('✅ Base de données nettoyée avec TRUNCATE CASCADE.');
  } catch (error) {
    logger.warn('⚠️ Le TRUNCATE a échoué, utilisation de deleteMany en séquentiel...');
    await prisma.notification.deleteMany();
    await prisma.order.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.follow.deleteMany();
    await prisma.pushSubscription.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    await prisma.heroSlide.deleteMany();
    await prisma.howItWorksStep.deleteMany();
  }

  // 1. Setup Admin
  logger.log('👤 Création de l\'administrateur...');
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  await prisma.user.upsert({
    where: { email: 'wapibeapp@gmail.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'wapibeapp@gmail.com',
      password: hashedPassword,
      fullName: 'WapiBei Admin',
      phone: '+243990000000',
      province: 'Nord-Kivu',
      commune: 'Goma',
      role: UserRole.ADMIN,
      isVerified: true,
      kycStatus: KycStatus.NOT_REQUIRED,
      trustScore: 100,
      country: 'RD Congo',
    },
  });
  logger.log('✅ Administrateur configuré (wapibeapp@gmail.com / Admin123!)');

  // 2. Setup Categories avec l'icône corrigée pour Agricole
  logger.log('🏷️ Création des catégories...');
  const categoriesData = [
    { name: 'Agricole', icon: 'potted_plant', colorClass: 'text-emerald-500', bgClass: 'bg-emerald-50' },
    { name: 'High-Tech', icon: 'smartphone', colorClass: 'text-blue-500', bgClass: 'bg-blue-50' },
    { name: 'Mode', icon: 'checkroom', colorClass: 'text-pink-500', bgClass: 'bg-pink-50' },
    { name: 'Maison', icon: 'home', colorClass: 'text-purple-500', bgClass: 'bg-purple-50' },
    { name: 'Alimentation', icon: 'restaurant', colorClass: 'text-orange-500', bgClass: 'bg-orange-50' },
    { name: 'Beauté & Santé', icon: 'health_and_safety', colorClass: 'text-rose-500', bgClass: 'bg-rose-50' },
    { name: 'Sport & Loisirs', icon: 'sports_soccer', colorClass: 'text-cyan-500', bgClass: 'bg-cyan-50' },
    { name: 'Auto & Moto', icon: 'directions_car', colorClass: 'text-slate-500', bgClass: 'bg-slate-50' },
    { name: 'Boutique Express', icon: 'local_mall', colorClass: 'text-amber-500', bgClass: 'bg-amber-50' },
    { name: 'Services & Travaux', icon: 'construction', colorClass: 'text-indigo-500', bgClass: 'bg-indigo-50' },
    { name: 'Bureautique', icon: 'print', colorClass: 'text-zinc-500', bgClass: 'bg-zinc-50' },
    { name: 'Divers', icon: 'category', colorClass: 'text-gray-500', bgClass: 'bg-gray-50' },
  ];

  for (const cat of categoriesData) {
    await prisma.category.create({ data: cat });
  }
  const dbCategories = await prisma.category.findMany();

  // 3. Setup Vendeurs (12 vendeurs pour varier les boutiques)
  logger.log('📦 Création des vendeurs...');
  const vendors = [];
  for (let i = 0; i < 12; i++) {
    const v = await prisma.user.create({
      data: {
        email: faker.internet.email().toLowerCase(),
        password: hashedPassword,
        fullName: faker.person.fullName(),
        phone: faker.phone.number('+243 ### ### ##'),
        province: 'Nord-Kivu',
        commune: 'Goma',
        role: UserRole.VENDOR,
        boutiqueName: faker.company.name() + ' Express',
        isVerified: Math.random() > 0.2,
        trustScore: faker.number.int({ min: 70, max: 100 }),
        avatarUrl: `https://i.pravatar.cc/150?u=${faker.string.uuid()}`,
      },
    });
    vendors.push(v);
  }

  // 3.5 Vendeur sans produits (Demandé pour tester les cas d'affichage vide)
  logger.log('👻 Création d\'un vendeur sans produits...');
  await prisma.user.create({
    data: {
      email: 'vide@wapibei.com',
      password: hashedPassword,
      fullName: 'Boutique Fantôme',
      phone: '+243991111111',
      province: 'Nord-Kivu',
      commune: 'Goma',
      role: UserRole.VENDOR,
      boutiqueName: 'Boutique Sans Produits',
      isVerified: true,
      trustScore: 85,
      avatarUrl: `https://i.pravatar.cc/150?u=vide`,
    },
  });

  // 4. Setup Produits (150 articles)
  logger.log('🛍️ Création de 150 produits...');
  const productImages: Record<string, string[]> = {
    'Agricole': [
      'https://images.unsplash.com/photo-1595855759920-86582396756a?w=800',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
    ],
    'High-Tech': [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
      'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=800'
    ],
    'Mode': [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800'
    ],
    'Maison': [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
    ],
  };

  for (let i = 0; i < 150; i++) {
    const category = faker.helpers.arrayElement(dbCategories);
    const vendor = faker.helpers.arrayElement(vendors);
    const price = parseFloat(faker.commerce.price({ min: 10, max: 2500 }));
    const categoryImgs = productImages[category.name] || productImages['Maison'];

    // ~30% des produits sont en promotion
    const isOnSale = Math.random() < 0.3;
    const originalPrice = isOnSale ? Math.round(price * (1 + Math.random() * 0.5 + 0.15)) : undefined;

    // Ventes simulées (certains produits sont très populaires)
    const totalSales = faker.number.int({ min: 0, max: Math.random() > 0.8 ? 200 : 30 });

    // Dates variées : 40% créés cette semaine (nouveautés), le reste plus ancien
    const isNew = Math.random() < 0.4;
    const createdAt = isNew
      ? faker.date.recent({ days: 7 })
      : faker.date.past({ years: 1 });

    await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        nameFr: faker.commerce.productName(),
        nameEn: fakerEN.commerce.productName(),
        nameSw: faker.commerce.productName(),
        descriptionFr: faker.commerce.productDescription(),
        descriptionEn: fakerEN.commerce.productDescription(),
        descriptionSw: faker.commerce.productDescription(),
        price,
        originalPrice: originalPrice || null,
        isOnSale,
        totalSales,
        displayPrice: `${price}$`,
        location: 'Marché central, Goma',
        city: 'Goma',
        country: 'RD Congo',
        image: faker.helpers.arrayElement(categoryImgs),
        images: faker.helpers.arrayElements(categoryImgs, { min: 2, max: 3 }),
        availability: ProductAvailability.IN_STOCK,
        categoryId: category.id,
        userId: vendor.id,
        createdAt,
      },
    });
  }

  // 5. Hero Slides & Steps (Inchangés)
  logger.log('🎬 Finalisation des éléments visuels...');
  const heroSlides = [
    { title: "L'excellence à portée de main", imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200', label: 'PREMIUM', order: 1 },
    { title: "L'élégance du détail", imageUrl: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=1200', label: 'LUXE', order: 2 },
  ];

  for (const slide of heroSlides) {
    await prisma.heroSlide.create({ data: { ...slide, id: faker.string.uuid() } });
  }

  const steps = [
    {
      icon: 'search',
      title: 'Trouvez vos produits favoris',
      description: 'Explorez un vaste catalogue de produits locaux et internationaux (agricole, mode, tech). Ajoutez vos coups de cœur à votre panier en un clic.',
      order: 1,
    },
    {
      icon: 'shopping_cart',
      title: 'Achetez en toute simplicité',
      description: 'Validez votre panier instantanément sur la plateforme. Le vendeur reçoit immédiatement une alerte sur son tableau de bord pour préparer votre commande.',
      order: 2,
    },
    {
      icon: 'notifications_active',
      title: 'Restez toujours informé',
      description: 'Suivez l\'état de votre commande (Confirmée, Expédiée) en temps réel. Discutez directement avec le vendeur sur WhatsApp pour le moindre détail.',
      order: 3,
    },
    {
      icon: 'inventory_2',
      title: 'Recevez et profitez',
      description: 'Le vendeur vous expédie votre colis. Réceptionnez vos achats, vérifiez la qualité et finalisez la transaction en toute confiance.',
      order: 4,
    },
  ];

  for (const step of steps) {
    await prisma.howItWorksStep.create({ data: { ...step, id: faker.string.uuid() } });
  }

  logger.log('✅ Base de données remplie avec succès !');
}

main()
  .catch((e) => { logger.error('❌ Erreur:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
