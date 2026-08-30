import { prisma } from "@/lib/prisma";
import { Gemstone, Product, ZodiacInfo, ZodiacSignId } from "@/lib/types";

export async function getAllZodiacSigns(): Promise<ZodiacInfo[]> {
  const signs = await prisma.zodiacSign.findMany({ orderBy: { id: "asc" } });
  return signs.map((sign) => ({
    id: sign.id as ZodiacSignId,
    name: sign.name,
    symbol: sign.symbol,
    dateRange: sign.dateRange,
    element: sign.element as ZodiacInfo["element"],
    rulingPlanet: sign.rulingPlanet,
    traits: JSON.parse(sign.traits) as string[],
  }));
}

export async function getAllGemstones(): Promise<Gemstone[]> {
  const stones = await prisma.gemstone.findMany({ orderBy: { name: "asc" } });
  return stones.map((stone) => ({
    id: stone.id,
    name: stone.name,
    color: stone.color,
    hex: stone.hex,
    chakra: stone.chakra,
    properties: JSON.parse(stone.properties) as string[],
  }));
}

type ProductWithRelations = Awaited<ReturnType<typeof prisma.product.findMany>>[number] & {
  gemstones: { gemstoneId: string }[];
  zodiacSigns: { signId: string }[];
};

function toProduct(row: ProductWithRelations): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: row.price,
    compareAtPrice: row.compareAtPrice ?? undefined,
    shortDescription: row.shortDescription,
    description: row.description,
    beadSizeMm: row.beadSizeMm,
    stock: row.stock,
    featured: row.featured,
    gemstoneIds: row.gemstones.map((g) => g.gemstoneId),
    zodiacSignIds: row.zodiacSigns.map((z) => z.signId) as ZodiacSignId[],
  };
}

const PRODUCT_INCLUDE = {
  gemstones: { select: { gemstoneId: true } },
  zodiacSigns: { select: { signId: true } },
} as const;

export async function getAllProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    include: PRODUCT_INCLUDE,
    orderBy: { createdAt: "asc" },
  });
  return rows.map(toProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { featured: true },
    include: PRODUCT_INCLUDE,
    orderBy: { createdAt: "asc" },
  });
  return rows.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({
    where: { slug },
    include: PRODUCT_INCLUDE,
  });
  return row ? toProduct(row) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({
    where: { id },
    include: PRODUCT_INCLUDE,
  });
  return row ? toProduct(row) : null;
}

export async function getProductsBySign(sign: ZodiacSignId): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { zodiacSigns: { some: { signId: sign } } },
    include: PRODUCT_INCLUDE,
    orderBy: { createdAt: "asc" },
  });
  return rows.map(toProduct);
}
