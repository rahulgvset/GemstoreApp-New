import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { ZODIAC_SIGNS } from "../src/data/zodiac";
import { GEMSTONES } from "../src/data/gemstones";
import { PRODUCTS } from "../src/data/products";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const sign of ZODIAC_SIGNS) {
    await prisma.zodiacSign.upsert({
      where: { id: sign.id },
      update: {
        name: sign.name,
        symbol: sign.symbol,
        dateRange: sign.dateRange,
        element: sign.element,
        rulingPlanet: sign.rulingPlanet,
        traits: JSON.stringify(sign.traits),
      },
      create: {
        id: sign.id,
        name: sign.name,
        symbol: sign.symbol,
        dateRange: sign.dateRange,
        element: sign.element,
        rulingPlanet: sign.rulingPlanet,
        traits: JSON.stringify(sign.traits),
      },
    });
  }

  for (const stone of GEMSTONES) {
    await prisma.gemstone.upsert({
      where: { id: stone.id },
      update: {
        name: stone.name,
        color: stone.color,
        hex: stone.hex,
        chakra: stone.chakra,
        properties: JSON.stringify(stone.properties),
      },
      create: {
        id: stone.id,
        name: stone.name,
        color: stone.color,
        hex: stone.hex,
        chakra: stone.chakra,
        properties: JSON.stringify(stone.properties),
      },
    });
  }

  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        price: product.price,
        compareAtPrice: product.compareAtPrice ?? null,
        shortDescription: product.shortDescription,
        description: product.description,
        beadSizeMm: product.beadSizeMm,
        stock: product.stock,
        featured: product.featured ?? false,
        gemstones: {
          deleteMany: {},
          create: product.gemstoneIds.map((gemstoneId) => ({ gemstoneId })),
        },
        zodiacSigns: {
          deleteMany: {},
          create: product.zodiacSignIds.map((signId) => ({ signId })),
        },
      },
      create: {
        slug: product.slug,
        name: product.name,
        price: product.price,
        compareAtPrice: product.compareAtPrice ?? null,
        shortDescription: product.shortDescription,
        description: product.description,
        beadSizeMm: product.beadSizeMm,
        stock: product.stock,
        featured: product.featured ?? false,
        gemstones: {
          create: product.gemstoneIds.map((gemstoneId) => ({ gemstoneId })),
        },
        zodiacSigns: {
          create: product.zodiacSignIds.map((signId) => ({ signId })),
        },
      },
    });
  }

  console.log(
    `Seeded ${ZODIAC_SIGNS.length} zodiac signs, ${GEMSTONES.length} gemstones, ${PRODUCTS.length} products.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
