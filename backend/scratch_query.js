const { Client } = require('d:/wapibei/node_modules/.pnpm/pg@8.22.0/node_modules/pg');

// Utilise la DATABASE_DIRECT_URL pour contourner le pooler Prisma Accelerate
const DB_URL = "postgres://c003c9af399966a0fc7032fabecd3ea07821c0f0cbf3969e9991396036e789c6:sk_tar-rgWshn1gM60FlnlVA@db.prisma.io:5432/postgres?sslmode=require";

const client = new Client({ connectionString: DB_URL });

async function main() {
  await client.connect();

  // Total
  const totalRes = await client.query('SELECT COUNT(*) FROM "Product"');
  const totalPublicRes = await client.query('SELECT COUNT(*) FROM "Product" WHERE "isPublic" = true');
  console.log('\n=== STATISTIQUES ===');
  console.log('Total produits:          ' + totalRes.rows[0].count);
  console.log('Total produits publics:  ' + totalPublicRes.rows[0].count);

  // Liste des produits avec catégorie
  const res = await client.query(`
    SELECT p.name, p.price, p."isPublic", p.availability, c.name as category
    FROM "Product" p
    LEFT JOIN "Category" c ON p."categoryId" = c.id
    ORDER BY p."createdAt" DESC
    LIMIT 60
  `);

  console.log('\n=== 60 DERNIERS PRODUITS ===');
  res.rows.forEach(function(p, i) {
    const status = p.isPublic ? 'PUBLIC' : 'DRAFT';
    console.log((i + 1) + '. [' + status + '] ' + p.name + ' | ' + p.price + '$ | Cat: ' + (p.category || 'N/A') + ' | ' + p.availability);
  });

  // Test mots clés
  const keywords = ['riz', 'huile', 'phone', 'samsung', 'tomate', 'sucre', 'farine', 'poulet', 'eau', 'sac', 'ordinateur', 'fruit', 'poisson', 'huile de palme', 'haricot'];
  console.log('\n=== RÉSULTATS PAR MOT CLÉ (produits publics) ===');
  for (const kw of keywords) {
    const r = await client.query(
      `SELECT COUNT(*) FROM "Product" WHERE "isPublic" = true AND ("name" ILIKE $1 OR "description" ILIKE $1)`,
      ['%' + kw + '%']
    );
    console.log('  "' + kw + '" => ' + r.rows[0].count + ' résultat(s)');
  }

  // Catégories
  const catRes = await client.query('SELECT id, name FROM "Category" ORDER BY name');
  console.log('\n=== CATÉGORIES DISPONIBLES ===');
  catRes.rows.forEach(function(c) { console.log('  [' + c.id + '] ' + c.name); });

  await client.end();
}

main().catch(function(e) { console.error('Erreur:', e.message); client.end(); });
