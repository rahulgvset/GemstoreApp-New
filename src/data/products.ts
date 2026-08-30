import { Product, ZodiacSignId } from "@/lib/types";
import { slugify } from "@/lib/slug";

interface ProductSeed {
  sign: ZodiacSignId;
  signName: string;
  stones: string[];
  stoneNames: string[];
  variant: "Classic" | "Aura";
  price: number;
}

const seeds: ProductSeed[] = [
  { sign: "aries", signName: "Aries", stones: ["red-jasper", "carnelian"], stoneNames: ["Red Jasper", "Carnelian"], variant: "Classic", price: 34 },
  { sign: "aries", signName: "Aries", stones: ["garnet"], stoneNames: ["Garnet"], variant: "Aura", price: 39 },
  { sign: "taurus", signName: "Taurus", stones: ["rose-quartz", "green-aventurine"], stoneNames: ["Rose Quartz", "Green Aventurine"], variant: "Classic", price: 32 },
  { sign: "taurus", signName: "Taurus", stones: ["green-aventurine"], stoneNames: ["Green Aventurine"], variant: "Aura", price: 29 },
  { sign: "gemini", signName: "Gemini", stones: ["citrine", "clear-quartz"], stoneNames: ["Citrine", "Clear Quartz"], variant: "Classic", price: 33 },
  { sign: "gemini", signName: "Gemini", stones: ["sodalite"], stoneNames: ["Sodalite"], variant: "Aura", price: 30 },
  { sign: "cancer", signName: "Cancer", stones: ["moonstone", "rose-quartz"], stoneNames: ["Moonstone", "Rose Quartz"], variant: "Classic", price: 38 },
  { sign: "cancer", signName: "Cancer", stones: ["moonstone"], stoneNames: ["Moonstone"], variant: "Aura", price: 36 },
  { sign: "leo", signName: "Leo", stones: ["tigers-eye", "citrine"], stoneNames: ["Tiger's Eye", "Citrine"], variant: "Classic", price: 35 },
  { sign: "leo", signName: "Leo", stones: ["tigers-eye"], stoneNames: ["Tiger's Eye"], variant: "Aura", price: 31 },
  { sign: "virgo", signName: "Virgo", stones: ["amethyst", "green-aventurine"], stoneNames: ["Amethyst", "Green Aventurine"], variant: "Classic", price: 33 },
  { sign: "virgo", signName: "Virgo", stones: ["smoky-quartz"], stoneNames: ["Smoky Quartz"], variant: "Aura", price: 28 },
  { sign: "libra", signName: "Libra", stones: ["lapis-lazuli", "rose-quartz"], stoneNames: ["Lapis Lazuli", "Rose Quartz"], variant: "Classic", price: 37 },
  { sign: "libra", signName: "Libra", stones: ["lapis-lazuli"], stoneNames: ["Lapis Lazuli"], variant: "Aura", price: 34 },
  { sign: "scorpio", signName: "Scorpio", stones: ["garnet", "black-onyx"], stoneNames: ["Garnet", "Black Onyx"], variant: "Classic", price: 36 },
  { sign: "scorpio", signName: "Scorpio", stones: ["black-onyx"], stoneNames: ["Black Onyx"], variant: "Aura", price: 30 },
  { sign: "sagittarius", signName: "Sagittarius", stones: ["labradorite", "lapis-lazuli"], stoneNames: ["Labradorite", "Lapis Lazuli"], variant: "Classic", price: 39 },
  { sign: "sagittarius", signName: "Sagittarius", stones: ["labradorite"], stoneNames: ["Labradorite"], variant: "Aura", price: 35 },
  { sign: "capricorn", signName: "Capricorn", stones: ["garnet", "smoky-quartz"], stoneNames: ["Garnet", "Smoky Quartz"], variant: "Classic", price: 34 },
  { sign: "capricorn", signName: "Capricorn", stones: ["smoky-quartz"], stoneNames: ["Smoky Quartz"], variant: "Aura", price: 29 },
  { sign: "aquarius", signName: "Aquarius", stones: ["amethyst", "labradorite"], stoneNames: ["Amethyst", "Labradorite"], variant: "Classic", price: 38 },
  { sign: "aquarius", signName: "Aquarius", stones: ["amethyst"], stoneNames: ["Amethyst"], variant: "Aura", price: 32 },
  { sign: "pisces", signName: "Pisces", stones: ["aquamarine", "amethyst"], stoneNames: ["Aquamarine", "Amethyst"], variant: "Classic", price: 37 },
  { sign: "pisces", signName: "Pisces", stones: ["aquamarine"], stoneNames: ["Aquamarine"], variant: "Aura", price: 33 },
];

export const PRODUCTS: Product[] = seeds.map((seed, index) => {
  const name = `${seed.signName} ${seed.variant} Bracelet`;
  const slug = slugify(`${seed.signName}-${seed.variant}-${index}`);
  const stoneList = seed.stoneNames.join(" & ");

  return {
    id: `prod-${index + 1}`,
    slug,
    name,
    price: seed.price,
    compareAtPrice: seed.variant === "Classic" ? seed.price + 8 : undefined,
    shortDescription: `${stoneList} beads aligned to ${seed.signName}'s energy.`,
    description: `Hand-strung with genuine ${stoneList.toLowerCase()} beads, this bracelet is curated for ${seed.signName} to channel their natural strengths. Each stone is chosen for its metaphysical properties and finished with an elastic cord for a comfortable, adjustable fit. Cleanse under moonlight to keep the energy fresh.`,
    gemstoneIds: seed.stones,
    zodiacSignIds: [seed.sign],
    beadSizeMm: 8,
    stock: 25,
    featured: seed.variant === "Classic",
  };
});

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsBySign(sign: ZodiacSignId): Product[] {
  return PRODUCTS.filter((p) => p.zodiacSignIds.includes(sign));
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}
