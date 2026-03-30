"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const faker_1 = require("@faker-js/faker");
const dotenv = require("dotenv");
const path = require("path");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const envPath = path.join(__dirname, '../.env');
dotenv.config({ path: envPath });
const url = process.env.DATABASE_URL;
const pool = new pg_1.Pool({ connectionString: url });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('🚀 Démarrage du Seeding (150 produits)...');
    console.log('🧹 Nettoyage de la base de données...');
    await prisma.notification.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.refreshToken.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.heroSlide.deleteMany({});
    await prisma.howItWorksStep.deleteMany({});
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    await prisma.user.create({
        data: {
            email: 'wapibeapp@gmail.com',
            password: hashedPassword,
            fullName: 'WapiBei Admin',
            phone: '+243990000000',
            province: 'Nord-Kivu',
            commune: 'Goma',
            role: client_1.UserRole.ADMIN,
            isVerified: true,
            kycStatus: client_1.KycStatus.NOT_REQUIRED,
            trustScore: 100,
            country: 'RD Congo',
        },
    });
    console.log('🏷️ Création des catégories...');
    const categoriesData = [
        { name: 'Agricole', icon: 'potted_plant', colorClass: 'text-emerald-500', bgClass: 'bg-emerald-50' },
        { name: 'High-Tech', icon: 'smartphone', colorClass: 'text-blue-500', bgClass: 'bg-blue-50' },
        { name: 'Mode', icon: 'checkroom', colorClass: 'text-orange-500', bgClass: 'bg-orange-50' },
        { name: 'Maison', icon: 'home', colorClass: 'text-purple-500', bgClass: 'bg-purple-50' },
    ];
    for (const cat of categoriesData) {
        await prisma.category.create({ data: cat });
    }
    const dbCategories = await prisma.category.findMany();
    console.log('📦 Création des vendeurs...');
    const vendors = [];
    for (let i = 0; i < 12; i++) {
        const v = await prisma.user.create({
            data: {
                email: faker_1.fakerFR.internet.email().toLowerCase(),
                password: hashedPassword,
                fullName: faker_1.fakerFR.person.fullName(),
                phone: faker_1.fakerFR.phone.number('+243 ### ### ##'),
                province: 'Nord-Kivu',
                commune: 'Goma',
                role: client_1.UserRole.VENDOR,
                boutiqueName: faker_1.fakerFR.company.name() + ' Express',
                isVerified: Math.random() > 0.2,
                trustScore: faker_1.fakerFR.number.int({ min: 70, max: 100 }),
                avatarUrl: `https://i.pravatar.cc/150?u=${faker_1.fakerFR.string.uuid()}`,
            },
        });
        vendors.push(v);
    }
    console.log('🛍️ Création de 150 produits...');
    const productImages = {
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
        const category = faker_1.fakerFR.helpers.arrayElement(dbCategories);
        const vendor = faker_1.fakerFR.helpers.arrayElement(vendors);
        const price = parseFloat(faker_1.fakerFR.commerce.price({ min: 10, max: 2500 }));
        const categoryImgs = productImages[category.name] || productImages['Maison'];
        await prisma.product.create({
            data: {
                name: faker_1.fakerFR.commerce.productName(),
                description: faker_1.fakerFR.commerce.productDescription(),
                price,
                displayPrice: `${price}$`,
                location: 'Marché central, Goma',
                city: 'Goma',
                country: 'RD Congo',
                image: faker_1.fakerFR.helpers.arrayElement(categoryImgs),
                images: faker_1.fakerFR.helpers.arrayElements(categoryImgs, { min: 2, max: 3 }),
                availability: client_1.ProductAvailability.IN_STOCK,
                categoryId: category.id,
                userId: vendor.id,
            },
        });
    }
    console.log('🎬 Finalisation des éléments visuels...');
    const heroSlides = [
        { title: "L'excellence à portée de main", imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200', label: 'PREMIUM', order: 1 },
        { title: "L'élégance du détail", imageUrl: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=1200', label: 'LUXE', order: 2 },
    ];
    for (const slide of heroSlides) {
        await prisma.heroSlide.create({ data: { ...slide, id: faker_1.fakerFR.string.uuid() } });
    }
    const steps = [
        { icon: 'search', title: 'Recherchez', description: 'Trouvez vos produits favoris.', order: 1 },
        { icon: 'shopping_bag', title: 'Achetez', description: 'Rencontrez le vendeur et achetez.', order: 2 },
    ];
    for (const step of steps) {
        await prisma.howItWorksStep.create({ data: { ...step, id: faker_1.fakerFR.string.uuid() } });
    }
    console.log('✅ Base de données remplie avec succès !');
}
main()
    .catch((e) => { console.error('❌ Erreur:', e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); await pool.end(); });
//# sourceMappingURL=seed.js.map