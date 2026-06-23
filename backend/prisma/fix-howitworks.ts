import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
const envPath = path.join(__dirname, '../.env');
dotenv.config({ path: envPath });

const databaseUrl = process.env.DATABASE_URL || '';
const isAccelerate = databaseUrl.startsWith('prisma://') || databaseUrl.startsWith('prisma+');

const prisma = new PrismaClient({
  ...(isAccelerate
    ? { accelerateUrl: databaseUrl }
    : { datasourceUrl: databaseUrl }),
} as any);

async function main() {
  console.log('Suppression des anciennes étapes HowItWorks...');
  await prisma.howItWorksStep.deleteMany();

  const steps = [
    {
      id: randomUUID(),
      icon: 'search',
      title: 'Trouvez vos favoris',
      description: 'Explorez un vaste catalogue de produits locaux et internationaux (agricole, mode, tech). Ajoutez vos coups de cœur à votre panier en un clic.',
      order: 1,
    },
    {
      id: randomUUID(),
      icon: 'shopping_cart',
      title: 'Achetez avec simplicité',
      description: 'Validez votre panier instantanément sur la plateforme. Le vendeur reçoit immédiatement une alerte sur son tableau de bord pour préparer votre commande.',
      order: 2,
    },
    {
      id: randomUUID(),
      icon: 'notifications_active',
      title: 'Restez informé',
      description: "Suivez l'état de votre commande en temps réel. Discutez directement avec le vendeur sur WhatsApp pour le moindre détail.",
      order: 3,
    },
    {
      id: randomUUID(),
      icon: 'inventory_2',
      title: 'Recevez et profitez',
      description: 'Le vendeur vous expédie votre colis. Réceptionnez vos achats, vérifiez la qualité et finalisez la transaction en toute confiance.',
      order: 4,
    },
  ];

  console.log('Insertion des 4 nouvelles étapes...');
  for (const step of steps) {
    await prisma.howItWorksStep.create({ data: step });
  }

  console.log('✅ Base de données (en ligne) mise à jour avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
