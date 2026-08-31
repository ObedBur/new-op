import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  try {
    const total = await prisma.product.count();
    console.log('\n=== TOTAL PRODUITS: ' + total + ' ===\n');

    const products = await prisma.product.findMany({
      select: {
        name: true,
        price: true,
        isPublic: true,
        availability: true,
        category: { select: { name: true } }
      },
      take: 60,
      orderBy: { createdAt: 'desc' }
    });

    console.log('=== 60 DERNIERS PRODUITS ===');
    products.forEach((p, i) => {
      const status = p.isPublic ? 'PUBLIC' : 'DRAFT';
      const cat = p.category ? p.category.name : 'N/A';
      console.log((i + 1) + '. [' + status + '] ' + p.name + ' | ' + p.price + '$ | ' + cat + ' | ' + p.availability);
    });

    const keywords = ['riz', 'huile', 'téléphone', 'phone', 'tomate', 'sucre', 'farine', 'poulet', 'samsung', 'eau', 'sac', 'habit', 'ordinateur', 'fruit', 'légume'];
    console.log('\n=== TEST MOTS CLÉS ===');
    for (const kw of keywords) {
      const res = await prisma.$queryRawUnsafe(
        `SELECT COUNT(*)::integer as count FROM "Product" WHERE "isPublic" = true AND ("name" ILIKE $1 OR "description" ILIKE $1)`,
        `%${kw}%`
      );
      console.log('  "' + kw + '" => ' + res[0].count + ' résultat(s)');
    }

    const cats = await prisma.category.findMany({ select: { name: true, id: true } });
    console.log('\n=== CATÉGORIES ===');
    cats.forEach(c => console.log('  [' + c.id + '] ' + c.name));

  } catch (e) {
    console.error('Erreur:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
