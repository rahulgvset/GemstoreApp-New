"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

interface ParsedProductForm {
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  shortDescription: string;
  description: string;
  beadSizeMm: number;
  stock: number;
  featured: boolean;
  gemstoneIds: string[];
  zodiacSignIds: string[];
}

function parseProductForm(formData: FormData): ParsedProductForm {
  const name = String(formData.get("name") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();

  return {
    name,
    slug: slugify(rawSlug || name),
    price: Number(formData.get("price") ?? 0),
    compareAtPrice: formData.get("compareAtPrice")
      ? Number(formData.get("compareAtPrice"))
      : null,
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    beadSizeMm: Number(formData.get("beadSizeMm") ?? 8),
    stock: Number(formData.get("stock") ?? 0),
    featured: formData.get("featured") === "on",
    gemstoneIds: formData.getAll("gemstoneIds").map(String),
    zodiacSignIds: formData.getAll("zodiacSignIds").map(String),
  };
}

function revalidateStorefront(slug?: string) {
  revalidatePath("/");
  revalidatePath("/collections");
  revalidatePath("/admin");
  if (slug) revalidatePath(`/products/${slug}`);
}

export async function createProduct(formData: FormData) {
  const data = parseProductForm(formData);

  await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      price: data.price,
      compareAtPrice: data.compareAtPrice,
      shortDescription: data.shortDescription,
      description: data.description,
      beadSizeMm: data.beadSizeMm,
      stock: data.stock,
      featured: data.featured,
      gemstones: { create: data.gemstoneIds.map((gemstoneId) => ({ gemstoneId })) },
      zodiacSigns: { create: data.zodiacSignIds.map((signId) => ({ signId })) },
    },
  });

  revalidateStorefront(data.slug);
  redirect("/admin");
}

export async function updateProduct(productId: string, formData: FormData) {
  const data = parseProductForm(formData);

  await prisma.product.update({
    where: { id: productId },
    data: {
      name: data.name,
      slug: data.slug,
      price: data.price,
      compareAtPrice: data.compareAtPrice,
      shortDescription: data.shortDescription,
      description: data.description,
      beadSizeMm: data.beadSizeMm,
      stock: data.stock,
      featured: data.featured,
      gemstones: {
        deleteMany: {},
        create: data.gemstoneIds.map((gemstoneId) => ({ gemstoneId })),
      },
      zodiacSigns: {
        deleteMany: {},
        create: data.zodiacSignIds.map((signId) => ({ signId })),
      },
    },
  });

  revalidateStorefront(data.slug);
  redirect("/admin");
}

export async function deleteProduct(productId: string) {
  const product = await prisma.product.delete({ where: { id: productId } });
  revalidateStorefront(product.slug);
}
