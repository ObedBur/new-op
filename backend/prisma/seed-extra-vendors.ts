import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { fakerFR as faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { Logger } from '@nestjs/common';

const logger = new Logger('ExtraVendorsSeeder');

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

const IMAGE_POOL = [
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
  'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=800',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
  'https://images.unsplash.com/photo-1595855759920-86582396756a?w=800',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
];

const TARGET_ACTIVE_VENDORS = 22;

async function main() {
  logger.log('🚀 Ajout de vendeurs vérifiés supplémentaires...');

  const hashedPassword = await bcrypt.hash('Vendor123!', 10);

  const existing = await prisma.user.findMany({
    where: { role: UserRole.VENDOR, isVerified: true },
    select: { id: true },
  });

  const current = existing.length;
  if (current >= TARGET_ACTIVE_VENDORS) {
    logger.log(`✅ Déjà ${current} vendeurs vérifiés (cible ${TARGET_ACTIVE_VENDORS}). Rien à faire.`);
    return;
  }

  const toCreate = TARGET_ACTIVE_VENDORS - current;
  const categories = await prisma.category.findMany();

  logger.log(`➕ Création de ${toCreate} vendeurs vérifiés (total visé : ${TARGET_ACTIVE_VENDORS})...`);

  for (let i = 0; i < toCreate; i++) {
    const email = `extra-vendor-${i + 1}@wapibei.com`;
    const phone = `+24396${String(800000 + i).padStart(6, '0')}`;

    const vendor = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName: faker.person.fullName(),
        phone,
        province: 'Nord-Kivu',
        commune: 'Goma',
        role: UserRole.VENDOR,
        boutiqueName: faker.company.name() + ' Express',
        isVerified: true,
        trustScore: faker.number.int({ min: 70, max: 100 }),
        avatarUrl: `https://i.pravatar.cc/150?u=${faker.string.uuid()}`,
      },
    });

    // 4 à 6 produits publics pour remplir previews, compteur produits et ventes
    const nbProducts = faker.number.int({ min: 4, max: 6 });
    const products = [];

    for (let p = 0; p < nbProducts; p++) {
      const cat = faker.helpers.arrayElement(categories);
      const price = parseFloat(faker.commerce.price({ min: 10, max: 2500 }));
      const isOnSale = Math.random() < 0.3;

      const imgs = [...IMAGE_POOL].sort(() => Math.random() - 0.5).slice(0, 2);

      products.push({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price,
        originalPrice: isOnSale ? Math.round(price * (1 + Math.random() * 0.5 + 0.15)) : null,
        isOnSale,
        totalSales: faker.number.int({ min: 0, max: 120 }),
        categoryId: cat.id,
        userId: vendor.id,
        images: imgs,
        isPublic: true,
      });
    }

    await prisma.product.createMany({ data: products });
    logger.log(`  ✅ ${vendor.boutiqueName} — ${nbProducts} produits`);
  }

  const final = await prisma.user.count({ where: { role: UserRole.VENDOR, isVerified: true } });
  logger.log(`🎉 Terminé. Vendeurs vérifiés actifs : ${final}`);
}

main()
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
