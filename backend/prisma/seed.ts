import { PrismaClient, UserRole, KycStatus, ProductAvailability, Market } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { fakerFR as faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// 1. Configuration de l'environnement
const envPath = path.join(__dirname, '../.env');
dotenv.config({ path: envPath });

const url = process.env.DATABASE_URL;
const pool = new Pool({ connectionString: url });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('🚀 Démarrage du Seeding (150 produits)...');

  // Nettoyage des données existantes
  console.log('🧹 Nettoyage de la base de données...');
  await prisma.notification.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.heroSlide.deleteMany({});
  await prisma.howItWorksStep.deleteMany({});

  // 1. Setup Admin
  console.log('👤 Création de l\'administrateur...');
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
  console.log('✅ Administrateur configuré (wapibeapp@gmail.com / Admin123!)');

  // 2. Setup Categories avec l'icône corrigée pour Agricole
  console.log('🏷️ Création des catégories...');
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
  console.log('📦 Création des vendeurs...');
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

  // 4. Setup Produits (150 articles)
  console.log('🛍️ Création de 150 produits...');
  const productImages: Record<string, string[]> = {
    'Agricole': [
      'https://images.unsplash.com/photo-1518977676601-b53f02ac6d31?w=800',
      'https://images.unsplash.com/photo-1595855759920-86582396756a?w=800',
      'https://images.unsplash.com/photo-1566385101042-1a010c1274cc?w=800'
    ],
    'High-Tech': [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800'
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
  console.log('🎬 Finalisation des éléments visuels...');
  const heroSlides = [
    { title: "L'excellence à portée de main", imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200', label: 'PREMIUM', order: 1 },
    { title: "L'élégance du détail", imageUrl: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=1200', label: 'LUXE', order: 2 },
  ];

  for (const slide of heroSlides) {
    await prisma.heroSlide.create({ data: { ...slide, id: faker.string.uuid() } });
  }

  const steps = [
    { icon: 'search', title: 'Recherchez', description: 'Trouvez vos produits favoris.', order: 1 },
    { icon: 'shopping_bag', title: 'Achetez', description: 'Rencontrez le vendeur et achetez.', order: 2 },
  ];

  for (const step of steps) {
    await prisma.howItWorksStep.create({ data: { ...step, id: faker.string.uuid() } });
  }

  console.log('✅ Base de données remplie avec succès !');
}

main()
  .catch((e) => { console.error('❌ Erreur:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });